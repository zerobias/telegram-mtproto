'use strict'
//     AuthKey class
//
// This class represents the Authentication Key

const utility = require('../utility')
const security = require('../security')
const tl = require('../tl')

function AuthKey(id, value) {
  this.id = id
  this.value = value
}

AuthKey.prototype.toString = function() {
  return tl.utility.toPrintable.apply(this, Array.prototype.slice.call(arguments))
}

AuthKey.prototype.derivateAesKey = function(msgKey, fromServer) {
  const aKey = this.value
  const x = fromServer
    ? 8
    : 0
  const sha1A = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x, x + 32)], 48))
  const sha1B = utility.createSHAHash(
    Buffer.concat([aKey.slice(x + 32, x + 48), msgKey, aKey.slice(x + 48, x + 64)], 48))
  const sha1C = utility.createSHAHash(Buffer.concat([aKey.slice(x + 64, x + 96), msgKey], 48))
  const sha1D = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x + 96, x + 128)], 48))
  return {
    key        : Buffer.concat([sha1A.slice(0, 8), sha1B.slice(8, 20), sha1C.slice(4, 16)], 32),
    iv         : Buffer.concat([sha1A.slice(8, 20), sha1B.slice(0, 8), sha1C.slice(16, 20), sha1D.slice(0, 8)], 32),
    toPrintable: tl.utility.toPrintable
  }
}

AuthKey.prototype.encrypt = function(password) {
  return AuthKey.encryptAuthKey(this, password)
}

AuthKey.encryptAuthKey = function(authKey, password) {
  const plainKey = Buffer.concat([authKey.id, authKey.value])
  const passwordHash = utility.createSHAHash(new Buffer(password), 'sha512')
  const aesKey = passwordHash.slice(0, 32)
  const aesIv = passwordHash.slice(32, 64)
  return security.cipher.aesEncrypt(plainKey, aesKey, aesIv).slice(0)
}

AuthKey.decryptAuthKey = function(buffer, password) {
  const passwordHash = utility.createSHAHash(new Buffer(password), 'sha512')
  const aesKey = passwordHash.slice(0, 32)
  const aesIv = passwordHash.slice(32, 64)
  const decrypted = security.cipher.aesDecrypt(buffer, aesKey, aesIv)
  const id = decrypted.slice(0, 8)
  const value = decrypted.slice(8, 264)
  const hash = utility.createSHAHash(value)
  return (hash.slice(-8).toString('hex') == id.toString('hex'))
    ? new AuthKey(id, value)
    : null
}

module.exports = exports = AuthKey
