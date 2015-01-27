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
    this.innerMessage = opts.message;
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
        logger.debug('Serialize encrypted_message(%s) with \nauthKeyId: %s, \nmessageKey: %s, \ndata: %s, \nencryptedData: %s',
            encryptedData.length, this.authKey.id.toString('hex'), this.msgKey.toString('hex'), data.toString('hex'), encryptedData.toString('hex'));
    }
    return this.retrieveBuffer();
};

// This method de-serialize the EncryptedMessage
EncryptedMessage.prototype.deserialize = function() {
    if (!this.isReadonly() || !this.authKey) {
        logger.warn('Unable to deserialize the message, "message" is not readonly || "authKey" is undefined!');
        return false;
    }
    var msgAuthKeyId = this.readLong();
    if (msgAuthKeyId != tl.TypeObject.buffer2StringValue(this.authKey.id)) {
        logger.warn('Unable to decrypt the message, the authKey ids do not match!');
        return false;
    }
    // call low level read method
    this.msgKey =  this._readBytes(20);
    var aes = this.authKey.derivateAesKey(this.msgKey, true);
    // call low level read method
    var data = this._readBytes();
    var decryptedData = security.cipher.aesDecrypt(data, aes.key, aes.iv);
    if (logger.isDebugEnabled()) {
        logger.debug('Deserializing encrypted_message(%s) with \nauthKeyId: %s, \nmessageKey: %s, \ndata: %s, \ndecryptedData: %s',
            data.length, this.authKey.id.toString('hex'), this.msgKey.toString('hex'), data.toString('hex'), decryptedData.toString('hex'));
    }
    this.innerMessage = new EncryptedMessage.InnerMessage({buffer: decryptedData}).deserialize(true);
    return this;
};

// Export the class
module.exports = exports = EncryptedMessage;