//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     EncryptedRpcChannel class
//
// This class provides an encrypted remote procedure call channel to `Telegram` through a TCP|HTTP connection.
// This channel is encrypted and therefore use the EncryptedMessage objects to wrap the communication.

// Import dependencies
const RpcChannel = require('../net/rpc-channel')
const message = require('../message')
const mtproto = require('../mtproto')
// var zlib = require('zlib');
const pako = require('pako')
const tl = require('@goodmind/telegram-tl-node')
const logger = require('get-log')('net.EncryptedRpcChannel')
const util = require('util')
// EncryptedRpcChannel extends RpcChannel
// require('util').inherits(EncryptedRpcChannelFunc, RpcChannel)

// The constructor require the following:
// - connection (required): the [Http|Tcp]Connection .
// - context (required):
// { authKey, serverSalt, sessionId, sequenceNumber, apiVersion }
// - app (required), the application data required for execute the first API call to Telegram:
// { id, version, langCode, deviceModel, systemVersion }

class EncryptedRpcChannel extends RpcChannel {
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

  _onRpcResult(rpcResult, duration) {
    const callback = this._callbackMap[rpcResult.req_msg_id]
    if (callback) {
      removeFromMap(this._callbackMap, rpcResult.req_msg_id)
          // add the acknowledgment..
      this._messageIdsToBeAck.push(rpcResult._messageId)
      this.sendMessagesAck()
          // callback when the ack has been sent
      setTimeout(function() {
        callback(null, checkIfGzipped(rpcResult.result), duration)
      }, 100)
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
    for (let i = 0; i < msgIds.length; i++) {
      removeFromMap(this.waiting4Response, msgIds[i])
    }
  }

  _onBadServerSalt(badServerSalt) {
    const badMsgId = badServerSalt.bad_msg_id
    logger.info('Wrong server_salt in message [%s]', badMsgId)
      // set the  new_server_salt
    this._context.serverSalt = badServerSalt.new_server_salt
      // retrieve the method (and the relative callback) to resend
    const method = this.waiting4Response[badMsgId]
    removeFromMap(this.waiting4Response, badMsgId)
    const callback = this._callbackMap[badMsgId]
    removeFromMap(this._callbackMap, badMsgId)
      // send again
    this.callMethod(method, callback)
  }

  // Send the message acknowledgement for each collected messageId
  sendMessagesAck() {
    const msgsAck = createMessagesAck.call(this)
    if (msgsAck) {
      logger.info('Send the ack to the server: %s', msgsAck.toPrintable())
      this.callMethod(msgsAck)
    }
  }

  // Execute remotely the given Type function
  callMethod(method, callback) {
    if (!this._open) {
      callback(new Error('Channel is closed'))
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
    if (callback) {
      if (isContentRelated) {
        this._callbackMap[reqMsg.messageId] = callback
        logger.debug('Register callback, %s: %s', reqMsg.messageId, callback)
      } else
        directCallback = callback
    }
    this.lastMsgId = reqMsg.messageId
    this.waiting4Response[this.lastMsgId] = method
    this._call(reqMsg, directCallback)
  }
  _call(reqMsg, directCallback) {
    const self = this
    const callback = directCallback || this._callbackMap[reqMsg.messageId]
    try {
      super._call(reqMsg, function(ex, result, duration) {
        try {
          if (ex) {
            logger.error(ex.stack)
            if (callback)
              callback(ex)
          } else {
            logger.info('Call of \'%s\' took %sms', reqMsg.body.getTypeName(), duration)
            self._parser.parse(result, duration)
            if (directCallback)
              directCallback(null, checkIfGzipped(result), duration)
          }
        } catch (err) {
          logger.error(err.stack)
          if (callback)
            callback(err)
        }
      })
    } catch (err) {
      logger.error(err.stack)
      if (callback)
        callback(err)
    }
  }
  _deserializeResponse(response) {
    const resObj = new message.EncryptedMessage({ buffer: response, authKey: this._context.authKey }).deserialize()
    const result = resObj.body
    result._messageId = resObj.messageId
    return result
  }
}


function checkIfGzipped(obj) {
  if (typeof obj !== 'boolean' && obj.instanceOf('mtproto.type.Gzip_packed')) {
    const packedData = obj.packed_data
        // logger.info("Gzip packed data [%s]", packedData ? packedData.toString('hex') : null);
    const buffer = pako.ungzip(packedData)
    Object.setPrototypeOf(buffer, packedData.__proto__)
        // logger.info("Buffer after gunzip [%s]", buffer.toString('hex'));
    const Type = tl.TypeBuilder.requireTypeFromBuffer(buffer)
    return new Type({ buffer: buffer }).deserialize()
  }
  else return obj
}

function removeFromMap(map, item) {
  if (map && map[item]) {
    map[item] = null
    delete map[item]
  }
}

function createMessagesAck() {
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


module.exports = exports = EncryptedRpcChannel