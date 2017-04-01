import toLower from 'ramda/src/toLower'
import Rusha from 'rusha'
import * as CryptoJSlib from '@goodmind/node-cryptojs-aes'
const { CryptoJS } = CryptoJSlib
import { inflate } from 'pako/lib/inflate'

import random from './service/secure-random'


import { eGCD_, greater, divide_, str2bigInt, equalsInt,
  isZero, bigInt2str, copy_, copyInt_, rightShift_,
  leftShift_, sub_, add_, powMod, bpe, one } from './vendor/leemon'


const rushaInstance = new Rusha(1024 * 1024)


export function generateNonce() {
  const nonce = new Array(16)
  for (let i = 0; i < 16; i++)
    nonce[i] = nextRandomInt(0xFF)
  return nonce
}


export function bytesToString(bytes: Uint8Array) {
  const ln = bytes.length
  const temp = new Array(ln)
  for (let i = 0; i < ln; ++i)
    temp[i] = String.fromCharCode(bytes[i])
  const result = temp.join('')
  return result
}

export function stringToChars(str: string) {
  const ln = str.length
  const result: number[] = Array(ln)
  for (let i = 0; i < ln; ++i)
    result[i] = str.charCodeAt(i)
  return result
}

export const strDecToHex = str => toLower(
  bigInt2str(
    str2bigInt(str, 10, 0), 16
  ))

export function bytesToHex(bytes = []) {
  const arr = []
  for (let i = 0; i < bytes.length; i++) {
    arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16))
  }
  return arr.join('')
}

export function bytesFromHex(hexString: string) {
  const len = hexString.length
  let start = 0
  const bytes = []

  if (hexString.length % 2) {
    bytes.push(parseInt(hexString.charAt(0), 16))
    start++
  }

  for (let i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16))
  }

  return bytes
}

export function bytesCmp(bytes1: number[] | Uint8Array,
                         bytes2: number[] | Uint8Array) {
  const len = bytes1.length
  if (len !== bytes2.length) {
    return false
  }

  for (let i = 0; i < len; i++) {
    if (bytes1[i] !== bytes2[i])
      return false
  }
  return true
}

export function bytesXor(bytes1, bytes2) {
  const len = bytes1.length
  const bytes = []

  for (let i = 0; i < len; ++i) {
    bytes[i] = bytes1[i] ^ bytes2[i]
  }

  return bytes
}

export function bytesToWords(bytes) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes)
  }
  const len = bytes.length
  const words = []
  let i
  for (i = 0; i < len; i++) {
    words[i >>> 2] |= bytes[i] << 24 - i % 4 * 8
  }

  return new CryptoJS.lib.WordArray.init(words, len)
}

export function bytesFromWords(wordArray) {
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes
  const bytes = []

  for (let i = 0; i < sigBytes; i++) {
    bytes.push(words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff)
  }

  return bytes
}


export function bytesFromLeemonBigInt(bigInt) {
  const str = bigInt2str(bigInt, 16)
  return bytesFromHex(str)
}

export function bytesToArrayBuffer(b) {
  return (new Uint8Array(b)).buffer
}

export function convertToArrayBuffer(bytes) {
  // Be careful with converting subarrays!!
  if (bytes instanceof ArrayBuffer) {
    return bytes
  }
  if (bytes.buffer !== undefined &&
    bytes.buffer.byteLength == bytes.length * bytes.BYTES_PER_ELEMENT) {
    return bytes.buffer
  }
  return bytesToArrayBuffer(bytes)
}

export function convertToUint8Array(bytes) {
  if (bytes.buffer !== undefined)
    return bytes
  return new Uint8Array(bytes)
}

export function convertToByteArray(bytes) {
  if (Array.isArray(bytes))
    return bytes
  bytes = convertToUint8Array(bytes)
  const newBytes = []
  for (let i = 0, len = bytes.length; i < len; i++)
    newBytes.push(bytes[i])
  return newBytes
}

export function bytesFromArrayBuffer(buffer) {
  const byteView = new Uint8Array(buffer)
  const bytes = Array.from( byteView )
  return bytes
}

export function bufferConcat(buffer1, buffer2) {
  const l1 = buffer1.byteLength || buffer1.length
  const l2 = buffer2.byteLength || buffer2.length
  const tmp = new Uint8Array(l1 + l2)
  tmp.set(
    buffer1 instanceof ArrayBuffer
      ? new Uint8Array(buffer1)
      : buffer1,
    0)
  tmp.set(
    buffer2 instanceof ArrayBuffer
      ? new Uint8Array(buffer2)
      : buffer2,
    l1)

  return tmp.buffer
}

// const dividerBig = bigint(0x100000000)
const dividerLem = str2bigInt('100000000', 16, 4)

// const printTimers = (timeL, timeB, a, b, n) => setTimeout(
//   () => console.log(`Timer L ${timeL} B ${timeB}`, ...a, ...b, n || ''),
//   100)

export function longToInts(sLong: string) {
  const lemNum = str2bigInt(sLong, 10, 6)
  const div = new Array(lemNum.length)
  const rem = new Array(lemNum.length)
  divide_(lemNum, dividerLem, div, rem)
  const resL = [
    ~~bigInt2str(div, 10),
    ~~bigInt2str(rem, 10)
  ]
  return resL
}

export function longToBytes(sLong) {
  return bytesFromWords({ words: longToInts(sLong), sigBytes: 8 }).reverse()
}

export function lshift32(high: number, low: number) {
  const highNum = str2bigInt(high.toString(), 10, 6)
  const nLow = str2bigInt(low.toString(), 10, 6)
  leftShift_(highNum, 32)

  add_(highNum, nLow)
  const res = bigInt2str(highNum, 10)
  return res
}

export const rshift32 = (str: string) => {
  const num = str2bigInt(str, 10, 6)
  rightShift_(num, 32)
  return bigInt2str(num, 10)
}

export function intToUint(val: string) {
  let result = ~~val
  if (result < 0)
    result = result + 0x100000000
  return result
}

const middle = 0x100000000 / 2 - 1

export function uintToInt(val: number): number {
  if (val > middle)
    val = val - 0x100000000
  return val
}

export function sha1HashSync(bytes) {
  // console.log(dT(), 'SHA-1 hash start', bytes.byteLength || bytes.length)
  const hashBytes = rushaInstance.rawDigest(bytes).buffer
  // console.log(dT(), 'SHA-1 hash finish')

  return hashBytes
}

export function sha1BytesSync(bytes) {
  return bytesFromArrayBuffer(sha1HashSync(bytes))
}

export function sha256HashSync(bytes) {
  // console.log(dT(), 'SHA-2 hash start', bytes.byteLength || bytes.length)
  const hashWords = CryptoJS.SHA256(bytesToWords(bytes))
  // console.log(dT(), 'SHA-2 hash finish')

  const hashBytes = bytesFromWords(hashWords)

  return hashBytes
}

export function rsaEncrypt(publicKey, bytes) {
  bytes = addPadding(bytes, 255)

  const N = str2bigInt(publicKey.modulus, 16, 256)
  const E = str2bigInt(publicKey.exponent, 16, 256)
  const X = str2bigInt(bytesToHex(bytes), 16, 256)
  const encryptedBigInt = powMod(X, E, N),
        encryptedBytes = bytesFromHex(bigInt2str(encryptedBigInt, 16))

  return encryptedBytes
}

export function addPadding(bytes: ArrayBuffer | Uint8Array | number[],
                           blockSize: number = 16,
                           zeroes: boolean) {

  const len = bytes.byteLength || bytes.length
  const needPadding = blockSize - len % blockSize
  if (needPadding > 0 && needPadding < blockSize) {
    const padding = new Array(needPadding)
    if (zeroes) {
      for (let i = 0; i < needPadding; i++)
        padding[i] = 0
    } else
      random(padding)

    bytes = bytes instanceof ArrayBuffer
      ? bufferConcat(bytes, padding)
      : bytes.concat(padding)
  }

  return bytes
}

export function aesEncryptSync(bytes, keyBytes, ivBytes) {
  // console.log(dT(), 'AES encrypt start', len/*, bytesToHex(keyBytes), bytesToHex(ivBytes)*/)
  bytes = addPadding(bytes)

  const encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
    iv     : bytesToWords(ivBytes),
    padding: CryptoJS.pad.NoPadding,
    mode   : CryptoJS.mode.IGE
  }).ciphertext

  const encryptedBytes = bytesFromWords(encryptedWords)
  // console.log(dT(), 'AES encrypt finish')

  return encryptedBytes
}

export function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {

  // console.log(dT(), 'AES decrypt start', encryptedBytes.length)
  const decryptedWords = CryptoJS.AES.decrypt({ ciphertext: bytesToWords(encryptedBytes) }, bytesToWords(keyBytes), {
    iv     : bytesToWords(ivBytes),
    padding: CryptoJS.pad.NoPadding,
    mode   : CryptoJS.mode.IGE
  })

  const bytes = bytesFromWords(decryptedWords)
  // console.log(dT(), 'AES decrypt finish')

  return bytes
}

export function gzipUncompress(bytes) {
  // console.log('Gzip uncompress start')
  const result = inflate(bytes)
  // console.log('Gzip uncompress finish')
  return result
}

export function nextRandomInt(maxValue: number) {
  return Math.floor(Math.random() * maxValue)
}


export function pqPrimeFactorization(pqBytes) {
  const minSize = Math.ceil(64 / bpe) + 1

  // const what = new BigInteger(pqBytes)
  const hex = bytesToHex(pqBytes)
  const lWhat = str2bigInt(hex, 16, minSize)
  const result = pqPrimeLeemon(lWhat)
  return result
}


export function pqPrimeLeemon(what) {
  const minBits = 64
  const minLen = Math.ceil(minBits / bpe) + 1
  let it = 0
  let q, lim
  const a = new Array(minLen)
  const b = new Array(minLen)
  const c = new Array(minLen)
  const g = new Array(minLen)
  const z = new Array(minLen)
  const x = new Array(minLen)
  const y = new Array(minLen)

  for (let i = 0; i < 3; i++) {
    q = (nextRandomInt(128) & 15) + 17
    copyInt_(x, nextRandomInt(1000000000) + 1)
    copy_(y, x)
    lim = 1 << i + 18

    for (let j = 1; j < lim; j++) {
      ++it
      copy_(a, x)
      copy_(b, x)
      copyInt_(c, q)

      while (!isZero(b)) {
        if (b[0] & 1) {
          add_(c, a)
          if (greater(c, what)) {
            sub_(c, what)
          }
        }
        add_(a, a)
        if (greater(a, what)) {
          sub_(a, what)
        }
        rightShift_(b, 1)
      }

      copy_(x, c)
      if (greater(x, y)) {
        copy_(z, x)
        sub_(z, y)
      } else {
        copy_(z, y)
        sub_(z, x)
      }
      eGCD_(z, what, g, a, b)
      if (!equalsInt(g, 1)) {
        break
      }
      if ((j & j - 1) === 0) {
        copy_(y, x)
      }
    }
    if (greater(g, one)) {
      break
    }
  }

  divide_(what, g, x, y)

  const [P, Q] =
    greater(g, x)
      ? [x, g]
      : [g, x]

  // console.log(dT(), 'done', bigInt2str(what, 10), bigInt2str(P, 10), bigInt2str(Q, 10))

  return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it]
}

export function bytesModPow(x, y, m) {
  const xBigInt = str2bigInt(bytesToHex(x), 16)
  const yBigInt = str2bigInt(bytesToHex(y), 16)
  const mBigInt = str2bigInt(bytesToHex(m), 16)
  const resBigInt = powMod(xBigInt, yBigInt, mBigInt)

  return bytesFromHex(bigInt2str(resBigInt, 16))
}

