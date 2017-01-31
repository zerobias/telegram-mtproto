'use strict'
const net = require('net')
const util = require('util')
const TypeObject = require('../tl').TypeObject
const logger = require('../logger')('net.TcpConnection')

/**
 * This class provides a TCP socket to communicate with `Telegram` using `MTProto` protocol
 *
 * @class TcpConnection
 */
class TcpConnection {

  /**
   * The constructor accepts optionally an object to specify the connection address as following:
   *
   *     new TcpConnection({host: "173.240.5.253", port: "443"});
   *
   * `localhost:80` address is used as default otherwise
   * @param {{ host: string, port: string }} [options]
   *
   * @memberOf TcpConnection
   */
  constructor(options) {
    this.options = util._extend({ host: 'localhost', port: '80', localAddress: process.env.LOCAL_ADDRESS }, options)
    this._config = JSON.stringify(this.options)
    logger.debug('Created with %s', this._config)
  }

  /**
   * This method opens the connection and resolve promise when done
   *
   *
   * @memberOf TcpConnection
   * @returns {Promise<void>}
   */
  connect() {
    const self = this
    logger.debug('Connecting to %s', self._config)
    if (this._socket)
      return Promise.resolve()
    const caller = (rs, rj) => {
      const onError = e => {
        logger.error('Error %s connecting to %s', e.code, self._config)
        self._socket = undefined
        return rj(e)
      }
      const socket = net.connect(self.options, () => {
        socket.removeListener('error', onError)
        logger.debug(`Connected to ${  self._config}`)
        const abridgedFlag = new Buffer(1)
        abridgedFlag.writeUInt8(0xef, 0)
        logger.debug(`Sending abridgedFlag to ${  self._config}`)
        socket.write(abridgedFlag, 'UTF8', () => {
          logger.debug(`AbridgedFlag sent to ${  self._config}`)
          return rs()
        })
      })
      socket.setKeepAlive(true)
      socket.setNoDelay(true)
      socket.once('error', onError)
      self._socket = socket
    }
    return new Promise(caller)
  }

  isConnected() {
    return this._socket
  }

  /**
   * Writes the given data and calls back when done
   *
   * @param {any} data
   * @param {any} callback
   *
   * @memberOf TcpConnection
   */
  write(data, callback) {
    const self = this
    const socket = this._socket
    if (!socket && callback) {
      callback(createError('Not yet connected', 'ENOTCONNECTED'))
      return
    }
    if ((data.length % 4) !== 0 && callback) {
      callback(createError('Data length must be multiple of 4', 'EMULTIPLE4'))
      return
    }
    if (!Buffer.isBuffer(data)) {
      logger.debug('Given data is not a Buffer')
      data = new Buffer(data)
    }
    const message = new Message({ message: data })
    const request = message.serialize()
    logger.debug('Writing %s to %s', request.toString('hex'), self._config)
    const onError = function(e) {
      logger.error('Error %s writing %s bytes to %s', e.code, request.length, self._config)
      if (callback) {
        callback(e)
      }
    }
    socket.write(request, 'UTF8', function() {
      logger.debug('Wrote %s bytes to %s', request.length, self._config)
      socket.removeListener('error', onError)
      if (callback) {
        callback(null)
      }
    })
    socket.once('error', onError)
  }

  /**
   * Reads the data from the connection and calls back when done
   *
   * @param {any} callback
   *
   * @memberOf TcpConnection
   */
  read(callback) {
    const self = this
    const buffers = []
    let timer
    logger.debug('Reading from %s', self._config)
    const socket = this._socket
    if (!socket && callback) {
      callback(createError('Not yet connected', 'ENOTCONNECTED'))
      return
    }
    const onError = function(e) {
      logger.error('Error %s reading from %s', e.code, self._config)
      if (callback) {
        callback(e)
      }
    }
    const onData = function(data) {
      if (timer) {
        clearTimeout(timer)
      }
      buffers.push(data)
      timer = setTimeout(function() {
        onEnd()
      }, 10)
    }
    const onEnd = function() {
      socket.removeListener('error', onError)
      socket.removeListener('data', onData)
      socket.removeListener('end', onEnd)
      const data = Buffer.concat(buffers)
      const message = new Message({ buffer: data }).deserialize()
      const payload = message.getMessage()
      logger.debug('Read %s bytes from %s', payload.toString('hex'), self._config)
      if (callback) {
        callback(null, payload)
      }
    }
    socket.once('error', onError)
    socket.on('data', onData)
    socket.once('end', onEnd)
  }

  /**
   * This method close the connection and resolve promise when done
   *
   * @returns {Promise<void>}
   *
   * @memberOf TcpConnection
   */
  close() {
    const self = this
    const socket = this._socket
    if (socket) {
      logger.debug(`Disconnecting from ${  this._config}`)
      return new Promise((rs, rj) => {
        const onError = e => {
          logger.error('Error %s disconnecting from %s', e.code, self._config)
          return rj(e)
        }
        const onEnd = () => {
          socket.removeListener('error', onError)
          logger.debug(`Disconnected from ${  self._config}`)
          return rs()
        }
        socket.once('end', onEnd)
        socket.once('error', onError)
        socket.end()
        self._socket = undefined
      })
    } else
      return Promise.resolve()
  }
}



function createError(msg, code) {
  const error = new Error(msg)
  error.code = code
  return error
}

class Message extends TypeObject {

  /**
   * To get an instance for `serialization`:
   *
   *     new Message({message: myMessageBuffer});
   * Provide the payload as `Buffer`
   *
   * To get an instance for `de-serialization`:
   *
   *     new Message({buffer: myBuffer});
   * Provide a `buffer` containing the plain message from which extract the payload
   *
   * @param {any} [options={}]
   *
   * @memberOf Message
   */
  constructor(options = {}) {
    super(options.buffer, options.offset)
    this._message = options.message
    if (this._message) {
      this._message = Buffer.isBuffer(this._message)
        ? this._message
        : new Buffer(this._message, 'hex')
    }
  }
  /**
   * Serialize the Message
   */
  serialize() {
    if (!this._message) {
      return false
    }
    this.writeBytes(this._message, true)
    return this.retrieveBuffer()
  }

  /**
   * De-serialize the Message
   */
  deserialize() {
    if (!this.isReadonly()) {
      return false
    }
    this._message = this.readBytes(true)
    return this
  }

  /**
   * Returns the payload
   */
  getMessage() {
    return this._message
  }
}

Message.logger = logger


module.exports = exports = TcpConnection