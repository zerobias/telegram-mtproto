//@flow
import { when, is, identity, has, both } from 'ramda'
import isNode from 'detect-node'

import blueDefer from './util/defer'
import type { Defer } from './util/defer'
import { immediate } from 'mtproto-shared'
import { convertToUint8Array, sha1HashSync, sha256HashSync,
  aesEncryptSync, aesDecryptSync, convertToByteArray, convertToArrayBuffer,
  pqPrimeFactorization, bytesModPow } from './bin'

const convertIfArray = (val) => Array.isArray(val)
  ? convertToUint8Array(val)
  : val

let webWorker = !isNode
let taskID = 0
const awaiting: { [task: number]: Defer } = {}
const webCrypto = isNode
  ? false
  //eslint-disable-next-line
  : window.crypto.subtle || window.crypto.webkitSubtle
  //eslint-disable-next-line
  || window.msCrypto && window.msCrypto.subtle
const useWebCrypto = webCrypto && !!webCrypto.digest
let useSha1Crypto = useWebCrypto
let useSha256Crypto = useWebCrypto
const finalizeTask = (taskID: number, result) => {
  const deferred = awaiting[taskID]
  if (deferred) {
    deferred.resolve(result)
    delete awaiting[taskID]
  }
}

const isCryptoTask = both(has('taskID'), has('result'))

//eslint-disable-next-line
const workerEnable = !isNode && window.Worker
if (workerEnable) {
  let TmpWorker
  try {
    //$FlowIssue
    TmpWorker = require('worker-loader?inline!./worker.js')
  } catch (err) {
    TmpWorker = require('./worker.js')
  }
  const tmpWorker = new TmpWorker()
  // tmpWorker.onmessage = function(event) {
  //   console.info('CW tmpWorker.onmessage', event && event.data)
  // }
  tmpWorker.onmessage = e => {
    if (e.data === 'ready') {
      console.info('CW ready')
    } else if (!isCryptoTask(e.data)) {
      console.info('Not crypto task', e, e.data)
      return e
    } else
    return webWorker
      ? finalizeTask(e.data.taskID, e.data.result)
      : webWorker = tmpWorker
  }

  tmpWorker.onerror = function(error) {
    console.error('CW error', error, error.stack)
    webWorker = false
  }
  tmpWorker.postMessage('b')
  webWorker = tmpWorker
}

const performTaskWorker = (task, params, embed) => {
  // console.log(rework_d_T(), 'CW start', task)
  const deferred = blueDefer()

  awaiting[taskID] = deferred

  params.task = task
  params.taskID = taskID
  ;(embed || webWorker).postMessage(params)

  taskID++

  return deferred.promise
}

const sha1Hash = (bytes: *) => {
  if (useSha1Crypto) {
    // We don't use buffer since typedArray.subarray(...).buffer gives the whole buffer and not sliced one.
    // webCrypto.digest supports typed array
    const bytesTyped = convertIfArray(bytes)
    // console.log(rework_d_T(), 'Native sha1 start')
    return webCrypto.digest({ name: 'SHA-1' }, bytesTyped).then(digest =>
      // console.log(rework_d_T(), 'Native sha1 done')
        digest, e => {
      console.error('Crypto digest error', e)
      useSha1Crypto = false
      return sha1HashSync(bytes)
    })
  }
  return immediate(sha1HashSync, bytes)
}

const sha256Hash = (bytes: *) => {
  if (useSha256Crypto) {
    const bytesTyped = convertIfArray(bytes)
    // console.log(rework_d_T(), 'Native sha1 start')
    return webCrypto.digest({ name: 'SHA-256' }, bytesTyped)
      .then(identity
        // console.log(rework_d_T(), 'Native sha1 done')
        , e => {
          console.error('Crypto digest error', e)
          useSha256Crypto = false
          return sha256HashSync(bytes)
        })
  }
  return immediate(sha256HashSync, bytes)
}

const aesEncrypt = (bytes: *, keyBytes: *, ivBytes: *): Promise<ArrayBuffer> =>
  immediate(() => convertToArrayBuffer(aesEncryptSync(bytes, keyBytes, ivBytes)))

const aesDecrypt = (encryptedBytes: *, keyBytes: *, ivBytes: *): Promise<ArrayBuffer> =>
  immediate(() => convertToArrayBuffer(
    aesDecryptSync(encryptedBytes, keyBytes, ivBytes)))

const factorize = (bytes: number[] | Uint8Array) => {
  bytes = convertToByteArray(bytes)
  return webWorker
    ? performTaskWorker('factorize', { bytes })
    : immediate(pqPrimeFactorization, bytes)
}

const modPow = (x: number[] | Uint8Array,
                y: number[] | Uint8Array,
                m: number[] | Uint8Array): Promise<number[]> =>
webWorker
  ? performTaskWorker('mod-pow', {
    x,
    y,
    m
  })
  : immediate(bytesModPow, x, y, m)

export const CryptoWorker = {
  sha1Hash,
  sha256Hash,
  aesEncrypt,
  aesDecrypt,
  factorize,
  modPow
}

export default CryptoWorker