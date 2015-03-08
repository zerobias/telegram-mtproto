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

EncryptedMessage.InnerMessage = new tl.TypeBuilder('message.EncryptedMessage', {
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
            "type": "Message"
        }
    ],
    "type": "InnerMessage"
}).getType();

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
        this.body = Buffer.isBuffer(opts.message) ? opts.message : new Buffer(opts.message, 'hex');
        this.innerMessage = new EncryptedMessage.InnerMessage({
            props: {
                server_salt: opts.serverSalt,
                session_id: opts.sessionId,
                payload: new mtproto.type.Message({
                    props: {
                        msg_id: utility.createMessageId(),
                        seqno: opts.sequenceNumber,
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
EncryptedMessage.prototype.serialize = function() {
    if (!this.innerMessage || !this.authKey) {
        logger.warn('Unable to serialize the message, "message" & "authKey" are mandatory!');
        return false;
    }
    var data = this.innerMessage.serialize();
    this.msgKey = utility.createSHAHash(data);
    var aes = this.authKey.derivateAesKey(this.msgKey);
    var encryptedData = security.cipher.aesEncrypt(data, aes.key, aes.iv);
    this.writeLong(this.authKey.id);
    this.writeInt128(this.msgKey);
    // call low level write method
    this._writeBytes(encryptedData);
    if (logger.isDebugEnabled()) {
        logger.debug('After encryption: %s', this.toPrintable({authKey: true}));
    }
    return this.retrieveBuffer();
};

// This method de-serialize the EncryptedMessage
EncryptedMessage.prototype.deserialize = function(isSymmetric) {
    if (!this.isReadonly() || !this.authKey) {
        logger.warn('Unable to deserialize the message, "message" is not readonly || "authKey" is undefined!');
        return false;
    }
    var msgAuthKeyId = this.readLong();
    if (msgAuthKeyId !== tl.utility.buffer2StringValue(this.authKey.id)) {
        logger.warn('Unable to decrypt the message, the authKey ids do not match!');
        return false;
    }
    // call low level read method
    this.msgKey = this._readBytes(20);
    var aes = this.authKey.derivateAesKey(this.msgKey, !isSymmetric);
    // call low level read method
    var data = this._readBytes();
    var decryptedData = security.cipher.aesDecrypt(data, aes.key, aes.iv);
    if (logger.isDebugEnabled()) {
        logger.debug('After decryption: %s', this.toPrintable({authKey: true}));
    }
    this.innerMessage = new EncryptedMessage.InnerMessage({buffer: decryptedData}).deserialize(true);
    this.body = this.innerMessage.payload.body;
    this.serverSalt = this.innerMessage.server_salt;
    this.sessionId = this.innerMessage.session_id;
    this.sequenceNumber = this.innerMessage.payload.seqno;
    return this;
};

// Export the class
module.exports = exports = EncryptedMessage;