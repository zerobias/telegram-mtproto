'use strict'
const crypto = require('crypto')
const BigInteger = require('jsbn')
const getLogger = require('get-log')
const utility = require('./tl').utility
const timeMod = require('./time')
const util = require('util')

exports.P = (...args) =>
  data =>
    args.reduce((result, fn) => fn(result), data)

// Set the constants
const thousand = new BigInteger((1000).toString())
const lowerMultiplier = new BigInteger((4294964).toString())

// Create a message ID starting from the local time
function createMessageId() {
  const logger = getLogger('utility.createMessageId')
    // Constants
    // Take the time and sum the time-offset with the server clock
  const time = new BigInteger((timeMod.getLocalTime()).toString())
    // Divide the time by 1000 `result[0]` and take the fractional part `result[1]`
  const result = time.divideAndRemainder(thousand)
    // Prepare lower 32 bit using the fractional part of the time
  const lower = result[1].multiply(lowerMultiplier)
    // Create the message id
  const messageId = result[0].shiftLeft(32).add(lower)
  logger.debug('MessageId(%s) was created with time = %s, lower = %s,  messageID binary = %s',
          messageId.toString(16), time, lower, messageId.toString(2))
  return `0x${  messageId.toString(16)}`
}

// Create SHA1 hash starting from a buffer or an array of buffers
function createSHAHash(buffer, algorithm) {
  const logger = getLogger('utility.createSHA1Hash')
  const sha1sum = crypto.createHash(algorithm || 'sha1')
  if (util.isArray(buffer)) {
    logger.debug('It\'s an Array of buffers')
    buffer.forEach(b => sha1sum.update(b))
  } else {
    logger.debug('It\'s only one buffer')
    sha1sum.update(buffer)
  }
  return sha1sum.digest()
}

function createRandomBuffer(bytesLength) {
  return new Buffer(crypto.randomBytes(bytesLength))
}

// Create a new nonce
function createNonce(bytesLength) {
  return `0x${  createRandomBuffer(bytesLength).toString('hex')}`
}

const bigFn = num => typeof num === 'number'
  ? new BigInteger(`${num  }`, 10)
  : new BigInteger(num.toString('hex'), 16)

// Mod Pow
function modPow(x, e, m) {
  const logger = getLogger('utility.aesDecrypt')
  const bigX = bigFn(x)
  const bigE = bigFn(e)
  const bigM = bigFn(m)
  const bigResult = bigX.modPow(bigE, bigM)
  logger.debug('X = %s, E = %s, M = %s, result = %s', bigX, bigE, bigM, bigResult)
  let result = new Buffer(bigResult.toByteArray())
  if (result.length > 256)
    result = result.slice(result.length - 256)
  return result
}

// Xor op on buffers
function xor(buffer1, buffer2) {
  const length = Math.min(buffer1.length, buffer2.length)
  const retBuffer = new Buffer(length)
  for (let i = 0; i < length; i++) {
    retBuffer[i] = buffer1[i] ^ buffer2[i]
  }
  return retBuffer
}

// Convert a String to a Buffer using TL serialization
function string2Buffer(str, bufferLength) {
  return utility.stringValue2Buffer(str, bufferLength)
}

// Convert a Buffer to a String using TL deserialization
function buffer2String(buffer) {
  return utility.buffer2StringValue(buffer)
}

/**
 * @function uncall
 * @template T
 * @param {function(err, result)} cb wrapped callback
 * @param {Promise<T>} prom
 * @return {Promise<T>}
 */
exports.uncall = (cb, prom) => {
  prom.then(
    res => cb(null, res),
    err => cb(err)
  )
  return prom
}

exports.recall = (rs, rj) =>
  (err, res) =>
    err
      ? rj(err)
      : rs(res)


exports.createMessageId = createMessageId
exports.createSHAHash = createSHAHash
exports.createRandomBuffer = createRandomBuffer
exports.createNonce = createNonce
exports.modPow = modPow
exports.xor = xor
exports.string2Buffer = string2Buffer
exports.buffer2String = buffer2String