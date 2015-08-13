//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the class
module.exports = exports = SetClientDHParams;

// Import dependencies
require('requirish')._(module);
var flow = require('get-flow');
var logger = require('get-log')('auth.SetClientDHParams');
var mtproto = require('lib/mtproto');
var utility = require('lib/utility');
var security = require('lib/security');
var AuthKey = require('./auth-key');
var tl = require('telegram-tl-node');

// Requires a callback function and the rpc channel
function SetClientDHParams(callback, context) {
    flow.runSeries([
        createClientDHInnerData,
        encryptClientDHInnerDataWithAES,
        setClientDHParams
    ], callback, context);
}

// Calculate the g_b = pow(g, b) mod dh_prime
// Create the client DH inner data
function createClientDHInnerData(context) {
    var retryCount = 0;
    if (logger.isDebugEnabled()) {
        logger.debug('Start calculating g_b');
    }
    // Calculate g_b
    var g = context.serverDHInnerData.g;
    var b = utility.createNonce(256);
    var dhPrime = context.serverDHInnerData.dh_prime;
    var gb = utility.modPow(g, b, dhPrime);
    if (logger.isDebugEnabled()) {
        logger.debug('g_b(%s) = %s', gb.length, gb.toString('hex'));
    }
    // Create client DH inner data
    context.clientDHInnerData = new mtproto.type.Client_DH_inner_data({
        props: {
            nonce: context.resPQ.nonce,
            server_nonce: context.resPQ.server_nonce,
            retry_id: retryCount,
            g_b: gb
        }
    }).serialize();
    context.b = b;
    return context;
}

// Encrypt Client DH inner data
function encryptClientDHInnerDataWithAES(context) {
    var hash = utility.createSHAHash(context.clientDHInnerData);
    var dataWithHash = Buffer.concat([hash, context.clientDHInnerData]);
    if (logger.isDebugEnabled()) {
        logger.debug('Data to be encrypted contains: hash(%s), clientDHInnerData(%s), total length %s',
            hash.length, context.clientDHInnerData.length, dataWithHash.length);
    }
    context.encryptClientDHInnerData = security.cipher.aesEncrypt(
        dataWithHash,
        context.aes.key,
        context.aes.iv
    );
    if (logger.isDebugEnabled()) {
        logger.debug('encryptClientDHInnerData(%s) = %s',
            context.encryptClientDHInnerData.length, context.encryptClientDHInnerData.toString('hex'));
    }
    return context;
}

// Set client DH parameters
function setClientDHParams(callback, context) {
    mtproto.service.set_client_DH_params({
        props: {
            nonce: context.resPQ.nonce,
            server_nonce: context.resPQ.server_nonce,
            encrypted_data: context.encryptClientDHInnerData
        },
        channel: context.channel,
        callback: function (ex, setClientDHParamsAnswer) {
            if (ex) {
                logger.error(ex);
                if (callback) {
                    callback(ex);
                }
            } else {
                if (setClientDHParamsAnswer.instanceOf('mtproto.type.Dh_gen_ok')) {
                    if (logger.isDebugEnabled()) {
                        logger.debug('\'Dh_gen_ok\' received from Telegram.');
                    }
                    context.setClientDHParamsAnswer = setClientDHParamsAnswer;
                    flow.runSeries([
                        calculateAuthKeyValue,
                        createAuthKeyID,
                        checkNonceMatch,
                        createAuthKey
                    ], callback, context);
                } else if (setClientDHParamsAnswer.instanceOf('mtproto.type.Dh_gen_retry')) {
                    logger.warn('\'Dh_gen_retry\' received from Telegram!');
                    callback(createError(JSON.stringify(setClientDHParamsAnswer), 'EDHPARAMRETRY'));
                } else if (setClientDHParamsAnswer.instanceOf('mtproto.type.Dh_gen_fail')) {
                    logger.warn('\'Dh_gen_fail\' received from Telegram!');
                    callback(createError(JSON.stringify(setClientDHParamsAnswer), 'EDHPARAMFAIL'));
                } else {
                    var msg = 'Unknown error received from Telegram!';
                    logger.error(msg);
                    callback(createError(msg, 'EUNKNOWN'));
                }
            }
        }
    });
}

// Calculate the authentication key value
function calculateAuthKeyValue(context) {
    var ga = context.serverDHInnerData.g_a;
    var b = context.b;
    var dhPrime = context.serverDHInnerData.dh_prime;
    var authKeyValue = utility.modPow(ga, b, dhPrime);
    if (logger.isDebugEnabled()) {
        logger.debug('authKeyValue(%s) = %s', authKeyValue.length, authKeyValue.toString('hex'));
    }
    context.authKeyValue = authKeyValue;
    return context;
}

// Calculate AuthKey hash and ID
function createAuthKeyID(context) {
    var authKeyHash = utility.createSHAHash(context.authKeyValue);
    var authKeyAuxHash = authKeyHash.slice(0, 8);
    var authKeyID = authKeyHash.slice(-8);
    if (logger.isDebugEnabled()) {
        logger.debug('authKeyID(%s) = %s', authKeyID.length, authKeyID.toString('hex'));
    }
    context.authKeyID = authKeyID;
    context.authKeyAuxHash = authKeyAuxHash;
    return context;
}

// Withstand replay-attacks
function checkNonceMatch(context) {
    var newNonce1 = Buffer.concat([utility.string2Buffer(context.newNonce, 32), new Buffer([1]), context.authKeyAuxHash]);
    var newNonceHash = utility.buffer2String(utility.createSHAHash(newNonce1).slice(-16));
    var serverNewNonceHash = context.setClientDHParamsAnswer.new_nonce_hash1;
    if (logger.isDebugEnabled()) {
        logger.debug('newNonceHash = %s, new_nonce_hash1 = %s', newNonceHash.toString(), serverNewNonceHash.toString());
    }
    if (newNonceHash !== serverNewNonceHash) {
        logger.warn('\'dh_gen_ok.new_nonce_hash1\' check fails!');
        throw createError(newNonceHash + ' != ' + serverNewNonceHash, 'EREPLAYATTACK');
    }
    return context;
}

// Create the AuthKey
function createAuthKey(context) {
    // Extract the nonces
    var newNonce = utility.string2Buffer(context.newNonce, 32);
    var serverNonce = utility.string2Buffer(context.resPQ.server_nonce, 16);
    // Create the serverSalt
    var serverSalt = utility.xor(newNonce.slice(0, 8), serverNonce.slice(0, 8));
    if (logger.isDebugEnabled()) {
        logger.debug('serverSalt(%s) = %s', serverSalt.length, serverSalt.toString('hex'));
    }
    // Create the AuthKey
    var authKey = new AuthKey(context.authKeyID, context.authKeyValue);
    if (logger.isDebugEnabled()) {
        logger.debug('authKey = %s', authKey.toString());
    }
    return {
        key: authKey,
        serverSalt: serverSalt,
        toPrintable: tl.utility.toPrintable
    };
}

function createError(msg, code) {
    var error = new Error(msg);
    error.code = code;
    return error;
}
