'use strict'

const util = require('util')
const logger = require('../logger')('net.WsConnection')

const WebSocket = require('ws')

function noop(){}

/**
 * Provides a WebSocket to communicate with `Telegram` using `MTProto` protocol
 *
 * @class WsConnection
 */
class WsConnection {
  /**
   * Accepts optionally an object to specify the connection address as following:
   *
   *     new WsConnection({host: "173.240.5.253", port: "443"})
   * `localhost:80` address is used as default otherwise
   * @param {any} url
   *
   * @memberOf WsConnection
   */
  constructor(url) {
    this.url = url
    logger.debug('Created with %s', this.url)
  }

  // This method opens the connection and calls back when done
  connect() {
    logger.debug('Connecting to %s', this.url)
    if (this._socket) return Promise.resolve()

    const onError = e => {
      logger.error('Error %s connecting to %s', e.code, this.url)
      this._socket = undefined
      return Promise.reject(e)
    }

    const socket = new WebSocket(this.url)

    socket.addEventListener('error', onError)
    socket.addEventListener('open', event => {
      socket.removeListener('error', onError)

      logger.debug(`Connected to ${  this.url}`)

      const abridgedFlag = new Buffer(1)
      abridgedFlag.writeUInt8(0xef, 0)

      logger.debug(`Sending abridgedFlag to ${  this.url}`)

      try {
        socket.send(abridgedFlag)

        logger.debug(`AbridgedFlag sent to ${  this.url}`)
        return Promise.resolve()
      } catch (e) {
        logger.debug(`Error sending AbridgedFlag to ${  this.url}`)
        return Promise.reject(e)
      }
    })

    this._socket = socket
  }

  isConnected() {
    return this._socket
  }

  // This method writes the given data and calls back when done
  write(data, callback) {
    callback = callback || noop

    const socket = this._socket
    if (!socket) return callback(createError('Not yet connected', 'ENOTCONNECTED'))

    if ((data.length % 4) !== 0)
      return callback(createError('Data length must be multiple of 4', 'EMULTIPLE4'))

    if (!Buffer.isBuffer(data)) {
      logger.debug('Given data is not a Buffer')

      data = new Buffer(data)
    }

    const message = Message({ message: data })
    const request = message.serialize()
    logger.debug('Writing %s to %s', request.toString('hex'), this.url)

    try {
      socket.send(request)

      logger.debug('Wrote %s bytes to %s', request.length, this.url)
      callback()
    } catch (e) {
      logger.error('Error %s writing %s bytes to %s', e.code, request.length, this.url)
      callback(e)
    }
  }

  // This method reads the data from the connection and calls back when done
  read(callback) {
    callback = callback || noop

    const self = this

    logger.debug('Reading from %s', this.url)

    const socket = this._socket
    if (!socket) return callback(createError('Not yet connected', 'ENOTCONNECTED'))

    function onError(e) {
      socket.removeListener('error', onError)
      socket.removeListener('message', onMessage)

      logger.error('Error %s reading from %s', e.code, self.url)
      callback(e)
    }
    function onMessage(message) {
      socket.removeListener('error', onError)
      socket.removeListener('message', onMessage)

      const payload = Message({ buffer: message.data }).deserialize().getMessage()

      logger.debug('Read %s bytes from %s', payload.toString('hex'), self.url)

      callback(null, payload)
    }

    socket.addEventListener('error', onError)
    socket.addEventListener('message', onMessage)
  }

  // This method close the connection and calls back when done
  close() {
    const socket = this._socket
    if (!socket) return Promise.resolve()

    this._socket = undefined

    logger.debug(`Disconnecting from ${  this.url}`)
    socket.close()
    logger.debug(`Disconnected from ${  this.url}`)

    return Promise.resolve()
  }
}

function createError(msg, code) {
  const error = new Error(msg)
  error.code = code

  return error
}


const TypeObject = require('telegram-tl-node').TypeObject

// WsConnection inner class:
//
//     WsConnection.Message class
//
// To get an instance for `serialization`:
//
//     new WsConnection.Message({message: myMessageBuffer});
// Provide the payload as `Buffer`:
//
// To get an instance for `de-serialization`:
//
//     new WsConnection.Message({buffer: myBuffer});
// Provide a `buffer` containing the plain message from which extract the payload
//
// The `constructor`:
function Message(options) {
  if (!(this instanceof Message)) return new Message(options)

  const opts = options || {}
  this._message = opts.message

  WsConnection.super_.call(this, opts.buffer, opts.offset)

  if (this._message)
    this._message = Buffer.isBuffer(this._message)
                  ? this._message
                  : new Buffer(this._message, 'hex')
}
util.inherits(Message, TypeObject)

Message.logger = logger


// This method serialize the Message
Message.prototype.serialize = function() {
  if (!this._message) return false

  this.writeBytes(this._message, true)

  return this.retrieveBuffer()
}

// This method de-serialize the Message
Message.prototype.deserialize = function() {
  if (!this.isReadonly()) return false

  this._message = this.readBytes(true)

  return this
}

// This method returns the payload
Message.prototype.getMessage = function() {
  return this._message
}


WsConnection.Message = Message


// Export the class
module.exports = WsConnection