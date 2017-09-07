//@flow

import { cache, Fluture, encaseP, of, reject } from 'fluture'

import { DcUrlError } from '../../error'
import Config from 'ConfigProvider'
import { MAIN } from 'Action'
import { dispatch } from 'State'
import { Serialization, Deserialization } from '../../tl'

import random from '../secure-random'
import { applyServerTime, tsNow } from '../time-manager'

import { bytesCmp, bytesToHex, sha1BytesSync,
  aesEncryptSync, aesDecryptSync, bytesToArrayBuffer,
  bytesFromHex, bytesXor, generateNonce } from 'Bin'
import { bpe, str2bigInt, one,
  dup, sub_, sub, greater } from '../../vendor/leemon'
import {
  type DCNumber,
  type UID,
  toCryptoKey,
  type CryptoKey,
} from 'Newtype'

import {
  type ResPQ,
  type Server_DH_Params,
  type Server_DH_inner_data,
  type Set_client_DH_params_answer,
} from './index.h'

import {
  fetchDHInner,
  fetchDhParam,
  fetchResPQ,
  fetchServerDh,
  writeReqPQ,
  writeReqDH,
  writeInnerDH,
} from './fetch-object'
import primeHex from './prime-hex'
import sendPlainReq from './send-plain-req'

import Logger from 'mtproto-logger'

const log = Logger`auth`

export default function Auth(uid: UID, dc: DCNumber) {
  const savedReq = Config.authRequest.get(uid, dc)
  if (savedReq) {
    const req: typeof runThread = savedReq
    return req
  }

  const runThread = getUrl(uid, dc)
    .chain(url => authFuture(uid, dc, url))
    .map(res => ({ ...res, uid }))
    .chain(res => encaseP(async res => {
      const setter = Config.storageAdapter.set
      await setter.salt(uid, dc, res.serverSalt)
      await setter.authKey(uid, dc, res.authKey)
      await setter.authID(uid, dc, res.authKeyID)
      return res
    }, res))
    .map(res => (dispatch(MAIN.AUTH.RESOLVE(res), uid), res))
  const future = cache(runThread)
  Config.authRequest.set(uid, dc, future)
  return future
}

const failureHandler = (uid: string, dc: number) => (err) => {
  log`authChain, error`(err)
  Config.authRequest.remove(uid, dc)
  return err
}

const modPowF = encaseP(Config.common.Crypto.modPow)
const modPowPartial = (b, dhPrime) => x => modPowF({ x, y: b, m: dhPrime })/*::.mapRej(cryptoErr)*/

const factorize = encaseP(Config.common.Crypto.factorize)

const normalizeResPQ = (res: ResPQ) => ({
  serverNonce : res.server_nonce,
  pq          : res.pq,
  fingerprints: res.server_public_key_fingerprints,
  ...res
})

const makePqBlock = (uid: string) => (ctx) => {
  const { serverNonce, fingerprints, pq, it } = ctx
  log`PQ factorization done`(it)
  log`Got ResPQ`(bytesToHex(serverNonce), bytesToHex(pq), fingerprints)

  try {
    const publicKey = Config.publicKeys.select(uid, fingerprints)
    return of({ ...ctx, publicKey })
  } catch (err) {
    console.trace('select')
    const error: Error = err
    return reject(error)
  }
}

function getUrl(uid: string, dc: DCNumber): Fluture<string, DcUrlError> {
  const url = Config.dcMap(uid, dc)
  if (typeof url !== 'string')
    return reject(new DcUrlError(dc, url))
  log`mtpAuth, dc, url`(dc, url)
  return of(url)
}

function authFuture(uid: string, dc: DCNumber, url: string) {
  const nonce = newNonce()

  return of(writeReqPQ(uid, nonce))
    .chain(sendPlainReq(uid, url))
    .map(fetchResPQ)
    .chain(assertResPQ(nonce))
    .map(normalizeResPQ)
    .chain(factorizePQInner)
    .chain(makePqBlock(uid))
    .map(oneMoreNonce)
    .chain(mtpSendReqDh(uid, url))
    .chain(authKeyFuture(uid, url))
    .map(data => ({ ...data, dc }))
    .mapRej(failureHandler(uid, dc))
}

function newNonce() {
  const nonce = generateNonce()
  log`Send req_pq`(bytesToHex(nonce))
  return nonce
}

function oneMoreNonce(auth) {
  const newNonce = random(new Array(32))
  log`afterReqDH`('Send req_DH_params')
  return { ...auth, newNonce }
}

const factorizePQInner = ctx =>
  factorize({ bytes: ctx.pq })
    .map(([ p, q, it ]) => ({ ...ctx, p, q, it }))
    /*::.mapRej(cryptoErr)*/

const assertResPQ = (nonce) => (response: ResPQ) => {
  if (response._ !== 'resPQ') {
    return reject(ERR.sendPQ.response(response._))/*::.mapRej(sendPqFail)*/
  }
  if (!bytesCmp(nonce, response.nonce)) {
    return reject(ERR.sendPQ.nonce())/*::.mapRej(sendPqFail)*/
  }

  return of(response)/*::.mapRej(sendPqFail)*/
}

const authKeyFuture = (uid, url) => (auth) => {
  const {
    g, gA,
    nonce,
    serverNonce,
    dhPrime,
  } = auth
  const gBytes = bytesFromHex(g.toString(16))

  const b = random(new Array(256))

  const modPowFuture = modPowPartial(b, dhPrime)

  return modPowFuture(gBytes)
    .map(gB => writeInnerDH(uid, auth, gB))
    .map(prepareData(uid, url, auth))
    .chain(sendPlainReq(uid, url))
    .map(fetchDhParam)
    .chain(assertDhParams(nonce, serverNonce))
    .both(modPowFuture(gA))
    .map(authKeysGen)
    .chain(dhChoose(uid, url, auth))
    .map(result => ({ ...result, ...auth }))
}

const prepareData = (uid, url, auth) => (dataWithHash) => {
  const {
    g,
    serverNonce,
    nonce,
    tmpAesKey,
    tmpAesIv,
  } = auth

  const encryptedData = aesEncryptSync(dataWithHash, tmpAesKey, tmpAesIv)

  const request = new Serialization({ mtproto: true }, uid)

  log`onGb`('Send set_client_DH_params')
  request.storeMethod('set_client_DH_params', {
    nonce,
    server_nonce  : serverNonce,
    encrypted_data: encryptedData
  })


  return request.writer.getBuffer()
}

type AuthBlock = {
  authKeyID: CryptoKey,
  authKey: CryptoKey,
  serverSalt: CryptoKey,
}

function authKeysGen([response, authKey]) {
  const authKeyHash = sha1BytesSync(authKey)
  log`Got Set_client_DH_params_answer`(response._)
  return [response, {
    key: authKey,
    aux: authKeyHash.slice(0, 8),
    id : authKeyHash.slice(-8),
  }]
}

declare function joinChain<TA, /*::-*/FA, /*::-*/TB, FB>(future: Fluture<TA, FA> | Fluture<TB, FB>): Fluture<TA, FB>

const dhChoose = (uid: string, url: string, auth) => ([response, keys]) =>
  /*::joinChain(*/dhSwitch(uid, url, auth, response, keys)/*::)*/

function dhSwitch(uid: string, url: string, auth, response, keys) {
  switch (response._) {
    case 'dh_gen_ok': return /*::joinChain(*/dhGenOk(response, keys, auth)/*::)*/
    case 'dh_gen_retry': return /*::joinChain(*/dhGenRetry(uid, url, response, keys, auth)/*::)*/
    case 'dh_gen_fail': return /*::joinChain(*/dhGenFail(response, keys, auth)/*::)*/
    default: return reject(new Error('Unknown case'))/*::.mapRej(dhAnswerFail)*/
  }
}

function dhGenOk(response, { key, id, aux }, { newNonce, serverNonce }) {
  const newNonceHash1 = sha1BytesSync(newNonce.concat([1], aux)).slice(-16)

  if (!bytesCmp(newNonceHash1, response.new_nonce_hash1)) {
    const err = reject(ERR.dh.nonce.hash1())/*::.mapRej(dhAnswerFail)*/
    return err
  }

  const serverSalt = bytesXor(newNonce.slice(0, 8), serverNonce.slice(0, 8))
  // console.log('Auth successfull!', authKeyID, authKey, serverSalt)
  const authBlock = {
    authKeyID : /*:: toCryptoKey(*/ id /*::)*/,
    authKey   : /*:: toCryptoKey(*/ key /*::)*/,
    //eslint-disable-next-line
    serverSalt: /*:: toCryptoKey(*/ serverSalt /*::)*/,
  }

  const result: Fluture<AuthBlock, *> = of(authBlock)
  return result
}

function dhGenRetry(uid, url, response, { aux }, auth) {
  const { newNonce } = auth
  const newNonceHash2 = sha1BytesSync(newNonce.concat([2], aux)).slice(-16)
  if (!bytesCmp(newNonceHash2, response.new_nonce_hash2)) {
    const err: Fluture<AuthBlock, *> = reject(ERR.dh.nonce.hash2())/*::.mapRej(dhAnswerFail)*/
    return err
  }

  return authKeyFuture(uid, url)(auth)
}

function dhGenFail(response, { aux }, { newNonce }) {
  const newNonceHash3 = sha1BytesSync(newNonce.concat([3], aux)).slice(-16)
  if (!bytesCmp(newNonceHash3, response.new_nonce_hash3)) {
    const err: Fluture<AuthBlock, *> = reject(ERR.dh.nonce.hash3())/*::.mapRej(dhAnswerFail)*/
    return err
  }
  const result = reject(ERR.dh.paramsFail())/*::.mapRej(dhAnswerFail)*/
  return result
}

const mtpSendReqDh = (uid: string, url: string) =>  (auth) =>
  of(writeReqDH(uid, auth))
    .chain(sendPlainReq(uid, url))
    .map(fetchServerDh)
    .chain(assertDhResponse(auth))
    .chain(decryptServerDH(uid, auth))

const decryptServerDH = (uid: string, auth) => ctx =>
  decryptServerDHPlain(uid, makeAesKeys(auth), ctx)

function makeAesKeys(auth) {
  const { serverNonce, newNonce } = auth
  const tmpAesKey = aesKey(serverNonce, newNonce)
  const tmpAesIv = aesIv(serverNonce, newNonce)

  return { ...auth, tmpAesKey, tmpAesIv }
}

function decryptServerDHPlain(uid: string, auth, response) {
  const { encrypted_answer: encryptedAnswer } = response
  const { serverNonce, nonce, tmpAesKey, tmpAesIv } = auth

  const answerWithHash = aesDecryptSync(
    encryptedAnswer,
    tmpAesKey,
    tmpAesIv)

  const hash = answerWithHash.slice(0, 20)
  const answerWithPadding = answerWithHash.slice(20)

  const deserializer = new Deserialization(bytesToArrayBuffer(answerWithPadding), { mtproto: true }, uid)

  return of(deserializer)
    .map(fetchDHInner)
    .chain(assertDecryption(nonce, serverNonce))
    .chain(mtpVerifyDhParams(deserializer, hash, answerWithPadding))
    .map(afterServerDhDecrypt(uid, auth))
}

const afterServerDhDecrypt = (uid: string, auth) => (response) => {
  log`DecryptServerDhDataAnswer`('Done decrypting answer')
  const {
    g,
    dh_prime: dhPrime,
    g_a: gA,
    server_time: serverTime,
  } = response
  const localTime = tsNow()
  applyServerTime(uid, serverTime, localTime)
  return {
    ...auth,
    g, gA,
    dhPrime,
    retry: 0,
  }
}


function aesKey(serverNonce, newNonce) {
  const arr1 = [...newNonce, ...serverNonce]
  const arr2 = [...serverNonce, ...newNonce]
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2).slice(0, 12)
  return key1.concat(key2)
}

function aesIv(serverNonce, newNonce) {
  const arr1 = [...serverNonce, ...newNonce]
  const arr2 = [...newNonce, ...newNonce]
  const arr3 = newNonce.slice(0, 4)
  const key1 = sha1BytesSync(arr1)
  const key2 = sha1BytesSync(arr2)
  const res = key1.slice(12).concat(key2, arr3)
  return res
}

const minSize = Math.ceil(64 / bpe) + 1

const leemonTwoPow = (() => { //Dirty cheat to count 2^(2048 - 64)
  const arr = Array(496)      //This number contains 496 zeroes in hex
    .fill('0')
  arr.unshift('1')
  const hex = arr.join('')
  const res = str2bigInt(hex, 16, minSize)
  return res
})()

const innerLog = log`VerifyDhParams`

const mtpVerifyDhParams = (deserializer, hash, answerWithPadding) => (
  response: Server_DH_inner_data
)/*:: : Fluture<Server_DH_inner_data, *> */ => {

  const {
    g,
    dh_prime: dhPrime,
    g_a: gA,
  } = response
  innerLog('begin')
  const dhPrimeHex = bytesToHex(dhPrime)
  if (g !== 3 || dhPrimeHex !== primeHex)
    // The verified value is from https://core.telegram.org/mtproto/security_guidelines
    return reject(ERR.verify.unknownDhPrime())/*::.mapRej(verifyFail)*/
  innerLog('dhPrime cmp OK')

  const dhPrimeLeemon = str2bigInt(dhPrimeHex, 16, minSize)
  const gALeemon = str2bigInt(bytesToHex(gA), 16, minSize)
  const dhDec = dup(dhPrimeLeemon)
  sub_(dhDec, one)
  const case1 = !greater(gALeemon, one)
  const case2 = !greater(dhDec, gALeemon)
  if (case1)
    return reject(ERR.verify.case1())/*::.mapRej(verifyFail)*/

  if (case2)
    return reject(ERR.verify.case2())/*::.mapRej(verifyFail)*/
  const case3 = !!greater(leemonTwoPow, gALeemon)
  const dhSubPow = dup(dhPrimeLeemon)
  sub(dhSubPow, leemonTwoPow)
  const case4 = !greater(dhSubPow, gALeemon)
  if (case3)
    return reject(ERR.verify.case3())/*::.mapRej(verifyFail)*/
  if (case4)
    return reject(ERR.verify.case4())/*::.mapRej(verifyFail)*/
  innerLog('2^{2048-64} < gA < dhPrime-2^{2048-64} OK')

  const offset = deserializer.getOffset()
  if (!bytesCmp(hash, sha1BytesSync(answerWithPadding.slice(0, offset))))
    return reject(ERR.decrypt.sha1())/*::.mapRej(decryptFail)*/

  return of(response)/*::.mapRej(verifyFail)*/
}

const assertDecryption = (nonce, serverNonce) => (
  response: Server_DH_inner_data
)/*:: : Fluture<Server_DH_inner_data, *> */ => {
  if (response._ !== 'server_DH_inner_data')
    return reject(ERR.decrypt.response())/*::.mapRej(decryptFail)*/

  if (!bytesCmp(nonce, response.nonce))
    return reject(ERR.decrypt.nonce())/*::.mapRej(decryptFail)*/

  if (!bytesCmp(serverNonce, response.server_nonce))
    return reject(ERR.decrypt.serverNonce())/*::.mapRej(decryptFail)*/
  return of(response)/*::.mapRej(decryptFail)*/
}

const assertDhParams = (nonce, serverNonce) => (
  response: Set_client_DH_params_answer
)/*::: Fluture<Set_client_DH_params_answer, *> */=> {
  if (checkDhGen(response._)) {
    return reject(ERR.dh.responseInvalid(response._))/*::.mapRej(assertFail)*/
  } else if (!bytesCmp(nonce, response.nonce)) {
    return reject(ERR.dh.nonce.mismatch())/*::.mapRej(assertFail)*/
  } else if (!bytesCmp(serverNonce, response.server_nonce)) {
    return reject(ERR.dh.nonce.server())/*::.mapRej(assertFail)*/
  }
  return of(response)/*::.mapRej(assertFail)*/
}

function checkDhGen(_): boolean %checks {
  return (
    _ !== 'dh_gen_ok'
    && _ !== 'dh_gen_retry'
    && _ !== 'dh_gen_fail'
  )
}

const assertDhResponse = ({ nonce, serverNonce, newNonce }) => (
  response: Server_DH_Params
)/*:: : Fluture<*, *> */ => {
  if (response._ === 'server_DH_params_fail') {
    const newNonceHash = sha1BytesSync(newNonce).slice(-16)
    if (!bytesCmp(newNonceHash, response.new_nonce_hash)) {
      return reject(ERR.sendDH.hash())/*::.mapRej(assertFail)*/
    }
    return reject(ERR.sendDH.fail())/*::.mapRej(assertFail)*/
  }
  if (response._ !== 'server_DH_params_ok') {
    return reject(ERR.sendDH.invalid(response._))/*::.mapRej(assertFail)*/
  }

  if (!bytesCmp(nonce, response.nonce)) {
    return reject(ERR.sendDH.nonce())/*::.mapRej(assertFail)*/
  }

  if (!bytesCmp(serverNonce, response.server_nonce)) {
    return reject(ERR.sendDH.serverNonce())/*::.mapRej(assertFail)*/
  }
  return of(response)/*::.mapRej(assertFail)*/
}


declare class CryptoError extends Error {  }
declare function cryptoErr</*:: -*/F>(x: F): CryptoError

declare class DHAnswerError extends Error {  }
declare function dhAnswerFail</*:: -*/F>(x: F): DHAnswerError

declare class AssertError extends Error {  }
declare function assertFail</*:: -*/F>(x: F): AssertError

declare class DecryptError extends Error {  }
declare function decryptFail</*:: -*/F>(x: F): DecryptError

declare class VerifyError extends Error {  }
declare function verifyFail</*:: -*/F>(x: F): VerifyError

declare class SendPqError extends Error {  }
declare function sendPqFail</*:: -*/F>(x: F): SendPqError


const ERR = {
  dh: {
    paramsFail: () => new Error('[MT] Set_client_DH_params_answer fail'),
    nonce     : {
      mismatch: () => new Error('[MT] Set_client_DH_params_answer nonce mismatch'),
      server  : () => new Error('[MT] Set_client_DH_params_answer server_nonce mismatch'),
      hash1   : () => new Error('[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch'),
      hash2   : () => new Error('[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch'),
      hash3   : () => new Error('[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch'),
    },
    responseInvalid: (_: string) => new Error(`[MT] Set_client_DH_params_answer response invalid: ${_}`)
  },
  verify: {
    unknownDhPrime: () => new Error('[MT] DH params are not verified: unknown dhPrime'),
    case1         : () => new Error('[MT] DH params are not verified: gA <= 1'),
    case2         : () => new Error('[MT] DH params are not verified: gA >= dhPrime - 1'),
    case3         : () => new Error('[MT] DH params are not verified: gA < 2^{2048-64}'),
    case4         : () => new Error('[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}'),
  },
  decrypt: {
    response   : () => new Error(`[MT] server_DH_inner_data response invalid`),
    nonce      : () => new Error('[MT] server_DH_inner_data nonce mismatch'),
    serverNonce: () => new Error('[MT] server_DH_inner_data serverNonce mismatch'),
    sha1       : () => new Error('[MT] server_DH_inner_data SHA1-hash mismatch'),
  },
  sendDH: {
    invalid    : (_: string) => new Error(`[MT] Server_DH_Params response invalid: ${_}`),
    nonce      : () => new Error('[MT] Server_DH_Params nonce mismatch'),
    serverNonce: () => new Error('[MT] Server_DH_Params server_nonce mismatch'),
    hash       : () => new Error('[MT] server_DH_params_fail new_nonce_hash mismatch'),
    fail       : () => new Error('[MT] server_DH_params_fail'),
  },
  sendPQ: {
    response: (_: string) => new Error(`[MT] resPQ response invalid: ${_}`),
    nonce   : () => new Error('[MT] resPQ nonce mismatch'),
  },
}
