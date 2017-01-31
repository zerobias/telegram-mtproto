'use strict'
const RpcChannel = require('../net/rpc-channel')
const message = require('../message')
const mtproto = require('../mtproto')
const pako = require('pako')
const tl = require('../tl')
const logger = require('../logger')('net.EncryptedRpcChannel')
const util = require('util')
const { recall, uncall } = require('../utility')
// The constructor require the following:
// - connection (required): the [Http|Tcp]Connection .
// - context (required):
// { authKey, serverSalt, sessionId, sequenceNumber, apiVersion }
// - app (required), the application data required for execute the first API call to Telegram:
// { id, version, langCode, deviceModel, systemVersion }

const defCall = () => {}

/**
 * This class provides an encrypted remote procedure call channel to `Telegram` through a TCP|HTTP connection.
 * This channel is encrypted and therefore use the EncryptedMessage objects to wrap the communication.
 *
 * @class EncryptedRpcChannel
 * @extends {RpcChannel}
 */
class EncryptedRpcChannel extends RpcChannel {
  /**
   * Creates an instance of EncryptedRpcChannel.
   * The constructor require the following:
   * - connection: the [Http|Tcp]Connection .
   * - context:
   * { authKey, serverSalt, sessionId, sequenceNumber, apiVersion }
   * - app, the application data required for execute the first API call to Telegram:
   * { id, version, langCode, deviceModel, systemVersion }
   *
   * @param {any} connection [Http|Tcp]Connection
   * @param {{ authKey: string, serverSalt: string, sessionId: string, sequenceNumber: string, apiVersion: string }} context
   * @param {{ id: string, version: string, langCode?: string, deviceModel?: string, systemVersion?: string }} app
   *
   * @memberOf EncryptedRpcChannel
   */
  constructor(connection, context, app) {
    super(connection)
    this._context = context
    this._app = {
      api_id        : app.id,
      app_version   : app.version,
      device_model  : app.deviceModel || 'Unknown Device',
      system_version: app.systemVersion || 'Unknown System',
      lang_code     : app.langCode || 'en'
    }
    this._initialized = false
    this._callbackMap = {}
    this._messageIdsToBeAck = []
    // configure the message-parser
    this._parser = new message.MessageParser()
    this._parser.on('mtproto.type.New_session_created', this._onNewSessionCreated.bind(this))
    this._parser.on('mtproto.type.Rpc_result', this._onRpcResult.bind(this))
    this._parser.on('mtproto.type.Msgs_ack', this._onMsgsAck.bind(this))
    this._parser.on('mtproto.type.Bad_server_salt', this._onBadServerSalt.bind(this))
    // the sent messages still waiting for a response (msg-ack or rpc-result)
    this.waiting4Response = {}
    this.lastMsgId = -1
  }
  getParser() {
    return this._parser
  }
  get mapRemove() {
    return {
      cb  : item => mapRemover(this._callbackMap, item),
      wait: item => mapRemover(this.waiting4Response, item)
    }
  }
  _onRpcResult(rpcResult, duration) {
    const callback = this.mapRemove.cb(rpcResult.req_msg_id)
    if (callback) {
      // add the acknowledgment..
      this._messageIdsToBeAck.push(rpcResult._messageId)
      const sendPromise = this.sendMessagesAck()
      const pause = new Promise(rs => setTimeout(rs, 2e3))
      // callback when the ack has been sent
      Promise
        .race([sendPromise, pause])
        .then(
          () => callback(null, checkIfGzipped(rpcResult.result), duration),
          err => callback(err))
    }
  }

  _onNewSessionCreated(newSession) {
    this._context.serverSalt = newSession.server_salt
    logger.info('New session has been created by Telegram: %s', newSession.toPrintable())
      // send the acknowledgment..
    this._messageIdsToBeAck.push(newSession._messageId)
      // ..now!
    this.sendMessagesAck()
  }

  _onMsgsAck(msgIds) {
    logger.info('The server sent a acknowledge for the followings [%s]', msgIds)
    const remove = this.mapRemove.wait
    msgIds.forEach(remove)
  }

  _onBadServerSalt(badServerSalt) {
    const badMsgId = badServerSalt.bad_msg_id
    logger.info('Wrong server_salt in message [%s]', badMsgId)
      // set the  new_server_salt
    this._context.serverSalt = badServerSalt.new_server_salt
      // retrieve the method (and the relative callback) to resend
    const method = this.mapRemove.wait(badMsgId)
    const callback = this.mapRemove.cb(badMsgId)
      // send again
    this.callMethod(method, callback)
  }

  /**
   * Send the message acknowledgement for each collected messageId
   *
   * @returns
   *
   * @memberOf EncryptedRpcChannel
   */
  sendMessagesAck() {
    const msgsAck = this.createMessagesAck()
    if (msgsAck) {
      logger.info('Send the ack to the server: %s', msgsAck.toPrintable())
      return this.callMethod(msgsAck)
    }
    return Promise.resolve()
  }

  /**
   * Execute remotely the given Type function
   *
   * @param {any} method
   * @param {any} [callback=defCall]
   * @returns
   *
   * @memberOf EncryptedRpcChannel
   */
  callMethod(method, callback = defCall) {
    const caller = (rs, rj) => {
      const cb = recall(rs, rj)
      if (!this._open) {
        rj(new Error('Channel is closed'))
        return
      }
      let msg
      const isContentRelated = method.getTypeName().slice(0, 8) != 'mtproto.'
      if (!this._initialized) {
        const initData = util._extend({ query: method.serialize() }, this._app)
        msg = new mtproto.service.invokeWithLayer.Type({
          props: {
            layer: this._context.apiVersion || 57,
            query: new mtproto.service.initConnection.Type({
              props: initData
            }).serialize()
          }
        })
        this._initialized = true
      } else {
        msg = this.lastMsgId > 0 && isContentRelated
          ? new mtproto.service.invokeAfterMsg.Type({
            props: {
              msg_id: this.lastMsgId,
              query : method.serialize()
            }
          })
          : method
      }
      const reqMsg = new message.EncryptedMessage({
        message       : msg,
        authKey       : this._context.authKey,
        serverSalt    : this._context.serverSalt,
        sessionId     : this._context.sessionId,
        sequenceNumber: this._context.sequenceNumber
      })
      let directCallback
      if (isContentRelated) {
        this._callbackMap[reqMsg.messageId] = cb
        logger.debug('Register callback, %s: %s', reqMsg.messageId)
      } else
        directCallback = cb
      this.lastMsgId = reqMsg.messageId
      this.waiting4Response[this.lastMsgId] = method
      this._call(reqMsg, directCallback)
    }
    const promise = new Promise(caller)
    return uncall(callback, promise)
  }
  _call(reqMsg, directCallback = defCall) {
    const self = this
    // const callback = directCallback || this._callbackMap[reqMsg.messageId]
    const cbFromMap = this._callbackMap[reqMsg.messageId] || defCall
    const callPair = (err, res) => {
      directCallback(err, res)
      cbFromMap(err, res)
    }
    const caller = (rs, rj) => {
      try {
        super._call(reqMsg, function(ex, result) {
          try {
            if (ex) {
              logger.error(ex.stack)
              rj(ex)
            } else {
              logger.info('Call of \'%s\' took %sms', reqMsg.body.getTypeName(), result.duration)
              self._parser.parse(result, result.duration)
              if (directCallback !== defCall)
                rs(checkIfGzipped(result))
            }
          } catch (err) {
            logger.error(err.stack)
            rj(err)
          }
        })
      } catch (err) {
        logger.error(err.stack)
        rj(err)
      }
    }
    const prom = new Promise(caller)
    return uncall(callPair, prom)
  }
  _deserializeResponse(response) {
    const resObj = new message.EncryptedMessage({ buffer: response, authKey: this._context.authKey }).deserialize()
    const result = resObj.body
    result._messageId = resObj.messageId
    return result
  }
  createMessagesAck() {
    if (this._messageIdsToBeAck.length > 0) {
      const msgsAck = new mtproto.type.Msgs_ack({
        props: {
          msg_ids: new tl.TypeVector({ type: 'long', list: this._messageIdsToBeAck })
        }
      })
      this._messageIdsToBeAck = []
      return msgsAck
    }
  }
}


function checkIfGzipped(obj) {
  if (typeof obj !== 'boolean' && obj.instanceOf('mtproto.type.Gzip_packed')) {
    const packedData = obj.packed_data
    const buffer = pako.ungzip(packedData)
    Object.setPrototypeOf(buffer, packedData.__proto__)
    const Type = tl.TypeBuilder.requireTypeFromBuffer(buffer)
    return new Type({ buffer: buffer }).deserialize()
  }
  else return obj
}

const mapRemover = (map, itemId) => {
  const item = map[itemId]
  if (item){
    map[itemId] = null
    delete map[itemId]
  }
  return item
}

module.exports = exports = EncryptedRpcChannel