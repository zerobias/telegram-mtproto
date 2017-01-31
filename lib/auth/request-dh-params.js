'use strict'
const logger = require('../logger')('auth.RequestDHParams')
const mtproto = require('../mtproto')
const { P, createNonce, createSHAHash, string2Buffer } = require('../utility')
const security = require('../security')
const tl = require('../tl')


// Requires the rpc channel
function RequestDHParams(context) {
  const beforeRequest = P(
    createPQInnerData,
    encryptPQInnerDataWithRSA,
    requestDHParams)
  const afterRequest = P(decryptDHParams, deserializeDHInnerData)
  return beforeRequest(context).then(afterRequest, err => console.log('WTF', err))
}


// Create the pq_inner_data buffer
function createPQInnerData(context) {
  const resPQ = context.resPQ
  const newNonce = createNonce(32)
  const pqInnerData = new mtproto.type.P_q_inner_data({
    props: {
      pq          : resPQ.pq,
      p           : context.pBuffer,
      q           : context.qBuffer,
      nonce       : resPQ.nonce,
      server_nonce: resPQ.server_nonce,
      new_nonce   : newNonce
    }
  }).serialize()
  context.pqInnerData = pqInnerData
  context.newNonce = newNonce
  return context
}

// Encrypt the pq_inner_data with RSA
function encryptPQInnerDataWithRSA(context) {
    // Create the data with hash to be encrypt
  const hash = createSHAHash(context.pqInnerData)
  const dataWithHash = Buffer.concat([hash, context.pqInnerData])
  logger.debug('Data to be encrypted contains: hash(%s), pqInnerData(%s), total length %s',
          hash.length, context.pqInnerData.length, dataWithHash.length)
  // Encrypt data with RSA
  context.encryptedData = security.cipher.rsaEncrypt(dataWithHash, context.publicKey)
  return context
}

// Request server DH parameters
function requestDHParams(context) {
  const resPQ = context.resPQ
  return new Promise((rs, rj) =>
    mtproto.service.req_DH_params({
      props: {
        nonce                 : resPQ.nonce,
        server_nonce          : resPQ.server_nonce,
        p                     : context.pBuffer,
        q                     : context.qBuffer,
        public_key_fingerprint: context.fingerprint,
        encrypted_data        : context.encryptedData
      },
      channel : context.channel,
      callback: function(ex, result, duration) {
        if (ex) {
          logger.error(ex)
          return rj(ex)
        }
        // const { result, duration } = resp
        if (result.instanceOf('mtproto.type.Server_DH_params_ok')) {
          logger.debug('\'Server_DH_params_ok\' received from Telegram.')
          context.serverDHParams = result
          context.reqDHDuration = duration
          rs(context)
        } else if (result.instanceOf('mtproto.type.Server_DH_params_ko')) {
          logger.warn('\'Server_DH_params_ko\' received from Telegram!')
          return rj(createError(JSON.stringify(result), 'EDHPARAMKO'))
        } else {
          const msg = 'Unknown error received from Telegram!'
          logger.error(msg)
          return rj(createError(msg, 'EUNKNOWN'))
        }
      }
    })
  )
}

// Decrypt DH parameters and synch the local time with the server time
function decryptDHParams(context) {
  const newNonce = string2Buffer(context.newNonce, 32)
  const serverNonce = string2Buffer(context.resPQ.server_nonce, 16)
  logger.debug('newNonce = %s, serverNonce = %s', newNonce.toString('hex'), serverNonce.toString('hex'))
  const hashNS = createSHAHash([newNonce, serverNonce])
  const hashSN = createSHAHash([serverNonce, newNonce])
  const hashNN = createSHAHash([newNonce, newNonce])
  logger.debug('hashNS = %s, hashSN = %s, hashNN = %s',
          hashNS.toString('hex'), hashSN.toString('hex'), hashNN.toString('hex'))
    // Create the AES key
  context.aes = {
    key        : Buffer.concat([hashNS, hashSN.slice(0, 12)]),
    iv         : Buffer.concat([Buffer.concat([hashSN.slice(12), hashNN]), newNonce.slice(0, 4)]),
    toPrintable: tl.utility.toPrintable
  }

  logger.debug('aesKey = %s', context.aes.toPrintable())
  // Decrypt the message
  const answerWithHash = security.cipher.aesDecrypt(
        context.serverDHParams.encrypted_answer,
        context.aes.key,
        context.aes.iv)
  context.decryptedDHParams = answerWithHash
  return context
}

// De-serialize the server DH inner data
function deserializeDHInnerData(context) {
  const decryptedDHParamsWithHash = context.decryptedDHParams
  logger.debug('decryptedDHParamsWithHash(%s) = %s',
    decryptedDHParamsWithHash.length, decryptedDHParamsWithHash.toString('hex'))
  const decryptedDHParams = decryptedDHParamsWithHash.slice(20, 564 + 20)
  logger.debug('decryptedDHParams(%s) = %s', decryptedDHParams.length, decryptedDHParams.toString('hex'))
  const serverDHInnerData = new mtproto.type.Server_DH_inner_data({
    buffer: decryptedDHParams
  }).deserialize()
  logger.debug('serverDHInnerData = %s obtained in %sms', serverDHInnerData.toPrintable(), context.reqDHDuration)
    // Check if the nonces are consistent
  if (serverDHInnerData.nonce !== context.serverDHParams.nonce)
    throw createError('Nonce mismatch %s != %s', context.serverDHParams.nonce, serverDHInnerData.nonce)

  if (serverDHInnerData.server_nonce !== context.serverDHParams.server_nonce)
    throw createError('ServerNonce mismatch %s != %s',
      context.serverDHParams.server_nonce, serverDHInnerData.server_nonce)

    // Synch the local time with the server time
  mtproto.time.timeSynchronization(serverDHInnerData.server_time, context.reqDHDuration)
  context.serverDHInnerData = serverDHInnerData
  return context
}

function createError(msg, code) {
  const error = new Error(msg)
  error.code = code
  return error
}

module.exports = exports = RequestDHParams