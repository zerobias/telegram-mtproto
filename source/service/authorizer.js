import Promise from 'bluebird'
import jsbn from 'jsbn'
const { BigInteger } = jsbn

import blueDefer from '../defer'

import httpClient from '../http'
import CryptoWorker from '../crypto'

import MtpSecureRandom from './secure-random'
import { generateID, applyServerTime, dTime, tsNow } from './time-manager'

import { bytesCmp, bytesToHex, sha1BytesSync, nextRandomInt,
  aesEncryptSync, rsaEncrypt, aesDecryptSync, bytesToArrayBuffer,
  bytesFromHex, bytesXor } from '../bin'

export const Auth = ({ Serialization, Deserialization }, { select, prepare }) => {
  function mtpSendPlainRequest(url, requestBuffer) {
    const requestLength = requestBuffer.byteLength,
          requestArray = new Int32Array(requestBuffer)

    const header = new Serialization()
    header.storeLongP(0, 0, 'auth_key_id') // Auth key
    header.storeLong(generateID(), 'msg_id') // Msg_id
    header.storeInt(requestLength, 'request_length')

    const headerBuffer = header.getBuffer(),
          headerArray = new Int32Array(headerBuffer)
    const headerLength = headerBuffer.byteLength

    const resultBuffer = new ArrayBuffer(headerLength + requestLength),
          resultArray = new Int32Array(resultBuffer)

    resultArray.set(headerArray)
    resultArray.set(requestArray, headerArray.length)

    const requestData = resultArray
    let requestPromise
    const baseError = { code: 406, type: 'NETWORK_BAD_RESPONSE', url }
    try {
      requestPromise = httpClient.post(url, requestData, {
        responseType: 'arraybuffer'
      })
    } catch (e) {
      requestPromise = Promise.reject({ originalError: e, ...baseError })
    }
    return requestPromise.then(
      result => {
        if (!result.data || !result.data.byteLength)
          return Promise.reject(baseError)
        let deserializer
        try {
          deserializer = new Deserialization(result.data, { mtproto: true })
          const auth_key_id = deserializer.fetchLong('auth_key_id')
          const msg_id = deserializer.fetchLong('msg_id')
          const msg_len = deserializer.fetchInt('msg_len')
        } catch (e) {
          return Promise.reject({ originalError: e, ...baseError })
        }

        return deserializer
      },
      error => {
        if (!error.message && !error.type) {
          error = { originalError: error, ...baseError }
        }
        return Promise.reject(error)
      }
    )
  }

  function mtpSendReqPQ(auth) {
    console.warn('mtpSendReqPQ')
    const deferred = auth.deferred

    const request = new Serialization({ mtproto: true })

    request.storeMethod('req_pq', { nonce: auth.nonce })

    console.log(dTime(), 'Send req_pq', bytesToHex(auth.nonce))
    mtpSendPlainRequest(auth.dcUrl, request.getBuffer()).then((deserializer) => {
      const response = deserializer.fetchObject('ResPQ')

      if (response._ != 'resPQ')
        throw new Error(`[MT] resPQ response invalid: ${  response._}`)

      if (!bytesCmp(auth.nonce, response.nonce))
        throw new Error('[MT] resPQ nonce mismatch')

      auth.serverNonce = response.server_nonce
      auth.pq = response.pq
      auth.fingerprints = response.server_public_key_fingerprints

      console.log(dTime(), 'Got ResPQ', bytesToHex(auth.serverNonce), bytesToHex(auth.pq), auth.fingerprints)

      auth.publicKey = select(auth.fingerprints)

      if (!auth.publicKey)
        throw new Error('[MT] No public key found')

      console.log(dTime(), 'PQ factorization start', auth.pq)
      CryptoWorker.factorize(auth.pq).then(([ p, q, it ]) => {
        auth.p = p
        auth.q = q
        console.log(dTime(), 'PQ factorization done', it)
        mtpSendReqDhParams(auth)
      }, error => {
        console.log('Worker error', error, error.stack)
        deferred.reject(error)
      })
    }, error => {
      console.error(dTime(), 'req_pq error', error.message)
      deferred.reject(error)
    })

    setTimeout(prepare, 0)
  }

  function mtpSendReqDhParams(auth) {
    const deferred = auth.deferred

    auth.newNonce = new Array(32)
    MtpSecureRandom.nextBytes(auth.newNonce)

    const data = new Serialization({ mtproto: true })
    data.storeObject({
      _           : 'p_q_inner_data',
      pq          : auth.pq,
      p           : auth.p,
      q           : auth.q,
      nonce       : auth.nonce,
      server_nonce: auth.serverNonce,
      new_nonce   : auth.newNonce
    }, 'P_Q_inner_data', 'DECRYPTED_DATA')

    const dataWithHash = sha1BytesSync(data.getBuffer()).concat(data.getBytes())

    const request = new Serialization({ mtproto: true })
    request.storeMethod('req_DH_params', {
      nonce                 : auth.nonce,
      server_nonce          : auth.serverNonce,
      p                     : auth.p,
      q                     : auth.q,
      public_key_fingerprint: auth.publicKey.fingerprint,
      encrypted_data        : rsaEncrypt(auth.publicKey, dataWithHash)
    })

    console.log(dTime(), 'Send req_DH_params')
    mtpSendPlainRequest(auth.dcUrl, request.getBuffer()).then((deserializer) => {
      const response = deserializer.fetchObject('Server_DH_Params', 'RESPONSE')

      if (response._ != 'server_DH_params_fail' && response._ != 'server_DH_params_ok') {
        deferred.reject(new Error(`[MT] Server_DH_Params response invalid: ${  response._}`))
        return false
      }

      if (!bytesCmp(auth.nonce, response.nonce)) {
        deferred.reject(new Error('[MT] Server_DH_Params nonce mismatch'))
        return false
      }

      if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
        deferred.reject(new Error('[MT] Server_DH_Params server_nonce mismatch'))
        return false
      }

      if (response._ == 'server_DH_params_fail') {
        const newNonceHash = sha1BytesSync(auth.newNonce).slice(-16)
        if (!bytesCmp(newNonceHash, response.new_nonce_hash)) {
          deferred.reject(new Error('[MT] server_DH_params_fail new_nonce_hash mismatch'))
          return false
        }
        deferred.reject(new Error('[MT] server_DH_params_fail'))
        return false
      }

      try {
        mtpDecryptServerDhDataAnswer(auth, response.encrypted_answer)
      } catch (e) {
        deferred.reject(e)
        return false
      }

      mtpSendSetClientDhParams(auth)
    }, deferred.reject)
  }

  function mtpDecryptServerDhDataAnswer(auth, encryptedAnswer) {
    auth.localTime = tsNow()

    auth.tmpAesKey = sha1BytesSync(
      auth.newNonce
        .concat(auth.serverNonce))
          .concat(sha1BytesSync(auth.serverNonce.concat(auth.newNonce)).slice(0, 12))
    auth.tmpAesIv = sha1BytesSync(
      auth
        .serverNonce
        .concat(auth.newNonce))
          .slice(12)
          .concat(
            sha1BytesSync([].concat(auth.newNonce, auth.newNonce)),
            auth.newNonce.slice(0, 4))

    const answerWithHash = aesDecryptSync(encryptedAnswer, auth.tmpAesKey, auth.tmpAesIv)

    const hash = answerWithHash.slice(0, 20)
    const answerWithPadding = answerWithHash.slice(20)
    const buffer = bytesToArrayBuffer(answerWithPadding)

    const deserializer = new Deserialization(buffer, { mtproto: true })
    const response = deserializer.fetchObject('Server_DH_inner_data')

    if (response._ != 'server_DH_inner_data') {
      throw new Error(`[MT] server_DH_inner_data response invalid: ${  constructor}`)
    }

    if (!bytesCmp(auth.nonce, response.nonce)) {
      throw new Error('[MT] server_DH_inner_data nonce mismatch')
    }

    if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
      throw new Error('[MT] server_DH_inner_data serverNonce mismatch')
    }

    console.log(dTime(), 'Done decrypting answer')
    auth.g = response.g
    auth.dhPrime = response.dh_prime
    auth.gA = response.g_a
    auth.serverTime = response.server_time
    auth.retry = 0

    mtpVerifyDhParams(auth.g, auth.dhPrime, auth.gA)

    const offset = deserializer.getOffset()

    if (!bytesCmp(hash, sha1BytesSync(answerWithPadding.slice(0, offset)))) {
      throw new Error('[MT] server_DH_inner_data SHA1-hash mismatch')
    }

    applyServerTime(auth.serverTime, auth.localTime)
  }

  function mtpVerifyDhParams(g, dhPrime, gA) {
    console.log(dTime(), 'Verifying DH params')
    const dhPrimeHex = bytesToHex(dhPrime)
    if (g != 3 ||
        //eslint-disable-next-line
        dhPrimeHex !== 'c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b') {
      // The verified value is from https://core.telegram.org/mtproto/security_guidelines
      throw new Error('[MT] DH params are not verified: unknown dhPrime')
    }
    console.log(dTime(), 'dhPrime cmp OK')

    const gABigInt = new BigInteger(bytesToHex(gA), 16)
    const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    if (gABigInt.compareTo(BigInteger.ONE) <= 0) {
      throw new Error('[MT] DH params are not verified: gA <= 1')
    }

    if (gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0) {
      throw new Error('[MT] DH params are not verified: gA >= dhPrime - 1')
    }
    console.log(dTime(), '1 < gA < dhPrime-1 OK')


    const two = new BigInteger(null)
    two.fromInt(2)
    const twoPow = two.pow(2048 - 64)

    if (gABigInt.compareTo(twoPow) < 0) {
      throw new Error('[MT] DH params are not verified: gA < 2^{2048-64}')
    }
    if (gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0) {
      throw new Error('[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}')
    }
    console.log(dTime(), '2^{2048-64} < gA < dhPrime-2^{2048-64} OK')

    return true
  }

  function mtpSendSetClientDhParams(auth) {
    const deferred = auth.deferred
    const gBytes = bytesFromHex(auth.g.toString(16))

    auth.b = new Array(256)
    MtpSecureRandom.nextBytes(auth.b)

    CryptoWorker.modPow(gBytes, auth.b, auth.dhPrime).then(function(gB) {
      const data = new Serialization({ mtproto: true })
      data.storeObject({
        _           : 'client_DH_inner_data',
        nonce       : auth.nonce,
        server_nonce: auth.serverNonce,
        retry_id    : [0, auth.retry++],
        g_b         : gB
      }, 'Client_DH_Inner_Data')

      const dataWithHash = sha1BytesSync(data.getBuffer()).concat(data.getBytes())

      const encryptedData = aesEncryptSync(dataWithHash, auth.tmpAesKey, auth.tmpAesIv)

      const request = new Serialization({ mtproto: true })
      request.storeMethod('set_client_DH_params', {
        nonce         : auth.nonce,
        server_nonce  : auth.serverNonce,
        encrypted_data: encryptedData
      })

      console.log(dTime(), 'Send set_client_DH_params')
      mtpSendPlainRequest(auth.dcUrl, request.getBuffer())
        .then(function(deserializer) {
          const response = deserializer.fetchObject('Set_client_DH_params_answer')

          if (response._ != 'dh_gen_ok' && response._ != 'dh_gen_retry' && response._ != 'dh_gen_fail') {
            deferred.reject(new Error(`[MT] Set_client_DH_params_answer response invalid: ${  response._}`))
            return false
          }

          if (!bytesCmp(auth.nonce, response.nonce)) {
            deferred.reject(new Error('[MT] Set_client_DH_params_answer nonce mismatch'))
            return false
          }

          if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
            deferred.reject(new Error('[MT] Set_client_DH_params_answer server_nonce mismatch'))
            return false
          }

          CryptoWorker.modPow(auth.gA, auth.b, auth.dhPrime).then(function(authKey) {
            const authKeyHash = sha1BytesSync(authKey),
                  authKeyAux = authKeyHash.slice(0, 8),
                  authKeyID = authKeyHash.slice(-8)

            console.log(dTime(), 'Got Set_client_DH_params_answer', response._)
            switch (response._) {
              case 'dh_gen_ok': {
                const newNonceHash1 = sha1BytesSync(auth.newNonce.concat([1], authKeyAux)).slice(-16)

                if (!bytesCmp(newNonceHash1, response.new_nonce_hash1)) {
                  deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch'))
                  return false
                }

                const serverSalt = bytesXor(auth.newNonce.slice(0, 8), auth.serverNonce.slice(0, 8))
                // console.log('Auth successfull!', authKeyID, authKey, serverSalt)

                auth.authKeyID = authKeyID
                auth.authKey = authKey
                auth.serverSalt = serverSalt

                deferred.resolve(auth)
                break
              }
              case 'dh_gen_retry': {
                const newNonceHash2 = sha1BytesSync(auth.newNonce.concat([2], authKeyAux)).slice(-16)
                if (!bytesCmp(newNonceHash2, response.new_nonce_hash2)) {
                  deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch'))
                  return false
                }

                return mtpSendSetClientDhParams(auth)
              }
              case 'dh_gen_fail': {
                const newNonceHash3 = sha1BytesSync(auth.newNonce.concat([3], authKeyAux)).slice(-16)
                if (!bytesCmp(newNonceHash3, response.new_nonce_hash3)) {
                  deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch'))
                  return false
                }

                deferred.reject(new Error('[MT] Set_client_DH_params_answer fail'))
                return false
              }
            }
          }, function(error) {
            deferred.reject(error)
          })
        }, function(error) {
          deferred.reject(error)
        })
    }, (error) => {
      deferred.reject(error)
    })
  }

  function mtpAuth(dcID, cached, dcUrl) {
    console.count('mtpAuth')
    if (cached[dcID])
      return cached[dcID].promise
    console.warn('mtpAuth')
    const nonce = []
    for (let i = 0; i < 16; i++)
      nonce.push(nextRandomInt(0xFF))

    if (!dcUrl)
      return Promise.reject(
        new Error(`[MT] No server found for dc ${dcID} url ${dcUrl}`))

    const auth = {
      dcID,
      dcUrl,
      nonce,
      deferred: blueDefer()
    }

    setImmediate(() => mtpSendReqPQ(auth))

    cached[dcID] = auth.deferred

    cached[dcID].promise.catch(() => {
      delete cached[dcID]
    })

    return cached[dcID].promise
  }

  return mtpAuth
}
export default Auth