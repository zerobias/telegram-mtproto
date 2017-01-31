'use strict'

const message = require('../message')
const logger = require('../logger')('net.RpcChannel')

// const Balancer = require('knack')({ concurrency: 1, interval: 100 })

const { recall, uncall } = require('../utility')

const defCall = () => {}

/**
 * This class provides a remote procedure call channel to `Telegram` through the given TCP|HTTP connection.
 * This channel in not encrypted and therefore use PlainMessage objects to wrap the communication.
 * According with the MTProto specification, only few methods can use unencrypted message, see:
 * https://core.telegram.org/mtproto/description#unencrypted-messages
 *
 * @class RpcChannel
 */
class RpcChannel {
  /**
   * Require a [Http|Tcp]Connection, the connection must be already open.
   *
   * @param {any} connection
   *
   * @memberOf RpcChannel
   */
  constructor(connection) {
    if (!connection) {
      const msg = 'The connection is mandatory!'
      logger.error(msg)
      throw new TypeError(msg)
    }
    this._connection = connection
    this._open = true
    // this.caller = this.caller.bind(this)
    this._queue = []
    const self = this
    setInterval(function() {
      executor.call(self)
    }, 100)
  }

  /**
   * Execute remotely the given method (Type function) using the channel, call back with the response
   *
   * @param {any} method
   * @param {any} callback
   *
   * @memberOf RpcChannel
   */
  callMethod(method, callback) {
    if (!this._open) {
      callback(new Error('Channel is closed'))
      return
    }
    const reqMsg = new message.PlainMessage({ message: method })
    // this.caller(reqMsg).then(e => callback(null, e.result), callback)
    this._call(reqMsg, callback)
  }

  _call(reqMsg, callback = defCall) {
    const caller = (rs, rj) => {
      const task = {
        reqMsg  : reqMsg,
        callback: recall(rs, rj)
      }
      const queue = this._queue
      queue.push(task)
    }
    return uncall(callback, new Promise(caller))
  }
  // request(method) {
  //   if (!this._open)
  //     return Promise.reject(new Error('Channel is closed'))
  //   const reqMsg = new message.PlainMessage({ message: method })
  //   return this.caller(reqMsg)
  // }
  // caller(reqMsg) {
  //   const conn = this._connection
  //   const start = new Date().getTime()
  //   const self = this
  //   const getReqType = () => reqMsg.body
  //     ? reqMsg.body.getTypeName()
  //     : ''
  //   return new Promise((rs, rj) =>
  //     conn.write(reqMsg.serialize(), ex => {
  //       if (ex) {
  //         logger.error('Unable to write: %s ', ex)
  //         rj(ex)
  //       }
  //       conn.read((ex2, response) => {
  //         if (ex2) {
  //           logger.error(`Unable to read: %s `, ex2)
  //           return rj(ex2)
  //         }
  //         try {
  //           logger.debug('response(%s): %s ', response.length, response.toString('hex'))
  //           const resObj = self._deserializeResponse(response)
  //           const duration = new Date().getTime() - start
  //           logger.debug('%s executed in %sms', getReqType(), duration)
  //           return rs({ result: resObj, duration })
  //         } catch (ex3) {
  //           logger.error('Unable to deserialize response %s from %s due to %s ',
  //                       response.toString('hex'), getReqType(), ex3.stack)
  //           return rj(ex3)
  //         }
  //       })
  //     }))
  // }

  /**
   * Execute the call (protected)
   *
   * @param {any} reqMsg
   * @param {any} callback
   *
   * @memberOf RpcChannel
   */
  _executeCall(reqMsg, callback) {
    const conn = this._connection
    const start = new Date().getTime()
    const self = this
    const getReqType = () => reqMsg.body
      ? reqMsg.body.getTypeName()
      : ''
    conn.write(reqMsg.serialize(), function(ex) {
      if (ex) {
        logger.error('Unable to write: %s ', ex)
        if (callback) {
          callback(ex)
        }
        return
      }
      conn.read(function(ex2, response) {
        if (ex2) {
          logger.error('Unable to read: %s ', ex2)
          if (callback) callback(ex2)
          return
        }
        try {
          logger.debug('response(%s): %s ', response.length, response.toString('hex'))
          const resObj = self._deserializeResponse(response)
          const duration = new Date().getTime() - start
          resObj.duration = duration
          logger.debug('%s executed in %sms', getReqType(), duration)
          if (callback) callback(null, resObj)
        } catch (ex3) {
          logger.error('Unable to deserialize response %s from %s due to %s ',
                      response.toString('hex'), getReqType(), ex3.stack)
          if (callback) callback(ex3)
        }
      })
    })
  }

  _deserializeResponse(response) {
    return new message.PlainMessage({ buffer: response }).deserialize().body
  }

  isOpen() {
    return this._open
  }

  close() {
    this._open = false
  }
}



function executor() {
  const queue = this._queue
  if (queue.length > 0) {
    const task = queue.splice(0, 1)[0]
    try {
      this._executeCall(task.reqMsg, task.callback)
    } catch (err) {
      console.log(err.stack)
    }
  }
}


module.exports = exports = RpcChannel
