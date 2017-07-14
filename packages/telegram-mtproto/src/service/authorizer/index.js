//@flow

import Bluebird from 'bluebird'

import blueDefer from '../../util/defer'
import { immediate } from 'mtproto-shared'
import { type PublicKey } from '../main/index.h'
import { type Cached as ApiCached } from '../api-manager/index.h'
import Config from '../../config-provider'
import { Serialization, Deserialization } from '../../tl'

import random from '../secure-random'
import { applyServerTime, tsNow } from '../time-manager'

import { bytesCmp, bytesToHex, sha1BytesSync,
  aesEncryptSync, rsaEncrypt, aesDecryptSync, bytesToArrayBuffer,
  bytesFromHex, bytesXor, generateNonce } from '../../bin'
import { bpe, str2bigInt, one,
  dup, sub_, sub, greater } from '../../vendor/leemon'

import type { ResPQ, Server_DH_Params, Server_DH_inner_data, Set_client_DH_params_answer } from './index.h'
import type { PublicKeyExtended } from '../main/index.h'
import primeHex from './prime-hex'
import KeyManager from './rsa-keys-manger'

import Logger from 'mtproto-logger'

const log = Logger`auth`

// import { ErrorBadResponse } from '../../error'

import SendPlainReq from './send-plain-req'
import { TypeWriter } from '../../tl/type-buffer'

const concat = (e1, e2) => [...e1, ...e2]

const tmpAesKey = (serverNonce, newNonce) => {
  const arr1 = concat(newNonce, serverNonce)
  const arr2 = concat(serverNonce, newNonce)
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2).slice(0, 12)
  return key1.concat(key2)
}

const tmpAesIv = (serverNonce, newNonce: Bytes) => {
  const arr1 = concat(serverNonce, newNonce)
  const arr2 = concat(newNonce, newNonce)
  const arr3 = newNonce.slice(0, 4)
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2)
  const res = key1.slice(12).concat(key2, arr3)
  return res
}

type Defer = {
  resolve: (res: any) => void,
  reject: (res: any) => void,
  promise: Bluebird$Promise<any>
}

type Cached = {[id: number]: Defer}

type Bytes = number[]

type AuthBasic = {
  dcID: number,
  dcUrl: string,
  nonce: Bytes,
  deferred: Defer,
  serverNonce: Uint8Array,
  pq: Uint8Array,
  fingerprints: string[],
  p: Bytes,
  q: Bytes,
  publicKey: PublicKeyExtended,
  newNonce: Bytes,
  b: Bytes,
  g: number,
  gA: any,
  retry: number,
  dhPrime: Uint8Array,
  serverTime: number,
  localTime: number,
  tmpAesKey: Bytes,
  tmpAesIv: Bytes,
  authKeyID: Bytes,
  authKey: Bytes,
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

const reqPqRequest =
async(prepare: () => void, dcUrl: string, reqBox: TypeWriter, sendPlainReq: *): Promise<ResPQ> => {
  prepare()
  const deserializer = await sendPlainReq(dcUrl, reqBox.getBuffer())
  //$FlowIssue
  const response: ResPQ = deserializer.fetchObject('ResPQ', 'ResPQ')
  return response
}

export function Auth(
  uid: string,
  publisKeysHex: PublicKey[],
  publicKeysParsed: ApiCached<PublicKey>
) {
  const sendPlainReq = SendPlainReq(uid)
  const { prepare, select } = KeyManager(uid, publisKeysHex, publicKeysParsed)

  async function mtpSendReqPQ(auth: AuthBasic) {
    const deferred = auth.deferred
    log('Send req_pq')(bytesToHex(auth.nonce))

    const request = new Serialization({ mtproto: true }, uid)
    const reqBox = request.writer
    request.storeMethod('req_pq', { nonce: auth.nonce })


    /*let deserializer
    try {
      await prepare()
      deserializer = await sendPlainReq(auth.dcUrl, reqBox.getBuffer())
    } catch (err) {
      console.error(dTime(), 'req_pq error', err.message)
      deferred.reject(err)
      throw err
    }*/
    try {
      const response: ResPQ = await reqPqRequest(prepare, auth.dcUrl, reqBox, sendPlainReq)

      if (response._ !== 'resPQ') {
        const error = new Error(`[MT] resPQ response invalid: ${response._}`)
        deferred.reject(error)
        return Bluebird.reject(error)
      }
      if (!bytesCmp(auth.nonce, response.nonce)) {
        const error = new Error('[MT] resPQ nonce mismatch')
        deferred.reject(error)
        return Bluebird.reject(error)
      }
      auth.serverNonce = response.server_nonce
      auth.pq = response.pq
      auth.fingerprints = response.server_public_key_fingerprints

      log('Got ResPQ')(bytesToHex(auth.serverNonce), bytesToHex(auth.pq), auth.fingerprints)

      const key = select(auth.fingerprints)
      auth.publicKey = key

      log('PQ factorization start')(auth.pq)
      const [ p, q, it ] = await Config.common.Crypto.factorize({ bytes: auth.pq })

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

    const data = new Serialization({ mtproto: true }, uid)
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

    //$FlowIssue
    const hash: Bytes = data.getBytes()
    const dataWithHash = sha1BytesSync(dataBox.getBuffer()).concat(hash)

    const request = new Serialization({ mtproto: true }, uid)
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

    //$FlowIssue
    const response: Server_DH_Params = deserializer.fetchObject('Server_DH_Params', 'RESPONSE')

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

    const deserializer = new Deserialization(buffer, { mtproto: true }, uid)

    //$FlowIssue
    const response: Server_DH_inner_data = deserializer.fetchObject('Server_DH_inner_data', 'server_dh')

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
    applyServerTime(uid, auth.serverTime, auth.localTime)
  }

  const innerLog = log('VerifyDhParams')

  function mtpVerifyDhParams(g, dhPrime, gA) {
    innerLog('begin')
    const dhPrimeHex = bytesToHex(dhPrime)
    if (g !== 3 || dhPrimeHex !== primeHex)
      // The verified value is from https://core.telegram.org/mtproto/security_guidelines
      throw new Error('[MT] DH params are not verified: unknown dhPrime')
    innerLog('dhPrime cmp OK')

    const dhPrimeLeemon = str2bigInt(dhPrimeHex, 16, minSize)
    const gALeemon = str2bigInt(bytesToHex(gA), 16, minSize)
    const dhDec = dup(dhPrimeLeemon)
    sub_(dhDec, one)
    const case1 = !greater(gALeemon, one)
    const case2 = !greater(dhDec, gALeemon)
    if (case1)
      throw new Error('[MT] DH params are not verified: gA <= 1')

    if (case2)
      throw new Error('[MT] DH params are not verified: gA >= dhPrime - 1')
    const case3 = !!greater(leemonTwoPow, gALeemon)
    const dhSubPow = dup(dhPrimeLeemon)
    sub(dhSubPow, leemonTwoPow)
    const case4 = !greater(dhSubPow, gALeemon)
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

    const gB = await Config.common.Crypto.modPow({
      x: gBytes,
      y: auth.b,
      m: auth.dhPrime
    })
    const data = new Serialization({ mtproto: true }, uid)

    data.storeObject({
      _           : 'client_DH_inner_data',
      nonce       : auth.nonce,
      server_nonce: auth.serverNonce,
      retry_id    : [0, auth.retry++],
      g_b         : gB
    }, 'Client_DH_Inner_Data', 'client_DH')

    //$FlowIssue
    const hash: Bytes = data.getBytes()
    const dataWithHash = sha1BytesSync(data.writer.getBuffer()).concat(hash)

    const encryptedData = aesEncryptSync(dataWithHash, auth.tmpAesKey, auth.tmpAesIv)

    const request = new Serialization({ mtproto: true }, uid)

    request.storeMethod('set_client_DH_params', {
      nonce         : auth.nonce,
      server_nonce  : auth.serverNonce,
      encrypted_data: encryptedData
    })

    log('onGb')('Send set_client_DH_params')

    const deserializer = await sendPlainReq(auth.dcUrl, request.writer.getBuffer())

    //$FlowIssue
    const response: Set_client_DH_params_answer = deserializer.fetchObject('Set_client_DH_params_answer', 'client_dh')

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

    const authKey = await Config.common.Crypto.modPow({
      x: auth.gA,
      y: auth.b,
      m: auth.dhPrime
    })

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
      return Bluebird.reject(
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
      return Bluebird.reject(err)
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
