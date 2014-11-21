//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the classes
exports.PublicKey = require('./public-key');
exports.PQFinder = require('./pq-finder');

// Export functions
exports.createSHA1Hash = createSHA1Hash;
exports.createRandomBuffer = createRandomBuffer;
exports.createNonce = createNonce;
exports.rsaEncrypt = rsaEncrypt;
exports.aesDecrypt = aesDecrypt;
exports.aesEncrypt = aesEncrypt;
exports.modPow = modPow;
exports.createMessageId = createMessageId;
exports.timeSynchronization = timeSynchronization;

// Import dependencies
var crypto = require('crypto');
var util = require('util');
var BigInteger = require('jsbn');
var CryptoJS = require("node-cryptojs-aes").CryptoJS;
var getLogger = require('get-log');

// Create SHA1 hash starting from a buffer or an array of buffers
function createSHA1Hash(buffer) {
    var logger = getLogger('crypto-util.createSHA1Hash');
    var sha1sum = crypto.createHash('sha1');
    if (util.isArray(buffer)) {
        if (logger.isDebugEnabled()) logger.debug('It\'s an Array of buffers');
        for (var i = 0; i < buffer.length; i++) {
            sha1sum.update(buffer[i]);
        }
    } else {
        if (logger.isDebugEnabled()) logger.debug('It\'s only one buffer');
        sha1sum.update(buffer);
    }
    return sha1sum.digest();
}

// Create a random Buffer
function createRandomBuffer(bytesLength) {
    return new Buffer(crypto.randomBytes(bytesLength));
}

// Create a new nonce
function createNonce(bytesLength) {
    return '0x' + createRandomBuffer(bytesLength).toString('hex');
}

// RSA encrypt function, param: { key: publicKey, message: messageBuffer }
function rsaEncrypt(param) {
    var logger = getLogger('crypto-util.rsaEncrypt');

    var publicKey = param.key;
    var messageBuffer = param.message;
    var messageLength = messageBuffer.length;
    if (!messageBuffer || messageLength > 255) {
        logger.warn('Message is undefined or exceeds 255 bytes length.');
        return;
    }
    if (messageLength < 255) {
        // Add random bytes as padding
        var paddingLength = 255 - messageLength;
        messageBuffer = Buffer.concat([messageBuffer, createRandomBuffer(paddingLength)]);
    }
    if (logger.isDebugEnabled()) logger.debug('Message to be encrypt (%s) = %s',
        messageBuffer.length, messageBuffer.toString('hex'));
    // Encrypt the message
    var modulus = new BigInteger(publicKey.getModulus(), 16);
    var exponent = new BigInteger(publicKey.getExponent(), 16);
    var message = new BigInteger(messageBuffer);
    var encryptedMessage = new Buffer(message.modPowInt(exponent, modulus).toByteArray());
    if (encryptedMessage.length > 256) {
        encryptedMessage = encryptedMessage.slice(encryptedMessage.length - 256);
    }
    if (logger.isDebugEnabled()) logger.debug('Encrypted message(%s) = %s', encryptedMessage.length, encryptedMessage.toString('hex'));
    return encryptedMessage;
}

// AES decrypt function
function aesDecrypt(msg, key, iv) {
    var logger = getLogger('crypto-util.aesDecrypt');
    var encryptedMsg = buffer2WordArray(msg);
    var keyWordArray = buffer2WordArray(key);
    var ivWordArray = buffer2WordArray(iv);
    if (logger.isDebugEnabled()) {
        logger.debug('encryptedMsg = %s', JSON.stringify(encryptedMsg));
        logger.debug('keyWordArray = %s', JSON.stringify(keyWordArray));
        logger.debug('ivWordArray = %s', JSON.stringify(ivWordArray));
    }
    var decryptedWordArray = CryptoJS.AES.decrypt({ciphertext: encryptedMsg}, keyWordArray, {
        iv: ivWordArray,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    });
    if (logger.isDebugEnabled()) logger.debug('decryptedWordArray = %s', JSON.stringify(decryptedWordArray));
    return wordArray2Buffer(decryptedWordArray);
}

// AES encrypt function
function aesEncrypt(msg, key, iv) {
    var logger = getLogger('crypto-util.aesEncrypt');
    // Check if padding is needed
    var padding = msg.length % 16;
    if (padding > 0) {
        paddingBuffer = createRandomBuffer(16 - padding);
        msg = Buffer.concat([msg, paddingBuffer]);
    }
    // Convert buffers to wordArrays
    var plainMsg = buffer2WordArray(msg);
    var keyWordArray = buffer2WordArray(key);
    var ivWordArray = buffer2WordArray(iv);
    if (logger.isDebugEnabled()) {
        logger.debug('plainMsg = %s', JSON.stringify(plainMsg));
        logger.debug('keyWordArray = %s', JSON.stringify(keyWordArray));
        logger.debug('ivWordArray = %s', JSON.stringify(ivWordArray));
    }
    // Encrypt plain message
    var encryptedWordArray = CryptoJS.AES.encrypt(plainMsg, keyWordArray, {
        iv: ivWordArray,
        padding: CryptoJS.pad.NoPadding,
        mode: CryptoJS.mode.IGE
    }).ciphertext;
    if (logger.isDebugEnabled()) logger.debug('encryptedWordArray = %s', JSON.stringify(encryptedWordArray));
    // Return the encrypted buffer
    return wordArray2Buffer(encryptedWordArray);
}

// Mod Pow
function modPow(x, e, m) {
    var logger = getLogger('crypto-util.aesDecrypt');
    var bigX = (typeof x == 'number') ? new BigInteger(x + '', 10) : new BigInteger(x.toString('hex'), 16);
    var bigE = (typeof e == 'number') ? new BigInteger(e + '', 10) : new BigInteger(e.toString('hex'), 16);
    var bigM = (typeof m == 'number') ? new BigInteger(m + '', 10) : new BigInteger(m.toString('hex'), 16);
    var bigResult = bigX.modPow(bigE, bigM);
    if (logger.isDebugEnabled()) logger.debug('X = %s, E = %s, M = %s, result = %s', bigX, bigE, bigM, bigResult);
    var result = new Buffer(bigResult.toByteArray());
    if (result.length > 256) {
        result = result.slice(result.length - 256);
    }
    return result;
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

// Time offset between local time and server time
var timeOffset = 0;
var lastResponseTime = Number.MAX_VALUE;

// Create a message ID starting from the local time
function createMessageId() {
    var logger = getLogger('crypto-util.createMessageId');
    // Constants
    var thousand = new BigInteger((1000).toString());
    var lowerMultiplier = new BigInteger((4294964).toString());
    // Take the time and sum the time-offset with the server clock
    var time = new BigInteger((new Date().getTime() + timeOffset).toString());
    // Divide the time by 1000 `result[0]` and take the fractional part `result[1]`
    var result = time.divideAndRemainder(thousand);
    // Prepare lower 32 bit using the fractional part of the time
    var lower = result[1].multiply(lowerMultiplier);
    // Create the message id
    var messageId = result[0].shiftLeft(32).add(lower);
    if (logger.isDebugEnabled()) {
        logger.debug('MessageId(%s) was created with time = %s and offset = %s, lower = %s,  messageID binary = %s',
            messageId.toString(), time, timeOffset,  lower,  messageId.toString(2));
    }
    return messageId.toString();
}

// Synchronize the local time with the server time
function timeSynchronization(serverTime, requestDuration) {
    var logger = getLogger('crypto-util.timeSynchronization');
    var localTime = new Date().getTime();
    var responseTime = requestDuration / 2;
    if (lastResponseTime > responseTime) {
        lastResponseTime = responseTime;
        timeOffset = (serverTime + responseTime) - localTime;
        logger.info('(ServerTime %s + ServerResponseTime %s) - LocalTime %s = timeOffset %s ',
            serverTime, responseTime, localTime, timeOffset);
    } else {
        logger.info('Discarded: ServerResponseTime (%s) higher than previous one (%s) ',
            responseTime, lastResponseTime);
    }
}