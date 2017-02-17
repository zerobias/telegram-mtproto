import { when, is, identity } from 'ramda'
import blueDefer from './defer'
import smartTimeout from './smart-timeout'
import { convertToUint8Array, sha1HashSync, sha256HashSync,
  aesEncryptSync, aesDecryptSync, convertToByteArray, convertToArrayBuffer,
  pqPrimeFactorization, bytesModPow } from './bin'

const convertIfArray = when(is(Array), convertToUint8Array)
let webWorker = false
let taskID = 0
const awaiting = {}
const webCrypto = (window.crypto.subtle || window.crypto.webkitSubtle) //TODO remove browser depends
  /* || window.msCrypto && window.msCrypto.subtle*/
let useSha1Crypto = true//webCrypto && webCrypto.digest !== undefined
let useSha256Crypto = true//webCrypto && webCrypto.digest !== undefined
const finalizeTask = (taskID, result) => {
  const deferred = awaiting[taskID]
  if (deferred !== undefined) {
    // console.log(rework_d_T(), 'CW done')
    deferred.resolve(result)
    delete awaiting[taskID]
  }
}
// window.Worker
const workerEnable = false
if (workerEnable) { //TODO worker disabled here
  const tmpWorker = new Worker('js/lib/crypto_worker.js')
  tmpWorker.onmessage = e =>
    webWorker
      ? finalizeTask(e.data.taskID, e.data.result)
      : webWorker = tmpWorker
  tmpWorker.onerror = error => {
    console.error('CW error', error, error.stack)
    webWorker = false
  }
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
  return smartTimeout.promise(sha1HashSync, 0, bytes)
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
  return smartTimeout.promise(sha256HashSync, 0, bytes)
}

const aesEncrypt = (bytes, keyBytes, ivBytes) =>
  smartTimeout.promise(() => convertToArrayBuffer(aesEncryptSync(bytes, keyBytes, ivBytes)))

const aesDecrypt = (encryptedBytes, keyBytes, ivBytes) =>
  smartTimeout.promise(() => convertToArrayBuffer(
    aesDecryptSync(encryptedBytes, keyBytes, ivBytes)))

const factorize = bytes => {
  bytes = convertToByteArray(bytes)
  return webWorker
    ? performTaskWorker('factorize', { bytes: bytes })
    : smartTimeout.promise(() => pqPrimeFactorization(bytes))
}

const modPow = (x, y, m) => webWorker
  ? performTaskWorker('mod-pow', {
    x: x,
    y: y,
    m: m
  })
  : smartTimeout.promise(() => bytesModPow(x, y, m))

export const CryptoWorker = {
  sha1Hash,
  sha256Hash,
  aesEncrypt,
  aesDecrypt,
  factorize,
  modPow
}

export default CryptoWorker