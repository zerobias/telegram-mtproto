//@flow

const { pqPrimeFactorization, bytesModPow, sha1HashSync,
  aesEncryptSync, aesDecryptSync } = require('./bin')

console.info('Crypto worker registered')

const post = (() => {
  function postStar(data: any) {
    postMessage(data, '*')
  }
  function postPlain(data: any) {
    postMessage(data)
  }
  let result = postStar
  try {
    result('ready')
  } catch (err) {
    result = postPlain
    result('ready')
  } finally {
    //eslint-disable-next-line
    return result
  }
})()

const runTask = data => {
  switch (data.task) {
    case 'factorize'  : return pqPrimeFactorization(data.bytes)
    case 'mod-pow'    : return bytesModPow(data.x, data.y, data.m)
    case 'sha1-hash'  : return sha1HashSync(data.bytes)
    case 'aes-encrypt': return aesEncryptSync(data.bytes, data.keyBytes, data.ivBytes)
    case 'aes-decrypt': return aesDecryptSync(data.encryptedBytes,
                                              data.keyBytes, data.ivBytes)
    default:
      throw new Error(`Unknown task: ${data.task}`)
  }
}

onmessage = function(e) {
  if (e.data === '') {
    console.info('empty crypto task')
  } else if (typeof e.data === 'string') {
    console.info('crypto task string message', e.data)
  } else {
    const taskID = e.data.taskID
    const result = runTask(e.data)
    post({ taskID, result })
  }
}

declare function postMessage(data: any, target?: '*'): void
