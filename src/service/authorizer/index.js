//@flow

import Promise from 'bluebird'

import blueDefer from '../../util/defer'
import { immediate } from '../../util/smart-timeout'
import CryptoWorker from '../../crypto'

import random from '../secure-random'
import { applyServerTime, dTime, tsNow } from '../time-manager'

import { bytesCmp, bytesToHex, sha1BytesSync,
  aesEncryptSync, rsaEncrypt, aesDecryptSync, bytesToArrayBuffer,
  bytesFromHex, bytesXor, generateNonce } from '../../bin'
import { bpe, str2bigInt, one,
    dup, sub_, sub, greater } from '../../vendor/leemon'

import Logger from '../../util/log'

const log = Logger`auth`

// import { ErrorBadResponse } from '../../error'

import SendPlainReq from './send-plain-req'

import type { TLFabric } from '../../tl'

const primeHex = 'c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d93' +
  '0f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f6945' +
  '8705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4a' +
  'c8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba7' +
  '4d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9c' +
  'a3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851' +
  'f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b'

const concat = (e1, e2) => [...e1, ...e2]

const tmpAesKey = (serverNonce, newNonce) => {
  const arr1 = concat(newNonce, serverNonce)
  const arr2 = concat(serverNonce, newNonce)
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2).slice(0, 12)
  return key1.concat(key2)
}

const tmpAesIv = (serverNonce, newNonce) => {
  const arr1 = concat(serverNonce, newNonce)
  const arr2 = concat(newNonce, newNonce)
  const arr3 = newNonce.slice(0, 4)
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2)
  return key1.slice(12).concat(key2, arr3)
}

type Defer = {
  resolve: (res: any) => void,
  reject: (res: any) => void,
  promise: Promise<any>
}

type Cached = {[id: number]: Defer}

export type Args = {
  select: (fingerprints: string[]) => Promise<{
    fingerprint: string,
    exponent: string,
    modulus: string
  } | false>,
  prepare: () => Promise<void>
}

type Bytes = number[]

type AuthBasic = {
  dcID: number,
  dcUrl: string,
  nonce: Bytes,
  deferred: Defer,
  serverNonce: Bytes,
  pq: Bytes,
  fingerprints: Bytes,
  p: number,
  q: number,
  publicKey: {
    fingerprint: string
  },
  newNonce: number[],
  b: Bytes,
  g: number,
  gA: any,
  retry: number,
  dhPrime: any,
  serverTime: number,
  localTime: number,
  tmpAesKey: Bytes,
  tmpAesIv: Bytes,
  authKeyID: Bytes,
  authKey: string,
  serverSalt: Bytes
}

const minSize = Math.ceil(64 / bpe) + 1

const getTwoPow = () => { //Dirty cheat to count 2^(2048 - 64)
                          //This number contains 496 zeroes in hex
  const arr = Array(496)
    .fill('0')
  arr.unshift('1')
  const hex = arr.join('')
  const res = str2bigInt(hex, 16, minSize)
  return res
}

const leemonTwoPow = getTwoPow()

export const Auth = ({ Serialization, Deserialization }: TLFabric,
                     { select, prepare }: Args) => {
  const sendPlainReq = SendPlainReq({ Serialization, Deserialization })

  async function mtpSendReqPQ(auth: AuthBasic) {
    const deferred = auth.deferred
    log('Send req_pq')(bytesToHex(auth.nonce))

    const request = Serialization({ mtproto: true })
    const reqBox = request.writer
    request.storeMethod('req_pq', { nonce: auth.nonce })


    let deserializer
    try {
      await prepare()
      deserializer = await sendPlainReq(auth.dcUrl, reqBox.getBuffer())
    } catch (err) {
      console.error(dTime(), 'req_pq error', err.message)
      deferred.reject(err)
      throw err
    }

    try {
      const response = deserializer.fetchObject('ResPQ', 'ResPQ')

      if (response._ !== 'resPQ') {
        const error = new Error(`[MT] resPQ response invalid: ${  response._}`)
        deferred.reject(error)
        return Promise.reject(error)
      }
      if (!bytesCmp(auth.nonce, response.nonce)) {
        const error = new Error('[MT] resPQ nonce mismatch')
        deferred.reject(error)
        return Promise.reject(error)
      }
      auth.serverNonce = response.server_nonce
      auth.pq = response.pq
      auth.fingerprints = response.server_public_key_fingerprints

      log('Got ResPQ')(bytesToHex(auth.serverNonce), bytesToHex(auth.pq), auth.fingerprints)

      const key = await select(auth.fingerprints)

      if (key)
        auth.publicKey = key
      else {
        const error = new Error('[MT] No public key found')
        deferred.reject(error)
        return Promise.reject(error)
      }
      log('PQ factorization start')(auth.pq)
      const [ p, q, it ] = await CryptoWorker.factorize(auth.pq)

      auth.p = p
      auth.q = q
      log('PQ factorization done')(it)
    } catch (error) {
      log('Worker error')(error, error.stack)
      deferred.reject(error)
      throw error
    }


    return auth
  }

  async function mtpSendReqDhParams(auth: AuthBasic) {
    const deferred = auth.deferred

    auth.newNonce = new Array(32)
    random(auth.newNonce)

    const data = Serialization({ mtproto: true })
    const dataBox = data.writer
    data.storeObject({
      _           : 'p_q_inner_data',
      pq          : auth.pq,
      p           : auth.p,
      q           : auth.q,
      nonce       : auth.nonce,
      server_nonce: auth.serverNonce,
      new_nonce   : auth.newNonce
    }, 'P_Q_inner_data', 'DECRYPTED_DATA')

    const dataWithHash = sha1BytesSync(dataBox.getBuffer()).concat(data.getBytes())

    const request = Serialization({ mtproto: true })
    const reqBox = request.writer
    request.storeMethod('req_DH_params', {
      nonce                 : auth.nonce,
      server_nonce          : auth.serverNonce,
      p                     : auth.p,
      q                     : auth.q,
      public_key_fingerprint: auth.publicKey.fingerprint,
      encrypted_data        : rsaEncrypt(auth.publicKey, dataWithHash)
    })


    log('afterReqDH')('Send req_DH_params')

    let deserializer
    try {
      deserializer = await sendPlainReq(auth.dcUrl, reqBox.getBuffer())
    } catch (error) {
      deferred.reject(error)
      throw error
    }


    const response = deserializer.fetchObject('Server_DH_Params', 'RESPONSE')

    if (response._ !== 'server_DH_params_fail' && response._ !== 'server_DH_params_ok') {
      const error = new Error(`[MT] Server_DH_Params response invalid: ${  response._}`)
      deferred.reject(error)
      throw error
    }

    if (!bytesCmp(auth.nonce, response.nonce)) {
      const error = new Error('[MT] Server_DH_Params nonce mismatch')
      deferred.reject(error)
      throw error
    }

    if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
      const error = new Error('[MT] Server_DH_Params server_nonce mismatch')
      deferred.reject(error)
      throw error
    }

    if (response._ === 'server_DH_params_fail') {
      const newNonceHash = sha1BytesSync(auth.newNonce).slice(-16)
      if (!bytesCmp(newNonceHash, response.new_nonce_hash)) {
        const error = new Error('[MT] server_DH_params_fail new_nonce_hash mismatch')
        deferred.reject(error)
        throw error
      }
      const error = new Error('[MT] server_DH_params_fail')
      deferred.reject(error)
      throw error
    }

    // try {
    mtpDecryptServerDhDataAnswer(auth, response.encrypted_answer)
    // } catch (e) {
    //   deferred.reject(e)
    //   return false
    // }

    return auth
  }

  function mtpDecryptServerDhDataAnswer(auth: AuthBasic, encryptedAnswer) {
    auth.tmpAesKey = tmpAesKey(auth.serverNonce, auth.newNonce)
    auth.tmpAesIv = tmpAesIv(auth.serverNonce, auth.newNonce)

    const answerWithHash = aesDecryptSync(
      encryptedAnswer,
      auth.tmpAesKey,
      auth.tmpAesIv)

    const hash = answerWithHash.slice(0, 20)
    const answerWithPadding = answerWithHash.slice(20)
    const buffer = bytesToArrayBuffer(answerWithPadding)

    const deserializer = Deserialization(buffer, { mtproto: true })
    const response = deserializer.fetchObject('Server_DH_inner_data', 'server_dh')

    if (response._ !== 'server_DH_inner_data')
      throw new Error(`[MT] server_DH_inner_data response invalid`)

    if (!bytesCmp(auth.nonce, response.nonce))
      throw new Error('[MT] server_DH_inner_data nonce mismatch')

    if (!bytesCmp(auth.serverNonce, response.server_nonce))
      throw new Error('[MT] server_DH_inner_data serverNonce mismatch')

    log('DecryptServerDhDataAnswer')('Done decrypting answer')
    auth.g = response.g
    auth.dhPrime = response.dh_prime
    auth.gA = response.g_a
    auth.serverTime = response.server_time
    auth.retry = 0

    mtpVerifyDhParams(auth.g, auth.dhPrime, auth.gA)

    const offset = deserializer.getOffset()

    if (!bytesCmp(hash, sha1BytesSync(answerWithPadding.slice(0, offset))))
      throw new Error('[MT] server_DH_inner_data SHA1-hash mismatch')

    auth.localTime = tsNow()
    applyServerTime(auth.serverTime, auth.localTime)
  }

  const innerLog = log('VerifyDhParams')

  function mtpVerifyDhParams(g, dhPrime, gA) {
    innerLog('begin')
    const dhPrimeHex = bytesToHex(dhPrime)
    if (g !== 3 || dhPrimeHex !== primeHex)
      // The verified value is from https://core.telegram.org/mtproto/security_guidelines
      throw new Error('[MT] DH params are not verified: unknown dhPrime')
    innerLog('dhPrime cmp OK')

    // const gABigInt = new BigInteger(bytesToHex(gA), 16)
    // const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    const dhPrimeLeemon = str2bigInt(dhPrimeHex, 16, minSize)
    const gALeemon = str2bigInt(bytesToHex(gA), 16, minSize)
    const dhDec = dup(dhPrimeLeemon)
    sub_(dhDec, one)
    // const dhDecStr = bigInt2str(dhDec, 16)
    // const comp = dhPrimeBigInt.subtract(BigInteger.ONE).toString(16)
    // console.log(dhPrimeLeemon, dhDecStr === comp)
    const case1 = !greater(gALeemon, one)
      //gABigInt.compareTo(BigInteger.ONE) <= 0
    const case2 = !greater(dhDec, gALeemon)
      //gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0
    if (case1)
      throw new Error('[MT] DH params are not verified: gA <= 1')

    if (case2)
      throw new Error('[MT] DH params are not verified: gA >= dhPrime - 1')
    // console.log(dTime(), '1 < gA < dhPrime-1 OK')


    // const two = new BigInteger(null)
    // two.fromInt(2)
    // const twoPow = two.pow(2048 - 64)

    const case3 = !!greater(leemonTwoPow, gALeemon)
      //gABigInt.compareTo(twoPow) < 0
    const dhSubPow = dup(dhPrimeLeemon)
    sub(dhSubPow, leemonTwoPow)
    const case4 = !greater(dhSubPow, gALeemon)
      //gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0
    // console.log(case3 === gABigInt.compareTo(twoPow) < 0)
    if (case3)
      throw new Error('[MT] DH params are not verified: gA < 2^{2048-64}')
    if (case4)
      throw new Error('[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}')
    innerLog('2^{2048-64} < gA < dhPrime-2^{2048-64} OK')

    return true
  }

  async function mtpSendSetClientDhParams(auth: AuthBasic) {
    const deferred = auth.deferred
    const gBytes = bytesFromHex(auth.g.toString(16))

    auth.b = new Array(256)
    random(auth.b)

    const gB = await CryptoWorker.modPow(gBytes, auth.b, auth.dhPrime)
    const data = Serialization({ mtproto: true })

    data.storeObject({
      _           : 'client_DH_inner_data',
      nonce       : auth.nonce,
      server_nonce: auth.serverNonce,
      retry_id    : [0, auth.retry++],
      g_b         : gB
    }, 'Client_DH_Inner_Data', 'client_DH')

    const dataWithHash = sha1BytesSync(data.writer.getBuffer()).concat(data.getBytes())

    const encryptedData = aesEncryptSync(dataWithHash, auth.tmpAesKey, auth.tmpAesIv)

    const request = Serialization({ mtproto: true })

    request.storeMethod('set_client_DH_params', {
      nonce         : auth.nonce,
      server_nonce  : auth.serverNonce,
      encrypted_data: encryptedData
    })

    log('onGb')('Send set_client_DH_params')

    const deserializer = await sendPlainReq(auth.dcUrl, request.writer.getBuffer())

    const response = deserializer.fetchObject('Set_client_DH_params_answer', 'client_dh')

    if (response._ != 'dh_gen_ok' && response._ != 'dh_gen_retry' && response._ != 'dh_gen_fail') {
      const error = new Error(`[MT] Set_client_DH_params_answer response invalid: ${  response._}`)
      deferred.reject(error)
      throw error
    }

    if (!bytesCmp(auth.nonce, response.nonce)) {
      const error = new Error('[MT] Set_client_DH_params_answer nonce mismatch')
      deferred.reject(error)
      throw error
    }

    if (!bytesCmp(auth.serverNonce, response.server_nonce)) {
      const error = new Error('[MT] Set_client_DH_params_answer server_nonce mismatch')
      deferred.reject(error)
      throw error
    }

    const authKey = await CryptoWorker.modPow(auth.gA, auth.b, auth.dhPrime)

    const authKeyHash = sha1BytesSync(authKey),
          authKeyAux = authKeyHash.slice(0, 8),
          authKeyID = authKeyHash.slice(-8)

    log('Got Set_client_DH_params_answer')(response._)
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
  }

  const authChain = (auth: AuthBasic) =>
    mtpSendReqPQ(auth)
      .then(mtpSendReqDhParams)
      .then(mtpSendSetClientDhParams)

  function mtpAuth(dcID: number, cached: Cached, dcUrl: string) {
    if (cached[dcID])
      return cached[dcID].promise
    log('mtpAuth', 'dcID', 'dcUrl')(dcID, dcUrl)
    const nonce = generateNonce()

    if (!dcUrl)
      return Promise.reject(
        new Error(`[MT] No server found for dc ${dcID} url ${dcUrl}`))

    const auth: any = {
      dcID,
      dcUrl,
      nonce,
      deferred: blueDefer()
    }

    const onFail = (err: Error) => {
      log('authChain', 'error')(err)
      cached[dcID].reject(err)
      delete cached[dcID]
      return Promise.reject(err)
    }

    try {
      immediate(authChain, auth)
    } catch (err) {
      return onFail(err)
    }

    cached[dcID] = auth.deferred

    cached[dcID].promise.catch(onFail)

    return cached[dcID].promise
  }

  return mtpAuth
}
export default Auth