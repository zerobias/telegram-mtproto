//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the module
module.exports = exports = RequestPQ

// Import dependencies
const flow = require('get-flow')
const logger = require('../logger')('auth.RequestPQ')
const mtproto = require('../mtproto')
const utility = require('../utility')
const security = require('../security')

// Requires a callback function and the rpc channel
function RequestPQ(callback, channel) {
  flow.runSeries([
    requestPQ,
    findPAndQ,
    findPublicKey,
  ], callback, channel)
}

// Request a PQ pair number
function requestPQ(callback, channel) {
    // Create a nonce for the client
  const clientNonce = utility.createNonce(16)
  mtproto.service.req_pq({
    props: {
      nonce: clientNonce
    },
    channel : channel,
    callback: function(ex, resPQ) {
      if (resPQ && clientNonce === resPQ.nonce) {
        const context = {
          resPQ  : resPQ,
          channel: channel
        }
        callback(null, context)
      } else
        callback(createError('Nonce mismatch.', 'ENONCE'))
    }
  })
}

// Find the P and Q prime numbers
function findPAndQ(context) {
  const pqFinder = new security.PQFinder(context.resPQ.pq)
  logger.debug('Start finding P and Q, with PQ = %s', pqFinder.getPQPairNumber())
  const pq = pqFinder.findPQ()
  logger.debug('Found P = %s and Q = %s', pq[0], pq[1])
  context.pBuffer = pqFinder.getPQAsBuffer()[0]
  context.qBuffer = pqFinder.getPQAsBuffer()[1]
  return context
}

// Find the correct Public Key using fingerprint from server response
function findPublicKey(context) {
  const fingerprints = context.resPQ.server_public_key_fingerprints.getList()
  logger.debug('Public keys fingerprints from server: %s', fingerprints)
  for (let i = 0; i < fingerprints.length; i++) {
    const fingerprint = fingerprints[i]
    logger.debug('Searching fingerprint %s in store', fingerprint)
    const publicKey = security.PublicKey.retrieveKey(fingerprint)
    if (publicKey) {
      logger.debug('Fingerprint %s found in keyStore.', fingerprint)
      context.fingerprint = fingerprint
      context.publicKey = publicKey
      return context
    }
  }
  throw createError('Fingerprints from server not found in keyStore.', 'EFINGERNOTFOUND')
}

function createError(msg, code) {
  const error = new Error(msg)
  error.code = code
  return error
}

