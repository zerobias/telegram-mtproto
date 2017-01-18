//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the class
module.exports = exports = RequestDHParams

// Import dependencies
const flow = require('get-flow')
const logger = require('../logger')('auth.RequestDHParams')
const mtproto = require('../mtproto')
const utility = require('../utility')
const security = require('../security')
const tl = require('@goodmind/telegram-tl-node')


// Requires a callback function and the rpc channel
function RequestDHParams(callback, context) {
  flow.runSeries([
    createPQInnerData,
    encryptPQInnerDataWithRSA,
    requestDHParams,
    decryptDHParams,
    deserializeDHInnerData
  ], callback, context)
}


// Create the pq_inner_data buffer
function createPQInnerData(context) {
  const resPQ = context.resPQ
  const newNonce = utility.createNonce(32)
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
  const hash = utility.createSHAHash(context.pqInnerData)
  const dataWithHash = Buffer.concat([hash, context.pqInnerData])
  logger.debug('Data to be encrypted contains: hash(%s), pqInnerData(%s), total length %s',
          hash.length, context.pqInnerData.length, dataWithHash.length)
  // Encrypt data with RSA
  context.encryptedData = security.cipher.rsaEncrypt(dataWithHash, context.publicKey)
  return context
}

// Request server DH parameters
function requestDHParams(callback, context) {
  const resPQ = context.resPQ
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
    callback: function(ex, serverDHParams, duration) {
      if (ex) {
        logger.error(ex)
        if (callback) {
          callback(ex)
        }
      } else {
        if (serverDHParams.instanceOf('mtproto.type.Server_DH_params_ok')) {
          logger.debug('\'Server_DH_params_ok\' received from Telegram.')
          context.serverDHParams = serverDHParams
          context.reqDHDuration = duration
          callback(null, context)
        } else if (serverDHParams.instanceOf('mtproto.type.Server_DH_params_ko')) {
          logger.warn('\'Server_DH_params_ko\' received from Telegram!')
          callback(createError(JSON.stringify(serverDHParams), 'EDHPARAMKO'))
        } else {
          const msg = 'Unknown error received from Telegram!'
          logger.error(msg)
          callback(createError(msg, 'EUNKNOWN'))
        }
      }
    }
  })
}

// Decrypt DH parameters and synch the local time with the server time
function decryptDHParams(context) {
  const newNonce = utility.string2Buffer(context.newNonce, 32)
  const serverNonce = utility.string2Buffer(context.resPQ.server_nonce, 16)
  logger.debug('newNonce = %s, serverNonce = %s', newNonce.toString('hex'), serverNonce.toString('hex'))
  const hashNS = utility.createSHAHash([newNonce, serverNonce])
  const hashSN = utility.createSHAHash([serverNonce, newNonce])
  const hashNN = utility.createSHAHash([newNonce, newNonce])
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
