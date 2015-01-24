//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

/*jshint bitwise:false*/

// Export functions
exports.rsaEncrypt = rsaEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.aesEncrypt = aesEncrypt;

// Import dependencies
require('requirish')._(module);
var BigInteger = require('jsbn');
var CryptoJS = require('node-cryptojs-aes').CryptoJS;
var getLogger = require('get-log');
var utility = require('lib/utility');

// RSA encrypt function, requires:
//  - publicKey
//  - messageBuffer
function rsaEncrypt(messageBuffer, publicKey) {
    var logger = getLogger('security.cipher.rsaEncrypt');
    var messageLength = messageBuffer.length;
    if (!messageBuffer || messageLength > 255) {
        logger.warn('Message is undefined or exceeds 255 bytes length.');
        return;
    } else if (messageLength < 255) {
        // Add random bytes as padding
        var paddingLength = 255 - messageLength;
        messageBuffer = Buffer.concat([messageBuffer, utility.createRandomBuffer(paddingLength)]);
    }
    // Encrypt the message
    var modulus = new BigInteger(publicKey.getModulus(), 16);
    var exponent = new BigInteger(publicKey.getExponent(), 16);
    var message = new BigInteger(messageBuffer);
    var encryptedMessage = new Buffer(message.modPowInt(exponent, modulus).toByteArray());
    if (encryptedMessage.length > 256) {
        encryptedMessage = encryptedMessage.slice(encryptedMessage.length - 256);
    }
    if (logger.isDebugEnabled()) {
        logger.debug('Plain-text message(%s) = %s', messageBuffer.length, messageBuffer.toString('hex'));
        logger.debug('Encrypted message(%s) = %s', encryptedMessage.length, encryptedMessage.toString('hex'));
    }
    return encryptedMessage;
}

// AES decrypt function
function aesDecrypt(msg, key, iv) {
    var logger = getLogger('security.cipher.aesDecrypt');
    var encryptedMsg = buffer2WordArray(msg);
    var keyWordArray = buffer2WordArray(key);
    var ivWordArray = buffer2WordArray(iv);
    if (logger.isDebugEnabled()) {
        logger.debug('encryptedMsg = %s\nkeyWordArray = %s\nivWordArray = %s',
            JSON.stringify(encryptedMsg), JSON.stringify(keyWordArray), JSON.stringify(ivWordArray));
    }
    var decryptedWordArray = CryptoJS.AES.decrypt({ciphertext: encryptedMsg}, keyWordArray, {
        iv: ivWordArray,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    });
    if (logger.isDebugEnabled()) {
        logger.debug('decryptedWordArray = %s', JSON.stringify(decryptedWordArray));
    }
    return wordArray2Buffer(decryptedWordArray);
}

// AES encrypt function
function aesEncrypt(msg, key, iv) {
    var logger = getLogger('security.cipher.aesEncrypt');
    // Check if padding is needed
    var padding = msg.length % 16;
    if (padding > 0) {
        var paddingBuffer = utility.createRandomBuffer(16 - padding);
        msg = Buffer.concat([msg, paddingBuffer]);
    }
    // Convert buffers to wordArrays
    var plainMsg = buffer2WordArray(msg);
    var keyWordArray = buffer2WordArray(key);
    var ivWordArray = buffer2WordArray(iv);
    if (logger.isDebugEnabled()) {
        logger.debug('plainMsg = %s\nkeyWordArray = %s\nivWordArray = %s',
            JSON.stringify(plainMsg), JSON.stringify(keyWordArray), JSON.stringify(ivWordArray));
    }
    // Encrypt plain message
    var encryptedWordArray = CryptoJS.AES.encrypt(plainMsg, keyWordArray, {
        iv: ivWordArray,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    }).ciphertext;
    if (logger.isDebugEnabled()) {
        logger.debug('encryptedWordArray = %s', JSON.stringify(encryptedWordArray));
    }
    // Return the encrypted buffer
    return wordArray2Buffer(encryptedWordArray);
}

function buffer2WordArray(buffer) {
    var length = buffer.length;
    var wordArray = [];
    for (var i = 0; i < length; i++) {
        wordArray[i >>> 2] |= buffer[i] << (24 - 8 * (i % 4));
    }
    return new CryptoJS.lib.WordArray.init(wordArray, length);
}

function wordArray2Buffer(wordArray) {
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    var buffer = new Buffer(sigBytes);
    for (var i = 0; i < sigBytes; i++) {
        buffer.writeUInt8((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff, i);
    }
    return buffer;
}