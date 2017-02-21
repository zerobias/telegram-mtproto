'use strict'
const util = require('util')
const mtproto = require('../mtproto')
const utility = require('../utility')
const security = require('../security')
const tl = require('../tl')
const logger = require('../logger')('message.EncryptedMessage')

const InnerMessage = tl.TypeBuilder.buildType('mtproto.type', {
  'predicate': 'InnerMessage',
  'params'   : [
    {
      'name': 'server_salt',
      'type': 'long'
    }, {
      'name': 'session_id',
      'type': 'long'
    }, {
      'name': 'payload',
      'type': '%Message'
    }
  ],
  'type': 'InnerMessage'
})

const createInnerMessage = (body, opts, isContentRelated) =>
  new InnerMessage({
    props: {
      server_salt: opts.serverSalt,
      session_id : opts.sessionId,
      payload    : wrap(body, opts.sequenceNumber, isContentRelated)
    }
  })

const wrap = (body, sequenceNumber, isContentRelated) =>
  new mtproto.type.Message({
    props: {
      msg_id: utility.createMessageId(),
      seqno : sequenceNumber.generate(isContentRelated),
      bytes : body.length,
      body  : body
    }
  })

const isContentRel = message =>
  message.getTypeName().slice(0, 8) != 'mtproto.' ||
  message.getTypeName().slice(-15) == 'invokeWithLayer'

/**
 * Provide a encrypted-text message for data transmission in MTProto
 *
 * @class EncryptedMessage
 * @extends {tl.TypeObject}
 */
class EncryptedMessage extends tl.TypeObject {
  /**
   * To get an instance for `serialization`:
   *
   *     new EncryptedMessage({message: myMessageBuffer});
   * Provide the payload as `Buffer`:
   *
   * To get an instance for `de-serialization`:
   *
   *     new EncryptedMessage({buffer: myBuffer});
   * Provide a `buffer` containing the plain message from which extract the payload
   * @param {any} options
   *
   * @memberOf EncryptedMessage
   */
  constructor(options) {
    const opts = options
      ? options
      : {}
    super(opts.buffer, opts.offset)
    this.authKey = opts.authKey
    if (opts.message) {
      if (util.isArray(opts.message)) {
        const messages = opts.message.map(message => {
          const isContRel = isContentRel(message)
          logger.debug('Message [%s] is content related? %s', message.getTypeName(), isContRel)
          return wrap(message, opts.sequenceNumber, isContRel)
        })
        this.body = new mtproto.type.Msg_container({
          props: {
            messages: new tl.TypeVector({ module: 'mtproto.type', type: '%Message', list: messages })
          }
        })
        this.innerMessage = createInnerMessage(this.body, opts, false)
      } else {
        this.body = opts.message
        this.innerMessage = createInnerMessage(this.body, opts, true)
      }
      this.messageId = this.innerMessage.payload.msg_id
    }
  }
  serialize() {
    if (!this.innerMessage || !this.authKey) {
      logger.warn('Unable to serialize the message, "message" & "authKey" are mandatory!')
      return false
    }
      // Serialize the message
    this.decryptedData = this.innerMessage.serialize()
      // Create the message_key
    this.msgKey = utility.createSHAHash(this.decryptedData).slice(4, 20)
      // Derivate the AES key
    this.aes = this.authKey.derivateAesKey(this.msgKey)
    logger.debug('Before encryption: %s', this.toPrintable({ authKey: true }))
      // Start serializing..
    this.writeLong(this.authKey.id)
    this.writeInt128(this.msgKey)
      // Encrypt the message
    this.encryptedData = security.cipher.aesEncrypt(this.decryptedData, this.aes.key, this.aes.iv)
      // Call the low level write method
    this._writeBytes(this.encryptedData)
    logger.debug('After encryption: %s', this.toPrintable({ authKey: true }))
    return this.retrieveBuffer()
  }

  deserialize(isSymmetric) {
    let msg
    if (!this.isReadonly() || !this.authKey) {
      msg = 'Unable to deserialize the message, "message" is not readonly || "authKey" is undefined!'
      logger.warn(msg)
      throw new Error(msg)
    }
    const msgAuthKeyId = this.readLong()
    if (msgAuthKeyId !== tl.utility.buffer2StringValue(this.authKey.id)) {
      msg = 'Unable to decrypt the message, the authKey ids do not match!'
      logger.warn(msg)
      throw new Error(msg)
    }
      // Call low level read method
    this.msgKey = this._readBytes(16)
    this.aes = this.authKey.derivateAesKey(this.msgKey, !isSymmetric)
      // Call low level read method
    this.encryptedData = this._readBytes()
      // Decrypt the message
    logger.debug('Before decryption: %s', this.toPrintable({ authKey: true }))
    this.decryptedData = security.cipher.aesDecrypt(this.encryptedData, this.aes.key, this.aes.iv)
    logger.debug('After decryption: %s', this.toPrintable({ authKey: true }))
      // Deserialize the message
    this.innerMessage = new InnerMessage({ buffer: this.decryptedData })
      .deserialize({ noLengthCheck: true })
    this.body = this.innerMessage.payload.body
    this.serverSalt = this.innerMessage.server_salt
    this.sessionId = this.innerMessage.session_id
    this.messageId = this.innerMessage.payload.msg_id
    return this
  }
}

module.exports = exports = EncryptedMessage