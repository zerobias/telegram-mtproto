import when from 'ramda/src/when'
import is from 'ramda/src/is'
import identity from 'ramda/src/identity'
import has from 'ramda/src/has'
import both from 'ramda/src/both'
import isNode from 'detect-node'

import blueDefer from './util/defer'
import smartTimeout from './util/smart-timeout'
import { convertToUint8Array, sha1HashSync, sha256HashSync,
  aesEncryptSync, aesDecryptSync, convertToByteArray, convertToArrayBuffer,
  pqPrimeFactorization, bytesModPow } from './bin'

const convertIfArray = when(is(Array), convertToUint8Array)
let webWorker = !isNode
let taskID = 0
const awaiting = {}
const webCrypto = isNode
  ? false
  //eslint-disable-next-line
  : window.crypto.subtle || window.crypto.webkitSubtle //TODO remove browser depends
  //eslint-disable-next-line
  || window.msCrypto && window.msCrypto.subtle
const useWebCrypto = webCrypto && !!webCrypto.digest
let useSha1Crypto = useWebCrypto
let useSha256Crypto = useWebCrypto
const finalizeTask = (taskID, result) => {
  const deferred = awaiting[taskID]
  if (deferred) {
    // console.log(rework_d_T(), 'CW done')
    deferred.resolve(result) //TODO Possibly, can be used as
    delete awaiting[taskID]  //
  }                          //    deferred = Promise.resolve()
}                            //    deferred.resolve( result )

const isCryptoTask = both(has('taskID'), has('result'))

//eslint-disable-next-line
const workerEnable = !isNode && window.Worker
if (workerEnable) {
  const TmpWorker = require('worker-loader?inline!./worker.js')
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

const sha1Hash = bytes => {
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
  return smartTimeout.immediate(sha1HashSync, bytes)
}

const sha256Hash = bytes => {
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
  return smartTimeout.immediate(sha256HashSync, bytes)
}

const aesEncrypt = (bytes, keyBytes, ivBytes) =>
  smartTimeout.immediate(() => convertToArrayBuffer(aesEncryptSync(bytes, keyBytes, ivBytes)))

const aesDecrypt = (encryptedBytes, keyBytes, ivBytes) =>
  smartTimeout.immediate(() => convertToArrayBuffer(
    aesDecryptSync(encryptedBytes, keyBytes, ivBytes)))

const factorize = bytes => {
  bytes = convertToByteArray(bytes)
  return webWorker
    ? performTaskWorker('factorize', { bytes })
    : smartTimeout.immediate(pqPrimeFactorization, bytes)
}

const modPow = (x, y, m) => webWorker
  ? performTaskWorker('mod-pow', {
    x,
    y,
    m
  })
  : smartTimeout.immediate(bytesModPow, x, y, m)

export const CryptoWorker = {
  sha1Hash,
  sha256Hash,
  aesEncrypt,
  aesDecrypt,
  factorize,
  modPow
}

export default CryptoWorker