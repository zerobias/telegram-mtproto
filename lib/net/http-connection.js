//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     HttpConnection class
//
// This class provides a HTTP transport to communicate with `Telegram` using `MTProto` protocol

// Import dependencies
const httpPath = '/apiw1'
const http = require('http')
const util = require('util')
const logger = require('../logger')('net.HttpConnection')
const { NetworkError } = require('./errors')

// The constructor accepts optionally an object to specify the connection address as following:
//
//     new HttpConnection({host: "173.240.5.253", port: "443"});
//
// `localhost:80` address is used as default otherwise

class HttpConnection {
  constructor(options) {
    options = options
      ? ({
        protocol       : (options.protocol || 'http:'),
        host           : (options.host || 'localhost'),
        port           : (options.port || '80'),
        path           : httpPath,
        withCredentials: false
      })
      : ({
        path: `http://localhost:80${  httpPath}`
      })
    this.options = util._extend({
      localAddress: process.env.LOCAL_ADDRESS
    }, options)
    this._config = JSON.stringify(this.options)
    logger.debug('created with %s', this._config)
  }
  connect(callback) {
    logger.debug('connected to %s', this._config)
    this._writeBuffers = []
    this._writeOffset = 0
    this._connected = true
    if (callback) {
      setTimeout(callback, 0)
    }
  }
  isConnected() {
    return this._connected
  }
  write(data, callback) {
    this._writeBuffers.push(data)
    this._writeOffset += data.length
    logger.debug('add buffer(%s) to the write buffer queue, total length %s',
            data.length, this._writeOffset)
    if (callback)
      setTimeout(callback, 0)
  }
  read(callback) {
    const options = util._extend(this.options, {
      method      : (this._writeOffset === 0 ? 'GET' : 'POST'),
      responseType: 'arraybuffer'
    })
    this._request = this._createRequest(options, callback)
    this._request.setHeader('Content-Length', this._writeOffset)
    this._request.setHeader('Connection', 'keep-alive')
    this._request.removeHeader('Content-Type')
    this._request.removeHeader('Accept')
    const request = Buffer.concat(this._writeBuffers)
    this._writeBuffers = []
    this._writeOffset = 0
    logger.debug('content-length = %s\ncontent-type = %s\naccept = %s\nhost = %s\nconnection = %s\n',
            this._request.getHeader('Content-Length'), this._request.getHeader('Content-Type'), this._request.getHeader('Accept'),
            this._request.getHeader('Host'), this._request.getHeader('Connection'))
    logger.debug('writing request(%s) to %s', request.length, this._config)
    this._request.end(request)
  }
  _createRequest(options, callback) {
    const config = this._config
    logger.info(`_createRequest`)
    const onError = e => {
      logger.error('Error %s', e.code)
      callback && callback(e)
    }
    const request = http.request(options, res => {
      logger.debug('reading from %s\nstatus: %s\nheaders: %s', config, res.statusCode, JSON.stringify(res.headers))
      const buffers = []
      const onData = data => buffers.push(data)
      res.on('data', onData)
      res.once('end', () => {
        request.removeListener('error', onError)
        res.removeListener('data', onData)
        const data = Buffer.concat(buffers)
        if (res.statusCode === 200) {
          if (callback) callback(null, data)
        } else {
          if (callback) callback(new NetworkError(res, data))
        }
      })
    })

    request.once('error', onError)
    return request
  }
  close(callback) {
    if (callback) {
      this._connected = false
      setTimeout(callback, 0)
    }
  }
}

module.exports = exports = HttpConnection