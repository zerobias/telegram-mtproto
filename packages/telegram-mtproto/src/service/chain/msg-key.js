//@flow

import CryptoWorker from '../../crypto'

async function getMsgKeyIv(authKey: Uint8Array, msgKey: Uint8Array, isOut: boolean): * {
  const x = isOut
    ? 0
    : 8
  const sha1aText = new Uint8Array(48)
  const sha1bText = new Uint8Array(48)
  const sha1cText = new Uint8Array(48)
  const sha1dText = new Uint8Array(48)
  const promises = []

  sha1aText.set(msgKey, 0)
  sha1aText.set(authKey.subarray(x, x + 32), 16)
  promises.push(CryptoWorker.sha1Hash(sha1aText))

  sha1bText.set(authKey.subarray(x + 32, x + 48), 0)
  sha1bText.set(msgKey, 16)
  sha1bText.set(authKey.subarray(x + 48, x + 64), 32)
  promises.push(CryptoWorker.sha1Hash(sha1bText))

  sha1cText.set(authKey.subarray(x + 64, x + 96), 0)
  sha1cText.set(msgKey, 32)
  promises.push(CryptoWorker.sha1Hash(sha1cText))

  sha1dText.set(msgKey, 0)
  sha1dText.set(authKey.subarray(x + 96, x + 128), 16)
  promises.push(CryptoWorker.sha1Hash(sha1dText))

  const results = await Promise.all(promises)
  const aesKey = new Uint8Array(32),
        aesIv = new Uint8Array(32),
        sha1a = new Uint8Array(results[0]),
        sha1b = new Uint8Array(results[1]),
        sha1c = new Uint8Array(results[2]),
        sha1d = new Uint8Array(results[3])

  aesKey.set(sha1a.subarray(0, 8))
  aesKey.set(sha1b.subarray(8, 20), 8)
  aesKey.set(sha1c.subarray(4, 16), 20)

  aesIv.set(sha1a.subarray(8, 20))
  aesIv.set(sha1b.subarray(0, 8), 12)
  aesIv.set(sha1c.subarray(16, 20), 20)
  aesIv.set(sha1d.subarray(0, 8), 24)

  const result: [Uint8Array, Uint8Array] = [aesKey, aesIv]
  return result
}

export default getMsgKeyIv
