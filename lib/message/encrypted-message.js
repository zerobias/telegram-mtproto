//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     EncryptedMessage class
//
// This class provide a encrypted-text message for data transmission in MTProto

// Import dependencies
require('requirish')._(module);
var util = require('util');
var mtproto = require('lib/mtproto');
var utility = require('lib/utility');
var security = require('lib/security');
var tl = require('telegram-tl-node');
var logger = require('get-log')('mtproto.EncryptedMessage');

EncryptedMessage.InnerMessage = new tl.TypeBuilder.buildType('message.EncryptedMessage', {
    "predicate": "InnerMessage",
    "params": [
        {
            "name": "server_salt",
            "type": "long"
        }, {
            "name": "session_id",
            "type": "long"
        }, {
            "name": "payload",
            "type": "%Message"
        }
    ],
    "type": "InnerMessage"
});

// To get an instance for `serialization`:
//
//     new EncryptedMessage({message: myMessageBuffer});
// Provide the payload as `Buffer`:
//
// To get an instance for `de-serialization`:
//
//     new EncryptedMessage({buffer: myBuffer});
// Provide a `buffer` containing the plain message from which extract the payload
function EncryptedMessage(options) {
    var opts = options ? options : {};
    this.constructor.super_.call(this, opts.buffer, opts.offset);
    this.authKey = opts.authKey;
    if (opts.message) {
        this.body = opts.message;
        this.innerMessage = new EncryptedMessage.InnerMessage({
            props: {
                server_salt: opts.serverSalt,
                session_id: opts.sessionId,
                payload: new mtproto.type.Message({
                    props: {
                        msg_id: utility.createMessageId(),
                        seqno: opts.sequenceNumber.generate(true),
                        bytes: this.body.length,
                        body: this.body
                    }
                })
            }
        });
    }
}

// Extend TypeObject class
util.inherits(EncryptedMessage, tl.TypeObject);

// This method serialize the EncryptedMessage
EncryptedMessage.prototype.serialize = function () {
    if (!this.innerMessage || !this.authKey) {
        logger.warn('Unable to serialize the message, "message" & "authKey" are mandatory!');
        return false;
    }
    // Serialize the message
    this.decryptedData = this.innerMessage.serialize();
    // Create the message_key
    this.msgKey = utility.createSHAHash(this.decryptedData).slice(4, 20);
    // Derivate the AES key
    this.aes = this.authKey.derivateAesKey(this.msgKey);
    if (logger.isDebugEnabled()) {
        logger.debug('Before encryption: %s', this.toPrintable({authKey: true}));
    }
    // Start serializing..
    this.writeLong(this.authKey.id);
    this.writeInt128(this.msgKey);
    // Encrypt the message
    this.encryptedData = security.cipher.aesEncrypt(this.decryptedData, this.aes.key, this.aes.iv);
    // Call the low level write method
    this._writeBytes(this.encryptedData);
    if (logger.isDebugEnabled()) {
        logger.debug('After encryption: %s', this.toPrintable({authKey: true}));
    }
    return this.retrieveBuffer();
};

// This method de-serialize the EncryptedMessage
EncryptedMessage.prototype.deserialize = function (isSymmetric) {
    if (!this.isReadonly() || !this.authKey) {
        var msg = 'Unable to deserialize the message, "message" is not readonly || "authKey" is undefined!';
        logger.warn(msg);
        throw new Error(msg);
    }
    var msgAuthKeyId = this.readLong();
    if (msgAuthKeyId !== tl.utility.buffer2StringValue(this.authKey.id)) {
        msg = 'Unable to decrypt the message, the authKey ids do not match!';
        logger.warn(msg);
        throw new Error(msg);
    }
    // Call low level read method
    this.msgKey = this._readBytes(16);
    this.aes = this.authKey.derivateAesKey(this.msgKey, !isSymmetric);
    // Call low level read method
    this.encryptedData = this._readBytes();
    // Decrypt the message
    if (logger.isDebugEnabled()) {
        logger.debug('Before decryption: %s', this.toPrintable({authKey: true}));
    }
    this.decryptedData = security.cipher.aesDecrypt(this.encryptedData, this.aes.key, this.aes.iv);
    if (logger.isDebugEnabled()) {
        logger.debug('After decryption: %s', this.toPrintable({authKey: true}));
    }
    // Deserialize the message
    this.innerMessage = new EncryptedMessage.InnerMessage({buffer: this.decryptedData}).deserialize({noLengthCheck: true});
    this.body = this.innerMessage.payload.body;
    this.serverSalt = this.innerMessage.server_salt;
    this.sessionId = this.innerMessage.session_id;
    this.sequenceNumber = this.innerMessage.payload.seqno;
    return this;
};

// Export the class
module.exports = exports = EncryptedMessage;