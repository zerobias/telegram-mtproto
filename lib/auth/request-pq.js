//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the module
module.exports = exports = RequestPQ;

// Import dependencies
var flow = require('get-flow');
var logger = require('get-log')('auth.RequestPQ');
var mtproto = require('../mtproto');
var utility = require('../utility');
var security = require('../security');

// Requires a callback function and the rpc channel
function RequestPQ(callback, channel) {
    flow.runSeries([
        requestPQ,
        findPAndQ,
        findPublicKey,
    ], callback, channel);
}

// Request a PQ pair number
function requestPQ(callback, channel) {
    // Create a nonce for the client
    var clientNonce = utility.createNonce(16);
    mtproto.service.req_pq({
        props: {
            nonce: clientNonce
        },
        channel: channel,
        callback: function (ex, resPQ) {
            if (clientNonce === resPQ.nonce) {
                var context = {
                    resPQ: resPQ,
                    channel: channel
                };
                callback(null, context);
            } else {
                callback(createError('Nonce mismatch.', 'ENONCE'));
            }
        }
    });
}

// Find the P and Q prime numbers
function findPAndQ(context) {
    var pqFinder = new security.PQFinder(context.resPQ.pq);
    if (logger.isDebugEnabled()) {
        logger.debug('Start finding P and Q, with PQ = %s', pqFinder.getPQPairNumber());
    }
    var pq = pqFinder.findPQ();
    if (logger.isDebugEnabled()) {
        logger.debug('Found P = %s and Q = %s', pq[0], pq[1]);
    }
    context.pBuffer = pqFinder.getPQAsBuffer()[0];
    context.qBuffer = pqFinder.getPQAsBuffer()[1];
    return context;
}

// Find the correct Public Key using fingerprint from server response
function findPublicKey(context) {
    var fingerprints = context.resPQ.server_public_key_fingerprints.getList();
    if (logger.isDebugEnabled()) {
        logger.debug('Public keys fingerprints from server: %s', fingerprints);
    }
    for (var i = 0; i < fingerprints.length; i++) {
        var fingerprint = fingerprints[i];
        if (logger.isDebugEnabled()) {
            logger.debug('Searching fingerprint %s in store', fingerprint);
        }
        var publicKey = security.PublicKey.retrieveKey(fingerprint);
        if (publicKey) {
            if (logger.isDebugEnabled()) {
                logger.debug('Fingerprint %s found in keyStore.', fingerprint);
            }
            context.fingerprint = fingerprint;
            context.publicKey = publicKey;
            return context;
        }
    }
    throw createError('Fingerprints from server not found in keyStore.', 'EFINGERNOTFOUND');
}

function createError(msg, code) {
    var error = new Error(msg);
    error.code = code;
    return error;
}

