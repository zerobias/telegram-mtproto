'use strict'
const BigInteger = require('jsbn')
const CryptoJS = require('@goodmind/node-cryptojs-aes').CryptoJS
const getLogger = require('../logger')
const utility = require('../utility')

// RSA encrypt function, requires:
//  - publicKey
//  - messageBuffer
function rsaEncrypt(messageBuffer, publicKey) {
  const logger = getLogger('security.cipher.rsaEncrypt')
  const messageLength = messageBuffer.length
  if (!messageBuffer || messageLength > 255) {
    logger.warn('Message is undefined or exceeds 255 bytes length.')
    return
  } else if (messageLength < 255) {
        // Add random bytes as padding
    const paddingLength = 255 - messageLength
    messageBuffer = Buffer.concat([messageBuffer, utility.createRandomBuffer(paddingLength)])
  }
    // Encrypt the message
  const modulus = new BigInteger(publicKey.getModulus(), 16)
  const exponent = new BigInteger(publicKey.getExponent(), 16)
  const message = new BigInteger(messageBuffer)
  let encryptedMessage = new Buffer(message.modPowInt(exponent, modulus).toByteArray())
  if (encryptedMessage.length > 256) {
    encryptedMessage = encryptedMessage.slice(encryptedMessage.length - 256)
  }
  logger.debug('Plain-text message(%s) = %s', messageBuffer.length, messageBuffer.toString('hex'))
  logger.debug('Encrypted message(%s) = %s', encryptedMessage.length, encryptedMessage.toString('hex'))
  return encryptedMessage
}

// AES decrypt function
function aesDecrypt(msg, key, iv) {
  const logger = getLogger('security.cipher.aesDecrypt')
  const encryptedMsg = buffer2WordArray(msg)
  const keyWordArray = buffer2WordArray(key)
  const ivWordArray = buffer2WordArray(iv)
  logger.debug('encryptedMsg = %s\nkeyWordArray = %s\nivWordArray = %s',
            JSON.stringify(encryptedMsg), JSON.stringify(keyWordArray), JSON.stringify(ivWordArray))
  const decryptedWordArray = CryptoJS.AES.decrypt({ ciphertext: encryptedMsg }, keyWordArray, {
    iv     : ivWordArray,
    padding: CryptoJS.pad.NoPadding,
    mode   : CryptoJS.mode.IGE
  })
  logger.debug('decryptedWordArray = %s', JSON.stringify(decryptedWordArray))
  return wordArray2Buffer(decryptedWordArray)
}

// AES encrypt function
function aesEncrypt(msg, key, iv) {
  const logger = getLogger('security.cipher.aesEncrypt')
    // Check if padding is needed
  const padding = msg.length % 16
  if (padding > 0) {
    const paddingBuffer = utility.createRandomBuffer(16 - padding)
    msg = Buffer.concat([msg, paddingBuffer])
  }
    // Convert buffers to wordArrays
  const plainMsg = buffer2WordArray(msg)
  const keyWordArray = buffer2WordArray(key)
  const ivWordArray = buffer2WordArray(iv)
    logger.debug('plainMsg = %s\nkeyWordArray = %s\nivWordArray = %s',
            JSON.stringify(plainMsg), JSON.stringify(keyWordArray), JSON.stringify(ivWordArray))
    // Encrypt plain message
  const encryptedWordArray = CryptoJS.AES.encrypt(plainMsg, keyWordArray, {
    iv     : ivWordArray,
    padding: CryptoJS.pad.NoPadding,
    mode   : CryptoJS.mode.IGE
  }).ciphertext
  logger.debug('encryptedWordArray = %s', JSON.stringify(encryptedWordArray))
    // Return the encrypted buffer
  return wordArray2Buffer(encryptedWordArray)
}

function buffer2WordArray(buffer) {
  const length = buffer.length
  const wordArray = []
  for (let i = 0; i < length; i++) {
    wordArray[i >>> 2] |= buffer[i] << (24 - 8 * (i % 4))
  }
  return new CryptoJS.lib.WordArray.init(wordArray, length)
}

function wordArray2Buffer(wordArray) {
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes
  const buffer = new Buffer(sigBytes)
  for (let i = 0; i < sigBytes; i++) {
    buffer.writeUInt8((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff, i)
  }
  return buffer
}

module.exports = {
  rsaEncrypt,
  aesDecrypt,
  aesEncrypt
}