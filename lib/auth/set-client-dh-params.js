'use strict'
const logger = require('../logger')('auth.SetClientDHParams')
const mtproto = require('../mtproto')
const utility = require('../utility')
const security = require('../security')
const AuthKey = require('./auth-key')
const tl = require('../tl')

// Requires a callback function and the rpc channel
function SetClientDHParams(context) {
  return utility.P(
    createClientDHInnerData,
    encryptClientDHInnerDataWithAES,
    setClientDHParams
  )(context)
}

// Calculate the g_b = pow(g, b) mod dh_prime
// Create the client DH inner data
function createClientDHInnerData(context) {
  const retryCount = 0
  logger.debug('Start calculating g_b')
    // Calculate g_b
  const g = context.serverDHInnerData.g
  const b = utility.createNonce(256)
  const dhPrime = context.serverDHInnerData.dh_prime
  const gb = utility.modPow(g, b, dhPrime)
  logger.debug('g_b(%s) = %s', gb.length, gb.toString('hex'))
    // Create client DH inner data
  context.clientDHInnerData = new mtproto.type.Client_DH_inner_data({
    props: {
      nonce       : context.resPQ.nonce,
      server_nonce: context.resPQ.server_nonce,
      retry_id    : retryCount,
      g_b         : gb
    }
  }).serialize()
  context.b = b
  return context
}

function encryptClientDHInnerDataWithAES(context) {
  const hash = utility.createSHAHash(context.clientDHInnerData)
  const dataWithHash = Buffer.concat([hash, context.clientDHInnerData])
  logger.debug('Data to be encrypted contains: hash(%s), clientDHInnerData(%s), total length %s',
          hash.length, context.clientDHInnerData.length, dataWithHash.length)
  context.encryptClientDHInnerData = security.cipher.aesEncrypt(
        dataWithHash,
        context.aes.key,
        context.aes.iv
    )
  logger.debug('encryptClientDHInnerData(%s) = %s',
          context.encryptClientDHInnerData.length, context.encryptClientDHInnerData.toString('hex'))
  return context
}

const processing = utility.P(
  calculateAuthKeyValue,
  createAuthKeyID,
  checkNonceMatch,
  createAuthKey
)

function setClientDHParams(context) {
  return new Promise((rs, rj) =>
    mtproto.service.set_client_DH_params({
      props: {
        nonce         : context.resPQ.nonce,
        server_nonce  : context.resPQ.server_nonce,
        encrypted_data: context.encryptClientDHInnerData
      },
      channel : context.channel,
      // setter === setClientDHParamsAnswer
      callback: function(ex, result) {
        if (ex) {
          logger.error(ex)
          return rj(ex)
        }
        // const result = resp.result
        const instof = typeName => result.instanceOf(typeName)
        switch (true) {
          case instof('mtproto.type.Dh_gen_ok'): {
            logger.debug('\'Dh_gen_ok\' received from Telegram.')
            context.setter = result
            return rs(processing(context))
          }
          case instof('mtproto.type.Dh_gen_retry'): {
            logger.warn('\'Dh_gen_retry\' received from Telegram!')
            return rj(createError(JSON.stringify(result), 'EDHPARAMRETRY'))
          }
          case instof('mtproto.type.Dh_gen_fail'): {
            logger.warn('\'Dh_gen_fail\' received from Telegram!')
            return rj(createError(JSON.stringify(result), 'EDHPARAMFAIL'))
          }
          default: {
            const msg = 'Unknown error received from Telegram!'
            logger.error(msg)
            return rj(createError(msg, 'EUNKNOWN'))
          }
        }
      }
    })
  )
}

function calculateAuthKeyValue(context) {
  const ga = context.serverDHInnerData.g_a
  const b = context.b
  const dhPrime = context.serverDHInnerData.dh_prime
  const authKeyValue = utility.modPow(ga, b, dhPrime)
  logger.debug('authKeyValue(%s) = %s', authKeyValue.length, authKeyValue.toString('hex'))
  context.authKeyValue = authKeyValue
  return context
}

// Calculate AuthKey hash and ID
function createAuthKeyID(context) {
  const authKeyHash = utility.createSHAHash(context.authKeyValue)
  const authKeyAuxHash = authKeyHash.slice(0, 8)
  const authKeyID = authKeyHash.slice(-8)
  logger.debug('authKeyID(%s) = %s', authKeyID.length, authKeyID.toString('hex'))
  context.authKeyID = authKeyID
  context.authKeyAuxHash = authKeyAuxHash
  return context
}

// Withstand replay-attacks
function checkNonceMatch(context) {
  const newNonce1 = Buffer.concat([
    utility.string2Buffer(context.newNonce, 32), new Buffer([1]), context.authKeyAuxHash])
  const newNonceHash = utility.buffer2String(utility.createSHAHash(newNonce1).slice(-16))
  const serverNewNonceHash = context.setter.new_nonce_hash1
  logger.debug('newNonceHash = %s, new_nonce_hash1 = %s', newNonceHash.toString(), serverNewNonceHash.toString())
  if (newNonceHash !== serverNewNonceHash) {
    logger.warn('\'dh_gen_ok.new_nonce_hash1\' check fails!')
    throw createError(`${newNonceHash  } != ${  serverNewNonceHash}`, 'EREPLAYATTACK')
  }
  return context
}

function createAuthKey(context) {
    // Extract the nonces
  const newNonce = utility.string2Buffer(context.newNonce, 32)
  const serverNonce = utility.string2Buffer(context.resPQ.server_nonce, 16)
    // Create the serverSalt
  const serverSalt = utility.xor(newNonce.slice(0, 8), serverNonce.slice(0, 8))
  logger.debug('serverSalt(%s) = %s', serverSalt.length, serverSalt.toString('hex'))

  const authKey = new AuthKey(context.authKeyID, context.authKeyValue)
  logger.debug('authKey = %s', authKey.toString())
  return {
    key        : authKey,
    serverSalt : serverSalt,
    toPrintable: tl.utility.toPrintable
  }
}

function createError(msg, code) {
  const error = new Error(msg)
  error.code = code
  return error
}

module.exports = exports = SetClientDHParams