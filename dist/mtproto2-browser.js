(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vendor"));
	else if(typeof define === 'function' && define.amd)
		define(["vendor"], factory);
	else if(typeof exports === 'object')
		exports["mtproto"] = factory(require("vendor"));
	else
		root["mtproto"] = factory(root["vendor"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jsbn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rusha__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rusha___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rusha__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_pako_lib_inflate__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_pako_lib_inflate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_pako_lib_inflate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__leemon__ = __webpack_require__(20);
/* harmony export (immutable) */ __webpack_exports__["c"] = bigint;
/* harmony export (immutable) */ __webpack_exports__["b"] = bigStringInt;
/* unused harmony export dHexDump */
/* harmony export (immutable) */ __webpack_exports__["e"] = bytesToHex;
/* harmony export (immutable) */ __webpack_exports__["x"] = bytesFromHex;
/* unused harmony export bytesToBase64 */
/* unused harmony export uint6ToBase64 */
/* harmony export (immutable) */ __webpack_exports__["l"] = bytesCmp;
/* harmony export (immutable) */ __webpack_exports__["y"] = bytesXor;
/* unused harmony export bytesToWords */
/* unused harmony export bytesFromWords */
/* unused harmony export bytesFromBigInt */
/* unused harmony export bytesFromLeemonBigInt */
/* harmony export (immutable) */ __webpack_exports__["h"] = bytesToArrayBuffer;
/* harmony export (immutable) */ __webpack_exports__["j"] = convertToArrayBuffer;
/* harmony export (immutable) */ __webpack_exports__["i"] = convertToUint8Array;
/* harmony export (immutable) */ __webpack_exports__["t"] = convertToByteArray;
/* harmony export (immutable) */ __webpack_exports__["m"] = bytesFromArrayBuffer;
/* unused harmony export bufferConcat */
/* unused harmony export longToInts */
/* harmony export (immutable) */ __webpack_exports__["n"] = longToBytes;
/* harmony export (immutable) */ __webpack_exports__["z"] = longFromInts;
/* harmony export (immutable) */ __webpack_exports__["d"] = intToUint;
/* harmony export (immutable) */ __webpack_exports__["f"] = uintToInt;
/* harmony export (immutable) */ __webpack_exports__["p"] = sha1HashSync;
/* harmony export (immutable) */ __webpack_exports__["k"] = sha1BytesSync;
/* harmony export (immutable) */ __webpack_exports__["q"] = sha256HashSync;
/* harmony export (immutable) */ __webpack_exports__["w"] = rsaEncrypt;
/* unused harmony export addPadding */
/* harmony export (immutable) */ __webpack_exports__["r"] = aesEncryptSync;
/* harmony export (immutable) */ __webpack_exports__["s"] = aesDecryptSync;
/* harmony export (immutable) */ __webpack_exports__["g"] = gzipUncompress;
/* harmony export (immutable) */ __webpack_exports__["o"] = nextRandomInt;
/* harmony export (immutable) */ __webpack_exports__["u"] = pqPrimeFactorization;
/* unused harmony export pqPrimeJsbn */
/* unused harmony export pqPrimeLeemon */
/* harmony export (immutable) */ __webpack_exports__["v"] = bytesModPow;






// import Int from 'big-integer'

// import BN from 'bn.js'



// import { bigInt2str } from 'BigInt'

// const { BigInteger } = jsbn

const rushaInstance = new __WEBPACK_IMPORTED_MODULE_1_rusha___default.a(1024 * 1024);

function bigint(num) {
  return new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](num.toString(16), 16);
}

function bigStringInt(strNum) {
  return new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](strNum, 10);
}

function dHexDump(bytes) {
  const arr = [];
  for (let i = 0; i < bytes.length; i++) {
    if (i && !(i % 2)) {
      if (!(i % 16)) {
        arr.push('\n');
      } else if (!(i % 4)) {
        arr.push('  ');
      } else {
        arr.push(' ');
      }
    }
    arr.push((bytes[i] < 16 ? '0' : '') + bytes[i].toString(16));
  }

  console.log(arr.join(''));
}

function bytesToHex(bytes = []) {
  const arr = [];
  for (let i = 0; i < bytes.length; i++) {
    arr.push((bytes[i] < 16 ? '0' : '') + (bytes[i] || 0).toString(16));
  }
  return arr.join('');
}

function bytesFromHex(hexString) {
  const len = hexString.length;
  let start = 0;
  const bytes = [];

  if (hexString.length % 2) {
    bytes.push(parseInt(hexString.charAt(0), 16));
    start++;
  }

  for (let i = start; i < len; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }

  return bytes;
}

function bytesToBase64(bytes) {
  let mod3;
  let result = '';

  for (let nLen = bytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
    mod3 = nIdx % 3;
    nUint24 |= bytes[nIdx] << (16 >>> mod3 & 24);
    if (mod3 === 2 || nLen - nIdx === 1) {
      result += String.fromCharCode(uint6ToBase64(nUint24 >>> 18 & 63), uint6ToBase64(nUint24 >>> 12 & 63), uint6ToBase64(nUint24 >>> 6 & 63), uint6ToBase64(nUint24 & 63));
      nUint24 = 0;
    }
  }

  return result.replace(/A(?=A$|$)/g, '=');
}

function uint6ToBase64(nUint6) {
  return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
}

// export function base64ToBlob(base64str, mimeType) {
//   const sliceSize = 1024
//   const byteCharacters = atob(base64str)
//   const bytesLength = byteCharacters.length
//   const slicesCount = Math.ceil(bytesLength / sliceSize)
//   const byteArrays = new Array(slicesCount)

//   for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
//     const begin = sliceIndex * sliceSize
//     const end = Math.min(begin + sliceSize, bytesLength)

//     const bytes = new Array(end - begin)
//     for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
//       bytes[i] = byteCharacters[offset].charCodeAt(0)
//     }
//     byteArrays[sliceIndex] = new Uint8Array(bytes)
//   }

//   return blobConstruct(byteArrays, mimeType)
// }

// export function dataUrlToBlob(url) {
//   // var name = 'b64blob ' + url.length
//   // console.time(name)
//   const urlParts = url.split(',')
//   const base64str = urlParts[1]
//   const mimeType = urlParts[0].split(':')[1].split(';')[0]
//   const blob = base64ToBlob(base64str, mimeType)
//   // console.timeEnd(name)
//   return blob
// }

// export function blobConstruct(blobParts, mimeType) {
//   let blob
//   try {
//     blob = new Blob(blobParts, { type: mimeType })
//   } catch (e) {
//     const bb = new BlobBuilder
//     angular.forEach(blobParts, function(blobPart) {
//       bb.append(blobPart)
//     })
//     blob = bb.getBlob(mimeType)
//   }
//   return blob
// }

function bytesCmp(bytes1, bytes2) {
  const len = bytes1.length;
  if (len !== bytes2.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    if (bytes1[i] !== bytes2[i]) return false;
  }
  return true;
}

function bytesXor(bytes1, bytes2) {
  const len = bytes1.length;
  const bytes = [];

  for (let i = 0; i < len; ++i) {
    bytes[i] = bytes1[i] ^ bytes2[i];
  }

  return bytes;
}

function bytesToWords(bytes) {
  if (bytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(bytes);
  }
  const len = bytes.length;
  const words = [];
  let i;
  for (i = 0; i < len; i++) {
    words[i >>> 2] |= bytes[i] << 24 - i % 4 * 8;
  }

  return new __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].lib.WordArray.init(words, len);
}

function bytesFromWords(wordArray) {
  const words = wordArray.words;
  const sigBytes = wordArray.sigBytes;
  const bytes = [];

  for (let i = 0; i < sigBytes; i++) {
    bytes.push(words[i >>> 2] >>> 24 - i % 4 * 8 & 0xff);
  }

  return bytes;
}

function bytesFromBigInt(bigInt, len) {
  let bytes = bigInt.toByteArray();

  if (len && bytes.length < len) {
    const padding = [];
    for (let i = 0, needPadding = len - bytes.length; i < needPadding; i++) {
      padding[i] = 0;
    }
    if (bytes instanceof ArrayBuffer) {
      bytes = bufferConcat(padding, bytes);
    } else {
      bytes = padding.concat(bytes);
    }
  } else {
    while (!bytes[0] && (!len || bytes.length > len)) {
      bytes = bytes.slice(1);
    }
  }

  return bytes;
}

function bytesFromLeemonBigInt(bigInt, len) {
  const str = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["a" /* bigInt2str */])(bigInt, 16);
  return bytesFromHex(str);
}

function bytesToArrayBuffer(b) {
  return new Uint8Array(b).buffer;
}

function convertToArrayBuffer(bytes) {
  // Be careful with converting subarrays!!
  if (bytes instanceof ArrayBuffer) {
    return bytes;
  }
  if (bytes.buffer !== undefined && bytes.buffer.byteLength == bytes.length * bytes.BYTES_PER_ELEMENT) {
    return bytes.buffer;
  }
  return bytesToArrayBuffer(bytes);
}

function convertToUint8Array(bytes) {
  if (bytes.buffer !== undefined) {
    return bytes;
  }
  return new Uint8Array(bytes);
}

function convertToByteArray(bytes) {
  if (Array.isArray(bytes)) {
    return bytes;
  }
  bytes = convertToUint8Array(bytes);
  const newBytes = [];
  for (let i = 0, len = bytes.length; i < len; i++) {
    newBytes.push(bytes[i]);
  }
  return newBytes;
}

function bytesFromArrayBuffer(buffer) {
  const byteView = new Uint8Array(buffer);
  const bytes = Array.from(byteView);
  return bytes;
}

function bufferConcat(buffer1, buffer2) {
  const l1 = buffer1.byteLength || buffer1.length;
  const l2 = buffer2.byteLength || buffer2.length;
  const tmp = new Uint8Array(l1 + l2);
  tmp.set(buffer1 instanceof ArrayBuffer ? new Uint8Array(buffer1) : buffer1, 0);
  tmp.set(buffer2 instanceof ArrayBuffer ? new Uint8Array(buffer2) : buffer2, l1);

  return tmp.buffer;
}

function longToInts(sLong) {
  const divRem = bigStringInt(sLong).divideAndRemainder(bigint(0x100000000));

  return [divRem[0].intValue(), divRem[1].intValue()];
}

function longToBytes(sLong) {
  return bytesFromWords({ words: longToInts(sLong), sigBytes: 8 }).reverse();
}

function longFromInts(high, low) {
  return bigint(high).shiftLeft(32).add(bigint(low)).toString(10);
}

function intToUint(val) {
  val = parseInt(val);
  if (val < 0) {
    val = val + 4294967296;
  }
  return val;
}

function uintToInt(val) {
  if (val > 2147483647) {
    val = val - 4294967296;
  }
  return val;
}

function sha1HashSync(bytes) {
  // console.log(dT(), 'SHA-1 hash start', bytes.byteLength || bytes.length)
  const hashBytes = rushaInstance.rawDigest(bytes).buffer;
  // console.log(dT(), 'SHA-1 hash finish')

  return hashBytes;
}

function sha1BytesSync(bytes) {
  return bytesFromArrayBuffer(sha1HashSync(bytes));
}

function sha256HashSync(bytes) {
  // console.log(dT(), 'SHA-2 hash start', bytes.byteLength || bytes.length)
  const hashWords = __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].SHA256(bytesToWords(bytes));
  // console.log(dT(), 'SHA-2 hash finish')

  const hashBytes = bytesFromWords(hashWords);

  return hashBytes;
}

function rsaEncrypt(publicKey, bytes) {
  bytes = addPadding(bytes, 255);

  // console.log('RSA encrypt start')
  const N = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](publicKey.modulus, 16);
  const E = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](publicKey.exponent, 16);
  const X = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](bytes);
  const encryptedBigInt = X.modPowInt(E, N),
        encryptedBytes = bytesFromBigInt(encryptedBigInt, 256);
  // console.log('RSA encrypt finish')

  return encryptedBytes;
}

function addPadding(bytes, blockSize, zeroes) {
  blockSize = blockSize || 16;
  const len = bytes.byteLength || bytes.length;
  const needPadding = blockSize - len % blockSize;
  if (needPadding > 0 && needPadding < blockSize) {
    const padding = new Array(needPadding);
    if (zeroes) {
      for (let i = 0; i < needPadding; i++) {
        padding[i] = 0;
      }
    } else {
      new __WEBPACK_IMPORTED_MODULE_0_jsbn__["SecureRandom"]().nextBytes(padding);
    }

    if (bytes instanceof ArrayBuffer) {
      bytes = bufferConcat(bytes, padding);
    } else {
      bytes = bytes.concat(padding);
    }
  }

  return bytes;
}

function aesEncryptSync(bytes, keyBytes, ivBytes) {
  const len = bytes.byteLength || bytes.length;

  // console.log(dT(), 'AES encrypt start', len/*, bytesToHex(keyBytes), bytesToHex(ivBytes)*/)
  bytes = addPadding(bytes);

  const encryptedWords = __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
    iv: bytesToWords(ivBytes),
    padding: __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].pad.NoPadding,
    mode: __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].mode.IGE
  }).ciphertext;

  const encryptedBytes = bytesFromWords(encryptedWords);
  // console.log(dT(), 'AES encrypt finish')

  return encryptedBytes;
}

function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {

  // console.log(dT(), 'AES decrypt start', encryptedBytes.length)
  const decryptedWords = __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].AES.decrypt({ ciphertext: bytesToWords(encryptedBytes) }, bytesToWords(keyBytes), {
    iv: bytesToWords(ivBytes),
    padding: __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].pad.NoPadding,
    mode: __WEBPACK_IMPORTED_MODULE_2__goodmind_node_cryptojs_aes__["CryptoJS"].mode.IGE
  });

  const bytes = bytesFromWords(decryptedWords);
  // console.log(dT(), 'AES decrypt finish')

  return bytes;
}

function gzipUncompress(bytes) {
  // console.log('Gzip uncompress start')
  const result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_pako_lib_inflate__["inflate"])(bytes);
  // console.log('Gzip uncompress finish')
  return result;
}

function nextRandomInt(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

// const bytesToInt = bytes => Int(bytesToHex(bytes), 16)
// const bytesFromInt = int => bytesFromHex(int.toString(16))

function pqPrimeFactorization(pqBytes) {
  const what = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](pqBytes);
  // const whatInt = bytesToInt(pqBytes)
  // const whatBn = new BN(bytesToHex(pqBytes), 16)
  let result = false;
  // let intRes = []
  // const bnRes = []
  // console.log(dT(), 'PQ start', pqBytes, what.toString(16), what.bitLength())

  // try {
  // console.time('pq leemon')
  // const toHex = bytesToHex(pqBytes)
  result = pqPrimeLeemon(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["b" /* str2bigInt */])(what.toString(16), 16, Math.ceil(64 / __WEBPACK_IMPORTED_MODULE_4__leemon__["c" /* bpe */]) + 1));
  // console.timeEnd('pq leemon')
  // } catch (e) {
  //   console.error('Pq leemon Exception', e)
  // }

  /*if (result === false && what.bitLength() <= 64) {
    // console.time('PQ long')
    try {
      result = pqPrimeLong(goog.math.Long.fromString(what.toString(16), 16))
    } catch (e) {
      console.error('Pq long Exception', e)
    }
  // console.timeEnd('PQ long')
  }*/
  // console.log(result)

  // if (result === false) {
  // console.time('pq BigInt')
  // intRes = pqPrimeJsbn(what)
  // console.timeEnd('pq BigInt')

  // console.time('pq bn')
  // bnRes = pqPrimeBN(whatBn)
  // console.timeEnd('pq bn')
  // }
  // console.log(...result, ...bnRes)
  // console.log(dT(), 'PQ finish')

  return result;
  //intRes//result//bnRes
}

/*export function pqPrimeBN(what) {
  let it = 0,
      g
  const nOne = new BN(1)
  for (let i = 0; i < 3; i++) {
    const q = (nextRandomInt(128) & 15) + 17
    let x = new BN(nextRandomInt(1000000000) + 1)
    let y = x.clone()
    const lim = 1 << (i + 18)

    for (let j = 1; j < lim; j++) {
      ++it
      let a = x.clone()
      let b = x.clone()
      let c = new BN(q)

      while (!b.isZero()) {
        if (!b.and(nOne).isZero()) {
          c = c.add(a)
          if (c.gt(what)) {
            c = c.sub(what)
          }
        }
        a = a.add(a)
        if (a.gt(what)) {
          a = a.sub(what)
        }
        b = b.shrn(1)
      }

      x = c.clone()
      const z = x.lt(y)
        ? y.sub(x)
        : x.sub(y)
      g = z.gcd(what)
      if (!g.eq(nOne)) {
        break
      }
      if ((j & (j - 1)) == 0) {
        y = x.clone()
      }
    }
    if (g.gt(nOne)) {
      break
    }
  }

  let f = what.div(g), P, Q

  if (g.gt(f)) {
    P = f
    Q = g
  } else {
    P = g
    Q = f
  }

  return [P.toArray(), Q.toArray(), it]
}*/

function pqPrimeJsbn(what) {
  let it = 0,
      g;
  for (let i = 0; i < 3; i++) {
    const q = (nextRandomInt(128) & 15) + 17;
    let x = bigint(nextRandomInt(1000000000) + 1);
    let y = x.clone();
    const lim = 1 << i + 18;

    for (let j = 1; j < lim; j++) {
      ++it;
      let a = x.clone();
      let b = x.clone();
      let c = bigint(q);

      while (!b.equals(__WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"].ZERO)) {
        if (!b.and(__WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"].ONE).equals(__WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"].ZERO)) {
          c = c.add(a);
          if (c.compareTo(what) > 0) {
            c = c.subtract(what);
          }
        }
        a = a.add(a);
        if (a.compareTo(what) > 0) {
          a = a.subtract(what);
        }
        b = b.shiftRight(1);
      }

      x = c.clone();
      const z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y);
      g = z.gcd(what);
      if (!g.equals(__WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"].ONE)) {
        break;
      }
      if ((j & j - 1) == 0) {
        y = x.clone();
      }
    }
    if (g.compareTo(__WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"].ONE) > 0) {
      break;
    }
  }

  let f = what.divide(g),
      P,
      Q;

  if (g.compareTo(f) > 0) {
    P = f;
    Q = g;
  } else {
    P = g;
    Q = f;
  }

  return [bytesFromBigInt(P), bytesFromBigInt(Q), it];
}

/*export function pqPrimeBigInteger(what) {
  let it = 0,
      g
  for (let i = 0; i < 3; i++) {
    const q = (nextRandomInt(128) & 15) + 17
    let x = Int(nextRandomInt(1000000000) + 1)
    let y = Int(x)
    const lim = 1 << (i + 18)

    for (let j = 1; j < lim; j++) {
      ++it
      let a = Int(x)
      let b = Int(x)
      let c = Int(q)

      while (!b.isZero()) {
        if (!b.and(Int.one).isZero()) {
          c = c.add(a)
          if (c.greater(what))
            c = c.subtract(what)
        }
        a = a.add(a)
        if (a.greater(what))
          a = a.subtract(what)
        b = b.shiftRight(1)
      }

      x = Int(c)
      const z = x.lesser(y)
        ? y.subtract(x)
        : x.subtract(y)
      g = Int.gcd(z, what)
      if (g.notEquals(Int.one))
        break
      if ((j & (j - 1)) == 0)
        y = Int(x)
    }
    if (g.greater(Int.one))
      break
  }

  const f = what.divide(g)
  let P, Q

  if (g.greater(f)) {
    P = f
    Q = g
  } else {
    P = g
    Q = f
  }

  return [bytesFromInt(P), bytesFromInt(Q), it]
}*/

/*export function gcdLong(a, b) {
  while (a.notEquals(goog.math.Long.ZERO) && b.notEquals(goog.math.Long.ZERO)) {
    while (b.and(goog.math.Long.ONE).equals(goog.math.Long.ZERO)) {
      b = b.shiftRight(1)
    }
    while (a.and(goog.math.Long.ONE).equals(goog.math.Long.ZERO)) {
      a = a.shiftRight(1)
    }
    if (a.compare(b) > 0) {
      a = a.subtract(b)
    } else {
      b = b.subtract(a)
    }
  }
  return b.equals(goog.math.Long.ZERO) ? a : b
}

export function pqPrimeLong(what) {
  let it = 0,
      g
  for (let i = 0; i < 3; i++) {
    const q = goog.math.Long.fromInt((nextRandomInt(128) & 15) + 17)
    let x = goog.math.Long.fromInt(nextRandomInt(1000000000) + 1)
    let y = x
    const lim = 1 << (i + 18)

    for (let j = 1; j < lim; j++) {
      ++it
      let a = x
      let b = x
      let c = q

      while (b.notEquals(goog.math.Long.ZERO)) {
        if (b.and(goog.math.Long.ONE).notEquals(goog.math.Long.ZERO)) {
          c = c.add(a)
          if (c.compare(what) > 0) {
            c = c.subtract(what)
          }
        }
        a = a.add(a)
        if (a.compare(what) > 0) {
          a = a.subtract(what)
        }
        b = b.shiftRight(1)
      }

      x = c
      const z = x.compare(y) < 0 ? y.subtract(x) : x.subtract(y)
      g = gcdLong(z, what)
      if (g.notEquals(goog.math.Long.ONE)) {
        break
      }
      if ((j & (j - 1)) == 0) {
        y = x
      }
    }
    if (g.compare(goog.math.Long.ONE) > 0) {
      break
    }
  }

  let f = what.div(g), P, Q

  if (g.compare(f) > 0) {
    P = f
    Q = g
  } else {
    P = g
    Q = f
  }

  return [bytesFromHex(P.toString(16)), bytesFromHex(Q.toString(16)), it]
}*/

/*//is bigint x equal to integer y?
//y must have less than bpe bits
function equalsInt(x,y) {
  var i;
  if (x[0]!=y)
    return 0;
  for (i=1;i<x.length;i++)
    if (x[i])
      return 0;
  return 1;
}*/

function pqPrimeLeemon(what) {
  const minBits = 64;
  const minLen = Math.ceil(minBits / __WEBPACK_IMPORTED_MODULE_4__leemon__["c" /* bpe */]) + 1;
  let it = 0;
  let q, lim;
  const a = new Array(minLen);
  const b = new Array(minLen);
  const c = new Array(minLen);
  const g = new Array(minLen);
  const z = new Array(minLen);
  const x = new Array(minLen);
  const y = new Array(minLen);

  for (let i = 0; i < 3; i++) {
    q = (nextRandomInt(128) & 15) + 17;
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["d" /* copyInt_ */])(x, nextRandomInt(1000000000) + 1);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(y, x);
    lim = 1 << i + 18;

    for (let j = 1; j < lim; j++) {
      ++it;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(a, x);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(b, x);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["d" /* copyInt_ */])(c, q);

      while (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["f" /* isZero */])(b)) {
        if (b[0] & 1) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["g" /* add_ */])(c, a);
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["h" /* greater */])(c, what)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["i" /* sub_ */])(c, what);
          }
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["g" /* add_ */])(a, a);
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["h" /* greater */])(a, what)) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["i" /* sub_ */])(a, what);
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["j" /* rightShift_ */])(b, 1);
      }

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(x, c);
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["h" /* greater */])(x, y)) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(z, x);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["i" /* sub_ */])(z, y);
      } else {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(z, y);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["i" /* sub_ */])(z, x);
      }
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["k" /* eGCD_ */])(z, what, g, a, b);
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["l" /* equalsInt */])(g, 1)) {
        break;
      }
      if ((j & j - 1) === 0) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["e" /* copy_ */])(y, x);
      }
    }
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["h" /* greater */])(g, __WEBPACK_IMPORTED_MODULE_4__leemon__["m" /* one */])) {
      break;
    }
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["n" /* divide_ */])(what, g, x, y);

  const [P, Q] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["h" /* greater */])(g, x) ? [x, g] : [g, x];

  // console.log(dT(), 'done', bigInt2str(what, 10), bigInt2str(P, 10), bigInt2str(Q, 10))

  return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it];
}

function bytesModPow(x, y, m) {
  try {
    const xBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["b" /* str2bigInt */])(bytesToHex(x), 16);
    const yBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["b" /* str2bigInt */])(bytesToHex(y), 16);
    const mBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["b" /* str2bigInt */])(bytesToHex(m), 16);
    const resBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["o" /* powMod */])(xBigInt, yBigInt, mBigInt);

    return bytesFromHex(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__leemon__["a" /* bigInt2str */])(resBigInt, 16));
  } catch (e) {
    console.error('mod pow error', e);
  }

  return bytesFromBigInt(new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](x).modPow(new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](y), new __WEBPACK_IMPORTED_MODULE_0_jsbn__["BigInteger"](m)), 256);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(128);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(131);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);

/**
 * Defered promise like in Q and $q
 *
 * @returns {{ resolve: (res: any) => void, reject: (res: any) => void, promise: Promise<{}> }}
 */
const blueDefer = () => {
  let resolve, reject;
  const promise = new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a((rs, rj) => {
    resolve = rs;
    reject = rj;
  });
  return {
    resolve,
    reject,
    promise
  };
};
/* harmony export (immutable) */ __webpack_exports__["a"] = blueDefer;


/* harmony default export */ __webpack_exports__["b"] = blueDefer;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bin__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateID", function() { return generateMessageID; });





const tsNow = seconds => {
  let t = +new Date();
  if (!__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) t += window.tsOffset || 0;
  return seconds ? Math.floor(t / 1000) : t;
};
/* harmony export (immutable) */ __webpack_exports__["tsNow"] = tsNow;


const logTimer = new Date().getTime();

const dTime = () => `[${((new Date().getTime() - logTimer) / 1000).toFixed(3)}]`;
/* harmony export (immutable) */ __webpack_exports__["dTime"] = dTime;


let lastMessageID = [0, 0];
let timerOffset = 0;

const offset = __WEBPACK_IMPORTED_MODULE_1__store__["b" /* TimeOffset */].get();
if (offset) timerOffset = offset;

const generateMessageID = () => {
  const timeTicks = tsNow(),
        timeSec = Math.floor(timeTicks / 1000) + timerOffset,
        timeMSec = timeTicks % 1000,
        random = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["o" /* nextRandomInt */])(0xFFFF);

  let messageID = [timeSec, timeMSec << 21 | random << 3 | 4];
  if (lastMessageID[0] > messageID[0] || lastMessageID[0] == messageID[0] && lastMessageID[1] >= messageID[1]) {
    messageID = [lastMessageID[0], lastMessageID[1] + 4];
  }

  lastMessageID = messageID;

  // console.log('generated msg id', messageID, timerOffset)

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["z" /* longFromInts */])(messageID[0], messageID[1]);
};

const applyServerTime = (serverTime, localTime) => {
  const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000);
  const changed = Math.abs(timerOffset - newTimeOffset) > 10;
  __WEBPACK_IMPORTED_MODULE_1__store__["b" /* TimeOffset */].set(newTimeOffset);

  lastMessageID = [0, 0];
  timerOffset = newTimeOffset;
  console.log(dTime(), 'Apply server time', serverTime, localTime, newTimeOffset, changed);

  return changed;
};
/* harmony export (immutable) */ __webpack_exports__["applyServerTime"] = applyServerTime;




/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);




const ValueStore = () => {
  let val = null;

  return {
    get: () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["clone"])(val),
    set: newVal => val = newVal
  };
};
/* unused harmony export ValueStore */


const ValueStoreMap = () => {
  const val = new Map();

  return {
    get: key => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["clone"])(val.get(key)),
    set: (key, newVal) => val.set(key, newVal)
  };
};
/* unused harmony export ValueStoreMap */


const TimeOffset = ValueStore();
/* harmony export (immutable) */ __webpack_exports__["b"] = TimeOffset;

const dcList = ValueStoreMap();
/* unused harmony export dcList */


const PureStorage = {
  get: (...keys) => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(rs => ConfigStorage.get(keys, rs)),
  set: obj => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(rs => ConfigStorage.set(obj, rs)),
  remove: (...keys) => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(rs => ConfigStorage.remove(...keys, rs)),
  noPrefix: () => ConfigStorage.noPrefix(),
  clear: () => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(rs => ConfigStorage.clear(rs))
};
/* harmony export (immutable) */ __webpack_exports__["a"] = PureStorage;


const flatArgs = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["unapply"])(__WEBPACK_IMPORTED_MODULE_1_ramda__["unnest"]);
const splitter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["chain"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["split"])('.'));
const rejecter = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["either"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["complement"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(String)), __WEBPACK_IMPORTED_MODULE_1_ramda__["isEmpty"]);

const flatPath = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["memoize"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(flatArgs, splitter, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["reject"])(rejecter)));

const pipeWith = (ln, ctx) => (...funcs) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["view"])(ln), ...funcs)(ctx);

class SyncStorage {
  constructor(def = {}) {
    this.set = val => this.storage = val;

    this.fpSave = func => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(func, this.set);

    this.createOnNil = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["when"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["view"])(__WEBPACK_IMPORTED_MODULE_1_ramda__["__"], this.storage), __WEBPACK_IMPORTED_MODULE_1_ramda__["isNil"]), this.fpSave(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["set"])(__WEBPACK_IMPORTED_MODULE_1_ramda__["__"], {}, this.storage)));

    this.subtree = (...pathKeys) => {
      const args = flatPath(...pathKeys);
      const ln = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["lensPath"])(args);
      this.createOnNil(ln);
      //console.log(this.lensNil(ln))
      const pipeWithLn = pipeWith(ln, this.storage);
      const overSubtree = fn => this.fpSave(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["over"])(ln, fn))(this.storage);
      return {
        // has   : field => overSubtree( has ( field ) ),
        field: key => ({
          has: () => pipeWithLn(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["has"])(key)),
          view: () => pipeWithLn(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["prop"])(key)),
          set: val => overSubtree(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["merge"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["objOf"])(key, val))),
          pipeWith: (...funcs) => pipeWithLn(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["prop"])(key), ...funcs),
          pipeOver: (...funcs) => this.fpSave(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["over"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["compose"])(ln, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["lensProp"])(key)), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(...funcs)))(this.storage),
          remove: () => overSubtree(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["omit"])([key]))
        }),
        has: key => pipeWithLn(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["has"])(key)),
        view: () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["view"])(ln, this.storage),
        set: this.fpSave(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["set"])(ln, __WEBPACK_IMPORTED_MODULE_1_ramda__["__"], this.storage)),
        over: overSubtree,
        remove: () => this.fpSave(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["dissocPath"])(args))(this.storage),
        without: (...keys) => overSubtree(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["omit"])(keys))
      };
    };

    this.storage = def;
  }

  set save(val) {
    this.storage = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["merge"])(this.storage, val);
  }
}
/* unused harmony export SyncStorage */


const innerStore = new SyncStorage();
/* unused harmony export innerStore */


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bin__ = __webpack_require__(1);



class TLSerialization {
  constructor({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) {
    this.maxLength = startMaxLength;
    this.offset = 0; // in bytes

    this.createBuffer();

    // this.debug = options.debug !== undefined ? options.debug : Config.Modes.debug
    this.mtproto = mtproto;
  }

  createBuffer() {
    this.buffer = new ArrayBuffer(this.maxLength);
    this.intView = new Int32Array(this.buffer);
    this.byteView = new Uint8Array(this.buffer);
  }

  getArray() {
    const resultBuffer = new ArrayBuffer(this.offset);
    const resultArray = new Int32Array(resultBuffer);

    resultArray.set(this.intView.subarray(0, this.offset / 4));

    return resultArray;
  }

  getBuffer() {
    return this.getArray().buffer;
  }

  getBytes(typed) {
    if (typed) {
      const resultBuffer = new ArrayBuffer(this.offset);
      const resultArray = new Uint8Array(resultBuffer);

      resultArray.set(this.byteView.subarray(0, this.offset));

      return resultArray;
    }

    const bytes = [];
    for (let i = 0; i < this.offset; i++) {
      bytes.push(this.byteView[i]);
    }
    return bytes;
  }

  checkLength(needBytes) {
    if (this.offset + needBytes < this.maxLength) {
      return;
    }

    console.trace('Increase buffer', this.offset, needBytes, this.maxLength);
    this.maxLength = Math.ceil(Math.max(this.maxLength * 2, this.offset + needBytes + 16) / 4) * 4;
    const previousBuffer = this.buffer;
    const previousArray = new Int32Array(previousBuffer);

    this.createBuffer();

    new Int32Array(this.buffer).set(previousArray);
  }

  writeInt(i, field) {
    this.debug && console.log('>>>', i.toString(16), i, field);

    this.checkLength(4);
    this.intView[this.offset / 4] = i;
    this.offset += 4;
  }

  storeInt(i, field = '') {
    this.writeInt(i, `${field}:int`);
  }

  storeBool(i, field = '') {
    if (i) {
      this.writeInt(0x997275b5, `${field}:bool`);
    } else {
      this.writeInt(0xbc799737, `${field}:bool`);
    }
  }

  storeLongP(iHigh, iLow, field) {
    this.writeInt(iLow, `${field}:long[low]`);
    this.writeInt(iHigh, `${field}:long[high]`);
  }

  storeLong(sLong, field = '') {
    if (angular.isArray(sLong)) {
      if (sLong.length == 2) {
        return this.storeLongP(sLong[0], sLong[1], field);
      } else {
        return this.storeIntBytes(sLong, 64, field);
      }
    }

    if (typeof sLong != 'string') {
      sLong = sLong ? sLong.toString() : '0';
    }
    const divRem = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["b" /* bigStringInt */])(sLong).divideAndRemainder(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["c" /* bigint */])(0x100000000));

    this.writeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["d" /* intToUint */])(divRem[1].intValue()), `${field}:long[low]`);
    this.writeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["d" /* intToUint */])(divRem[0].intValue()), `${field}:long[high]`);
  }

  storeDouble(f, field = '') {
    const buffer = new ArrayBuffer(8);
    const intView = new Int32Array(buffer);
    const doubleView = new Float64Array(buffer);

    doubleView[0] = f;

    this.writeInt(intView[0], `${field}:double[low]`);
    this.writeInt(intView[1], `${field}:double[high]`);
  }

  storeString(s, field = '') {
    this.debug && console.log('>>>', s, `${field}:string`);

    if (s === undefined) {
      s = '';
    }
    const sUTF8 = unescape(encodeURIComponent(s));

    this.checkLength(sUTF8.length + 8);

    const len = sUTF8.length;
    if (len <= 253) {
      this.byteView[this.offset++] = len;
    } else {
      this.byteView[this.offset++] = 254;
      this.byteView[this.offset++] = len & 0xFF;
      this.byteView[this.offset++] = (len & 0xFF00) >> 8;
      this.byteView[this.offset++] = (len & 0xFF0000) >> 16;
    }
    for (let i = 0; i < len; i++) {
      this.byteView[this.offset++] = sUTF8.charCodeAt(i);
    }

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0;
    }
  }

  storeBytes(bytes, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    } else if (bytes === undefined) {
      bytes = [];
    }
    this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), `${field}:bytes`);

    const len = bytes.byteLength || bytes.length;
    this.checkLength(len + 8);
    if (len <= 253) {
      this.byteView[this.offset++] = len;
    } else {
      this.byteView[this.offset++] = 254;
      this.byteView[this.offset++] = len & 0xFF;
      this.byteView[this.offset++] = (len & 0xFF00) >> 8;
      this.byteView[this.offset++] = (len & 0xFF0000) >> 16;
    }

    this.byteView.set(bytes, this.offset);
    this.offset += len;

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0;
    }
  }

  storeIntBytes(bytes, bits, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    }
    const len = bytes.length;
    if (bits % 32 || len * 8 != bits) {
      throw new Error(`Invalid bits: ${bits}, ${bytes.length}`);
    }

    this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), `${field}:int${bits}`);
    this.checkLength(len);

    this.byteView.set(bytes, this.offset);
    this.offset += len;
  }

  storeRawBytes(bytes, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes);
    }
    const len = bytes.length;

    this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), field);
    this.checkLength(len);

    this.byteView.set(bytes, this.offset);
    this.offset += len;
  }

  storeMethod(methodName, params) {
    const schema = this.mtproto ? Config.Schema.MTProto : Config.Schema.API;
    let methodData = false;

    for (let i = 0; i < schema.methods.length; i++) {
      if (schema.methods[i].method == methodName) {
        methodData = schema.methods[i];
        break;
      }
    }
    if (!methodData) {
      throw new Error(`No method ${methodName} found`);
    }

    this.storeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["d" /* intToUint */])(methodData.id), `${methodName}[id]`);

    let param, type;
    let condType;
    let fieldBit;
    const len = methodData.params.length;
    for (let i = 0; i < len; i++) {
      param = methodData.params[i];
      type = param.type;
      if (type.indexOf('?') !== -1) {
        condType = type.split('?');
        fieldBit = condType[0].split('.');
        if (!(params[fieldBit[0]] & 1 << fieldBit[1])) {
          continue;
        }
        type = condType[1];
      }

      this.storeObject(params[param.name], type, `${methodName}[${param.name}]`);
    }

    return methodData.type;
  }

  storeObject(obj, type, field) {
    switch (type) {
      case '#':
      case 'int':
        return this.storeInt(obj, field);
      case 'long':
        return this.storeLong(obj, field);
      case 'int128':
        return this.storeIntBytes(obj, 128, field);
      case 'int256':
        return this.storeIntBytes(obj, 256, field);
      case 'int512':
        return this.storeIntBytes(obj, 512, field);
      case 'string':
        return this.storeString(obj, field);
      case 'bytes':
        return this.storeBytes(obj, field);
      case 'double':
        return this.storeDouble(obj, field);
      case 'Bool':
        return this.storeBool(obj, field);
      case 'true':
        return;
    }

    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Array, obj)) {
      if (type.substr(0, 6) == 'Vector') {
        this.writeInt(0x1cb5c415, `${field}[id]`);
      } else if (type.substr(0, 6) != 'vector') {
        throw new Error(`Invalid vector type ${type}`);
      }
      const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
      this.writeInt(obj.length, `${field}[count]`);
      for (let i = 0; i < obj.length; i++) {
        this.storeObject(obj[i], itemType, `${field}[${i}]`);
      }
      return true;
    } else if (type.substr(0, 6).toLowerCase() == 'vector') {
      throw new Error('Invalid vector object');
    }

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Object, obj)) throw new Error(`Invalid object for type ${type}`);

    const schema = this.mtproto ? Config.Schema.MTProto : Config.Schema.API;
    const predicate = obj['_'];
    let isBare = false;
    let constructorData = false;

    if (isBare = type.charAt(0) == '%') type = type.substr(1);

    for (let i = 0; i < schema.constructors.length; i++) {
      if (schema.constructors[i].predicate == predicate) {
        constructorData = schema.constructors[i];
        break;
      }
    }
    if (!constructorData) throw new Error(`No predicate ${predicate} found`);

    if (predicate == type) isBare = true;

    if (!isBare) this.writeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["d" /* intToUint */])(constructorData.id), `${field}[${predicate}][id]`);

    let param;
    let condType;
    let fieldBit;
    const len = constructorData.params.length;
    for (let i = 0; i < len; i++) {
      param = constructorData.params[i];
      type = param.type;
      if (type.indexOf('?') !== -1) {
        condType = type.split('?');
        fieldBit = condType[0].split('.');
        if (!(obj[fieldBit[0]] & 1 << fieldBit[1])) {
          continue;
        }
        type = condType[1];
      }

      this.storeObject(obj[param.name], type, `${field}[${predicate}][${param.name}]`);
    }

    return constructorData.type;
  }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = TLSerialization;


class TLDeserialization {
  constructor(buffer, { mtproto = false, override = {} } = {}) {
    this.offset = 0; // in bytes
    this.override = override;

    this.buffer = buffer;
    this.intView = new Uint32Array(this.buffer);
    this.byteView = new Uint8Array(this.buffer);

    // this.debug = options.debug !== undefined ? options.debug : Config.Modes.debug
    this.mtproto = mtproto;
    return this;
  }

  readInt(field) {
    if (this.offset >= this.intView.length * 4) {
      throw new Error(`Nothing to fetch: ${field}`);
    }

    const i = this.intView[this.offset / 4];

    this.debug && console.log('<<<', i.toString(16), i, field);

    this.offset += 4;

    return i;
  }

  fetchInt(field = '') {
    return this.readInt(`${field}:int`);
  }

  fetchDouble(field = '') {
    const buffer = new ArrayBuffer(8);
    const intView = new Int32Array(buffer);
    const doubleView = new Float64Array(buffer);

    intView[0] = this.readInt(`${field}:double[low]`), intView[1] = this.readInt(`${field}:double[high]`);

    return doubleView[0];
  }

  fetchLong(field = '') {
    const iLow = this.readInt(`${field}:long[low]`);
    const iHigh = this.readInt(`${field}:long[high]`);

    const longDec = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["c" /* bigint */])(iHigh).shiftLeft(32).add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["c" /* bigint */])(iLow)).toString();

    return longDec;
  }

  fetchBool(field = '') {
    const i = this.readInt(`${field}:bool`);
    if (i == 0x997275b5) {
      return true;
    } else if (i == 0xbc799737) {
      return false;
    }

    this.offset -= 4;
    return this.fetchObject('Object', field);
  }

  fetchString(field = '') {
    let len = this.byteView[this.offset++];

    if (len == 254) {
      len = this.byteView[this.offset++] | this.byteView[this.offset++] << 8 | this.byteView[this.offset++] << 16;
    }

    let sUTF8 = '';
    for (let i = 0; i < len; i++) {
      sUTF8 += String.fromCharCode(this.byteView[this.offset++]);
    }

    // Padding
    while (this.offset % 4) {
      this.offset++;
    }
    let s;
    try {
      s = decodeURIComponent(escape(sUTF8));
    } catch (e) {
      s = sUTF8;
    }

    this.debug && console.log('<<<', s, `${field}:string`);

    return s;
  }

  fetchBytes(field = '') {
    let len = this.byteView[this.offset++];

    if (len == 254) {
      len = this.byteView[this.offset++] | this.byteView[this.offset++] << 8 | this.byteView[this.offset++] << 16;
    }

    const bytes = this.byteView.subarray(this.offset, this.offset + len);
    this.offset += len;

    // Padding
    while (this.offset % 4) {
      this.offset++;
    }

    this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), `${field}:bytes`);

    return bytes;
  }

  fetchIntBytes(bits, typed, field = '') {
    if (bits % 32) {
      throw new Error(`Invalid bits: ${bits}`);
    }

    const len = bits / 8;
    if (typed) {
      const result = this.byteView.subarray(this.offset, this.offset + len);
      this.offset += len;
      return result;
    }

    const bytes = [];
    for (let i = 0; i < len; i++) {
      bytes.push(this.byteView[this.offset++]);
    }

    this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), `${field}:int${bits}`);

    return bytes;
  }

  fetchRawBytes(len, typed, field = '') {
    if (len === false) {
      len = this.readInt(`${field}_length`);
      if (len > this.byteView.byteLength) throw new Error(`Invalid raw bytes length: ${len}, buffer len: ${this.byteView.byteLength}`);
    }
    let bytes;
    if (typed) {
      bytes = new Uint8Array(len);
      bytes.set(this.byteView.subarray(this.offset, this.offset + len));
      this.offset += len;
      return bytes;
    }

    bytes = [];
    for (let i = 0; i < len; i++) bytes.push(this.byteView[this.offset++]);

    this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(bytes), field);

    return bytes;
  }

  fetchObject(type, field) {
    switch (type) {
      case '#':
      case 'int':
        return this.fetchInt(field);
      case 'long':
        return this.fetchLong(field);
      case 'int128':
        return this.fetchIntBytes(128, false, field);
      case 'int256':
        return this.fetchIntBytes(256, false, field);
      case 'int512':
        return this.fetchIntBytes(512, false, field);
      case 'string':
        return this.fetchString(field);
      case 'bytes':
        return this.fetchBytes(field);
      case 'double':
        return this.fetchDouble(field);
      case 'Bool':
        return this.fetchBool(field);
      case 'true':
        return true;
    }
    let fallback;
    field = field || type || 'Object';

    if (type.substr(0, 6) == 'Vector' || type.substr(0, 6) == 'vector') {
      if (type.charAt(0) == 'V') {
        const constructor = this.readInt(`${field}[id]`);
        const constructorCmp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["f" /* uintToInt */])(constructor);

        if (constructorCmp == 0x3072cfa1) {
          // Gzip packed
          const compressed = this.fetchBytes(`${field}[packed_string]`);
          const uncompressed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["g" /* gzipUncompress */])(compressed);
          const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["h" /* bytesToArrayBuffer */])(uncompressed);
          const newDeserializer = new TLDeserialization(buffer);

          return newDeserializer.fetchObject(type, field);
        }
        if (constructorCmp != 0x1cb5c415) {
          throw new Error(`Invalid vector constructor ${constructor}`);
        }
      }
      const len = this.readInt(`${field}[count]`);
      const result = [];
      if (len > 0) {
        const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
        for (let i = 0; i < len; i++) result.push(this.fetchObject(itemType, `${field}[${i}]`));
      }

      return result;
    }

    const schema = this.mtproto ? Config.Schema.MTProto : Config.Schema.API;
    let predicate = false;
    let constructorData = false;

    if (type.charAt(0) == '%') {
      const checkType = type.substr(1);
      for (let i = 0; i < schema.constructors.length; i++) {
        if (schema.constructors[i].type == checkType) {
          constructorData = schema.constructors[i];
          break;
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found for type: ${type}`);
      }
    } else if (type.charAt(0) >= 97 && type.charAt(0) <= 122) {
      for (let i = 0; i < schema.constructors.length; i++) {
        if (schema.constructors[i].predicate == type) {
          constructorData = schema.constructors[i];
          break;
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found for predicate: ${type}`);
      }
    } else {
      const constructor = this.readInt(`${field}[id]`);
      const constructorCmp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["f" /* uintToInt */])(constructor);

      if (constructorCmp == 0x3072cfa1) {
        // Gzip packed
        const compressed = this.fetchBytes(`${field}[packed_string]`);
        const uncompressed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["g" /* gzipUncompress */])(compressed);
        const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["h" /* bytesToArrayBuffer */])(uncompressed);
        const newDeserializer = new TLDeserialization(buffer);

        return newDeserializer.fetchObject(type, field);
      }

      let index = schema.constructorsIndex;
      if (!index) {
        schema.constructorsIndex = index = {};
        for (let i = 0; i < schema.constructors.length; i++) {
          index[schema.constructors[i].id] = i;
        }
      }
      let i = index[constructorCmp];
      if (i) {
        constructorData = schema.constructors[i];
      }

      fallback = false;
      if (!constructorData && this.mtproto) {
        const schemaFallback = Config.Schema.API;
        for (i = 0; i < schemaFallback.constructors.length; i++) {
          if (schemaFallback.constructors[i].id == constructorCmp) {
            constructorData = schemaFallback.constructors[i];

            delete this.mtproto;
            fallback = true;
            break;
          }
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found: ${constructor} ${this.fetchInt()} ${this.fetchInt()}`);
      }
    }

    predicate = constructorData.predicate;

    const result = { '_': predicate };
    const overrideKey = (this.mtproto ? 'mt_' : '') + predicate;
    const self = this;

    if (this.override[overrideKey]) {
      this.override[overrideKey].apply(this, [result, `${field}[${predicate}]`]);
    } else {
      let param, isCond;
      let condType, fieldBit;
      let value;
      const len = constructorData.params.length;
      for (let i = 0; i < len; i++) {
        param = constructorData.params[i];
        type = param.type;
        if (type == '#' && result.pFlags === undefined) {
          result.pFlags = {};
        }
        if (isCond = type.indexOf('?') !== -1) {
          condType = type.split('?');
          fieldBit = condType[0].split('.');
          if (!(result[fieldBit[0]] & 1 << fieldBit[1])) {
            continue;
          }
          type = condType[1];
        }

        value = self.fetchObject(type, `${field}[${predicate}][${param.name}]`);

        if (isCond && type === 'true') {
          result.pFlags[param.name] = value;
        } else {
          result[param.name] = value;
        }
      }
    }

    if (fallback) {
      this.mtproto = true;
    }

    return result;
  }

  getOffset() {
    return this.offset;
  }

  fetchEnd() {
    if (this.offset != this.byteView.length) {
      throw new Error('Fetch end with non-empty buffer');
    }
    return true;
  }

}
/* harmony export (immutable) */ __webpack_exports__["b"] = TLDeserialization;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_node__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__smart_timeout__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bin__ = __webpack_require__(1);







const convertIfArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["when"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Array), __WEBPACK_IMPORTED_MODULE_4__bin__["i" /* convertToUint8Array */]);
let webWorker = false;
let taskID = 0;
const awaiting = {};
const webCrypto = __WEBPACK_IMPORTED_MODULE_1_detect_node___default.a ? false : window.crypto.subtle || window.crypto.webkitSubtle; //TODO remove browser depends
/* || window.msCrypto && window.msCrypto.subtle*/
let useSha1Crypto = true; //webCrypto && webCrypto.digest !== undefined
let useSha256Crypto = true; //webCrypto && webCrypto.digest !== undefined
const finalizeTask = (taskID, result) => {
  const deferred = awaiting[taskID];
  if (deferred !== undefined) {
    // console.log(rework_d_T(), 'CW done')
    deferred.resolve(result);
    delete awaiting[taskID];
  }
};
// window.Worker
const workerEnable = false;
if (workerEnable) {
  //TODO worker disabled here
  const tmpWorker = new Worker('js/lib/crypto_worker.js');
  tmpWorker.onmessage = e => webWorker ? finalizeTask(e.data.taskID, e.data.result) : webWorker = tmpWorker;
  tmpWorker.onerror = error => {
    console.error('CW error', error, error.stack);
    webWorker = false;
  };
}

const performTaskWorker = (task, params, embed) => {
  // console.log(rework_d_T(), 'CW start', task)
  const deferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__defer__["b" /* default */])();

  awaiting[taskID] = deferred;

  params.task = task;
  params.taskID = taskID;(embed || webWorker).postMessage(params);

  taskID++;

  return deferred.promise;
};

const sha1Hash = bytes => {
  if (useSha1Crypto) {
    // We don't use buffer since typedArray.subarray(...).buffer gives the whole buffer and not sliced one.
    // webCrypto.digest supports typed array
    const bytesTyped = convertIfArray(bytes);
    // console.log(rework_d_T(), 'Native sha1 start')
    return webCrypto.digest({ name: 'SHA-1' }, bytesTyped).then(digest =>
    // console.log(rework_d_T(), 'Native sha1 done')
    digest, e => {
      console.error('Crypto digest error', e);
      useSha1Crypto = false;
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["p" /* sha1HashSync */])(bytes);
    });
  }
  return __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(__WEBPACK_IMPORTED_MODULE_4__bin__["p" /* sha1HashSync */], 0, bytes);
};

const sha256Hash = bytes => {
  if (useSha256Crypto) {
    const bytesTyped = convertIfArray(bytes);
    // console.log(rework_d_T(), 'Native sha1 start')
    return webCrypto.digest({ name: 'SHA-256' }, bytesTyped).then(__WEBPACK_IMPORTED_MODULE_0_ramda__["identity"]
    // console.log(rework_d_T(), 'Native sha1 done')
    , e => {
      console.error('Crypto digest error', e);
      useSha256Crypto = false;
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["q" /* sha256HashSync */])(bytes);
    });
  }
  return __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(__WEBPACK_IMPORTED_MODULE_4__bin__["q" /* sha256HashSync */], 0, bytes);
};

const aesEncrypt = (bytes, keyBytes, ivBytes) => __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["j" /* convertToArrayBuffer */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["r" /* aesEncryptSync */])(bytes, keyBytes, ivBytes)));

const aesDecrypt = (encryptedBytes, keyBytes, ivBytes) => __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["j" /* convertToArrayBuffer */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["s" /* aesDecryptSync */])(encryptedBytes, keyBytes, ivBytes)));

const factorize = bytes => {
  bytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["t" /* convertToByteArray */])(bytes);
  return webWorker ? performTaskWorker('factorize', { bytes }) : __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["u" /* pqPrimeFactorization */])(bytes));
};

const modPow = (x, y, m) => webWorker ? performTaskWorker('mod-pow', {
  x,
  y,
  m
}) : __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].promise(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["v" /* bytesModPow */])(x, y, m));

const CryptoWorker = {
  sha1Hash,
  sha256Hash,
  aesEncrypt,
  aesDecrypt,
  factorize,
  modPow
};
/* harmony export (immutable) */ __webpack_exports__["a"] = CryptoWorker;


/* harmony default export */ __webpack_exports__["b"] = CryptoWorker;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


const httpClient = __WEBPACK_IMPORTED_MODULE_0_axios___default.a.create();
/* harmony export (immutable) */ __webpack_exports__["a"] = httpClient;

delete httpClient.defaults.headers.post['Content-Type'];
delete httpClient.defaults.headers.common['Accept'];

/* harmony default export */ __webpack_exports__["b"] = httpClient;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const sslSubdomains = ['pluto', 'venus', 'aurora', 'vesta', 'flora'];

const dcOptions = Config.Modes.test ? [{ id: 1, host: '149.154.175.10', port: 80 }, { id: 2, host: '149.154.167.40', port: 80 }, { id: 3, host: '149.154.175.117', port: 80 }] : [{ id: 1, host: '149.154.175.50', port: 80 }, { id: 2, host: '149.154.167.51', port: 80 }, { id: 3, host: '149.154.175.100', port: 80 }, { id: 4, host: '149.154.167.91', port: 80 }, { id: 5, host: '149.154.171.5', port: 80 }];

const chosenServers = {};

const chooseServer = (dcID, upload) => {
  if (chosenServers[dcID] === undefined) {
    let chosenServer = false,
        i,
        dcOption;

    if (Config.Modes.ssl || !Config.Modes.http) {
      const subdomain = sslSubdomains[dcID - 1] + (upload ? '-1' : '');
      const path = Config.Modes.test ? 'apiw_test1' : 'apiw1';
      chosenServer = `https://${subdomain}.web.telegram.org/${path}`;
      return chosenServer;
    }

    for (i = 0; i < dcOptions.length; i++) {
      dcOption = dcOptions[i];
      if (dcOption.id == dcID) {
        chosenServer = `http://${dcOption.host}${dcOption.port != 80 ? `:${dcOption.port}` : ''}/apiw1`;
        break;
      }
    }
    chosenServers[dcID] = chosenServer;
  }

  return chosenServers[dcID];
};
/* harmony export (immutable) */ __webpack_exports__["chooseServer"] = chooseServer;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jsbn__);


const random = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["SecureRandom"]();
/* unused harmony export random */


/* harmony default export */ __webpack_exports__["a"] = random;

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);


const cancelToken = Symbol('cancel token');

const timeoutRefs = new WeakSet();

const pause = delay => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(r => setTimeout(r, delay));

const smartTimeout = (fn, delay, ...args) => {
  const newToken = Symbol('cancel id');
  const checkRun = () => {
    if (timeoutRefs.has(newToken)) {
      timeoutRefs.delete(newToken);
      return fn(...args);
    } else return false;
  };
  const promise = pause(delay).then(checkRun);
  promise[cancelToken] = newToken;
  return promise;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = smartTimeout;


smartTimeout.cancel = promise => {
  if (!promise || !promise[cancelToken]) return false;
  const token = promise[cancelToken];
  return timeoutRefs.has(token) ? timeoutRefs.delete(token) : false;
};

smartTimeout.promise = (fn, delay = 0, ...args) => pause(delay).then(() => fn(...args));

/* harmony default export */ __webpack_exports__["b"] = smartTimeout;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(129);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);


const indexedMap = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["addIndex"])(__WEBPACK_IMPORTED_MODULE_0_ramda__["map"]);
const forEach = (data, func) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["reject"])(__WEBPACK_IMPORTED_MODULE_0_ramda__["isNil"]), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["ifElse"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Array), indexedMap(func), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["mapObjIndexed"])(func)))(data);
/* harmony export (immutable) */ __webpack_exports__["a"] = forEach;


/* harmony default export */ __webpack_exports__["b"] = forEach;

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsbn__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsbn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jsbn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__http__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__crypto__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__secure_random__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tl__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dc_configurator__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__rsa_keys_manger__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__bin__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "auth", function() { return mtpAuth; });


const { BigInteger } = __WEBPACK_IMPORTED_MODULE_1_jsbn___default.a;














function mtpSendPlainRequest(dcID, requestBuffer) {
  const requestLength = requestBuffer.byteLength,
        requestArray = new Int32Array(requestBuffer);

  const header = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]();
  header.storeLongP(0, 0, 'auth_key_id'); // Auth key
  header.storeLong(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["generateID"])(), 'msg_id'); // Msg_id
  header.storeInt(requestLength, 'request_length');

  const headerBuffer = header.getBuffer(),
        headerArray = new Int32Array(headerBuffer);
  const headerLength = headerBuffer.byteLength;

  const resultBuffer = new ArrayBuffer(headerLength + requestLength),
        resultArray = new Int32Array(resultBuffer);

  resultArray.set(headerArray);
  resultArray.set(requestArray, headerArray.length);

  const requestData = resultArray;
  let requestPromise;
  const url = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__dc_configurator__["chooseServer"])(dcID);
  const baseError = { code: 406, type: 'NETWORK_BAD_RESPONSE', url: url };
  try {
    requestPromise = __WEBPACK_IMPORTED_MODULE_3__http__["b" /* default */].post(url, requestData, {
      responseType: 'arraybuffer'
    });
  } catch (e) {
    requestPromise = __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(Object.assign({ originalError: e }, baseError));
  }
  return requestPromise.then(result => {
    if (!result.data || !result.data.byteLength) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(baseError);
    let deserializer;
    try {
      deserializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["b" /* TLDeserialization */](result.data, { mtproto: true });
      const auth_key_id = deserializer.fetchLong('auth_key_id');
      const msg_id = deserializer.fetchLong('msg_id');
      const msg_len = deserializer.fetchInt('msg_len');
    } catch (e) {
      return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(Object.assign({ originalError: e }, baseError));
    }

    return deserializer;
  }, error => {
    if (!error.message && !error.type) {
      error = Object.assign({ originalError: error }, baseError);
    }
    return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(error);
  });
}

function mtpSendReqPQ(auth) {
  console.warn('mtpSendReqPQ');
  const deferred = auth.deferred;

  const request = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });

  request.storeMethod('req_pq', { nonce: auth.nonce });

  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Send req_pq', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["e" /* bytesToHex */])(auth.nonce));
  mtpSendPlainRequest(auth.dcID, request.getBuffer()).then(function (deserializer) {
    const response = deserializer.fetchObject('ResPQ');

    if (response._ != 'resPQ') {
      throw new Error(`[MT] resPQ response invalid: ${response._}`);
    }

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.nonce, response.nonce)) {
      throw new Error('[MT] resPQ nonce mismatch');
    }

    auth.serverNonce = response.server_nonce;
    auth.pq = response.pq;
    auth.fingerprints = response.server_public_key_fingerprints;

    console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Got ResPQ', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["e" /* bytesToHex */])(auth.serverNonce), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["e" /* bytesToHex */])(auth.pq), auth.fingerprints);

    auth.publicKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__rsa_keys_manger__["a" /* select */])(auth.fingerprints);

    if (!auth.publicKey) throw new Error('[MT] No public key found');

    console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'PQ factorization start', auth.pq);
    __WEBPACK_IMPORTED_MODULE_4__crypto__["b" /* default */].factorize(auth.pq).then(([p, q, it]) => {
      auth.p = p;
      auth.q = q;
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'PQ factorization done', it);
      mtpSendReqDhParams(auth);
    }, function (error) {
      console.log('Worker error', error, error.stack);
      deferred.reject(error);
    });
  }, function (error) {
    console.error(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'req_pq error', error.message);
    deferred.reject(error);
  });

  setTimeout(__WEBPACK_IMPORTED_MODULE_9__rsa_keys_manger__["b" /* prepare */], 0);
}

function mtpSendReqDhParams(auth) {
  const deferred = auth.deferred;

  auth.newNonce = new Array(32);
  __WEBPACK_IMPORTED_MODULE_5__secure_random__["a" /* default */].nextBytes(auth.newNonce);

  const data = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
  data.storeObject({
    _: 'p_q_inner_data',
    pq: auth.pq,
    p: auth.p,
    q: auth.q,
    nonce: auth.nonce,
    server_nonce: auth.serverNonce,
    new_nonce: auth.newNonce
  }, 'P_Q_inner_data', 'DECRYPTED_DATA');

  const dataWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(data.getBuffer()).concat(data.getBytes());

  const request = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
  request.storeMethod('req_DH_params', {
    nonce: auth.nonce,
    server_nonce: auth.serverNonce,
    p: auth.p,
    q: auth.q,
    public_key_fingerprint: auth.publicKey.fingerprint,
    encrypted_data: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["w" /* rsaEncrypt */])(auth.publicKey, dataWithHash)
  });

  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Send req_DH_params');
  mtpSendPlainRequest(auth.dcID, request.getBuffer()).then(function (deserializer) {
    const response = deserializer.fetchObject('Server_DH_Params', 'RESPONSE');

    if (response._ != 'server_DH_params_fail' && response._ != 'server_DH_params_ok') {
      deferred.reject(new Error(`[MT] Server_DH_Params response invalid: ${response._}`));
      return false;
    }

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.nonce, response.nonce)) {
      deferred.reject(new Error('[MT] Server_DH_Params nonce mismatch'));
      return false;
    }

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) {
      deferred.reject(new Error('[MT] Server_DH_Params server_nonce mismatch'));
      return false;
    }

    if (response._ == 'server_DH_params_fail') {
      const newNonceHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.newNonce).slice(-16);
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(newNonceHash, response.new_nonce_hash)) {
        deferred.reject(new Error('[MT] server_DH_params_fail new_nonce_hash mismatch'));
        return false;
      }
      deferred.reject(new Error('[MT] server_DH_params_fail'));
      return false;
    }

    try {
      mtpDecryptServerDhDataAnswer(auth, response.encrypted_answer);
    } catch (e) {
      deferred.reject(e);
      return false;
    }

    mtpSendSetClientDhParams(auth);
  }, function (error) {
    deferred.reject(error);
  });
}

function mtpDecryptServerDhDataAnswer(auth, encryptedAnswer) {
  auth.localTime = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["tsNow"])();

  auth.tmpAesKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.newNonce.concat(auth.serverNonce)).concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.serverNonce.concat(auth.newNonce)).slice(0, 12));
  auth.tmpAesIv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.serverNonce.concat(auth.newNonce)).slice(12).concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])([].concat(auth.newNonce, auth.newNonce)), auth.newNonce.slice(0, 4));

  const answerWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["s" /* aesDecryptSync */])(encryptedAnswer, auth.tmpAesKey, auth.tmpAesIv);

  const hash = answerWithHash.slice(0, 20);
  const answerWithPadding = answerWithHash.slice(20);
  const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["h" /* bytesToArrayBuffer */])(answerWithPadding);

  const deserializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["b" /* TLDeserialization */](buffer, { mtproto: true });
  const response = deserializer.fetchObject('Server_DH_inner_data');

  if (response._ != 'server_DH_inner_data') {
    throw new Error(`[MT] server_DH_inner_data response invalid: ${constructor}`);
  }

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.nonce, response.nonce)) {
    throw new Error('[MT] server_DH_inner_data nonce mismatch');
  }

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) {
    throw new Error('[MT] server_DH_inner_data serverNonce mismatch');
  }

  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Done decrypting answer');
  auth.g = response.g;
  auth.dhPrime = response.dh_prime;
  auth.gA = response.g_a;
  auth.serverTime = response.server_time;
  auth.retry = 0;

  mtpVerifyDhParams(auth.g, auth.dhPrime, auth.gA);

  const offset = deserializer.getOffset();

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(hash, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(answerWithPadding.slice(0, offset)))) {
    throw new Error('[MT] server_DH_inner_data SHA1-hash mismatch');
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["applyServerTime"])(auth.serverTime, auth.localTime);
}

function mtpVerifyDhParams(g, dhPrime, gA) {
  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Verifying DH params');
  const dhPrimeHex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["e" /* bytesToHex */])(dhPrime);
  if (g != 3 || dhPrimeHex !== 'c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b') {
    // The verified value is from https://core.telegram.org/mtproto/security_guidelines
    throw new Error('[MT] DH params are not verified: unknown dhPrime');
  }
  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'dhPrime cmp OK');

  const gABigInt = new BigInteger(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["e" /* bytesToHex */])(gA), 16);
  const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16);

  if (gABigInt.compareTo(BigInteger.ONE) <= 0) {
    throw new Error('[MT] DH params are not verified: gA <= 1');
  }

  if (gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0) {
    throw new Error('[MT] DH params are not verified: gA >= dhPrime - 1');
  }
  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), '1 < gA < dhPrime-1 OK');

  const two = new BigInteger(null);
  two.fromInt(2);
  const twoPow = two.pow(2048 - 64);

  if (gABigInt.compareTo(twoPow) < 0) {
    throw new Error('[MT] DH params are not verified: gA < 2^{2048-64}');
  }
  if (gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0) {
    throw new Error('[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}');
  }
  console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), '2^{2048-64} < gA < dhPrime-2^{2048-64} OK');

  return true;
}

function mtpSendSetClientDhParams(auth) {
  const deferred = auth.deferred;
  const gBytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["x" /* bytesFromHex */])(auth.g.toString(16));

  auth.b = new Array(256);
  __WEBPACK_IMPORTED_MODULE_5__secure_random__["a" /* default */].nextBytes(auth.b);

  __WEBPACK_IMPORTED_MODULE_4__crypto__["b" /* default */].modPow(gBytes, auth.b, auth.dhPrime).then(function (gB) {
    const data = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
    data.storeObject({
      _: 'client_DH_inner_data',
      nonce: auth.nonce,
      server_nonce: auth.serverNonce,
      retry_id: [0, auth.retry++],
      g_b: gB
    }, 'Client_DH_Inner_Data');

    const dataWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(data.getBuffer()).concat(data.getBytes());

    const encryptedData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["r" /* aesEncryptSync */])(dataWithHash, auth.tmpAesKey, auth.tmpAesIv);

    const request = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
    request.storeMethod('set_client_DH_params', {
      nonce: auth.nonce,
      server_nonce: auth.serverNonce,
      encrypted_data: encryptedData
    });

    console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Send set_client_DH_params');
    mtpSendPlainRequest(auth.dcID, request.getBuffer()).then(function (deserializer) {
      const response = deserializer.fetchObject('Set_client_DH_params_answer');

      if (response._ != 'dh_gen_ok' && response._ != 'dh_gen_retry' && response._ != 'dh_gen_fail') {
        deferred.reject(new Error(`[MT] Set_client_DH_params_answer response invalid: ${response._}`));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.nonce, response.nonce)) {
        deferred.reject(new Error('[MT] Set_client_DH_params_answer nonce mismatch'));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) {
        deferred.reject(new Error('[MT] Set_client_DH_params_answer server_nonce mismatch'));
        return false;
      }

      __WEBPACK_IMPORTED_MODULE_4__crypto__["b" /* default */].modPow(auth.gA, auth.b, auth.dhPrime).then(function (authKey) {
        const authKeyHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(authKey),
              authKeyAux = authKeyHash.slice(0, 8),
              authKeyID = authKeyHash.slice(-8);

        console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Got Set_client_DH_params_answer', response._);
        switch (response._) {
          case 'dh_gen_ok':
            {
              const newNonceHash1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.newNonce.concat([1], authKeyAux)).slice(-16);

              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(newNonceHash1, response.new_nonce_hash1)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch'));
                return false;
              }

              const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["y" /* bytesXor */])(auth.newNonce.slice(0, 8), auth.serverNonce.slice(0, 8));
              // console.log('Auth successfull!', authKeyID, authKey, serverSalt)

              auth.authKeyID = authKeyID;
              auth.authKey = authKey;
              auth.serverSalt = serverSalt;

              deferred.resolve(auth);
              break;
            }
          case 'dh_gen_retry':
            {
              const newNonceHash2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.newNonce.concat([2], authKeyAux)).slice(-16);
              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(newNonceHash2, response.new_nonce_hash2)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch'));
                return false;
              }

              return mtpSendSetClientDhParams(auth);
            }
          case 'dh_gen_fail':
            {
              const newNonceHash3 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["k" /* sha1BytesSync */])(auth.newNonce.concat([3], authKeyAux)).slice(-16);
              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["l" /* bytesCmp */])(newNonceHash3, response.new_nonce_hash3)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch'));
                return false;
              }

              deferred.reject(new Error('[MT] Set_client_DH_params_answer fail'));
              return false;
            }
        }
      }, function (error) {
        deferred.reject(error);
      });
    }, function (error) {
      deferred.reject(error);
    });
  }, function (error) {
    deferred.reject(error);
  });
}

const cached = {};

function mtpAuth(dcID) {
  console.count('mtpAuth');
  if (cached[dcID] !== undefined) {
    return cached[dcID].promise;
  }
  console.warn('mtpAuth');
  const nonce = [];
  for (let i = 0; i < 16; i++) {
    nonce.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__bin__["o" /* nextRandomInt */])(0xFF));
  }

  if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__dc_configurator__["chooseServer"])(dcID)) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(new Error(`[MT] No server found for dc ${dcID}`));

  const auth = {
    dcID: dcID,
    nonce: nonce,
    deferred: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__defer__["b" /* default */])()
  };

  setImmediate(() => mtpSendReqPQ(auth));

  cached[dcID] = auth.deferred;

  cached[dcID].promise.catch(() => {
    delete cached[dcID];
  });

  return cached[dcID].promise;
}


/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(17).setImmediate))

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__crypto__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__secure_random__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__for_each__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tl__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__smart_timeout__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__http__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__dc_configurator__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__store__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__bin__ = __webpack_require__(1);

















let updatesProcessor;
let iii = 0;
let offlineInited = false;
let akStopped = false;
// const chromeMatches = navigator.userAgent.match(/Chrome\/(\d+(\.\d+)?)/)
// const chromeVersion = chromeMatches && parseFloat(chromeMatches[1]) || false
// const xhrSendBuffer = !('ArrayBufferView' in window) && (!chromeVersion || chromeVersion < 30)
class MtpNetworker {
  constructor(dcID, authKey, serverSalt, options = {}) {
    _initialiseProps.call(this);

    this.dcID = dcID;
    this.iii = iii++;

    this.authKey = authKey;
    this.authKeyUint8 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["i" /* convertToUint8Array */])(authKey);
    this.authKeyBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["j" /* convertToArrayBuffer */])(authKey);
    this.authKeyID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["k" /* sha1BytesSync */])(authKey).slice(-8);

    this.serverSalt = serverSalt;

    this.upload = options.fileUpload || options.fileDownload || false;

    this.updateSession();

    this.lastServerMessages = [];

    this.currentRequests = 0;
    this.checkConnectionPeriod = 0;

    this.sentMessages = {};
    this.clientMessages = [];

    this.pendingMessages = {};
    this.pendingAcks = [];
    this.pendingResends = [];
    this.connectionInited = false;

    this.pendingTimeouts = [];

    setInterval(this.checkLongPoll, 10000);
    this.checkLongPoll();

    if (!offlineInited) offlineInited = true;
  }
  updateSession() {
    this.seqNo = 0;
    this.prevSessionID = this.sessionID;
    this.sessionID = new Array(8);
    __WEBPACK_IMPORTED_MODULE_4__secure_random__["a" /* default */].nextBytes(this.sessionID);
  }

  updateSentMessage(sentMessageID) {
    const sentMessage = this.sentMessages[sentMessageID];
    if (!sentMessage) return false;

    if (sentMessage.container) {
      const newInner = [];
      const updateInner = innerSentMessageID => {
        const innerSentMessage = this.updateSentMessage(innerSentMessageID);
        if (innerSentMessage) newInner.push(innerSentMessage.msg_id);
      };
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(sentMessage.inner, updateInner);
      sentMessage.inner = newInner;
    }

    sentMessage.msg_id = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
    sentMessage.seq_no = this.generateSeqNo(sentMessage.notContentRelated || sentMessage.container);
    this.sentMessages[sentMessage.msg_id] = sentMessage;
    delete this.sentMessages[sentMessageID];

    return sentMessage;
  }

  generateSeqNo(notContentRelated) {
    let seqNo = this.seqNo * 2;

    if (!notContentRelated) {
      seqNo++;
      this.seqNo++;
    }

    return seqNo;
  }

  wrapMtpCall(method, params, options) {
    const serializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });

    serializer.storeMethod(method, params);

    const messageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
    const seqNo = this.generateSeqNo();
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes()
    };

    if (Config.Modes.debug) {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'MT call', method, params, messageID, seqNo);
    }

    return this.pushMessage(message, options);
  }

  wrapMtpMessage(object, options = {}) {

    const serializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
    serializer.storeObject(object, 'Object');

    const messageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
    const seqNo = this.generateSeqNo(options.notContentRelated);
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes()
    };

    if (Config.Modes.debug) {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'MT message', object, messageID, seqNo);
    }

    return this.pushMessage(message, options);
  }

  wrapApiCall(method, params, options) {
    const serializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */](options);

    if (!this.connectionInited) {
      serializer.storeInt(0xda9b0d0d, 'invokeWithLayer');
      serializer.storeInt(Config.Schema.API.layer, 'layer');
      serializer.storeInt(0x69796de9, 'initConnection');
      serializer.storeInt(Config.App.id, 'api_id');
      serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model');
      serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version');
      serializer.storeString(Config.App.version, 'app_version');
      serializer.storeString(navigator.language || 'en', 'lang_code');
    }

    if (options.afterMessageID) {
      serializer.storeInt(0xcb9f372d, 'invokeAfterMsg');
      serializer.storeLong(options.afterMessageID, 'msg_id');
    }

    options.resultType = serializer.storeMethod(method, params);

    const messageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
    const seqNo = this.generateSeqNo();
    const message = {
      msg_id: messageID,
      seq_no: seqNo,
      body: serializer.getBytes(true),
      isAPI: true
    };

    if (Config.Modes.debug) {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Api call', method, params, messageID, seqNo, options);
    } else {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Api call', method);
    }

    return this.pushMessage(message, options);
  }

  sendLongPoll() {
    const maxWait = 25000;
    const self = this;

    this.longPollPending = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + maxWait;
    // console.log('Set lp', this.longPollPending, tsNow())

    this.wrapMtpCall('http_wait', {
      max_delay: 500,
      wait_after: 150,
      max_wait: maxWait
    }, {
      noResponse: true,
      longPoll: true
    }).then(function () {
      delete self.longPollPending;
      setImmediate(self.checkLongPoll);
    }, function () {
      console.log('Long-poll failed');
    });
  }

  pushMessage(message, options = {}) {
    const deferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__defer__["b" /* default */])();

    this.sentMessages[message.msg_id] = Object.assign({}, message, options, { deferred });
    this.pendingMessages[message.msg_id] = 0;

    if (!options || !options.noShedule) {
      this.sheduleRequest();
    }
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Object, options)) {
      options.messageID = message.msg_id;
    }

    return deferred.promise;
  }

  pushResend(messageID, delay) {
    const value = delay ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + delay : 0;
    const sentMessage = this.sentMessages[messageID];
    if (sentMessage.container) {
      for (let i = 0; i < sentMessage.inner.length; i++) {
        this.pendingMessages[sentMessage.inner[i]] = value;
      }
    } else {
      this.pendingMessages[messageID] = value;
    }

    // console.log('Resend due', messageID, this.pendingMessages)

    this.sheduleRequest(delay);
  }

  getMsgKeyIv(msgKey, isOut) {
    const authKey = this.authKeyUint8;
    const x = isOut ? 0 : 8;
    const sha1aText = new Uint8Array(48);
    const sha1bText = new Uint8Array(48);
    const sha1cText = new Uint8Array(48);
    const sha1dText = new Uint8Array(48);
    const promises = {};

    sha1aText.set(msgKey, 0);
    sha1aText.set(authKey.subarray(x, x + 32), 16);
    promises.sha1a = __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(sha1aText);

    sha1bText.set(authKey.subarray(x + 32, x + 48), 0);
    sha1bText.set(msgKey, 16);
    sha1bText.set(authKey.subarray(x + 48, x + 64), 32);
    promises.sha1b = __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(sha1bText);

    sha1cText.set(authKey.subarray(x + 64, x + 96), 0);
    sha1cText.set(msgKey, 32);
    promises.sha1c = __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(sha1cText);

    sha1dText.set(msgKey, 0);
    sha1dText.set(authKey.subarray(x + 96, x + 128), 16);
    promises.sha1d = __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(sha1dText);

    const onAll = result => {
      const aesKey = new Uint8Array(32),
            aesIv = new Uint8Array(32),
            sha1a = new Uint8Array(result[0]),
            sha1b = new Uint8Array(result[1]),
            sha1c = new Uint8Array(result[2]),
            sha1d = new Uint8Array(result[3]);

      aesKey.set(sha1a.subarray(0, 8));
      aesKey.set(sha1b.subarray(8, 20), 8);
      aesKey.set(sha1c.subarray(4, 16), 20);

      aesIv.set(sha1a.subarray(8, 20));
      aesIv.set(sha1b.subarray(0, 8), 12);
      aesIv.set(sha1c.subarray(16, 20), 20);
      aesIv.set(sha1d.subarray(0, 8), 24);

      return [aesKey, aesIv];
    };

    return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.all(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["values"])(promises)).then(onAll);
  }

  toggleOffline(enabled) {
    // console.log('toggle ', enabled, this.dcID, this.iii)
    if (this.offline !== undefined && this.offline == enabled) {
      return false;
    }

    this.offline = enabled;

    if (this.offline) {
      __WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */].cancel(this.nextReqPromise);
      delete this.nextReq;

      if (this.checkConnectionPeriod < 1.5) {
        this.checkConnectionPeriod = 0;
      }

      this.checkConnectionPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */])(this.checkConnection, parseInt(this.checkConnectionPeriod * 1000));
      this.checkConnectionPeriod = Math.min(30, (1 + this.checkConnectionPeriod) * 1.5);

      this.onOnlineCb = this.checkConnection;

      $(document.body).on('online focus', this.onOnlineCb);
    } else {
      delete this.longPollPending;
      this.checkLongPoll();
      this.sheduleRequest();

      if (this.onOnlineCb) {
        $(document.body).off('online focus', this.onOnlineCb);
      }
      __WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */].cancel(this.checkConnectionPromise);
    }
  }


  getEncryptedMessage(bytes) {
    let msgKey;
    const f1 = __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash;
    const f2 = bytesHash => {
      msgKey = new Uint8Array(bytesHash).subarray(4, 20);
      return this.getMsgKeyIv(msgKey, true);
    };
    const f3 = keyIv => __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].aesEncrypt(bytes, keyIv[0], keyIv[1]);
    const f4 = encryptedBytes => ({
      bytes: encryptedBytes,
      msgKey: msgKey
    });
    const encryptFlow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipeP"])(f1, f2, f3, f4);
    return encryptFlow(bytes);
  }

  getDecryptedMessage(msgKey, encryptedData) {
    const getKeyCurry = key => this.getMsgKeyIv(key, false);
    const cryptoAesCurry = keyIv => __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].aesDecrypt(encryptedData, keyIv[0], keyIv[1]);
    const decryptFlow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipeP"])(getKeyCurry, cryptoAesCurry);
    return decryptFlow(msgKey);
  }

  parseResponse(responseBuffer) {
    // console.log(dTime(), 'Start parsing response')
    // const self = this

    const deserializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["b" /* TLDeserialization */](responseBuffer);

    const authKeyID = deserializer.fetchIntBytes(64, false, 'auth_key_id');
    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["l" /* bytesCmp */])(authKeyID, this.authKeyID)) {
      throw new Error(`[MT] Invalid server auth_key_id: ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["e" /* bytesToHex */])(authKeyID)}`);
    }
    const msgKey = deserializer.fetchIntBytes(128, true, 'msg_key');
    const encryptedData = deserializer.fetchRawBytes(responseBuffer.byteLength - deserializer.getOffset(), true, 'encrypted_data');

    const afterDecrypt = dataWithPadding => {
      // console.log(dTime(), 'after decrypt')
      const deserializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["b" /* TLDeserialization */](dataWithPadding, { mtproto: true });

      const salt = deserializer.fetchIntBytes(64, false, 'salt');
      const sessionID = deserializer.fetchIntBytes(64, false, 'session_id');
      const messageID = deserializer.fetchLong('message_id');

      const isInvalidSession = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["l" /* bytesCmp */])(sessionID, this.sessionID) && (!this.prevSessionID || !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["l" /* bytesCmp */])(sessionID, this.prevSessionID));
      if (isInvalidSession) {
        console.warn('Sessions', sessionID, this.sessionID, this.prevSessionID);
        throw new Error(`[MT] Invalid server session_id: ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["e" /* bytesToHex */])(sessionID)}`);
      }

      const seqNo = deserializer.fetchInt('seq_no');

      let offset = deserializer.getOffset();
      const totalLength = dataWithPadding.byteLength;

      const messageBodyLength = deserializer.fetchInt('message_data[length]');
      if (messageBodyLength % 4 || messageBodyLength > totalLength - offset) {
        throw new Error(`[MT] Invalid body length: ${messageBodyLength}`);
      }
      const messageBody = deserializer.fetchRawBytes(messageBodyLength, true, 'message_data');

      offset = deserializer.getOffset();
      const paddingLength = totalLength - offset;
      if (paddingLength < 0 || paddingLength > 15) throw new Error(`[MT] Invalid padding length: ${paddingLength}`);
      const hashData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["i" /* convertToUint8Array */])(dataWithPadding).subarray(0, offset);

      const afterShaHash = dataHash => {
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["l" /* bytesCmp */])(msgKey, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["m" /* bytesFromArrayBuffer */])(dataHash).slice(-16))) {
          console.warn(msgKey, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["m" /* bytesFromArrayBuffer */])(dataHash));
          throw new Error('[MT] server msgKey mismatch');
        }

        const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["h" /* bytesToArrayBuffer */])(messageBody);
        const deserializerOptions = getDeserializeOpts(this.getMsgById);
        const deserializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["b" /* TLDeserialization */](buffer, deserializerOptions);
        const response = deserializer.fetchObject('', 'INPUT');

        return {
          response: response,
          messageID: messageID,
          sessionID: sessionID,
          seqNo: seqNo
        };
      };
      return __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(hashData).then(afterShaHash);
    };

    return this.getDecryptedMessage(msgKey, encryptedData).then(afterDecrypt);
  }

  applyServerSalt(newServerSalt) {
    const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["n" /* longToBytes */])(newServerSalt);

    const storeObj = {
      [`dc${this.dcID}_server_salt`]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["e" /* bytesToHex */])(serverSalt)
    };
    __WEBPACK_IMPORTED_MODULE_11__store__["a" /* PureStorage */].set(storeObj);

    this.serverSalt = serverSalt;
    return true;
  }

  sheduleRequest(delay = 0) {
    if (this.offline) this.checkConnection('forced shedule');
    const nextReq = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + delay;

    if (delay && this.nextReq && this.nextReq <= nextReq) return false;

    // console.log(dTime(), 'shedule req', delay)
    // console.trace()
    __WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */].cancel(this.nextReqPromise);
    if (delay > 0) this.nextReqPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */])(this.performSheduledRequest, delay);else setImmediate(this.performSheduledRequest);

    this.nextReq = nextReq;
  }

  ackMessage(msgID) {
    // console.log('ack message', msgID)
    this.pendingAcks.push(msgID);
    this.sheduleRequest(30000);
  }

  reqResendMessage(msgID) {
    console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Req resend', msgID);
    this.pendingResends.push(msgID);
    this.sheduleRequest(100);
  }

  cleanupSent() {
    let notEmpty = false;
    // console.log('clean start', this.dcID/*, this.sentMessages*/)
    const cleanMessages = (message, msgID) => {
      // console.log('clean iter', msgID, message)
      if (message.notContentRelated && this.pendingMessages[msgID] === undefined) {
        // console.log('clean notContentRelated', msgID)
        delete this.sentMessages[msgID];
      } else if (message.container) {
        for (let i = 0; i < message.inner.length; i++) {
          if (this.sentMessages[message.inner[i]] !== undefined) {
            // console.log('clean failed, found', msgID, message.inner[i], this.sentMessages[message.inner[i]].seq_no)
            notEmpty = true;
            return;
          }
        }
        // console.log('clean container', msgID)
        delete this.sentMessages[msgID];
      } else {
        notEmpty = true;
      }
    };
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(this.sentMessages, cleanMessages);

    return !notEmpty;
  }

  processError(rawError) {
    const matches = (rawError.error_message || '').match(/^([A-Z_0-9]+\b)(: (.+))?/) || [];
    rawError.error_code = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["f" /* uintToInt */])(rawError.error_code);

    return {
      code: !rawError.error_code || rawError.error_code <= 0 ? 500 : rawError.error_code,
      type: matches[1] || 'UNKNOWN',
      description: matches[3] || `CODE#${rawError.error_code} ${rawError.error_message}`,
      originalError: rawError
    };
  }

  processMessage(message, messageID, sessionID) {
    const msgidInt = parseInt(messageID.toString(10).substr(0, -10), 10);
    if (msgidInt % 2) {
      console.warn('[MT] Server even message id: ', messageID, message);
      return;
    }
    // console.log('process message', message, messageID, sessionID)
    switch (message._) {
      case 'msg_container':
        {
          const len = message.messages.length;
          for (let i = 0; i < len; i++) {
            this.processMessage(message.messages[i], message.messages[i].msg_id, sessionID);
          }
          break;
        }
      case 'bad_server_salt':
        {
          console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Bad server salt', message);
          const sentMessage = this.sentMessages[message.bad_msg_id];
          if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
            console.log(message.bad_msg_id, message.bad_msg_seqno);
            throw new Error('[MT] Bad server salt for invalid message');
          }

          this.applyServerSalt(message.new_server_salt);
          this.pushResend(message.bad_msg_id);
          this.ackMessage(messageID);
          break;
        }
      case 'bad_msg_notification':
        {
          console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Bad msg notification', message);
          const sentMessage = this.sentMessages[message.bad_msg_id];
          if (!sentMessage || sentMessage.seq_no != message.bad_msg_seqno) {
            console.log(message.bad_msg_id, message.bad_msg_seqno);
            throw new Error('[MT] Bad msg notification for invalid message');
          }

          if (message.error_code == 16 || message.error_code == 17) {
            if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["applyServerTime"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["b" /* bigStringInt */])(messageID).shiftRight(32).toString(10))) {
              console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Update session');
              this.updateSession();
            }
            const badMessage = this.updateSentMessage(message.bad_msg_id);
            this.pushResend(badMessage.msg_id);
            this.ackMessage(messageID);
          }
          break;
        }
      case 'message':
        {
          if (this.lastServerMessages.indexOf(messageID) != -1) {
            // console.warn('[MT] Server same messageID: ', messageID)
            this.ackMessage(messageID);
            return;
          }
          this.lastServerMessages.push(messageID);
          if (this.lastServerMessages.length > 100) {
            this.lastServerMessages.shift();
          }
          this.processMessage(message.body, message.msg_id, sessionID);
          break;
        }
      case 'new_session_created':
        {
          this.ackMessage(messageID);

          this.processMessageAck(message.first_msg_id);
          this.applyServerSalt(message.server_salt);

          const onBaseDc = baseDcID => {
            const updateCond = baseDcID === this.dcID && !this.upload && updatesProcessor;
            if (updateCond) updatesProcessor(message, true);
          };
          __WEBPACK_IMPORTED_MODULE_11__store__["a" /* PureStorage */].get('dc').then(onBaseDc);
          break;
        }
      case 'msgs_ack':
        {
          message.msg_ids.forEach(this.processMessageAck);
          break;
        }
      case 'msg_detailed_info':
        {
          if (!this.sentMessages[message.msg_id]) {
            this.ackMessage(message.answer_msg_id);
            break;
          }
          break;
        }
      case 'msg_new_detailed_info':
        {
          // this.ackMessage(message.answer_msg_id)
          this.reqResendMessage(message.answer_msg_id);
          break;
        }
      case 'msgs_state_info':
        {
          this.ackMessage(message.answer_msg_id);
          const spliceCond = this.lastResendReq && this.lastResendReq.req_msg_id == message.req_msg_id && this.pendingResends.length;
          if (spliceCond) this.lastResendReq.resend_msg_ids.forEach(this.spliceMessage);
          break;
        }
      case 'rpc_result':
        {
          this.ackMessage(messageID);

          const sentMessageID = message.req_msg_id;
          const sentMessage = this.sentMessages[sentMessageID];

          this.processMessageAck(sentMessageID);
          if (!sentMessage) break;

          const deferred = sentMessage.deferred;
          if (message.result._ == 'rpc_error') {
            const error = this.processError(message.result);
            console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Rpc error', error);
            if (deferred) {
              deferred.reject(error);
            }
          } else {
            if (deferred) {
              if (Config.Modes.debug) {
                console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Rpc response', message.result);
              } else {
                let dRes = message.result._;
                if (!dRes) dRes = message.result.length > 5 ? `[..${message.result.length}..]` : message.result;
                console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Rpc response', dRes);
              }
              sentMessage.deferred.resolve(message.result);
            }
            if (sentMessage.isAPI) this.connectionInited = true;
          }

          delete this.sentMessages[sentMessageID];
          break;
        }
      default:
        {
          this.ackMessage(messageID);

          // console.log('Update', message)
          if (updatesProcessor) updatesProcessor(message, true);
          break;
        }
    }
  }
}

var _initialiseProps = function () {
  this.checkLongPoll = force => {
    const isClean = this.cleanupSent();
    // console.log('Check lp', this.longPollPending, tsNow(), this.dcID, isClean)
    if (this.longPollPending && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() < this.longPollPending || this.offline || akStopped) {
      return false;
    }
    const self = this;
    __WEBPACK_IMPORTED_MODULE_11__store__["a" /* PureStorage */].get('dc').then(function (baseDcID) {
      if (isClean && (baseDcID != self.dcID || self.upload || self.sleepAfter && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() > self.sleepAfter)) {
        // console.warn(dTime(), 'Send long-poll for DC is delayed', self.dcID, self.sleepAfter)
        return;
      }
      self.sendLongPoll();
    });
  };

  this.checkConnection = event => {
    console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Check connection', event);
    __WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */].cancel(this.checkConnectionPromise);

    const serializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
    const pingID = [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["o" /* nextRandomInt */])(0xFFFFFFFF), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__bin__["o" /* nextRandomInt */])(0xFFFFFFFF)];

    serializer.storeMethod('ping', { ping_id: pingID });

    const pingMessage = {
      msg_id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])(),
      seq_no: this.generateSeqNo(true),
      body: serializer.getBytes()
    };

    const self = this;
    this.sendEncryptedRequest(pingMessage, { timeout: 15000 }).then(result => self.toggleOffline(false), () => {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Delay ', self.checkConnectionPeriod * 1000);
      self.checkConnectionPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__smart_timeout__["b" /* default */])(self.checkConnection, parseInt(self.checkConnectionPeriod * 1000));
      self.checkConnectionPeriod = Math.min(60, self.checkConnectionPeriod * 1.5);
    });
  };

  this.onNoResponseMsg = msgID => {
    if (this.sentMessages[msgID]) {
      const deferred = this.sentMessages[msgID].deferred;
      delete this.sentMessages[msgID];
      return deferred.resolve();
    }
  };

  this.onNoResponseMsgReject = msgID => {
    if (this.sentMessages[msgID]) {
      const deferred = this.sentMessages[msgID].deferred;
      delete this.sentMessages[msgID];
      delete this.pendingMessages[msgID];
      return deferred.reject();
    }
  };

  this.resetPendingMessage = msgID => this.pendingMessages[msgID] = 0;

  this.performSheduledRequest = () => {
    //TODO extract huge method
    // console.log(dTime(), 'sheduled', this.dcID, this.iii)
    if (this.offline || akStopped) {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Cancel sheduled');
      return false;
    }
    delete this.nextReq;
    if (this.pendingAcks.length) {
      const ackMsgIDs = [];
      for (let i = 0; i < this.pendingAcks.length; i++) {
        ackMsgIDs.push(this.pendingAcks[i]);
      }
      // console.log('acking messages', ackMsgIDs)
      this.wrapMtpMessage({ _: 'msgs_ack', msg_ids: ackMsgIDs }, { notContentRelated: true, noShedule: true });
    }

    if (this.pendingResends.length) {
      const resendMsgIDs = [];
      const resendOpts = { noShedule: true, notContentRelated: true };
      for (let i = 0; i < this.pendingResends.length; i++) {
        resendMsgIDs.push(this.pendingResends[i]);
      }
      // console.log('resendReq messages', resendMsgIDs)
      this.wrapMtpMessage({ _: 'msg_resend_req', msg_ids: resendMsgIDs }, resendOpts);
      this.lastResendReq = { req_msg_id: resendOpts.messageID, resend_msg_ids: resendMsgIDs };
    }

    const messages = [];
    let message,
        messagesByteLen = 0;
    const currentTime = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])();
    let hasApiCall = false;
    let hasHttpWait = false;
    let lengthOverflow = false;
    let singlesCount = 0;

    const onPendingMessage = (value, messageID) => {
      if (!(!value || value >= currentTime)) return;
      message = this.sentMessages[messageID];
      if (message) {
        const messageByteLength = (message.body.byteLength || message.body.length) + 32;
        const cond1 = !message.notContentRelated && lengthOverflow;
        const cond2 = !message.notContentRelated && messagesByteLen && messagesByteLen + messageByteLength > 655360; // 640 Kb
        if (cond1) return;
        if (cond2) {
          lengthOverflow = true;
          return;
        }
        if (message.singleInRequest) {
          singlesCount++;
          if (singlesCount > 1) return;
        }
        messages.push(message);
        messagesByteLen += messageByteLength;
        if (message.isAPI) hasApiCall = true;else if (message.longPoll) hasHttpWait = true;
      } else {
        // console.log(message, messageID)
      }
      delete this.pendingMessages[messageID];
    };

    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(this.pendingMessages, onPendingMessage);

    if (hasApiCall && !hasHttpWait) {
      const serializer = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true });
      serializer.storeMethod('http_wait', {
        max_delay: 500,
        wait_after: 150,
        max_wait: 3000
      });
      messages.push({
        msg_id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])(),
        seq_no: this.generateSeqNo(),
        body: serializer.getBytes()
      });
    }

    if (!messages.length) {
      // console.log('no sheduled messages')
      return;
    }

    const noResponseMsgs = [];

    if (messages.length > 1) {
      const container = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ mtproto: true, startMaxLength: messagesByteLen + 64 });
      container.storeInt(0x73f1f8dc, 'CONTAINER[id]');
      container.storeInt(messages.length, 'CONTAINER[count]');
      const onloads = [];
      const innerMessages = [];
      for (let i = 0; i < messages.length; i++) {
        container.storeLong(messages[i].msg_id, `CONTAINER[${i}][msg_id]`);
        innerMessages.push(messages[i].msg_id);
        container.storeInt(messages[i].seq_no, `CONTAINER[${i}][seq_no]`);
        container.storeInt(messages[i].body.length, `CONTAINER[${i}][bytes]`);
        container.storeRawBytes(messages[i].body, `CONTAINER[${i}][body]`);
        if (messages[i].noResponse) {
          noResponseMsgs.push(messages[i].msg_id);
        }
      }

      const containerSentMessage = {
        msg_id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])(),
        seq_no: this.generateSeqNo(true),
        container: true,
        inner: innerMessages
      };

      message = Object.assign({ body: container.getBytes(true) }, containerSentMessage);

      this.sentMessages[message.msg_id] = containerSentMessage;

      if (Config.Modes.debug) {
        console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Container', innerMessages, message.msg_id, message.seq_no);
      }
    } else {
      if (message.noResponse) {
        noResponseMsgs.push(message.msg_id);
      }
      this.sentMessages[message.msg_id] = message;
    }

    this.pendingAcks = [];
    const afterSendRequest = result => {
      this.toggleOffline(false);
      // console.log('parse for', message)
      this.parseResponse(result.data).then(afterResponseParse);
    };
    const afterResponseParse = response => {
      if (Config.Modes.debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Server response', this.dcID, response);

      this.processMessage(response.response, response.messageID, response.sessionID);

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(noResponseMsgs, this.onNoResponseMsg);

      this.checkLongPoll();

      this.checkConnectionPeriod = Math.max(1.1, Math.sqrt(this.checkConnectionPeriod));
    };
    const onRequestFail = error => {
      console.log('Encrypted request failed', error);

      if (message.container) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(message.inner, this.resetPendingMessage);
        delete this.sentMessages[message.msg_id];
      } else this.pendingMessages[message.msg_id] = 0;

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__for_each__["b" /* default */])(noResponseMsgs, this.onNoResponseMsgReject);

      this.toggleOffline(true);
    };
    this.sendEncryptedRequest(message).then(afterSendRequest).catch(onRequestFail);

    if (lengthOverflow || singlesCount > 1) this.sheduleRequest();
  };

  this.getRequestUrl = () => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__dc_configurator__["chooseServer"])(this.dcID, this.upload);

  this.sendEncryptedRequest = (message, options = {}) => {
    // console.log(dTime(), 'Send encrypted'/*, message*/)
    // console.trace()
    const data = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ startMaxLength: message.body.length + 64 });

    data.storeIntBytes(this.serverSalt, 64, 'salt');
    data.storeIntBytes(this.sessionID, 64, 'session_id');

    data.storeLong(message.msg_id, 'message_id');
    data.storeInt(message.seq_no, 'seq_no');

    data.storeInt(message.body.length, 'message_data_length');
    data.storeRawBytes(message.body, 'message_data');

    const url = this.getRequestUrl();
    const baseError = { code: 406, type: 'NETWORK_BAD_RESPONSE', url: url };

    const afterRequestData = result => {
      if (!result.data || !result.data.byteLength) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(baseError);
      return result;
    };

    const afterRequestReject = error => {
      if (!error.message && !error.type) error = Object.assign({ type: 'NETWORK_BAD_REQUEST', originalError: error }, baseError);
      return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(error);
    };

    const onEncryptedResult = encryptedResult => {
      // console.log(dTime(), 'Got encrypted out message'/*, encryptedResult*/)
      const request = new __WEBPACK_IMPORTED_MODULE_6__tl__["a" /* TLSerialization */]({ startMaxLength: encryptedResult.bytes.byteLength + 256 });
      request.storeIntBytes(this.authKeyID, 64, 'auth_key_id');
      request.storeIntBytes(encryptedResult.msgKey, 128, 'msg_key');
      request.storeRawBytes(encryptedResult.bytes, 'encrypted_data');

      const requestData = /*xhrSendBuffer
                          ? request.getBuffer()
                          : */request.getArray();

      try {
        options = Object.assign({ responseType: 'arraybuffer' }, options);
        return __WEBPACK_IMPORTED_MODULE_9__http__["a" /* httpClient */].post(url, requestData, options);
      } catch (e) {
        return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(e);
      }
    };

    return this.getEncryptedMessage(data.getBuffer()).then(onEncryptedResult).then(afterRequestData, afterRequestReject);
  };

  this.getMsgById = ({ req_msg_id }) => this.sentMessages[req_msg_id];

  this.processMessageAck = messageID => {
    const sentMessage = this.sentMessages[messageID];
    if (sentMessage && !sentMessage.acked) {
      delete sentMessage.body;
      sentMessage.acked = true;

      return true;
    }

    return false;
  };

  this.spliceMessage = badMsgID => {
    const pos = this.pendingResends.indexOf(badMsgID);
    if (pos !== -1) this.pendingResends.splice(pos, 1);
  };
};

const getDeserializeOpts = msgGetter => ({
  mtproto: true,
  override: {
    mt_message: function (result, field) {
      result.msg_id = this.fetchLong(`${field}[msg_id]`);
      result.seqno = this.fetchInt(`${field}[seqno]`);
      result.bytes = this.fetchInt(`${field}[bytes]`);

      const offset = this.getOffset();

      try {
        result.body = this.fetchObject('Object', `${field}[body]`);
      } catch (e) {
        console.error(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'parse error', e.message, e.stack);
        result.body = { _: 'parse_error', error: e };
      }
      if (this.offset != offset + result.bytes) {
        // console.warn(dTime(), 'set offset', this.offset, offset, result.bytes)
        // console.log(dTime(), result)
        this.offset = offset + result.bytes;
      }
      // console.log(dTime(), 'override message', result)
    },
    mt_rpc_result: function (result, field) {
      result.req_msg_id = this.fetchLong(`${field}[req_msg_id]`);

      const sentMessage = msgGetter(result);
      const type = sentMessage && sentMessage.resultType || 'Object';

      if (result.req_msg_id && !sentMessage) {
        // console.warn(dTime(), 'Result for unknown message', result)
        return;
      }
      result.result = this.fetchObject(type, `${field}[result]`);
      // console.log(dTime(), 'override rpc_result', sentMessage, type, result)
    }
  }
});

const startAll = () => {
  if (akStopped) {
    akStopped = false;
    updatesProcessor({ _: 'new_session_created' }, true);
  }
};
/* harmony export (immutable) */ __webpack_exports__["startAll"] = startAll;


const stopAll = () => akStopped = true;
/* harmony export (immutable) */ __webpack_exports__["stopAll"] = stopAll;


const getNetworker = (dcID, authKey, serverSalt, options) => new MtpNetworker(dcID, authKey, serverSalt, options);
/* harmony export (immutable) */ __webpack_exports__["getNetworker"] = getNetworker;


const setUpdatesProcessor = callback => updatesProcessor = callback;
/* harmony export (immutable) */ __webpack_exports__["setUpdatesProcessor"] = setUpdatesProcessor;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(17).setImmediate))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(360);

/***/ }),
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(63);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return bpe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return one; });
/* harmony export (immutable) */ __webpack_exports__["o"] = powMod;
/* harmony export (immutable) */ __webpack_exports__["k"] = eGCD_;
/* harmony export (immutable) */ __webpack_exports__["h"] = greater;
/* harmony export (immutable) */ __webpack_exports__["n"] = divide_;
/* harmony export (immutable) */ __webpack_exports__["b"] = str2bigInt;
/* harmony export (immutable) */ __webpack_exports__["l"] = equalsInt;
/* harmony export (immutable) */ __webpack_exports__["f"] = isZero;
/* harmony export (immutable) */ __webpack_exports__["a"] = bigInt2str;
/* harmony export (immutable) */ __webpack_exports__["e"] = copy_;
/* harmony export (immutable) */ __webpack_exports__["d"] = copyInt_;
/* harmony export (immutable) */ __webpack_exports__["j"] = rightShift_;
/* harmony export (immutable) */ __webpack_exports__["i"] = sub_;
/* harmony export (immutable) */ __webpack_exports__["g"] = add_;
////////////////////////////////////////////////////////////////////////////////////////
// Big Integer Library v. 5.5
// Created 2000, last modified 2013
// Leemon Baird
// www.leemon.com
//
// Version history:
// v 5.5  17 Mar 2013
//   - two lines of a form like "if (x<0) x+=n" had the "if" changed to "while" to
//     handle the case when x<-n. (Thanks to James Ansell for finding that bug)
// v 5.4  3 Oct 2009
//   - added "var i" to greaterShift() so i is not global. (Thanks to PŽter Szab— for finding that bug)
//
// v 5.3  21 Sep 2009
//   - added randProbPrime(k) for probable primes
//   - unrolled loop in mont_ (slightly faster)
//   - millerRabin now takes a bigInt parameter rather than an int
//
// v 5.2  15 Sep 2009
//   - fixed capitalization in call to int2bigInt in randBigInt
//     (thanks to Emili Evripidou, Reinhold Behringer, and Samuel Macaleese for finding that bug)
//
// v 5.1  8 Oct 2007
//   - renamed inverseModInt_ to inverseModInt since it doesn't change its parameters
//   - added functions GCD and randBigInt, which call GCD_ and randBigInt_
//   - fixed a bug found by Rob Visser (see comment with his name below)
//   - improved comments
//
// This file is public domain.   You can use it for any purpose without restriction.
// I do not guarantee that it is correct, so use it at your own risk.  If you use
// it for something interesting, I'd appreciate hearing about it.  If you find
// any bugs or make any improvements, I'd appreciate hearing about those too.
// It would also be nice if my name and URL were left in the comments.  But none
// of that is required.
//
// This code defines a bigInt library for arbitrary-precision integers.
// A bigInt is an array of integers storing the value in chunks of bpe bits,
// little endian (buff[0] is the least significant word).
// Negative bigInts are stored two's complement.  Almost all the functions treat
// bigInts as nonnegative.  The few that view them as two's complement say so
// in their comments.  Some functions assume their parameters have at least one
// leading zero element. Functions with an underscore at the end of the name put
// their answer into one of the arrays passed in, and have unpredictable behavior
// in case of overflow, so the caller must make sure the arrays are big enough to
// hold the answer.  But the average user should never have to call any of the
// underscored functions.  Each important underscored function has a wrapper function
// of the same name without the underscore that takes care of the details for you.
// For each underscored function where a parameter is modified, that same variable
// must not be used as another argument too.  So, you cannot square x by doing
// multMod_(x,x,n).  You must use squareMod_(x,n) instead, or do y=dup(x); multMod_(x,y,n).
// Or simply use the multMod(x,x,n) function without the underscore, where
// such issues never arise, because non-underscored functions never change
// their parameters; they always allocate new memory for the answer that is returned.
//
// These functions are designed to avoid frequent dynamic memory allocation in the inner loop.
// For most functions, if it needs a BigInt as a local variable it will actually use
// a global, and will only allocate to it only when it's not the right size.  This ensures
// that when a function is called repeatedly with same-sized parameters, it only allocates
// memory on the first call.
//
// Note that for cryptographic purposes, the calls to Math.random() must
// be replaced with calls to a better pseudorandom number generator.
//
// In the following, "bigInt" means a bigInt with at least one leading zero element,
// and "integer" means a nonnegative integer less than radix.  In some cases, integer
// can be negative.  Negative bigInts are 2s complement.
//
// The following functions do not modify their inputs.
// Those returning a bigInt, string, or Array will dynamically allocate memory for that value.
// Those returning a boolean will return the integer 0 (false) or 1 (true).
// Those returning boolean or int will not allocate memory except possibly on the first
// time they're called with a given parameter size.
//
// bigInt  add(x,y)               //return (x+y) for bigInts x and y.
// bigInt  addInt(x,n)            //return (x+n) where x is a bigInt and n is an integer.
// string  bigInt2str(x,base)     //return a string form of bigInt x in a given base, with 2 <= base <= 95
// int     bitSize(x)             //return how many bits long the bigInt x is, not counting leading zeros
// bigInt  dup(x)                 //return a copy of bigInt x
// boolean equals(x,y)            //is the bigInt x equal to the bigint y?
// boolean equalsInt(x,y)         //is bigint x equal to integer y?
// bigInt  expand(x,n)            //return a copy of x with at least n elements, adding leading zeros if needed
// Array   findPrimes(n)          //return array of all primes less than integer n
// bigInt  GCD(x,y)               //return greatest common divisor of bigInts x and y (each with same number of elements).
// boolean greater(x,y)           //is x>y?  (x and y are nonnegative bigInts)
// boolean greaterShift(x,y,shift)//is (x <<(shift*bpe)) > y?
// bigInt  int2bigInt(t,n,m)      //return a bigInt equal to integer t, with at least n bits and m array elements
// bigInt  inverseMod(x,n)        //return (x**(-1) mod n) for bigInts x and n.  If no inverse exists, it returns null
// int     inverseModInt(x,n)     //return x**(-1) mod n, for integers x and n.  Return 0 if there is no inverse
// boolean isZero(x)              //is the bigInt x equal to zero?
// boolean millerRabin(x,b)       //does one round of Miller-Rabin base integer b say that bigInt x is possibly prime? (b is bigInt, 1<b<x)
// boolean millerRabinInt(x,b)    //does one round of Miller-Rabin base integer b say that bigInt x is possibly prime? (b is int,    1<b<x)
// bigInt  mod(x,n)               //return a new bigInt equal to (x mod n) for bigInts x and n.
// int     modInt(x,n)            //return x mod n for bigInt x and integer n.
// bigInt  mult(x,y)              //return x*y for bigInts x and y. This is faster when y<x.
// bigInt  multMod(x,y,n)         //return (x*y mod n) for bigInts x,y,n.  For greater speed, let y<x.
// boolean negative(x)            //is bigInt x negative?
// bigInt  powMod(x,y,n)          //return (x**y mod n) where x,y,n are bigInts and ** is exponentiation.  0**0=1. Faster for odd n.
// bigInt  randBigInt(n,s)        //return an n-bit random BigInt (n>=1).  If s=1, then the most significant of those n bits is set to 1.
// bigInt  randTruePrime(k)       //return a new, random, k-bit, true prime bigInt using Maurer's algorithm.
// bigInt  randProbPrime(k)       //return a new, random, k-bit, probable prime bigInt (probability it's composite less than 2^-80).
// bigInt  str2bigInt(s,b,n,m)    //return a bigInt for number represented in string s in base b with at least n bits and m array elements
// bigInt  sub(x,y)               //return (x-y) for bigInts x and y.  Negative answers will be 2s complement
// bigInt  trim(x,k)              //return a copy of x with exactly k leading zero elements
//
//
// The following functions each have a non-underscored version, which most users should call instead.
// These functions each write to a single parameter, and the caller is responsible for ensuring the array
// passed in is large enough to hold the result.
//
// void    addInt_(x,n)          //do x=x+n where x is a bigInt and n is an integer
// void    add_(x,y)             //do x=x+y for bigInts x and y
// void    copy_(x,y)            //do x=y on bigInts x and y
// void    copyInt_(x,n)         //do x=n on bigInt x and integer n
// void    GCD_(x,y)             //set x to the greatest common divisor of bigInts x and y, (y is destroyed).  (This never overflows its array).
// boolean inverseMod_(x,n)      //do x=x**(-1) mod n, for bigInts x and n. Returns 1 (0) if inverse does (doesn't) exist
// void    mod_(x,n)             //do x=x mod n for bigInts x and n. (This never overflows its array).
// void    mult_(x,y)            //do x=x*y for bigInts x and y.
// void    multMod_(x,y,n)       //do x=x*y  mod n for bigInts x,y,n.
// void    powMod_(x,y,n)        //do x=x**y mod n, where x,y,n are bigInts (n is odd) and ** is exponentiation.  0**0=1.
// void    randBigInt_(b,n,s)    //do b = an n-bit random BigInt. if s=1, then nth bit (most significant bit) is set to 1. n>=1.
// void    randTruePrime_(ans,k) //do ans = a random k-bit true random prime (not just probable prime) with 1 in the msb.
// void    sub_(x,y)             //do x=x-y for bigInts x and y. Negative answers will be 2s complement.
//
// The following functions do NOT have a non-underscored version.
// They each write a bigInt result to one or more parameters.  The caller is responsible for
// ensuring the arrays passed in are large enough to hold the results.
//
// void addShift_(x,y,ys)       //do x=x+(y<<(ys*bpe))
// void carry_(x)               //do carries and borrows so each element of the bigInt x fits in bpe bits.
// void divide_(x,y,q,r)        //divide x by y giving quotient q and remainder r
// int  divInt_(x,n)            //do x=floor(x/n) for bigInt x and integer n, and return the remainder. (This never overflows its array).
// int  eGCD_(x,y,d,a,b)        //sets a,b,d to positive bigInts such that d = GCD_(x,y) = a*x-b*y
// void halve_(x)               //do x=floor(|x|/2)*sgn(x) for bigInt x in 2's complement.  (This never overflows its array).
// void leftShift_(x,n)         //left shift bigInt x by n bits.  n<bpe.
// void linComb_(x,y,a,b)       //do x=a*x+b*y for bigInts x and y and integers a and b
// void linCombShift_(x,y,b,ys) //do x=x+b*(y<<(ys*bpe)) for bigInts x and y, and integers b and ys
// void mont_(x,y,n,np)         //Montgomery multiplication (see comments where the function is defined)
// void multInt_(x,n)           //do x=x*n where x is a bigInt and n is an integer.
// void rightShift_(x,n)        //right shift bigInt x by n bits.  0 <= n < bpe. (This never overflows its array).
// void squareMod_(x,n)         //do x=x*x  mod n for bigInts x,n
// void subShift_(x,y,ys)       //do x=x-(y<<(ys*bpe)). Negative answers will be 2s complement.
//
// The following functions are based on algorithms from the _Handbook of Applied Cryptography_
//    powMod_()           = algorithm 14.94, Montgomery exponentiation
//    eGCD_,inverseMod_() = algorithm 14.61, Binary extended GCD_
//    GCD_()              = algorothm 14.57, Lehmer's algorithm
//    mont_()             = algorithm 14.36, Montgomery multiplication
//    divide_()           = algorithm 14.20  Multiple-precision division
//    squareMod_()        = algorithm 14.16  Multiple-precision squaring
//    randTruePrime_()    = algorithm  4.62, Maurer's algorithm
//    millerRabin()       = algorithm  4.24, Miller-Rabin algorithm
//
// Profiling shows:
//     randTruePrime_() spends:
//         10% of its time in calls to powMod_()
//         85% of its time in calls to millerRabin()
//     millerRabin() spends:
//         99% of its time in calls to powMod_()   (always with a base of 2)
//     powMod_() spends:
//         94% of its time in calls to mont_()  (almost always with x==y)
//
// This suggests there are several ways to speed up this library slightly:
//     - convert powMod_ to use a Montgomery form of k-ary window (or maybe a Montgomery form of sliding window)
//         -- this should especially focus on being fast when raising 2 to a power mod n
//     - convert randTruePrime_() to use a minimum r of 1/3 instead of 1/2 with the appropriate change to the test
//     - tune the parameters in randTruePrime_(), including c, m, and recLimit
//     - speed up the single loop in mont_() that takes 95% of the runtime, perhaps by reducing checking
//       within the loop when all the parameters are the same length.
//
// There are several ideas that look like they wouldn't help much at all:
//     - replacing trial division in randTruePrime_() with a sieve (that speeds up something taking almost no time anyway)
//     - increase bpe from 15 to 30 (that would help if we had a 32*32->64 multiplier, but not with JavaScript's 32*32->32)
//     - speeding up mont_(x,y,n,np) when x==y by doing a non-modular, non-Montgomery square
//       followed by a Montgomery reduction.  The intermediate answer will be twice as long as x, so that
//       method would be slower.  This is unfortunate because the code currently spends almost all of its time
//       doing mont_(x,x,...), both for randTruePrime_() and powMod_().  A faster method for Montgomery squaring
//       would have a large impact on the speed of randTruePrime_() and powMod_().  HAC has a couple of poorly-worded
//       sentences that seem to imply it's faster to do a non-modular square followed by a single
//       Montgomery reduction, but that's obviously wrong.
////////////////////////////////////////////////////////////////////////////////////////

//globals
var bpe = 0; //bits stored per array element
var mask = 0; //AND this with an array element to chop it down to bpe bits
var radix = mask + 1; //equals 2^bpe.  A single 1 bit to the left of the last bit of mask.

//the digits for converting to different bases
var digitsStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_=!@#$%^&*()[]{}|;:,.<>/?`~ \\\'\"+-';

//initialize the global variables
for (bpe = 0; 1 << bpe + 1 > 1 << bpe; bpe++); //bpe=number of bits in the mantissa on this platform
bpe >>= 1; //bpe=number of bits in one element of the array representing the bigInt
mask = (1 << bpe) - 1; //AND the mask with an integer to get its bpe least significant bits
radix = mask + 1; //2^bpe.  a single 1 bit to the left of the first bit of mask
var one = int2bigInt(1, 1, 1); //constant used in powMod_()

//the following global variables are scratchpad memory to
//reduce dynamic memory allocation in the inner loop
var t = new Array(0);
var ss = t; //used in mult_()
var s0 = t; //used in multMod_(), squareMod_()
var s1 = t; //used in powMod_(), multMod_(), squareMod_()
var s2 = t; //used in powMod_(), multMod_()
var s3 = t; //used in powMod_()
var s4 = t,
    s5 = t; //used in mod_()
var s6 = t; //used in bigInt2str()
var s7 = t; //used in powMod_()
var T = t; //used in GCD_()
var sa = t; //used in mont_()
var mr_x1 = t,
    mr_r = t,
    mr_a = t,
    //used in millerRabin()
eg_v = t,
    eg_u = t,
    eg_A = t,
    eg_B = t,
    eg_C = t,
    eg_D = t,
    //used in eGCD_(), inverseMod_()
md_q1 = t,
    md_q2 = t,
    md_q3 = t,
    md_r = t,
    md_r1 = t,
    md_r2 = t,
    md_tt = t,
    //used in mod_()

primes = t,
    pows = t,
    s_i = t,
    s_i2 = t,
    s_R = t,
    s_rm = t,
    s_q = t,
    s_n1 = t,
    s_a = t,
    s_r2 = t,
    s_n = t,
    s_b = t,
    s_d = t,
    s_x1 = t,
    s_x2 = t,
    s_aa = t,
    //used in randTruePrime_()

rpprb = t; //used in randProbPrimeRounds() (which also uses "primes")

////////////////////////////////////////////////////////////////////////////////////////

var k, buff;

//return array of all primes less than integer n
function findPrimes(n) {
  var i, s, p, ans;
  s = new Array(n);
  for (i = 0; i < n; i++) s[i] = 0;
  s[0] = 2;
  p = 0; //first p elements of s are primes, the rest are a sieve
  for (; s[p] < n;) {
    //s[p] is the pth prime
    for (i = s[p] * s[p]; i < n; i += s[p]) //mark multiples of s[p]
    s[i] = 1;
    p++;
    s[p] = s[p - 1] + 1;
    for (; s[p] < n && s[s[p]]; s[p]++); //find next prime (where s[p]==0)
  }
  ans = new Array(p);
  for (i = 0; i < p; i++) ans[i] = s[i];
  return ans;
}

//does a single round of Miller-Rabin base b consider x to be a possible prime?
//x is a bigInt, and b is an integer, with b<x
function millerRabinInt(x, b) {
  if (mr_x1.length != x.length) {
    mr_x1 = dup(x);
    mr_r = dup(x);
    mr_a = dup(x);
  }

  copyInt_(mr_a, b);
  return millerRabin(x, mr_a);
}

//does a single round of Miller-Rabin base b consider x to be a possible prime?
//x and b are bigInts with b<x
function millerRabin(x, b) {
  var i, j, k, s;

  if (mr_x1.length != x.length) {
    mr_x1 = dup(x);
    mr_r = dup(x);
    mr_a = dup(x);
  }

  copy_(mr_a, b);
  copy_(mr_r, x);
  copy_(mr_x1, x);

  addInt_(mr_r, -1);
  addInt_(mr_x1, -1);

  //s=the highest power of two that divides mr_r
  k = 0;
  for (i = 0; i < mr_r.length; i++) for (j = 1; j < mask; j <<= 1) if (x[i] & j) {
    s = k < mr_r.length + bpe ? k : 0;
    i = mr_r.length;
    j = mask;
  } else k++;

  if (s) rightShift_(mr_r, s);

  powMod_(mr_a, mr_r, x);

  if (!equalsInt(mr_a, 1) && !equals(mr_a, mr_x1)) {
    j = 1;
    while (j <= s - 1 && !equals(mr_a, mr_x1)) {
      squareMod_(mr_a, x);
      if (equalsInt(mr_a, 1)) {
        return 0;
      }
      j++;
    }
    if (!equals(mr_a, mr_x1)) {
      return 0;
    }
  }
  return 1;
}

//returns how many bits long the bigInt is, not counting leading zeros.
function bitSize(x) {
  var j, z, w;
  for (j = x.length - 1; x[j] == 0 && j > 0; j--);
  for (z = 0, w = x[j]; w; w >>= 1, z++);
  z += bpe * j;
  return z;
}

//return a copy of x with at least n elements, adding leading zeros if needed
function expand(x, n) {
  var ans = int2bigInt(0, (x.length > n ? x.length : n) * bpe, 0);
  copy_(ans, x);
  return ans;
}

//return a k-bit true random prime using Maurer's algorithm.
function randTruePrime(k) {
  var ans = int2bigInt(0, k, 0);
  randTruePrime_(ans, k);
  return trim(ans, 1);
}

//return a k-bit random probable prime with probability of error < 2^-80
function randProbPrime(k) {
  if (k >= 600) return randProbPrimeRounds(k, 2); //numbers from HAC table 4.3
  if (k >= 550) return randProbPrimeRounds(k, 4);
  if (k >= 500) return randProbPrimeRounds(k, 5);
  if (k >= 400) return randProbPrimeRounds(k, 6);
  if (k >= 350) return randProbPrimeRounds(k, 7);
  if (k >= 300) return randProbPrimeRounds(k, 9);
  if (k >= 250) return randProbPrimeRounds(k, 12); //numbers from HAC table 4.4
  if (k >= 200) return randProbPrimeRounds(k, 15);
  if (k >= 150) return randProbPrimeRounds(k, 18);
  if (k >= 100) return randProbPrimeRounds(k, 27);
  return randProbPrimeRounds(k, 40); //number from HAC remark 4.26 (only an estimate)
}

//return a k-bit probable random prime using n rounds of Miller Rabin (after trial division with small primes)
function randProbPrimeRounds(k, n) {
  var ans, i, divisible, B;
  B = 30000; //B is largest prime to use in trial division
  ans = int2bigInt(0, k, 0);

  //optimization: try larger and smaller B to find the best limit.

  if (primes.length == 0) primes = findPrimes(30000); //check for divisibility by primes <=30000

  if (rpprb.length != ans.length) rpprb = dup(ans);

  for (;;) {
    //keep trying random values for ans until one appears to be prime
    //optimization: pick a random number times L=2*3*5*...*p, plus a
    //   random element of the list of all numbers in [0,L) not divisible by any prime up to p.
    //   This can reduce the amount of random number generation.

    randBigInt_(ans, k, 0); //ans = a random odd number to check
    ans[0] |= 1;
    divisible = 0;

    //check ans for divisibility by small primes up to B
    for (i = 0; i < primes.length && primes[i] <= B; i++) if (modInt(ans, primes[i]) == 0 && !equalsInt(ans, primes[i])) {
      divisible = 1;
      break;
    }

    //optimization: change millerRabin so the base can be bigger than the number being checked, then eliminate the while here.

    //do n rounds of Miller Rabin, with random bases less than ans
    for (i = 0; i < n && !divisible; i++) {
      randBigInt_(rpprb, k, 0);
      while (!greater(ans, rpprb)) //pick a random rpprb that's < ans
      randBigInt_(rpprb, k, 0);
      if (!millerRabin(ans, rpprb)) divisible = 1;
    }

    if (!divisible) return ans;
  }
}

//return a new bigInt equal to (x mod n) for bigInts x and n.
function mod(x, n) {
  var ans = dup(x);
  mod_(ans, n);
  return trim(ans, 1);
}

//return (x+n) where x is a bigInt and n is an integer.
function addInt(x, n) {
  var ans = expand(x, x.length + 1);
  addInt_(ans, n);
  return trim(ans, 1);
}

//return x*y for bigInts x and y. This is faster when y<x.
function mult(x, y) {
  var ans = expand(x, x.length + y.length);
  mult_(ans, y);
  return trim(ans, 1);
}

//return (x**y mod n) where x,y,n are bigInts and ** is exponentiation.  0**0=1. Faster for odd n.
function powMod(x, y, n) {
  var ans = expand(x, n.length);
  powMod_(ans, trim(y, 2), trim(n, 2), 0); //this should work without the trim, but doesn't
  return trim(ans, 1);
}

//return (x-y) for bigInts x and y.  Negative answers will be 2s complement
function sub(x, y) {
  var ans = expand(x, x.length > y.length ? x.length + 1 : y.length + 1);
  sub_(ans, y);
  return trim(ans, 1);
}

//return (x+y) for bigInts x and y.
function add(x, y) {
  var ans = expand(x, x.length > y.length ? x.length + 1 : y.length + 1);
  add_(ans, y);
  return trim(ans, 1);
}

//return (x**(-1) mod n) for bigInts x and n.  If no inverse exists, it returns null
function inverseMod(x, n) {
  var ans = expand(x, n.length);
  var s;
  s = inverseMod_(ans, n);
  return s ? trim(ans, 1) : null;
}

//return (x*y mod n) for bigInts x,y,n.  For greater speed, let y<x.
function multMod(x, y, n) {
  var ans = expand(x, n.length);
  multMod_(ans, y, n);
  return trim(ans, 1);
}

//generate a k-bit true random prime using Maurer's algorithm,
//and put it into ans.  The bigInt ans must be large enough to hold it.
function randTruePrime_(ans, k) {
  var c, m, pm, dd, j, r, B, divisible, z, zz, recSize;

  if (primes.length == 0) primes = findPrimes(30000); //check for divisibility by primes <=30000

  if (pows.length == 0) {
    pows = new Array(512);
    for (j = 0; j < 512; j++) {
      pows[j] = Math.pow(2, j / 511. - 1.);
    }
  }

  //c and m should be tuned for a particular machine and value of k, to maximize speed
  c = 0.1; //c=0.1 in HAC
  m = 20; //generate this k-bit number by first recursively generating a number that has between k/2 and k-m bits
  recLimit = 20; //stop recursion when k <=recLimit.  Must have recLimit >= 2

  if (s_i2.length != ans.length) {
    s_i2 = dup(ans);
    s_R = dup(ans);
    s_n1 = dup(ans);
    s_r2 = dup(ans);
    s_d = dup(ans);
    s_x1 = dup(ans);
    s_x2 = dup(ans);
    s_b = dup(ans);
    s_n = dup(ans);
    s_i = dup(ans);
    s_rm = dup(ans);
    s_q = dup(ans);
    s_a = dup(ans);
    s_aa = dup(ans);
  }

  if (k <= recLimit) {
    //generate small random primes by trial division up to its square root
    pm = (1 << (k + 2 >> 1)) - 1; //pm is binary number with all ones, just over sqrt(2^k)
    copyInt_(ans, 0);
    for (dd = 1; dd;) {
      dd = 0;
      ans[0] = 1 | 1 << k - 1 | Math.floor(Math.random() * (1 << k)); //random, k-bit, odd integer, with msb 1
      for (j = 1; j < primes.length && (primes[j] & pm) == primes[j]; j++) {
        //trial division by all primes 3...sqrt(2^k)
        if (0 == ans[0] % primes[j]) {
          dd = 1;
          break;
        }
      }
    }
    carry_(ans);
    return;
  }

  B = c * k * k; //try small primes up to B (or all the primes[] array if the largest is less than B).
  if (k > 2 * m) //generate this k-bit number by first recursively generating a number that has between k/2 and k-m bits
    for (r = 1; k - k * r <= m;) r = pows[Math.floor(Math.random() * 512)]; //r=Math.pow(2,Math.random()-1);
  else r = .5;

  //simulation suggests the more complex algorithm using r=.333 is only slightly faster.

  recSize = Math.floor(r * k) + 1;

  randTruePrime_(s_q, recSize);
  copyInt_(s_i2, 0);
  s_i2[Math.floor((k - 2) / bpe)] |= 1 << (k - 2) % bpe; //s_i2=2^(k-2)
  divide_(s_i2, s_q, s_i, s_rm); //s_i=floor((2^(k-1))/(2q))

  z = bitSize(s_i);

  for (;;) {
    for (;;) {
      //generate z-bit numbers until one falls in the range [0,s_i-1]
      randBigInt_(s_R, z, 0);
      if (greater(s_i, s_R)) break;
    } //now s_R is in the range [0,s_i-1]
    addInt_(s_R, 1); //now s_R is in the range [1,s_i]
    add_(s_R, s_i); //now s_R is in the range [s_i+1,2*s_i]

    copy_(s_n, s_q);
    mult_(s_n, s_R);
    multInt_(s_n, 2);
    addInt_(s_n, 1); //s_n=2*s_R*s_q+1

    copy_(s_r2, s_R);
    multInt_(s_r2, 2); //s_r2=2*s_R

    //check s_n for divisibility by small primes up to B
    for (divisible = 0, j = 0; j < primes.length && primes[j] < B; j++) if (modInt(s_n, primes[j]) == 0 && !equalsInt(s_n, primes[j])) {
      divisible = 1;
      break;
    }

    if (!divisible) //if it passes small primes check, then try a single Miller-Rabin base 2
      if (!millerRabinInt(s_n, 2)) //this line represents 75% of the total runtime for randTruePrime_
        divisible = 1;

    if (!divisible) {
      //if it passes that test, continue checking s_n
      addInt_(s_n, -3);
      for (j = s_n.length - 1; s_n[j] == 0 && j > 0; j--); //strip leading zeros
      for (zz = 0, w = s_n[j]; w; w >>= 1, zz++);
      zz += bpe * j; //zz=number of bits in s_n, ignoring leading zeros
      for (;;) {
        //generate z-bit numbers until one falls in the range [0,s_n-1]
        randBigInt_(s_a, zz, 0);
        if (greater(s_n, s_a)) break;
      } //now s_a is in the range [0,s_n-1]
      addInt_(s_n, 3); //now s_a is in the range [0,s_n-4]
      addInt_(s_a, 2); //now s_a is in the range [2,s_n-2]
      copy_(s_b, s_a);
      copy_(s_n1, s_n);
      addInt_(s_n1, -1);
      powMod_(s_b, s_n1, s_n); //s_b=s_a^(s_n-1) modulo s_n
      addInt_(s_b, -1);
      if (isZero(s_b)) {
        copy_(s_b, s_a);
        powMod_(s_b, s_r2, s_n);
        addInt_(s_b, -1);
        copy_(s_aa, s_n);
        copy_(s_d, s_b);
        GCD_(s_d, s_n); //if s_b and s_n are relatively prime, then s_n is a prime
        if (equalsInt(s_d, 1)) {
          copy_(ans, s_aa);
          return; //if we've made it this far, then s_n is absolutely guaranteed to be prime
        }
      }
    }
  }
}

//Return an n-bit random BigInt (n>=1).  If s=1, then the most significant of those n bits is set to 1.
function randBigInt(n, s) {
  var a, b;
  a = Math.floor((n - 1) / bpe) + 2; //# array elements to hold the BigInt with a leading 0 element
  b = int2bigInt(0, 0, a);
  randBigInt_(b, n, s);
  return b;
}

//Set b to an n-bit random BigInt.  If s=1, then the most significant of those n bits is set to 1.
//Array b must be big enough to hold the result. Must have n>=1
function randBigInt_(b, n, s) {
  var i, a;
  for (i = 0; i < b.length; i++) b[i] = 0;
  a = Math.floor((n - 1) / bpe) + 1; //# array elements to hold the BigInt
  for (i = 0; i < a; i++) {
    b[i] = Math.floor(Math.random() * (1 << bpe - 1));
  }
  b[a - 1] &= (2 << (n - 1) % bpe) - 1;
  if (s == 1) b[a - 1] |= 1 << (n - 1) % bpe;
}

//Return the greatest common divisor of bigInts x and y (each with same number of elements).
function GCD(x, y) {
  var xc, yc;
  xc = dup(x);
  yc = dup(y);
  GCD_(xc, yc);
  return xc;
}

//set x to the greatest common divisor of bigInts x and y (each with same number of elements).
//y is destroyed.
function GCD_(x, y) {
  var i, xp, yp, A, B, C, D, q, sing;
  if (T.length != x.length) T = dup(x);

  sing = 1;
  while (sing) {
    //while y has nonzero elements other than y[0]
    sing = 0;
    for (i = 1; i < y.length; i++) //check if y has nonzero elements other than 0
    if (y[i]) {
      sing = 1;
      break;
    }
    if (!sing) break; //quit when y all zero elements except possibly y[0]

    for (i = x.length; !x[i] && i >= 0; i--); //find most significant element of x
    xp = x[i];
    yp = y[i];
    A = 1;B = 0;C = 0;D = 1;
    while (yp + C && yp + D) {
      q = Math.floor((xp + A) / (yp + C));
      qp = Math.floor((xp + B) / (yp + D));
      if (q != qp) break;
      t = A - q * C;A = C;C = t; //  do (A,B,xp, C,D,yp) = (C,D,yp, A,B,xp) - q*(0,0,0, C,D,yp)
      t = B - q * D;B = D;D = t;
      t = xp - q * yp;xp = yp;yp = t;
    }
    if (B) {
      copy_(T, x);
      linComb_(x, y, A, B); //x=A*x+B*y
      linComb_(y, T, D, C); //y=D*y+C*T
    } else {
      mod_(x, y);
      copy_(T, x);
      copy_(x, y);
      copy_(y, T);
    }
  }
  if (y[0] == 0) return;
  t = modInt(x, y[0]);
  copyInt_(x, y[0]);
  y[0] = t;
  while (y[0]) {
    x[0] %= y[0];
    t = x[0];x[0] = y[0];y[0] = t;
  }
}

//do x=x**(-1) mod n, for bigInts x and n.
//If no inverse exists, it sets x to zero and returns 0, else it returns 1.
//The x array must be at least as large as the n array.
function inverseMod_(x, n) {
  var k = 1 + 2 * Math.max(x.length, n.length);

  if (!(x[0] & 1) && !(n[0] & 1)) {
    //if both inputs are even, then inverse doesn't exist
    copyInt_(x, 0);
    return 0;
  }

  if (eg_u.length != k) {
    eg_u = new Array(k);
    eg_v = new Array(k);
    eg_A = new Array(k);
    eg_B = new Array(k);
    eg_C = new Array(k);
    eg_D = new Array(k);
  }

  copy_(eg_u, x);
  copy_(eg_v, n);
  copyInt_(eg_A, 1);
  copyInt_(eg_B, 0);
  copyInt_(eg_C, 0);
  copyInt_(eg_D, 1);
  for (;;) {
    while (!(eg_u[0] & 1)) {
      //while eg_u is even
      halve_(eg_u);
      if (!(eg_A[0] & 1) && !(eg_B[0] & 1)) {
        //if eg_A==eg_B==0 mod 2
        halve_(eg_A);
        halve_(eg_B);
      } else {
        add_(eg_A, n);halve_(eg_A);
        sub_(eg_B, x);halve_(eg_B);
      }
    }

    while (!(eg_v[0] & 1)) {
      //while eg_v is even
      halve_(eg_v);
      if (!(eg_C[0] & 1) && !(eg_D[0] & 1)) {
        //if eg_C==eg_D==0 mod 2
        halve_(eg_C);
        halve_(eg_D);
      } else {
        add_(eg_C, n);halve_(eg_C);
        sub_(eg_D, x);halve_(eg_D);
      }
    }

    if (!greater(eg_v, eg_u)) {
      //eg_v <= eg_u
      sub_(eg_u, eg_v);
      sub_(eg_A, eg_C);
      sub_(eg_B, eg_D);
    } else {
      //eg_v > eg_u
      sub_(eg_v, eg_u);
      sub_(eg_C, eg_A);
      sub_(eg_D, eg_B);
    }

    if (equalsInt(eg_u, 0)) {
      while (negative(eg_C)) //make sure answer is nonnegative
      add_(eg_C, n);
      copy_(x, eg_C);

      if (!equalsInt(eg_v, 1)) {
        //if GCD_(x,n)!=1, then there is no inverse
        copyInt_(x, 0);
        return 0;
      }
      return 1;
    }
  }
}

//return x**(-1) mod n, for integers x and n.  Return 0 if there is no inverse
function inverseModInt(x, n) {
  var a = 1,
      b = 0,
      t;
  for (;;) {
    if (x == 1) return a;
    if (x == 0) return 0;
    b -= a * Math.floor(n / x);
    n %= x;

    if (n == 1) return b; //to avoid negatives, change this b to n-b, and each -= to +=
    if (n == 0) return 0;
    a -= b * Math.floor(x / n);
    x %= n;
  }
}

//this deprecated function is for backward compatibility only.
function inverseModInt_(x, n) {
  return inverseModInt(x, n);
}

//Given positive bigInts x and y, change the bigints v, a, and b to positive bigInts such that:
//     v = GCD_(x,y) = a*x-b*y
//The bigInts v, a, b, must have exactly as many elements as the larger of x and y.
function eGCD_(x, y, v, a, b) {
  var g = 0;
  var k = Math.max(x.length, y.length);
  if (eg_u.length != k) {
    eg_u = new Array(k);
    eg_A = new Array(k);
    eg_B = new Array(k);
    eg_C = new Array(k);
    eg_D = new Array(k);
  }
  while (!(x[0] & 1) && !(y[0] & 1)) {
    //while x and y both even
    halve_(x);
    halve_(y);
    g++;
  }
  copy_(eg_u, x);
  copy_(v, y);
  copyInt_(eg_A, 1);
  copyInt_(eg_B, 0);
  copyInt_(eg_C, 0);
  copyInt_(eg_D, 1);
  for (;;) {
    while (!(eg_u[0] & 1)) {
      //while u is even
      halve_(eg_u);
      if (!(eg_A[0] & 1) && !(eg_B[0] & 1)) {
        //if A==B==0 mod 2
        halve_(eg_A);
        halve_(eg_B);
      } else {
        add_(eg_A, y);halve_(eg_A);
        sub_(eg_B, x);halve_(eg_B);
      }
    }

    while (!(v[0] & 1)) {
      //while v is even
      halve_(v);
      if (!(eg_C[0] & 1) && !(eg_D[0] & 1)) {
        //if C==D==0 mod 2
        halve_(eg_C);
        halve_(eg_D);
      } else {
        add_(eg_C, y);halve_(eg_C);
        sub_(eg_D, x);halve_(eg_D);
      }
    }

    if (!greater(v, eg_u)) {
      //v<=u
      sub_(eg_u, v);
      sub_(eg_A, eg_C);
      sub_(eg_B, eg_D);
    } else {
      //v>u
      sub_(v, eg_u);
      sub_(eg_C, eg_A);
      sub_(eg_D, eg_B);
    }
    if (equalsInt(eg_u, 0)) {
      while (negative(eg_C)) {
        //make sure a (C) is nonnegative
        add_(eg_C, y);
        sub_(eg_D, x);
      }
      multInt_(eg_D, -1); ///make sure b (D) is nonnegative
      copy_(a, eg_C);
      copy_(b, eg_D);
      leftShift_(v, g);
      return;
    }
  }
}

//is bigInt x negative?
function negative(x) {
  return x[x.length - 1] >> bpe - 1 & 1;
}

//is (x << (shift*bpe)) > y?
//x and y are nonnegative bigInts
//shift is a nonnegative integer
function greaterShift(x, y, shift) {
  var i,
      kx = x.length,
      ky = y.length;
  k = kx + shift < ky ? kx + shift : ky;
  for (i = ky - 1 - shift; i < kx && i >= 0; i++) if (x[i] > 0) return 1; //if there are nonzeros in x to the left of the first column of y, then x is bigger
  for (i = kx - 1 + shift; i < ky; i++) if (y[i] > 0) return 0; //if there are nonzeros in y to the left of the first column of x, then x is not bigger
  for (i = k - 1; i >= shift; i--) if (x[i - shift] > y[i]) return 1;else if (x[i - shift] < y[i]) return 0;
  return 0;
}

//is x > y? (x and y both nonnegative)
function greater(x, y) {
  var i;
  var k = x.length < y.length ? x.length : y.length;

  for (i = x.length; i < y.length; i++) if (y[i]) return 0; //y has more digits

  for (i = y.length; i < x.length; i++) if (x[i]) return 1; //x has more digits

  for (i = k - 1; i >= 0; i--) if (x[i] > y[i]) return 1;else if (x[i] < y[i]) return 0;
  return 0;
}

//divide x by y giving quotient q and remainder r.  (q=floor(x/y),  r=x mod y).  All 4 are bigints.
//x must have at least one leading zero element.
//y must be nonzero.
//q and r must be arrays that are exactly the same length as x. (Or q can have more).
//Must have x.length >= y.length >= 2.
function divide_(x, y, q, r) {
  var kx, ky;
  var i, j, y1, y2, c, a, b;
  copy_(r, x);
  for (ky = y.length; y[ky - 1] == 0; ky--); //ky is number of elements in y, not including leading zeros

  //normalize: ensure the most significant element of y has its highest bit set
  b = y[ky - 1];
  for (a = 0; b; a++) b >>= 1;
  a = bpe - a; //a is how many bits to shift so that the high order bit of y is leftmost in its array element
  leftShift_(y, a); //multiply both by 1<<a now, then divide both by that at the end
  leftShift_(r, a);

  //Rob Visser discovered a bug: the following line was originally just before the normalization.
  for (kx = r.length; r[kx - 1] == 0 && kx > ky; kx--); //kx is number of elements in normalized x, not including leading zeros

  copyInt_(q, 0); // q=0
  while (!greaterShift(y, r, kx - ky)) {
    // while (leftShift_(y,kx-ky) <= r) {
    subShift_(r, y, kx - ky); //   r=r-leftShift_(y,kx-ky)
    q[kx - ky]++; //   q[kx-ky]++;
  } // }

  for (i = kx - 1; i >= ky; i--) {
    if (r[i] == y[ky - 1]) q[i - ky] = mask;else q[i - ky] = Math.floor((r[i] * radix + r[i - 1]) / y[ky - 1]);

    //The following for(;;) loop is equivalent to the commented while loop,
    //except that the uncommented version avoids overflow.
    //The commented loop comes from HAC, which assumes r[-1]==y[-1]==0
    //  while (q[i-ky]*(y[ky-1]*radix+y[ky-2]) > r[i]*radix*radix+r[i-1]*radix+r[i-2])
    //    q[i-ky]--;
    for (;;) {
      y2 = (ky > 1 ? y[ky - 2] : 0) * q[i - ky];
      c = y2 >> bpe;
      y2 = y2 & mask;
      y1 = c + q[i - ky] * y[ky - 1];
      c = y1 >> bpe;
      y1 = y1 & mask;

      if (c == r[i] ? y1 == r[i - 1] ? y2 > (i > 1 ? r[i - 2] : 0) : y1 > r[i - 1] : c > r[i]) q[i - ky]--;else break;
    }

    linCombShift_(r, y, -q[i - ky], i - ky); //r=r-q[i-ky]*leftShift_(y,i-ky)
    if (negative(r)) {
      addShift_(r, y, i - ky); //r=r+leftShift_(y,i-ky)
      q[i - ky]--;
    }
  }

  rightShift_(y, a); //undo the normalization step
  rightShift_(r, a); //undo the normalization step
}

//do carries and borrows so each element of the bigInt x fits in bpe bits.
function carry_(x) {
  var i, k, c, b;
  k = x.length;
  c = 0;
  for (i = 0; i < k; i++) {
    c += x[i];
    b = 0;
    if (c < 0) {
      b = -(c >> bpe);
      c += b * radix;
    }
    x[i] = c & mask;
    c = (c >> bpe) - b;
  }
}

//return x mod n for bigInt x and integer n.
function modInt(x, n) {
  var i,
      c = 0;
  for (i = x.length - 1; i >= 0; i--) c = (c * radix + x[i]) % n;
  return c;
}

//convert the integer t into a bigInt with at least the given number of bits.
//the returned array stores the bigInt in bpe-bit chunks, little endian (buff[0] is least significant word)
//Pad the array with leading zeros so that it has at least minSize elements.
//There will always be at least one leading 0 element.
function int2bigInt(t, bits, minSize) {
  var i, k;
  k = Math.ceil(bits / bpe) + 1;
  k = minSize > k ? minSize : k;
  var buff = new Array(k);
  copyInt_(buff, t);
  return buff;
}

//return the bigInt given a string representation in a given base.
//Pad the array with leading zeros so that it has at least minSize elements.
//If base=-1, then it reads in a space-separated list of array elements in decimal.
//The array will always have at least one leading zero, unless base=-1.
function str2bigInt(s, base, minSize) {
  var d, i, j, x, y, kk;
  var k = s.length;
  if (base == -1) {
    //comma-separated list of array elements in decimal
    x = new Array(0);
    for (;;) {
      y = new Array(x.length + 1);
      for (i = 0; i < x.length; i++) y[i + 1] = x[i];
      y[0] = parseInt(s, 10);
      x = y;
      d = s.indexOf(',', 0);
      if (d < 1) break;
      s = s.substring(d + 1);
      if (s.length == 0) break;
    }
    if (x.length < minSize) {
      y = new Array(minSize);
      copy_(y, x);
      return y;
    }
    return x;
  }

  x = int2bigInt(0, base * k, 0);
  for (i = 0; i < k; i++) {
    d = digitsStr.indexOf(s.substring(i, i + 1), 0);
    if (base <= 36 && d >= 36) //convert lowercase to uppercase if base<=36
      d -= 26;
    if (d >= base || d < 0) {
      //stop at first illegal character
      break;
    }
    multInt_(x, base);
    addInt_(x, d);
  }

  for (k = x.length; k > 0 && !x[k - 1]; k--); //strip off leading zeros
  k = minSize > k + 1 ? minSize : k + 1;
  y = new Array(k);
  kk = k < x.length ? k : x.length;
  for (i = 0; i < kk; i++) y[i] = x[i];
  for (; i < k; i++) y[i] = 0;
  return y;
}

//is bigint x equal to integer y?
//y must have less than bpe bits
function equalsInt(x, y) {
  var i;
  if (x[0] != y) return 0;
  for (i = 1; i < x.length; i++) if (x[i]) return 0;
  return 1;
}

//are bigints x and y equal?
//this works even if x and y are different lengths and have arbitrarily many leading zeros
function equals(x, y) {
  var i;
  var k = x.length < y.length ? x.length : y.length;
  for (i = 0; i < k; i++) if (x[i] != y[i]) return 0;
  if (x.length > y.length) {
    for (; i < x.length; i++) if (x[i]) return 0;
  } else {
    for (; i < y.length; i++) if (y[i]) return 0;
  }
  return 1;
}

//is the bigInt x equal to zero?
function isZero(x) {
  var i;
  for (i = 0; i < x.length; i++) if (x[i]) return 0;
  return 1;
}

//convert a bigInt into a string in a given base, from base 2 up to base 95.
//Base -1 prints the contents of the array representing the number.
function bigInt2str(x, base) {
  var i,
      t,
      s = "";

  if (s6.length != x.length) s6 = dup(x);else copy_(s6, x);

  if (base == -1) {
    //return the list of array contents
    for (i = x.length - 1; i > 0; i--) s += x[i] + ',';
    s += x[0];
  } else {
    //return it in the given base
    while (!isZero(s6)) {
      t = divInt_(s6, base); //t=s6 % base; s6=floor(s6/base);
      s = digitsStr.substring(t, t + 1) + s;
    }
  }
  if (s.length == 0) s = "0";
  return s;
}

//returns a duplicate of bigInt x
function dup(x) {
  var i;
  buff = new Array(x.length);
  copy_(buff, x);
  return buff;
}

//do x=y on bigInts x and y.  x must be an array at least as big as y (not counting the leading zeros in y).
function copy_(x, y) {
  var i;
  var k = x.length < y.length ? x.length : y.length;
  for (i = 0; i < k; i++) x[i] = y[i];
  for (i = k; i < x.length; i++) x[i] = 0;
}

//do x=y on bigInt x and integer y.
function copyInt_(x, n) {
  var i, c;
  for (c = n, i = 0; i < x.length; i++) {
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x+n where x is a bigInt and n is an integer.
//x must be large enough to hold the result.
function addInt_(x, n) {
  var i, k, c, b;
  x[0] += n;
  k = x.length;
  c = 0;
  for (i = 0; i < k; i++) {
    c += x[i];
    b = 0;
    if (c < 0) {
      b = -(c >> bpe);
      c += b * radix;
    }
    x[i] = c & mask;
    c = (c >> bpe) - b;
    if (!c) return; //stop carrying as soon as the carry is zero
  }
}

//right shift bigInt x by n bits.  0 <= n < bpe.
function rightShift_(x, n) {
  var i;
  var k = Math.floor(n / bpe);
  if (k) {
    for (i = 0; i < x.length - k; i++) //right shift x by k elements
    x[i] = x[i + k];
    for (; i < x.length; i++) x[i] = 0;
    n %= bpe;
  }
  for (i = 0; i < x.length - 1; i++) {
    x[i] = mask & (x[i + 1] << bpe - n | x[i] >> n);
  }
  x[i] >>= n;
}

//do x=floor(|x|/2)*sgn(x) for bigInt x in 2's complement
function halve_(x) {
  var i;
  for (i = 0; i < x.length - 1; i++) {
    x[i] = mask & (x[i + 1] << bpe - 1 | x[i] >> 1);
  }
  x[i] = x[i] >> 1 | x[i] & radix >> 1; //most significant bit stays the same
}

//left shift bigInt x by n bits.
function leftShift_(x, n) {
  var i;
  var k = Math.floor(n / bpe);
  if (k) {
    for (i = x.length; i >= k; i--) //left shift x by k elements
    x[i] = x[i - k];
    for (; i >= 0; i--) x[i] = 0;
    n %= bpe;
  }
  if (!n) return;
  for (i = x.length - 1; i > 0; i--) {
    x[i] = mask & (x[i] << n | x[i - 1] >> bpe - n);
  }
  x[i] = mask & x[i] << n;
}

//do x=x*n where x is a bigInt and n is an integer.
//x must be large enough to hold the result.
function multInt_(x, n) {
  var i, k, c, b;
  if (!n) return;
  k = x.length;
  c = 0;
  for (i = 0; i < k; i++) {
    c += x[i] * n;
    b = 0;
    if (c < 0) {
      b = -(c >> bpe);
      c += b * radix;
    }
    x[i] = c & mask;
    c = (c >> bpe) - b;
  }
}

//do x=floor(x/n) for bigInt x and integer n, and return the remainder
function divInt_(x, n) {
  var i,
      r = 0,
      s;
  for (i = x.length - 1; i >= 0; i--) {
    s = r * radix + x[i];
    x[i] = Math.floor(s / n);
    r = s % n;
  }
  return r;
}

//do the linear combination x=a*x+b*y for bigInts x and y, and integers a and b.
//x must be large enough to hold the answer.
function linComb_(x, y, a, b) {
  var i, c, k, kk;
  k = x.length < y.length ? x.length : y.length;
  kk = x.length;
  for (c = 0, i = 0; i < k; i++) {
    c += a * x[i] + b * y[i];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; i < kk; i++) {
    c += a * x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do the linear combination x=a*x+b*(y<<(ys*bpe)) for bigInts x and y, and integers a, b and ys.
//x must be large enough to hold the answer.
function linCombShift_(x, y, b, ys) {
  var i, c, k, kk;
  k = x.length < ys + y.length ? x.length : ys + y.length;
  kk = x.length;
  for (c = 0, i = ys; i < k; i++) {
    c += x[i] + b * y[i - ys];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; c && i < kk; i++) {
    c += x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x+(y<<(ys*bpe)) for bigInts x and y, and integers a,b and ys.
//x must be large enough to hold the answer.
function addShift_(x, y, ys) {
  var i, c, k, kk;
  k = x.length < ys + y.length ? x.length : ys + y.length;
  kk = x.length;
  for (c = 0, i = ys; i < k; i++) {
    c += x[i] + y[i - ys];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; c && i < kk; i++) {
    c += x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x-(y<<(ys*bpe)) for bigInts x and y, and integers a,b and ys.
//x must be large enough to hold the answer.
function subShift_(x, y, ys) {
  var i, c, k, kk;
  k = x.length < ys + y.length ? x.length : ys + y.length;
  kk = x.length;
  for (c = 0, i = ys; i < k; i++) {
    c += x[i] - y[i - ys];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; c && i < kk; i++) {
    c += x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x-y for bigInts x and y.
//x must be large enough to hold the answer.
//negative answers will be 2s complement
function sub_(x, y) {
  var i, c, k, kk;
  k = x.length < y.length ? x.length : y.length;
  for (c = 0, i = 0; i < k; i++) {
    c += x[i] - y[i];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; c && i < x.length; i++) {
    c += x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x+y for bigInts x and y.
//x must be large enough to hold the answer.
function add_(x, y) {
  var i, c, k, kk;
  k = x.length < y.length ? x.length : y.length;
  for (c = 0, i = 0; i < k; i++) {
    c += x[i] + y[i];
    x[i] = c & mask;
    c >>= bpe;
  }
  for (i = k; c && i < x.length; i++) {
    c += x[i];
    x[i] = c & mask;
    c >>= bpe;
  }
}

//do x=x*y for bigInts x and y.  This is faster when y<x.
function mult_(x, y) {
  var i;
  if (ss.length != 2 * x.length) ss = new Array(2 * x.length);
  copyInt_(ss, 0);
  for (i = 0; i < y.length; i++) if (y[i]) linCombShift_(ss, x, y[i], i); //ss=1*ss+y[i]*(x<<(i*bpe))
  copy_(x, ss);
}

//do x=x mod n for bigInts x and n.
function mod_(x, n) {
  if (s4.length != x.length) s4 = dup(x);else copy_(s4, x);
  if (s5.length != x.length) s5 = dup(x);
  divide_(s4, n, s5, x); //x = remainder of s4 / n
}

//do x=x*y mod n for bigInts x,y,n.
//for greater speed, let y<x.
function multMod_(x, y, n) {
  var i;
  if (s0.length != 2 * x.length) s0 = new Array(2 * x.length);
  copyInt_(s0, 0);
  for (i = 0; i < y.length; i++) if (y[i]) linCombShift_(s0, x, y[i], i); //s0=1*s0+y[i]*(x<<(i*bpe))
  mod_(s0, n);
  copy_(x, s0);
}

//do x=x*x mod n for bigInts x,n.
function squareMod_(x, n) {
  var i, j, d, c, kx, kn, k;
  for (kx = x.length; kx > 0 && !x[kx - 1]; kx--); //ignore leading zeros in x
  k = kx > n.length ? 2 * kx : 2 * n.length; //k=# elements in the product, which is twice the elements in the larger of x and n
  if (s0.length != k) s0 = new Array(k);
  copyInt_(s0, 0);
  for (i = 0; i < kx; i++) {
    c = s0[2 * i] + x[i] * x[i];
    s0[2 * i] = c & mask;
    c >>= bpe;
    for (j = i + 1; j < kx; j++) {
      c = s0[i + j] + 2 * x[i] * x[j] + c;
      s0[i + j] = c & mask;
      c >>= bpe;
    }
    s0[i + kx] = c;
  }
  mod_(s0, n);
  copy_(x, s0);
}

//return x with exactly k leading zero elements
function trim(x, k) {
  var i, y;
  for (i = x.length; i > 0 && !x[i - 1]; i--);
  y = new Array(i + k);
  copy_(y, x);
  return y;
}

//do x=x**y mod n, where x,y,n are bigInts and ** is exponentiation.  0**0=1.
//this is faster when n is odd.  x usually needs to have as many elements as n.
function powMod_(x, y, n) {
  var k1, k2, kn, np;
  if (s7.length != n.length) s7 = dup(n);

  //for even modulus, use a simple square-and-multiply algorithm,
  //rather than using the more complex Montgomery algorithm.
  if ((n[0] & 1) == 0) {
    copy_(s7, x);
    copyInt_(x, 1);
    while (!equalsInt(y, 0)) {
      if (y[0] & 1) multMod_(x, s7, n);
      divInt_(y, 2);
      squareMod_(s7, n);
    }
    return;
  }

  //calculate np from n for the Montgomery multiplications
  copyInt_(s7, 0);
  for (kn = n.length; kn > 0 && !n[kn - 1]; kn--);
  np = radix - inverseModInt(modInt(n, radix), radix);
  s7[kn] = 1;
  multMod_(x, s7, n); // x = x * 2**(kn*bp) mod n

  if (s3.length != x.length) s3 = dup(x);else copy_(s3, x);

  for (k1 = y.length - 1; k1 > 0 & !y[k1]; k1--); //k1=first nonzero element of y
  if (y[k1] == 0) {
    //anything to the 0th power is 1
    copyInt_(x, 1);
    return;
  }
  for (k2 = 1 << bpe - 1; k2 && !(y[k1] & k2); k2 >>= 1); //k2=position of first 1 bit in y[k1]
  for (;;) {
    if (!(k2 >>= 1)) {
      //look at next bit of y
      k1--;
      if (k1 < 0) {
        mont_(x, one, n, np);
        return;
      }
      k2 = 1 << bpe - 1;
    }
    mont_(x, x, n, np);

    if (k2 & y[k1]) //if next bit is a 1
      mont_(x, s3, n, np);
  }
}

//do x=x*y*Ri mod n for bigInts x,y,n,
//  where Ri = 2**(-kn*bpe) mod n, and kn is the
//  number of elements in the n array, not
//  counting leading zeros.
//x array must have at least as many elemnts as the n array
//It's OK if x and y are the same variable.
//must have:
//  x,y < n
//  n is odd
//  np = -(n^(-1)) mod radix
function mont_(x, y, n, np) {
  var i, j, c, ui, t, ks;
  var kn = n.length;
  var ky = y.length;

  if (sa.length != kn) sa = new Array(kn);

  copyInt_(sa, 0);

  for (; kn > 0 && n[kn - 1] == 0; kn--); //ignore leading zeros of n
  for (; ky > 0 && y[ky - 1] == 0; ky--); //ignore leading zeros of y
  ks = sa.length - 1; //sa will never have more than this many nonzero elements.

  //the following loop consumes 95% of the runtime for randTruePrime_() and powMod_() for large numbers
  for (i = 0; i < kn; i++) {
    t = sa[0] + x[i] * y[0];
    ui = (t & mask) * np & mask; //the inner "& mask" was needed on Safari (but not MSIE) at one time
    c = t + ui * n[0] >> bpe;
    t = x[i];

    //do sa=(sa+x[i]*y+ui*n)/b   where b=2**bpe.  Loop is unrolled 5-fold for speed
    j = 1;
    for (; j < ky - 4;) {
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
    }
    for (; j < ky;) {
      c += sa[j] + ui * n[j] + t * y[j];sa[j - 1] = c & mask;c >>= bpe;j++;
    }
    for (; j < kn - 4;) {
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
    }
    for (; j < kn;) {
      c += sa[j] + ui * n[j];sa[j - 1] = c & mask;c >>= bpe;j++;
    }
    for (; j < ks;) {
      c += sa[j];sa[j - 1] = c & mask;c >>= bpe;j++;
    }
    sa[j - 1] = c & mask;
  }

  if (!greater(n, sa)) sub_(sa, n);
  copy_(x, sa);
}

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tl__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bin__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return prepareRsaKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return selectRsaKeyByFingerPrint; });




/**
*  Server public key, obtained from here: https://core.telegram.org/api/obtaining_api_id
*
* -----BEGIN RSA PUBLIC KEY-----
* MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
* lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
* an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
* Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
* 8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
* Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
* -----END RSA PUBLIC KEY-----
*/

const publisKeysHex = [{
  modulus: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
  exponent: '010001'
}];

const publicKeysParsed = {};
let prepared = false;

const mapPrepare = keyParsed => {
  const RSAPublicKey = new __WEBPACK_IMPORTED_MODULE_0__tl__["a" /* TLSerialization */]();
  RSAPublicKey.storeBytes(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["x" /* bytesFromHex */])(keyParsed.modulus), 'n');
  RSAPublicKey.storeBytes(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["x" /* bytesFromHex */])(keyParsed.exponent), 'e');

  const buffer = RSAPublicKey.getBuffer();

  const fingerprintBytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["k" /* sha1BytesSync */])(buffer).slice(-8);
  fingerprintBytes.reverse();

  publicKeysParsed[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["e" /* bytesToHex */])(fingerprintBytes)] = {
    modulus: keyParsed.modulus,
    exponent: keyParsed.exponent
  };
};
const prepareRsaKeys = () => {
  if (prepared) return;
  publisKeysHex.forEach(mapPrepare);
  prepared = true;
};

const selectRsaKeyByFingerPrint = fingerprints => {
  prepareRsaKeys();

  let fingerprintHex, foundKey;
  for (let i = 0; i < fingerprints.length; i++) {
    fingerprintHex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["b" /* bigStringInt */])(fingerprints[i]).toString(16);
    if (foundKey = publicKeysParsed[fingerprintHex]) return Object.assign({ fingerprint: fingerprints[i] }, foundKey);
  }

  return false;
};




/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(126);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(127);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(130);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(132);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_setimmediate__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_setimmediate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_setimmediate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__smart_timeout__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "smartTimeout", function() { return __WEBPACK_IMPORTED_MODULE_1__smart_timeout__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "blueDefer", function() { return __WEBPACK_IMPORTED_MODULE_2__defer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__crypto__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CryptoWorker", function() { return __WEBPACK_IMPORTED_MODULE_3__crypto__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bin__ = __webpack_require__(1);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bin", function() { return __WEBPACK_IMPORTED_MODULE_4__bin__["bin"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__for_each__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_5__for_each__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__service_api_manager_index_js__ = __webpack_require__(28);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mtpInvokeApi", function() { return __WEBPACK_IMPORTED_MODULE_6__service_api_manager_index_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mtpClearStorage", function() { return __WEBPACK_IMPORTED_MODULE_6__service_api_manager_index_js__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "api", function() { return __WEBPACK_IMPORTED_MODULE_6__service_api_manager_index_js__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ApiManager", function() { return __WEBPACK_IMPORTED_MODULE_6__service_api_manager_index_js__["d"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__store__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PureStorage", function() { return __WEBPACK_IMPORTED_MODULE_7__store__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_time_manager__ = __webpack_require__(5);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpTimeManager", function() { return __WEBPACK_IMPORTED_MODULE_8__service_time_manager__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_dc_configurator__ = __webpack_require__(10);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpDcConfigurator", function() { return __WEBPACK_IMPORTED_MODULE_9__service_dc_configurator__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_authorizer__ = __webpack_require__(15);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpAuthorizer", function() { return __WEBPACK_IMPORTED_MODULE_10__service_authorizer__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__service_secure_random__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MtpSecureRandom", function() { return __WEBPACK_IMPORTED_MODULE_11__service_secure_random__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__service_networker__ = __webpack_require__(16);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpNetworker", function() { return __WEBPACK_IMPORTED_MODULE_12__service_networker__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__tl__ = __webpack_require__(7);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TLSerialization", function() { return __WEBPACK_IMPORTED_MODULE_13__tl__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "TLDeserialization", function() { return __WEBPACK_IMPORTED_MODULE_13__tl__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__http__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "httpClient", function() { return __WEBPACK_IMPORTED_MODULE_14__http__["a"]; });
















// import * as MtpRsaKeysManager from './service/rsa-keys-manger'
// export { MtpRsaKeysManager }














console.debug('source loaded');

/* harmony default export */ __webpack_exports__["default"] = {};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * EventEmitter2
 * https://github.com/hij1nx/EventEmitter2
 *
 * Copyright (c) 2013 hij1nx
 * Licensed under the MIT license.
 */
;!function(undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      this._conf = conf;

      conf.delimiter && (this.delimiter = conf.delimiter);
      this._events.maxListeners = conf.maxListeners !== undefined ? conf.maxListeners : defaultMaxListeners;
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);
      conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    } else {
      this._events.maxListeners = defaultMaxListeners;
    }
  }

  function logPossibleMemoryLeak(count, eventName) {
    var errorMsg = '(node) warning: possible EventEmitter memory ' +
        'leak detected. %d listeners added. ' +
        'Use emitter.setMaxListeners() to increase limit.';

    if(this.verboseMemoryLeak){
      errorMsg += ' Event name: %s.';
      console.error(errorMsg, count, eventName);
    } else {
      console.error(errorMsg, count);
    }

    if (console.trace){
      console.trace();
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    this.verboseMemoryLeak = false;
    configure.call(this, conf);
  }
  EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }

    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }

        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name !== undefined) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else {
          if (typeof tree._listeners === 'function') {
            tree._listeners = [tree._listeners];
          }

          tree._listeners.push(listener);

          if (
            !tree._listeners.warned &&
            this._events.maxListeners > 0 &&
            tree._listeners.length > this._events.maxListeners
          ) {
            tree._listeners.warned = true;
            logPossibleMemoryLeak.call(this, tree._listeners.length, name);
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  }

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    if (n !== undefined) {
      this._events || init.call(this);
      this._events.maxListeners = n;
      if (!this._conf) this._conf = {};
      this._conf.maxListeners = n;
    }
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    }

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) {
        return false;
      }
    }

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all && this._all.length) {
      handler = this._all.slice();
      if (al > 3) {
        args = new Array(al);
        for (j = 0; j < al; j++) args[j] = arguments[j];
      }

      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this, type);
          break;
        case 2:
          handler[i].call(this, type, arguments[1]);
          break;
        case 3:
          handler[i].call(this, type, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
      if (typeof handler === 'function') {
        this.event = type;
        switch (al) {
        case 1:
          handler.call(this);
          break;
        case 2:
          handler.call(this, arguments[1]);
          break;
        case 3:
          handler.call(this, arguments[1], arguments[2]);
          break;
        default:
          args = new Array(al - 1);
          for (j = 1; j < al; j++) args[j - 1] = arguments[j];
          handler.apply(this, args);
        }
        return true;
      } else if (handler) {
        // need to make copy of handlers because list can change in the middle
        // of emit call
        handler = handler.slice();
      }
    }

    if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          handler[i].call(this);
          break;
        case 2:
          handler[i].call(this, arguments[1]);
          break;
        case 3:
          handler[i].call(this, arguments[1], arguments[2]);
          break;
        default:
          handler[i].apply(this, args);
        }
      }
      return true;
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }

    return !!this._all;
  };

  EventEmitter.prototype.emitAsync = function() {

    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
        if (!this._events.newListener) { return Promise.resolve([false]); }
    }

    var promises= [];

    var al = arguments.length;
    var args,l,i,j;
    var handler;

    if (this._all) {
      if (al > 3) {
        args = new Array(al);
        for (j = 1; j < al; j++) args[j] = arguments[j];
      }
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(this._all[i].call(this, type));
          break;
        case 2:
          promises.push(this._all[i].call(this, type, arguments[1]));
          break;
        case 3:
          promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
          break;
        default:
          promises.push(this._all[i].apply(this, args));
        }
      }
    }

    if (this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    } else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      switch (al) {
      case 1:
        promises.push(handler.call(this));
        break;
      case 2:
        promises.push(handler.call(this, arguments[1]));
        break;
      case 3:
        promises.push(handler.call(this, arguments[1], arguments[2]));
        break;
      default:
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
        promises.push(handler.apply(this, args));
      }
    } else if (handler && handler.length) {
      if (al > 3) {
        args = new Array(al - 1);
        for (j = 1; j < al; j++) args[j - 1] = arguments[j];
      }
      for (i = 0, l = handler.length; i < l; i++) {
        this.event = type;
        switch (al) {
        case 1:
          promises.push(handler[i].call(this));
          break;
        case 2:
          promises.push(handler[i].call(this, arguments[1]));
          break;
        case 3:
          promises.push(handler[i].call(this, arguments[1], arguments[2]));
          break;
        default:
          promises.push(handler[i].apply(this, args));
        }
      }
    } else if (!this._all && type === 'error') {
      if (arguments[1] instanceof Error) {
        return Promise.reject(arguments[1]); // Unhandled 'error' event
      } else {
        return Promise.reject("Uncaught, unspecified 'error' event.");
      }
    }

    return Promise.all(promises);
  };

  EventEmitter.prototype.on = function(type, listener) {
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if (this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else {
      if (typeof this._events[type] === 'function') {
        // Change to array.
        this._events[type] = [this._events[type]];
      }

      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (
        !this._events[type].warned &&
        this._events.maxListeners > 0 &&
        this._events[type].length > this._events.maxListeners
      ) {
        this._events[type].warned = true;
        logPossibleMemoryLeak.call(this, this._events[type].length, type);
      }
    }

    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {
    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    if (!this._all) {
      this._all = [];
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          continue;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1);
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }

        this.emit("removeListener", type, listener);

        return this;
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }

        this.emit("removeListener", type, listener);
      }
    }

    function recursivelyGarbageCollect(root) {
      if (root === undefined) {
        return;
      }
      var keys = Object.keys(root);
      for (var i in keys) {
        var key = keys[i];
        var obj = root[key];
        if ((obj instanceof Function) || (typeof obj !== "object") || (obj === null))
          continue;
        if (Object.keys(obj).length > 0) {
          recursivelyGarbageCollect(root[key]);
        }
        if (Object.keys(obj).length === 0) {
          delete root[key];
        }
      }
    }
    recursivelyGarbageCollect(this.listenerTree);

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          this.emit("removeListenerAny", fn);
          return this;
        }
      }
    } else {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++)
        this.emit("removeListenerAny", fns[i]);
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if (this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else if (this._events) {
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if (this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenerCount = function(type) {
    return this.listeners(type).length;
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (true) {
     // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return EventEmitter;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = EventEmitter;
  }
  else {
    // Browser global.
    window.EventEmitter2 = EventEmitter;
  }
}();


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_eventemitter2__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_eventemitter2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_eventemitter2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__networker__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__authorizer__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__bin__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__error_cases__ = __webpack_require__(29);















const mtpSetUserAuth = onAuth => function mtpSetUserAuth(dcID, userAuth) {
  const fullUserAuth = Object.assign({ dcID }, userAuth);
  __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].set({
    dc: dcID,
    user_auth: fullUserAuth
  });
  onAuth(fullUserAuth, dcID);
};
/* unused harmony export mtpSetUserAuth */


const hasPath = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["pathSatisfies"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["complement"])(__WEBPACK_IMPORTED_MODULE_2_ramda__["isNil"]));
const defDc = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["unless"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["is"])(Number), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["always"])(2));

const baseDcID = 2;

const mtpClearStorage = function () {
  const saveKeys = [];
  for (let dcID = 1; dcID <= 5; dcID++) {
    saveKeys.push(`dc${dcID}_auth_key`);
    saveKeys.push(`t_dc${dcID}_auth_key`);
  }
  __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].noPrefix();
  return __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].get(saveKeys).tap(__WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].clear).then(values => {
    const restoreObj = {};
    saveKeys.forEach((key, i) => {
      const value = values[i];
      if (value !== false && value !== undefined) restoreObj[key] = value;
    });
    __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].noPrefix();
    return restoreObj;
  }).then(__WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].set);
};
/* harmony export (immutable) */ __webpack_exports__["b"] = mtpClearStorage;


class ApiManager {
  constructor() {
    this.emitter = new __WEBPACK_IMPORTED_MODULE_1_eventemitter2___default.a({
      wildcard: true
    });
    this.on = this.emitter.on;
    this.emit = this.emitter.emit;
    this.cache = {
      uploader: {},
      downloader: {}
    };

    this.mtpGetNetworker = (dcID, options = {}) => {
      const cache = options.fileUpload || options.fileDownload ? this.cache.uploader : this.cache.downloader;
      if (!dcID) throw new Error('get Networker without dcID');

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["isNil"])(cache[dcID])) return cache[dcID];

      const akk = `dc${dcID}_auth_key`;
      const ssk = `dc${dcID}_server_salt`;

      const networkGetter = result => {
        if (cache[dcID]) return cache[dcID];

        const authKeyHex = result[0];
        let serverSaltHex = result[1];
        // console.log('ass', dcID, authKeyHex, serverSaltHex)
        if (authKeyHex && authKeyHex.length === 512) {
          if (!serverSaltHex || serverSaltHex.length !== 16) serverSaltHex = 'AAAAAAAAAAAAAAAA';
          const authKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__bin__["x" /* bytesFromHex */])(authKeyHex);
          const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__bin__["x" /* bytesFromHex */])(serverSaltHex);

          return cache[dcID] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__networker__["getNetworker"])(dcID, authKey, serverSalt, options);
        }

        if (!options.createNetworker) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject({ type: 'AUTH_KEY_EMPTY', code: 401 });

        const onDcAuth = ({ authKey, serverSalt }) => {
          const storeObj = {
            [akk]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__bin__["e" /* bytesToHex */])(authKey),
            [ssk]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__bin__["e" /* bytesToHex */])(serverSalt)
          };
          __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].set(storeObj);

          return cache[dcID] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__networker__["getNetworker"])(dcID, authKey, serverSalt, options);
        };

        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__authorizer__["auth"])(dcID).then(onDcAuth, netError);
      };

      return __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].get(akk, ssk).then(networkGetter);
    };

    this.mtpInvokeApi = this.mtpInvokeApi.bind(this);
  }

  mtpInvokeApi(method, params, options = {}) {
    const self = this;
    const deferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__defer__["b" /* default */])();
    const rejectPromise = error => {
      if (!error) error = { type: 'ERROR_EMPTY' };else if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["is"])(Object, error)) error = { message: error };
      deferred.reject(error);

      if (!options.noErrorBox) {
        //TODO weird code. `error` changed after `.reject`?
        error.input = method;
        error.stack = stack || hasPath(['originalError', 'stack'], error) || error.stack || new Error().stack;
        self.emit('error.invoke', error);
      }
    };
    let dcID, cachedNetworker;

    const cachedNetThunk = () => performRequest(cachedNetworker);
    const requestThunk = waitTime => setTimeout(cachedNetThunk, waitTime * 1e3);

    const stack = new Error().stack || 'empty stack';
    const performRequest = networker => (cachedNetworker = networker).wrapApiCall(method, params, options).then(deferred.resolve, error => {
      const deferResolve = deferred.resolve;
      const apiSavedNet = () => cachedNetworker = networker;
      const apiRecall = networker => networker.wrapApiCall(method, params, options);
      console.error(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Error', error.code, error.type, baseDcID, dcID);

      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__error_cases__["a" /* switchErrors */])(error, options, this.emit, rejectPromise, requestThunk, apiSavedNet, apiRecall, deferResolve);
    });
    const getDcNetworker = (baseDcID = 2) => self.mtpGetNetworker(dcID = defDc(baseDcID), options);
    if (dcID = options.dcID || baseDcID) __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(self.mtpGetNetworker(dcID, options)).then(performRequest).catch(rejectPromise);else __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */].get('dc').then(getDcNetworker).then(performRequest).catch(rejectPromise);

    return deferred.promise;
  }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = ApiManager;


const netError = error => {
  console.log('Get networker error', error, error.stack);
  return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(error);
};

const api = new ApiManager();
/* harmony export (immutable) */ __webpack_exports__["c"] = api;


const mtpInvokeApi = api.mtpInvokeApi;
/* harmony export (immutable) */ __webpack_exports__["a"] = mtpInvokeApi;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__switch__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__time_manager__ = __webpack_require__(5);









const cachedExportPromise = {};

const protect = ({ code = NaN, type = '' }, { rawError = null }, dcID, baseDcID) => ({ code, type, dcID, base: baseDcID, rawError });

const matchProtect = matched => (error, options, emit, rejectPromise, requestThunk, apiSavedNet, apiRecall, deferResolve) => matched({ error, options, emit,
  reject: rejectPromise, requestThunk,
  apiRecall, throwNext: () => rejectPromise(error),
  deferResolve });

const patterns = {
  noBaseAuth: ({ code, dcID, base }) => code === 401 && dcID === base,
  noDcAuth: ({ code, dcID, base }) => code === 401 && dcID !== base,
  migrate: ({ code }) => code === 303,
  floodWait: ({ code, rawError }) => !rawError && code === 420,
  waitFail: ({ code, type, rawError }) => !rawError && (code === 500 || type === 'MSG_WAIT_FAILED'),
  _: () => true
};

const noBaseAuth = ({ emit, throwNext }) => {
  __WEBPACK_IMPORTED_MODULE_4__store__["a" /* PureStorage */].remove('dc', 'user_auth');
  emit('error.401.base');
  throwNext();
};

const noDcAuth = ({ dcID, reject, apiSavedNet, apiRecall, deferResolve }) => {
  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["isNil"])(cachedExportPromise[dcID])) {
    const exportDeferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__defer__["b" /* default */])();
    const importAuth = ({ id, bytes }) => self.mtpInvokeApi('auth.importAuthorization', { id, bytes }, { dcID, noErrorBox: true });

    self.mtpInvokeApi('auth.exportAuthorization', { dc_id: dcID }, { noErrorBox: true }).then(importAuth).then(exportDeferred.resolve).catch(exportDeferred.reject);

    cachedExportPromise[dcID] = exportDeferred.promise;
  }

  cachedExportPromise[dcID].then(apiSavedNet).then(apiRecall).then(deferResolve).catch(reject);
};

const migrate = ({ error, dcID, options, reject, apiRecall, deferResolve }) => {
  const newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2];
  if (newDcID === dcID) return;
  if (options.dcID) options.dcID = newDcID;else __WEBPACK_IMPORTED_MODULE_4__store__["a" /* PureStorage */].set({ dc: /*baseDcID =*/newDcID });

  self.mtpGetNetworker(newDcID, options).then(apiRecall).then(deferResolve).catch(reject);
};

const floodWait = ({ error, options, throwNext, requestThunk }) => {
  const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10;
  if (waitTime > (options.timeout || 60)) return throwNext();
  requestThunk(waitTime);
};

const waitFail = ({ options, throwNext, requestThunk }) => {
  const now = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__time_manager__["tsNow"])();
  if (options.stopTime) {
    if (now >= options.stopTime) return throwNext();
  } else options.stopTime = now + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["propOr"])(10, 'timeout', options) * 1000;
  options.waitTime = options.waitTime ? Math.min(60, options.waitTime * 1.5) : 1;
  requestThunk(options.waitTime);
};

const def = ({ throwNext }) => throwNext();

const switchErrors = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__switch__["a" /* default */])(patterns, protect)({
  noBaseAuth,
  noDcAuth,
  migrate,
  floodWait,
  waitFail,
  _: def
}, matchProtect);
/* harmony export (immutable) */ __webpack_exports__["a"] = switchErrors;


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Switch = (patterns, protector = e => e) => (matches, mProtector = e => e) => (...data) => {
  const keyList = Object.keys(patterns);
  const normalized = protector(...data);
  for (const key of keyList) if (patterns[key](normalized)) return mProtector(matches[key]);
};
/* unused harmony export Switch */


/* harmony default export */ __webpack_exports__["a"] = Switch;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = false;

// Only Node.JS has a process variable that is of [[Class]] process
try {
 module.exports = Object.prototype.toString.call(global.process) === '[object process]' 
} catch(e) {}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(62);

/***/ })
/******/ ]);
});
//# sourceMappingURL=mtproto2-browser.js.map