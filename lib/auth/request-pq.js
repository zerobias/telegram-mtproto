'use strict'
const logger = require('../logger')('auth.RequestPQ')
const mtproto = require('../mtproto')
const { P, createNonce } = require('../utility')
const security = require('../security')

const { NonceError, FingerprintError } = require('../errors')

// Requires the rpc channel
module.exports = function RequestPQ(channel) {
  const onRequest = P(findPAndQ, findPublicKey)
  return requestPQ(channel).then(onRequest, err => {
    console.error(`WTF`, err)
    return Promise.reject(err)
  })
}

// Request a PQ pair number
function requestPQ(channel) {
    // Create a nonce for the client
  const clientNonce = createNonce(16)
  return new Promise((rs, rj) =>
    mtproto.service.req_pq({
      props: {
        nonce: clientNonce
      },
      channel : channel,
      callback: function(ex, result) {
        if (ex) return rj(ex)
        // const { result } = resp
        if (result && clientNonce === result.nonce) {
          const context = {
            resPQ  : result,
            channel: channel
          }
          return rs(context)
        } else
          return rj(new NonceError(clientNonce, result && result.nonce))
      }
    }))
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
  throw new FingerprintError()
}