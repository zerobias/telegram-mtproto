(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("vendor"));
	else if(typeof define === 'function' && define.amd)
		define(["vendor"], factory);
	else if(typeof exports === 'object')
		exports["mtproto"] = factory(require("vendor"));
	else
		root["mtproto"] = factory(root["vendor"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(128);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(125);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsbn__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsbn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jsbn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rusha__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rusha___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rusha__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__goodmind_node_cryptojs_aes__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__goodmind_node_cryptojs_aes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__goodmind_node_cryptojs_aes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_pako_lib_inflate__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_pako_lib_inflate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_pako_lib_inflate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_secure_random__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__vendor_leemon__ = __webpack_require__(17);
/* harmony export (immutable) */ __webpack_exports__["A"] = bigint;
/* harmony export (immutable) */ __webpack_exports__["k"] = bigStringInt;
/* harmony export (immutable) */ __webpack_exports__["f"] = bytesToHex;
/* harmony export (immutable) */ __webpack_exports__["u"] = bytesFromHex;
/* harmony export (immutable) */ __webpack_exports__["e"] = bytesCmp;
/* harmony export (immutable) */ __webpack_exports__["w"] = bytesXor;
/* unused harmony export bytesToWords */
/* unused harmony export bytesFromWords */
/* unused harmony export bytesFromLeemonBigInt */
/* harmony export (immutable) */ __webpack_exports__["h"] = bytesToArrayBuffer;
/* harmony export (immutable) */ __webpack_exports__["c"] = convertToArrayBuffer;
/* harmony export (immutable) */ __webpack_exports__["b"] = convertToUint8Array;
/* harmony export (immutable) */ __webpack_exports__["q"] = convertToByteArray;
/* harmony export (immutable) */ __webpack_exports__["g"] = bytesFromArrayBuffer;
/* unused harmony export bufferConcat */
/* harmony export (immutable) */ __webpack_exports__["y"] = longToInts;
/* harmony export (immutable) */ __webpack_exports__["i"] = longToBytes;
/* harmony export (immutable) */ __webpack_exports__["t"] = longFromLem;
/* harmony export (immutable) */ __webpack_exports__["z"] = intToUint;
/* harmony export (immutable) */ __webpack_exports__["j"] = uintToInt;
/* harmony export (immutable) */ __webpack_exports__["m"] = sha1HashSync;
/* harmony export (immutable) */ __webpack_exports__["d"] = sha1BytesSync;
/* harmony export (immutable) */ __webpack_exports__["n"] = sha256HashSync;
/* harmony export (immutable) */ __webpack_exports__["v"] = rsaEncrypt;
/* unused harmony export addPadding */
/* harmony export (immutable) */ __webpack_exports__["o"] = aesEncryptSync;
/* harmony export (immutable) */ __webpack_exports__["p"] = aesDecryptSync;
/* harmony export (immutable) */ __webpack_exports__["B"] = gzipUncompress;
/* harmony export (immutable) */ __webpack_exports__["l"] = nextRandomInt;
/* harmony export (immutable) */ __webpack_exports__["r"] = pqPrimeFactorization;
/* unused harmony export pqPrimeLeemon */
/* harmony export (immutable) */ __webpack_exports__["s"] = bytesModPow;




const { CryptoJS } = __WEBPACK_IMPORTED_MODULE_3__goodmind_node_cryptojs_aes__;


// import Timer from 'hirestime' //TODO remove in prod!





const rushaInstance = new __WEBPACK_IMPORTED_MODULE_2_rusha___default.a(1024 * 1024);

function bigint(num) {
  return new __WEBPACK_IMPORTED_MODULE_1_jsbn__["BigInteger"](num.toString(16), 16);
}

function bigStringInt(strNum) {
  return new __WEBPACK_IMPORTED_MODULE_1_jsbn__["BigInteger"](strNum, 10);
}

const rShift32 = str => {
  const num = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(str, 10, 0);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["b" /* rightShift_ */])(num, 32);
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(num, 10);
};
/* unused harmony export rShift32 */

const strDecToHex = str => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["toLower"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(str, 10, 0), 16));
/* harmony export (immutable) */ __webpack_exports__["x"] = strDecToHex;


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

  return new CryptoJS.lib.WordArray.init(words, len);
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

function bytesFromLeemonBigInt(bigInt) {
  const str = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(bigInt, 16);
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
  if (bytes.buffer !== undefined) return bytes;
  return new Uint8Array(bytes);
}

function convertToByteArray(bytes) {
  if (Array.isArray(bytes)) return bytes;
  bytes = convertToUint8Array(bytes);
  const newBytes = [];
  for (let i = 0, len = bytes.length; i < len; i++) newBytes.push(bytes[i]);
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

// const dividerBig = bigint(0x100000000)
const dividerLem = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])('100000000', 16, 4);

// const printTimers = (timeL, timeB, a, b, n) => setTimeout(
//   () => console.log(`Timer L ${timeL} B ${timeB}`, ...a, ...b, n || ''),
//   100)

function longToInts(sLong) {
  /*const bigTime = Timer()
  const divRem = bigStringInt(sLong).divideAndRemainder(dividerBig)
  const divIntB = divRem[0].intValue()
  const remIntB = divRem[1].intValue()
  const resB = [
    intToUint(divIntB),
    intToUint(remIntB)
  ]
  const timeB = bigTime()*/

  // const lemTime = Timer()
  const lemNum = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(sLong, 10, 6);
  const div = new Array(lemNum.length);
  const rem = new Array(lemNum.length);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["d" /* divide_ */])(lemNum, dividerLem, div, rem);
  const resL = [~~__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(div, 10), ~~__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(rem, 10)];
  // const timeL = lemTime()

  // printTimers(timeL, timeB, resL, resB)
  return resL;
}

function longToBytes(sLong) {
  return bytesFromWords({ words: longToInts(sLong), sigBytes: 8 }).reverse();
}

function longFromLem(high, low) {
  const highNum = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["e" /* int2bigInt */])(high, 96, 0);
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["f" /* leftShift_ */])(highNum, 32);

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["g" /* addInt_ */])(highNum, low);
  const res = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(highNum, 10);
  return res;
}

function intToUint(val) {
  val = parseInt(val); //TODO PERF parseInt is a perfomance issue
  if (val < 0) val = val + 4294967296;
  return val;
}

function uintToInt(val) {
  if (val > 2147483647) val = val - 4294967296;
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
  const hashWords = CryptoJS.SHA256(bytesToWords(bytes));
  // console.log(dT(), 'SHA-2 hash finish')

  const hashBytes = bytesFromWords(hashWords);

  return hashBytes;
}

function rsaEncrypt(publicKey, bytes) {
  bytes = addPadding(bytes, 255);

  const N = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(publicKey.modulus, 16, 256);
  const E = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(publicKey.exponent, 16, 256);
  const X = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(bytesToHex(bytes), 16, 256);
  const encryptedBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["h" /* powMod */])(X, E, N),
        encryptedBytes = bytesFromHex(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(encryptedBigInt, 16));

  return encryptedBytes;
}

function addPadding(bytes, blockSize, zeroes) {
  blockSize = blockSize || 16;
  const len = bytes.byteLength || bytes.length;
  const needPadding = blockSize - len % blockSize;
  if (needPadding > 0 && needPadding < blockSize) {
    const padding = new Array(needPadding);
    if (zeroes) {
      for (let i = 0; i < needPadding; i++) padding[i] = 0;
    } else __WEBPACK_IMPORTED_MODULE_5__service_secure_random__["a" /* default */].nextBytes(padding);

    bytes = bytes instanceof ArrayBuffer ? bufferConcat(bytes, padding) : bytes.concat(padding);
  }

  return bytes;
}

function aesEncryptSync(bytes, keyBytes, ivBytes) {
  const len = bytes.byteLength || bytes.length;

  // console.log(dT(), 'AES encrypt start', len/*, bytesToHex(keyBytes), bytesToHex(ivBytes)*/)
  bytes = addPadding(bytes);

  const encryptedWords = CryptoJS.AES.encrypt(bytesToWords(bytes), bytesToWords(keyBytes), {
    iv: bytesToWords(ivBytes),
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.IGE
  }).ciphertext;

  const encryptedBytes = bytesFromWords(encryptedWords);
  // console.log(dT(), 'AES encrypt finish')

  return encryptedBytes;
}

function aesDecryptSync(encryptedBytes, keyBytes, ivBytes) {

  // console.log(dT(), 'AES decrypt start', encryptedBytes.length)
  const decryptedWords = CryptoJS.AES.decrypt({ ciphertext: bytesToWords(encryptedBytes) }, bytesToWords(keyBytes), {
    iv: bytesToWords(ivBytes),
    padding: CryptoJS.pad.NoPadding,
    mode: CryptoJS.mode.IGE
  });

  const bytes = bytesFromWords(decryptedWords);
  // console.log(dT(), 'AES decrypt finish')

  return bytes;
}

function gzipUncompress(bytes) {
  // console.log('Gzip uncompress start')
  const result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_pako_lib_inflate__["inflate"])(bytes);
  // console.log('Gzip uncompress finish')
  return result;
}

function nextRandomInt(maxValue) {
  return Math.floor(Math.random() * maxValue);
}

function pqPrimeFactorization(pqBytes) {
  const minSize = Math.ceil(64 / __WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["i" /* bpe */]) + 1;

  // const what = new BigInteger(pqBytes)
  const hex = bytesToHex(pqBytes);
  const lWhat = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(hex, 16, minSize);
  const result = pqPrimeLeemon(lWhat);
  return result;
}

function pqPrimeLeemon(what) {
  const minBits = 64;
  const minLen = Math.ceil(minBits / __WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["i" /* bpe */]) + 1;
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["j" /* copyInt_ */])(x, nextRandomInt(1000000000) + 1);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(y, x);
    lim = 1 << i + 18;

    for (let j = 1; j < lim; j++) {
      ++it;
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(a, x);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(b, x);
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["j" /* copyInt_ */])(c, q);

      while (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["l" /* isZero */])(b)) {
        if (b[0] & 1) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["m" /* add_ */])(c, a);
          if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["n" /* greater */])(c, what)) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["o" /* sub_ */])(c, what);
          }
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["m" /* add_ */])(a, a);
        if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["n" /* greater */])(a, what)) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["o" /* sub_ */])(a, what);
        }
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["b" /* rightShift_ */])(b, 1);
      }

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(x, c);
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["n" /* greater */])(x, y)) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(z, x);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["o" /* sub_ */])(z, y);
      } else {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(z, y);
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["o" /* sub_ */])(z, x);
      }
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["p" /* eGCD_ */])(z, what, g, a, b);
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["q" /* equalsInt */])(g, 1)) {
        break;
      }
      if ((j & j - 1) === 0) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["k" /* copy_ */])(y, x);
      }
    }
    if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["n" /* greater */])(g, __WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["r" /* one */])) {
      break;
    }
  }

  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["d" /* divide_ */])(what, g, x, y);

  const [P, Q] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["n" /* greater */])(g, x) ? [x, g] : [g, x];

  // console.log(dT(), 'done', bigInt2str(what, 10), bigInt2str(P, 10), bigInt2str(Q, 10))

  return [bytesFromLeemonBigInt(P), bytesFromLeemonBigInt(Q), it];
}

function bytesModPow(x, y, m) {
  const xBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(bytesToHex(x), 16);
  const yBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(bytesToHex(y), 16);
  const mBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["a" /* str2bigInt */])(bytesToHex(m), 16);
  const resBigInt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["h" /* powMod */])(xBigInt, yBigInt, mBigInt);

  return bytesFromHex(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__vendor_leemon__["c" /* bigInt2str */])(resBigInt, 16));
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Create default initializer
                if (!subtype.hasOwnProperty('init')) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }

                // Initializer's prototype is the subtype object
                subtype.init.prototype = subtype;

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }

            return new WordArray.init(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));

exports.CryptoJS = CryptoJS;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bin__ = __webpack_require__(2);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateID", function() { return generateMessageID; });





const tsNow = seconds => {
  let t = +new Date();
  //eslint-disable-next-line
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
        random = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["l" /* nextRandomInt */])(0xFFFF);

  let messageID = [timeSec, timeMSec << 21 | random << 3 | 4];
  if (lastMessageID[0] > messageID[0] || lastMessageID[0] == messageID[0] && lastMessageID[1] >= messageID[1]) {
    messageID = [lastMessageID[0], lastMessageID[1] + 4];
  }

  lastMessageID = messageID;

  // console.log('generated msg id', messageID, timerOffset)

  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["t" /* longFromLem */])(messageID[0], messageID[1]);
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
/***/ (function(module, exports) {

module.exports = vendor;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsbn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jsbn__);


const random = new __WEBPACK_IMPORTED_MODULE_0_jsbn__["SecureRandom"]();
/* unused harmony export random */


/* harmony default export */ __webpack_exports__["a"] = random;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);


const cancelToken = Symbol('cancel token');

const timeoutRefs = new WeakSet();

const pause = delay => new __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a(r => setTimeout(r, delay));

const smartTimeout = (fn, delay = 0, ...args) => {
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

smartTimeout.immediate = (fn, ...args) => __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve().then(() => fn(...args));

smartTimeout.promise = (fn, delay = 0, ...args) => pause(delay).then(() => fn(...args));

/* harmony default export */ __webpack_exports__["b"] = smartTimeout;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_node__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__smart_timeout__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__bin__ = __webpack_require__(2);







const convertIfArray = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["when"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Array), __WEBPACK_IMPORTED_MODULE_4__bin__["b" /* convertToUint8Array */]);
let webWorker = !__WEBPACK_IMPORTED_MODULE_1_detect_node___default.a;
let taskID = 0;
const awaiting = {};
const webCrypto = __WEBPACK_IMPORTED_MODULE_1_detect_node___default.a ? false
//eslint-disable-next-line
: window.crypto.subtle || window.crypto.webkitSubtle //TODO remove browser depends
//eslint-disable-next-line
|| window.msCrypto && window.msCrypto.subtle;
const useWebCrypto = webCrypto && !!webCrypto.digest;
let useSha1Crypto = useWebCrypto;
let useSha256Crypto = useWebCrypto;
const finalizeTask = (taskID, result) => {
  const deferred = awaiting[taskID];
  if (deferred) {
    // console.log(rework_d_T(), 'CW done')
    deferred.resolve(result); //TODO Possibly, can be used as
    delete awaiting[taskID]; //
  } //    deferred = Promise.resolve()
}; //    deferred.resolve( result )

const isCryptoTask = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["both"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["has"])('taskID'), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["has"])('result'));

//eslint-disable-next-line
const workerEnable = !__WEBPACK_IMPORTED_MODULE_1_detect_node___default.a && window.Worker;
if (workerEnable) {
  __webpack_require__(37);
  const tmpWorker = new Worker('./bundle/hash.worker.js');
  // tmpWorker.onmessage = function(event) {
  //   console.info('CW tmpWorker.onmessage', event && event.data)
  // }
  tmpWorker.onmessage = e => {
    if (e.data === 'ready') {
      console.info('CW ready');
    } else if (!isCryptoTask(e.data)) {
      console.info('Not crypto task', e, e.data);
      return e;
    } else return webWorker ? finalizeTask(e.data.taskID, e.data.result) : webWorker = tmpWorker;
  };

  tmpWorker.onerror = function (error) {
    console.error('CW error', error, error.stack);
    webWorker = false;
  };
  tmpWorker.postMessage('b');
  webWorker = tmpWorker;
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
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["m" /* sha1HashSync */])(bytes);
    });
  }
  return __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(__WEBPACK_IMPORTED_MODULE_4__bin__["m" /* sha1HashSync */], bytes);
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
      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["n" /* sha256HashSync */])(bytes);
    });
  }
  return __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(__WEBPACK_IMPORTED_MODULE_4__bin__["n" /* sha256HashSync */], bytes);
};

const aesEncrypt = (bytes, keyBytes, ivBytes) => __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["c" /* convertToArrayBuffer */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["o" /* aesEncryptSync */])(bytes, keyBytes, ivBytes)));

const aesDecrypt = (encryptedBytes, keyBytes, ivBytes) => __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(() => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["c" /* convertToArrayBuffer */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["p" /* aesDecryptSync */])(encryptedBytes, keyBytes, ivBytes)));

const factorize = bytes => {
  bytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__bin__["q" /* convertToByteArray */])(bytes);
  return webWorker ? performTaskWorker('factorize', { bytes }) : __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(__WEBPACK_IMPORTED_MODULE_4__bin__["r" /* pqPrimeFactorization */], bytes);
};

const modPow = (x, y, m) => webWorker ? performTaskWorker('mod-pow', {
  x,
  y,
  m
}) : __WEBPACK_IMPORTED_MODULE_3__smart_timeout__["b" /* default */].immediate(__WEBPACK_IMPORTED_MODULE_4__bin__["s" /* bytesModPow */], x, y, m);

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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);


const httpClient = __WEBPACK_IMPORTED_MODULE_0_axios___default.a.create();
/* harmony export (immutable) */ __webpack_exports__["a"] = httpClient;

delete httpClient.defaults.headers.post['Content-Type'];
delete httpClient.defaults.headers.common['Accept'];

/* harmony default export */ __webpack_exports__["b"] = httpClient;

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(0);
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


const flatProps = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["flip"])(__WEBPACK_IMPORTED_MODULE_1_ramda__["props"]), __WEBPACK_IMPORTED_MODULE_1_ramda__["unapply"]);

const AsyncStorage = () => {
  let store = {};

  const flatGet = flatProps(store);
  const set = obj => store = Object.assign({}, store, obj);
  const remove = keys => store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["omit"])(keys, store);
  const clr = () => store = {};
  return {
    get: (...keys) => __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(flatGet(...keys)),
    set: obj => __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(set(obj)),
    remove: (...keys) => __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(remove(keys)),
    clear: () => __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(clr()),
    noPrefix: () => ({})
  };
};
/* unused harmony export AsyncStorage */


const PureStorage = AsyncStorage();
/* harmony export (immutable) */ __webpack_exports__["a"] = PureStorage;
 /*{
                                           get     : (...keys) => new Promise(rs => ConfigStorage.get(keys, rs)),
                                           set     : obj => new Promise(rs => ConfigStorage.set(obj, rs)),
                                           remove  : (...keys) => new Promise(rs => ConfigStorage.remove(...keys, rs)),
                                           noPrefix: () => ConfigStorage.noPrefix(),
                                           clear   : () => new Promise(rs => ConfigStorage.clear(rs))
                                           }*/

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_eventemitter2__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_eventemitter2___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_eventemitter2__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__networker__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__authorizer__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__dc_configurator__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__tl__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__rsa_keys_manger__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__bin__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__error_cases__ = __webpack_require__(29);


















const api57 = __webpack_require__(38);
const mtproto57 = __webpack_require__(39);

const hasPath = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["pathSatisfies"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["complement"])(__WEBPACK_IMPORTED_MODULE_2_ramda__["isNil"]));
const defDc = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["unless"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["is"])(Number), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["always"])(2));
const withoutNil = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["reject"])(__WEBPACK_IMPORTED_MODULE_2_ramda__["isNil"]);

const baseDcID = 2;

const Ln = (length, obj) => obj && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["propEq"])('length', length, obj);

class ApiManager {

  constructor({
    server = {},
    api = {},
    app: {
      debug = false,
      storage = __WEBPACK_IMPORTED_MODULE_5__store__["a" /* PureStorage */]
    } = {},
    schema = api57,
    mtSchema = mtproto57
  } = {}) {
    this.emitter = new __WEBPACK_IMPORTED_MODULE_1_eventemitter2___default.a({
      wildcard: true
    });
    this.on = this.emitter.on.bind(this.emitter);
    this.emit = this.emitter.emit.bind(this.emitter);
    this.cache = {
      uploader: {},
      downloader: {},
      auth: {},
      servers: {}
    };

    this.mtpGetNetworker = (dcID, options = {}) => {
      const isUpload = options.fileUpload || options.fileDownload;
      const cache = isUpload ? this.cache.uploader : this.cache.downloader;
      if (!dcID) throw new Error('get Networker without dcID');

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["isNil"])(cache[dcID])) return cache[dcID];

      const akk = `dc${dcID}_auth_key`;
      const ssk = `dc${dcID}_server_salt`;

      const dcUrl = this.chooseServer(dcID, isUpload);

      const networkGetter = result => {
        if (cache[dcID]) return cache[dcID];

        const authKeyHex = result[0];
        let serverSaltHex = result[1];
        // console.log('ass', dcID, authKeyHex, serverSaltHex)
        if (Ln(512, authKeyHex)) {
          if (!serverSaltHex || serverSaltHex.length !== 16) serverSaltHex = 'AAAAAAAAAAAAAAAA';
          const authKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__bin__["u" /* bytesFromHex */])(authKeyHex);
          const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__bin__["u" /* bytesFromHex */])(serverSaltHex);

          return cache[dcID] = new this.networkFabric(dcID, authKey, serverSalt, options);
        }

        if (!options.createNetworker) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject({ type: 'AUTH_KEY_EMPTY', code: 401 });

        const onDcAuth = ({ authKey, serverSalt }) => {
          const storeObj = {
            [akk]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__bin__["f" /* bytesToHex */])(authKey),
            [ssk]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__bin__["f" /* bytesToHex */])(serverSalt)
          };
          this.storage.set(storeObj);

          return cache[dcID] = new this.networkFabric(dcID, authKey, serverSalt, options);
        };

        return this.auth(dcID, this.cache.auth, dcUrl).then(onDcAuth, netError);
      };

      return this.storage.get(akk, ssk).then(networkGetter);
    };

    this.mtpClearStorage = function () {
      const saveKeys = [];
      for (let dcID = 1; dcID <= 5; dcID++) {
        saveKeys.push(`dc${dcID}_auth_key`);
        saveKeys.push(`t_dc${dcID}_auth_key`);
      }
      this.storage.noPrefix(); //TODO Remove noPrefix
      return this.storage.get(saveKeys).tap(this.storage.clear).then(values => {
        const restoreObj = {};
        saveKeys.forEach((key, i) => {
          const value = values[i];
          if (value !== false && value !== undefined) restoreObj[key] = value;
        });
        this.storage.noPrefix();
        return restoreObj;
      }).then(this.storage.set);
    };

    this.storage = storage;
    this.serverConfig = server;
    this.debug = debug;
    this.schema = schema;
    this.mtSchema = mtSchema;
    this.chooseServer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__dc_configurator__["chooseServer"])(this.cache.servers, server);
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this);
    this.setUserAuth = this.setUserAuth.bind(this);

    this.TL = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__tl__["a" /* default */])(schema, mtSchema);
    this.keyManager = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__rsa_keys_manger__["a" /* default */])(this.TL.Serialization);
    this.auth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__authorizer__["a" /* default */])(this.TL, this.keyManager);
    this.apiConfig = Object.assign({}, ApiManager.apiConfig, withoutNil(api));
    this.networkFabric = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__networker__["default"])(this.apiConfig, this.chooseServer, this.TL, storage, this.emit, debug);

    // return new Proxy(this, {
    //   get(ctx, name) {
    //     const result = Reflect.get(ctx, name)
    //     console.info('get', name, type(result))
    //     return result
    //   }
    // })
  }

  mtpInvokeApi(method, params, options = {}) {
    // const self = this
    const deferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__defer__["b" /* default */])();
    const rejectPromise = error => {
      if (!error) error = { type: 'ERROR_EMPTY' };else if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ramda__["is"])(Object, error)) error = { message: error };
      deferred.reject(error);

      if (!options.noErrorBox) {
        //TODO weird code. `error` changed after `.reject`?
        error.input = method;
        error.stack = stack || hasPath(['originalError', 'stack'], error) || error.stack || new Error().stack;
        this.emit('error.invoke', error);
      }
    };
    let dcID, cachedNetworker;

    const cachedNetThunk = () => performRequest(cachedNetworker);
    const requestThunk = waitTime => setTimeout(cachedNetThunk, waitTime * 1e3);

    const defError = new Error();
    const stack = defError.stack || 'empty stack';
    const performRequest = networker => (cachedNetworker = networker).wrapApiCall(method, params, options).then(deferred.resolve, error => {
      const deferResolve = deferred.resolve;
      const apiSavedNet = () => cachedNetworker = networker;
      const apiRecall = networker => networker.wrapApiCall(method, params, options);
      console.error(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__time_manager__["dTime"])(), 'Error', error.code, error.type, baseDcID, dcID);

      return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__error_cases__["a" /* switchErrors */])(error, options, dcID, baseDcID)(error, options, dcID, this.emit, rejectPromise, requestThunk, apiSavedNet, apiRecall, deferResolve, this.mtpInvokeApi, this.mtpGetNetworker, this.storage);
    });
    const getDcNetworker = (baseDcID = 2) => this.mtpGetNetworker(dcID = defDc(baseDcID), options);

    dcID = options.dcID || baseDcID;
    if (dcID) __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve(this.mtpGetNetworker(dcID, options)).then(performRequest).catch(rejectPromise);else this.storage.get('dc').then(getDcNetworker).then(performRequest).catch(rejectPromise);

    return deferred.promise;
  }
  setUserAuth(dcID, userAuth) {
    const fullUserAuth = Object.assign({ dcID }, userAuth);
    this.storage.set({
      dc: dcID,
      user_auth: fullUserAuth
    });
    this.emit('auth.dc', { dc: dcID, auth: userAuth });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ApiManager;


ApiManager.apiConfig = {
  invokeWithLayer: 0xda9b0d0d,
  layer: 57,
  initConnection: 0x69796de9,
  api_id: 49631,
  device_model: 'Unknown UserAgent',
  system_version: 'Unknown Platform',
  app_version: '1.0.1',
  lang_code: 'en'
};
const netError = error => {
  console.log('Get networker error', error, error.stack);
  return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(error);
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {module.exports = false;

// Only Node.JS has a process variable that is of [[Class]] process
try {
 module.exports = Object.prototype.toString.call(global.process) === '[object process]' 
} catch(e) {}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);


const indexedMap = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["addIndex"])(__WEBPACK_IMPORTED_MODULE_0_ramda__["map"]);
const forEach = (data, func) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["reject"])(__WEBPACK_IMPORTED_MODULE_0_ramda__["isNil"]), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["ifElse"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["is"])(Array), indexedMap(func), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["mapObjIndexed"])(func)))(data);
/* harmony export (immutable) */ __webpack_exports__["a"] = forEach;


/* harmony default export */ __webpack_exports__["b"] = forEach;

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ramda__);


const sslSubdomains = ['pluto', 'venus', 'aurora', 'vesta', 'flora'];

const devDC = [{ id: 1, host: '149.154.175.10', port: 80 }, { id: 2, host: '149.154.167.40', port: 80 }, { id: 3, host: '149.154.175.117', port: 80 }];

const prodDC = [{ id: 1, host: '149.154.175.50', port: 80 }, { id: 2, host: '149.154.167.51', port: 80 }, { id: 3, host: '149.154.175.100', port: 80 }, { id: 4, host: '149.154.167.91', port: 80 }, { id: 5, host: '149.154.171.5', port: 80 }];

const portString = ({ port = 80 }) => port === 80 ? '' : `:${port}`;

const findById = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["pipe"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["propEq"])('id'), __WEBPACK_IMPORTED_MODULE_0_ramda__["find"]);

const chooseServer = (chosenServers, {
  dev = false,
  webogram = false,
  dcList = dev ? devDC : prodDC
} = {}) => (dcID, upload = false) => {
  const choosen = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["prop"])(dcID);
  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_ramda__["has"])(dcID, chosenServers)) return choosen(chosenServers);
  let chosenServer = false;

  if (webogram) {
    const subdomain = sslSubdomains[dcID - 1] + (upload ? '-1' : '');
    const path = dev ? 'apiw_test1' : 'apiw1';
    chosenServer = `https://${subdomain}.web.telegram.org/${path}`;
    return chosenServer; //TODO Possibly bug. Isn't it necessary? chosenServers[dcID] = chosenServer
  }
  const dcOption = findById(dcID)(dcList);
  if (dcOption) chosenServer = `http://${dcOption.host}${portString(dcOption)}/apiw1`;
  chosenServers[dcID] = chosenServer;

  return choosen(chosenServers);
};
/* harmony export (immutable) */ __webpack_exports__["chooseServer"] = chooseServer;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__crypto__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__secure_random__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__for_each__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__smart_timeout__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__http__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__bin__ = __webpack_require__(2);














let updatesProcessor;
let iii = 0;
let offlineInited = false;
let akStopped = false;
// const chromeMatches = navigator.userAgent.match(/Chrome\/(\d+(\.\d+)?)/)
// const chromeVersion = chromeMatches && parseFloat(chromeMatches[1]) || false
// const xhrSendBuffer = !('ArrayBufferView' in window) && (!chromeVersion || chromeVersion < 30)


const NetworkerFabric = (appConfig, chooseServer, { Serialization, Deserialization }, storage, emit, debug) => {
  var _class, _temp, _initialiseProps;

  return _temp = _class = class NetworkerThread {
    constructor(dc, authKey, serverSalt, options = {}) {
      _initialiseProps.call(this);

      this.dcID = dc;
      this.iii = iii++;

      this.authKey = authKey;
      this.authKeyUint8 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["b" /* convertToUint8Array */])(authKey);
      this.authKeyBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["c" /* convertToArrayBuffer */])(authKey);
      this.authKeyID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["d" /* sha1BytesSync */])(authKey).slice(-8);

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
      const serializer = new Serialization({ mtproto: true });

      serializer.storeMethod(method, params);

      const messageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
      const seqNo = this.generateSeqNo();
      const message = {
        msg_id: messageID,
        seq_no: seqNo,
        body: serializer.getBytes()
      };

      if (debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'MT call', method, params, messageID, seqNo);

      return this.pushMessage(message, options);
    }

    wrapMtpMessage(object, options = {}) {

      const serializer = new Serialization({ mtproto: true });
      serializer.storeObject(object, 'Object');

      const messageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])();
      const seqNo = this.generateSeqNo(options.notContentRelated);
      const message = {
        msg_id: messageID,
        seq_no: seqNo,
        body: serializer.getBytes()
      };

      if (debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'MT message', object, messageID, seqNo);

      return this.pushMessage(message, options);
    }

    wrapApiCall(method, params, options) {
      const serializer = new Serialization(options);

      if (!this.connectionInited) {
        // serializer.storeInt(0xda9b0d0d, 'invokeWithLayer')
        // serializer.storeInt(Config.Schema.API.layer, 'layer')
        // serializer.storeInt(0x69796de9, 'initConnection')
        // serializer.storeInt(Config.App.id, 'api_id')
        // serializer.storeString(navigator.userAgent || 'Unknown UserAgent', 'device_model')
        // serializer.storeString(navigator.platform || 'Unknown Platform', 'system_version')
        // serializer.storeString(Config.App.version, 'app_version')
        // serializer.storeString(navigator.language || 'en', 'lang_code')
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["mapObjIndexed"])(serializer.storeIntString, appConfig);
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

      if (debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Api call', method, params, messageID, seqNo, options);else console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Api call', method);

      return this.pushMessage(message, options);
    }

    pushMessage(message, options = {}) {
      const deferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__defer__["b" /* default */])();

      this.sentMessages[message.msg_id] = Object.assign({}, message, options, { deferred });
      this.pendingMessages[message.msg_id] = 0;

      if (!options || !options.noShedule) this.sheduleRequest();
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Object, options)) options.messageID = message.msg_id;

      return deferred.promise;
    }

    pushResend(messageID, delay) {
      const value = delay ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + delay : 0;
      const innerMap = innerMsg => this.pendingMessages[innerMsg] = value;
      const sentMessage = this.sentMessages[messageID];
      if (sentMessage.container) sentMessage.inner.forEach(innerMap);else this.pendingMessages[messageID] = value;

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
      if (this.offline !== undefined && this.offline == enabled) return false;

      this.offline = enabled;

      if (this.offline) {
        __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].cancel(this.nextReqPromise);
        delete this.nextReq;

        if (this.checkConnectionPeriod < 1.5) this.checkConnectionPeriod = 0;

        this.checkConnectionPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */])(this.checkConnection, parseInt(this.checkConnectionPeriod * 1000));
        this.checkConnectionPeriod = Math.min(30, (1 + this.checkConnectionPeriod) * 1.5);

        this.onOnlineCb = this.checkConnection;
        emit('net.offline', this.onOnlineCb);
      } else {
        delete this.longPollPending;
        this.checkLongPoll();
        this.sheduleRequest();

        if (this.onOnlineCb) emit('net.online', this.onOnlineCb);

        __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].cancel(this.checkConnectionPromise);
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
        msgKey
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

      const deserializer = new Deserialization(responseBuffer);

      const authKeyID = deserializer.fetchIntBytes(64, false, 'auth_key_id');
      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["e" /* bytesCmp */])(authKeyID, this.authKeyID)) {
        throw new Error(`[MT] Invalid server auth_key_id: ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["f" /* bytesToHex */])(authKeyID)}`);
      }
      const msgKey = deserializer.fetchIntBytes(128, true, 'msg_key');
      const encryptedData = deserializer.fetchRawBytes(responseBuffer.byteLength - deserializer.getOffset(), true, 'encrypted_data');

      const afterDecrypt = dataWithPadding => {
        // console.log(dTime(), 'after decrypt')
        const deserializer = new Deserialization(dataWithPadding, { mtproto: true });

        const salt = deserializer.fetchIntBytes(64, false, 'salt');
        const sessionID = deserializer.fetchIntBytes(64, false, 'session_id');
        const messageID = deserializer.fetchLong('message_id');

        const isInvalidSession = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["e" /* bytesCmp */])(sessionID, this.sessionID) && (!this.prevSessionID || !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["e" /* bytesCmp */])(sessionID, this.prevSessionID));
        if (isInvalidSession) {
          console.warn('Sessions', sessionID, this.sessionID, this.prevSessionID);
          throw new Error(`[MT] Invalid server session_id: ${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["f" /* bytesToHex */])(sessionID)}`);
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
        const hashData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["b" /* convertToUint8Array */])(dataWithPadding).subarray(0, offset);

        const afterShaHash = dataHash => {
          if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["e" /* bytesCmp */])(msgKey, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["g" /* bytesFromArrayBuffer */])(dataHash).slice(-16))) {
            console.warn(msgKey, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["g" /* bytesFromArrayBuffer */])(dataHash));
            throw new Error('[MT] server msgKey mismatch');
          }

          const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["h" /* bytesToArrayBuffer */])(messageBody);
          const deserializerOptions = getDeserializeOpts(this.getMsgById);
          const deserializer = new Deserialization(buffer, deserializerOptions);
          const response = deserializer.fetchObject('', 'INPUT');

          return {
            response,
            messageID,
            sessionID,
            seqNo
          };
        };
        return __WEBPACK_IMPORTED_MODULE_2__crypto__["b" /* default */].sha1Hash(hashData).then(afterShaHash);
      };

      return this.getDecryptedMessage(msgKey, encryptedData).then(afterDecrypt);
    }

    applyServerSalt(newServerSalt) {
      const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["i" /* longToBytes */])(newServerSalt);

      const storeObj = {
        [`dc${this.dcID}_server_salt`]: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["f" /* bytesToHex */])(serverSalt)
      };
      storage.set(storeObj);

      this.serverSalt = serverSalt;
      return true;
    }

    sheduleRequest(delay = 0) {
      if (this.offline) this.checkConnection('forced shedule');
      const nextReq = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + delay;

      if (delay && this.nextReq && this.nextReq <= nextReq) return false;

      // console.log(dTime(), 'shedule req', delay)
      // console.trace()
      __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].cancel(this.nextReqPromise);
      if (delay > 0) this.nextReqPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */])(this.performSheduledRequest, delay);else __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].immediate(this.performSheduledRequest);

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
      rawError.error_code = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["j" /* uintToInt */])(rawError.error_code);

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
              if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["applyServerTime"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["k" /* bigStringInt */])(messageID).shiftRight(32).toString(10))) {
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
            storage.get('dc').then(onBaseDc);
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
                if (debug) {
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
  }, _initialiseProps = function () {
    this.checkLongPollCond = () => this.longPollPending && this.longPollPending > __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() || !!this.offline || akStopped;

    this.checkLongPollAfterDcCond = (isClean, baseDc) => isClean && (this.dcID !== baseDc || this.upload || this.sleepAfter && this.sleepAfter < __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])());

    this.checkLongPoll = force => {
      const isClean = this.cleanupSent();
      // console.log('Check lp', this.longPollPending, tsNow(), this.dcID, isClean)
      if (this.checkLongPollCond()) return false;

      const afterGetDc = baseDc => {
        if (this.checkLongPollAfterDcCond(isClean, baseDc))
          // console.warn(dTime(), 'Send long-poll for DC is delayed', this.dcID, this.sleepAfter)
          return;

        return this.sendLongPoll();
      };

      storage.get('dc').then(afterGetDc);
    };

    this.onHttpWait = () => {
      delete this.longPollPending;
      return __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].immediate(this.checkLongPoll);
    };

    this.sendLongPoll = () => {
      const maxWait = 25000;
      this.longPollPending = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["tsNow"])() + maxWait;
      // console.log('Set lp', this.longPollPending, tsNow())

      return this.wrapMtpCall('http_wait', {
        max_delay: 500,
        wait_after: 150,
        max_wait: maxWait
      }, {
        noResponse: true,
        longPoll: true
      }).then(this.onHttpWait, () => {
        console.log('Long-poll failed');
      });
    };

    this.checkConnection = event => {
      console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Check connection', event);
      __WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */].cancel(this.checkConnectionPromise);

      const serializer = new Serialization({ mtproto: true });
      const pingID = [__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["l" /* nextRandomInt */])(0xFFFFFFFF), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__bin__["l" /* nextRandomInt */])(0xFFFFFFFF)];

      serializer.storeMethod('ping', { ping_id: pingID });

      const pingMessage = {
        msg_id: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["generateID"])(),
        seq_no: this.generateSeqNo(true),
        body: serializer.getBytes()
      };

      this.sendEncryptedRequest(pingMessage, { timeout: 15000 }).then(result => this.toggleOffline(false), () => {
        console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Delay ', this.checkConnectionPeriod * 1000);
        this.checkConnectionPromise = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__smart_timeout__["b" /* default */])(this.checkConnection, parseInt(this.checkConnectionPeriod * 1000));
        this.checkConnectionPeriod = Math.min(60, this.checkConnectionPeriod * 1.5);
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
        const serializer = new Serialization({ mtproto: true });
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
        const container = new Serialization({ mtproto: true, startMaxLength: messagesByteLen + 64 });
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

        if (debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Container', innerMessages, message.msg_id, message.seq_no);
      } else {
        if (message.noResponse) noResponseMsgs.push(message.msg_id);
        this.sentMessages[message.msg_id] = message;
      }

      this.pendingAcks = [];
      const afterSendRequest = result => {
        this.toggleOffline(false);
        // console.log('parse for', message)
        this.parseResponse(result.data).then(afterResponseParse);
      };
      const afterResponseParse = response => {
        if (debug) console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__time_manager__["dTime"])(), 'Server response', this.dcID, response);

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

    this.getRequestUrl = () => chooseServer(this.dcID, this.upload);

    this.sendEncryptedRequest = (message, options = {}) => {
      // console.log(dTime(), 'Send encrypted'/*, message*/)
      // console.trace()
      const data = new Serialization({ startMaxLength: message.body.length + 64 });

      data.storeIntBytes(this.serverSalt, 64, 'salt');
      data.storeIntBytes(this.sessionID, 64, 'session_id');

      data.storeLong(message.msg_id, 'message_id');
      data.storeInt(message.seq_no, 'seq_no');

      data.storeInt(message.body.length, 'message_data_length');
      data.storeRawBytes(message.body, 'message_data');

      const url = this.getRequestUrl();
      const baseError = { code: 406, type: 'NETWORK_BAD_RESPONSE', url };

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
        const request = new Serialization({ startMaxLength: encryptedResult.bytes.byteLength + 256 });
        request.storeIntBytes(this.authKeyID, 64, 'auth_key_id');
        request.storeIntBytes(encryptedResult.msgKey, 128, 'msg_key');
        request.storeRawBytes(encryptedResult.bytes, 'encrypted_data');

        const requestData = /*xhrSendBuffer
                            ? request.getBuffer()
                            : */request.getArray();

        try {
          options = Object.assign({ responseType: 'arraybuffer' }, options);
          return __WEBPACK_IMPORTED_MODULE_8__http__["a" /* httpClient */].post(url, requestData, options);
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
  }, _temp;
};
/* harmony export (immutable) */ __webpack_exports__["NetworkerFabric"] = NetworkerFabric;


const getDeserializeOpts = msgGetter => ({
  mtproto: true,
  override: {
    mt_message(result, field) {
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
    mt_rpc_result(result, field) {
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


const setUpdatesProcessor = callback => updatesProcessor = callback;
/* harmony export (immutable) */ __webpack_exports__["setUpdatesProcessor"] = setUpdatesProcessor;


/* harmony default export */ __webpack_exports__["default"] = NetworkerFabric;

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return bpe; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return one; });
/* harmony export (immutable) */ __webpack_exports__["h"] = powMod;
/* harmony export (immutable) */ __webpack_exports__["t"] = sub;
/* harmony export (immutable) */ __webpack_exports__["p"] = eGCD_;
/* harmony export (immutable) */ __webpack_exports__["n"] = greater;
/* harmony export (immutable) */ __webpack_exports__["d"] = divide_;
/* harmony export (immutable) */ __webpack_exports__["e"] = int2bigInt;
/* harmony export (immutable) */ __webpack_exports__["a"] = str2bigInt;
/* harmony export (immutable) */ __webpack_exports__["q"] = equalsInt;
/* harmony export (immutable) */ __webpack_exports__["l"] = isZero;
/* harmony export (immutable) */ __webpack_exports__["c"] = bigInt2str;
/* harmony export (immutable) */ __webpack_exports__["s"] = dup;
/* harmony export (immutable) */ __webpack_exports__["k"] = copy_;
/* harmony export (immutable) */ __webpack_exports__["j"] = copyInt_;
/* harmony export (immutable) */ __webpack_exports__["g"] = addInt_;
/* harmony export (immutable) */ __webpack_exports__["b"] = rightShift_;
/* harmony export (immutable) */ __webpack_exports__["f"] = leftShift_;
/* harmony export (immutable) */ __webpack_exports__["o"] = sub_;
/* harmony export (immutable) */ __webpack_exports__["m"] = add_;
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
// var s1=t;       //used in powMod_(), multMod_(), squareMod_()
// var s2=t;       //used in powMod_(), multMod_()
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
    eg_D = t //used in eGCD_(), inverseMod_()
//, md_q1=t, md_q2=t, md_q3=t, md_r=t, md_r1=t, md_r2=t, md_tt=t, //used in mod_()

,
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
  var w;
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
  var recLimit = 20; //stop recursion when k <=recLimit.  Must have recLimit >= 2

  if (s_i2.length != ans.length) {
    s_i2 = dup(ans);
    s_R = dup(ans);
    s_n1 = dup(ans);
    s_r2 = dup(ans);
    s_d = dup(ans);
    s_x1 = dup(ans); //TODO Seems like a bug in eslint, reports as unused
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
  var qp;
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
      y[0] = parseInt(s, 10); //TODO PERF Should we replace that with ~~ (not not)? https://jsperf.com/number-vs-parseint-vs-plus/7
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
      s = '';

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
  if (s.length == 0) s = '0';
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
  var len = x.length; //TODO .length in for loop have perfomance costs. Bench this
  for (c = n, i = 0; i < len; i++) {
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(123);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(126);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;
__webpack_require__(23);
__webpack_require__(26);
__webpack_require__(24);
__webpack_require__(22);
__webpack_require__(21);
__webpack_require__(27);
var JsonFormatter = __webpack_require__(25).JsonFormatter;

exports.CryptoJS = CryptoJS;
exports.JsonFormatter = JsonFormatter;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;

    // Lookup tables
    var SBOX = [];
    var INV_SBOX = [];
    var SUB_MIX_0 = [];
    var SUB_MIX_1 = [];
    var SUB_MIX_2 = [];
    var SUB_MIX_3 = [];
    var INV_SUB_MIX_0 = [];
    var INV_SUB_MIX_1 = [];
    var INV_SUB_MIX_2 = [];
    var INV_SUB_MIX_3 = [];

    // Compute lookup tables
    (function () {
        // Compute double table
        var d = [];
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                d[i] = i << 1;
            } else {
                d[i] = (i << 1) ^ 0x11b;
            }
        }

        // Walk GF(2^8)
        var x = 0;
        var xi = 0;
        for (var i = 0; i < 256; i++) {
            // Compute sbox
            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
            SBOX[x] = sx;
            INV_SBOX[sx] = x;

            // Compute multiplication
            var x2 = d[x];
            var x4 = d[x2];
            var x8 = d[x4];

            // Compute sub bytes, mix columns tables
            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
            SUB_MIX_3[x] = t;

            // Compute inv sub bytes, inv mix columns tables
            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
            INV_SUB_MIX_3[sx] = t;

            // Compute next counter
            if (!x) {
                x = xi = 1;
            } else {
                x = x2 ^ d[d[d[x8 ^ x2]]];
                xi ^= d[d[xi]];
            }
        }
    }());

    // Precomputed Rcon lookup
    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

    /**
     * AES block cipher algorithm.
     */
    var AES = C_algo.AES = BlockCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySize = key.sigBytes / 4;

            // Compute number of rounds
            var nRounds = this._nRounds = keySize + 6

            // Compute number of key schedule rows
            var ksRows = (nRounds + 1) * 4;

            // Compute key schedule
            var keySchedule = this._keySchedule = [];
            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                    keySchedule[ksRow] = keyWords[ksRow];
                } else {
                    var t = keySchedule[ksRow - 1];

                    if (!(ksRow % keySize)) {
                        // Rot word
                        t = (t << 8) | (t >>> 24);

                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                        // Mix Rcon
                        t ^= RCON[(ksRow / keySize) | 0] << 24;
                    } else if (keySize > 6 && ksRow % keySize == 4) {
                        // Sub word
                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                    }

                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                }
            }

            // Compute inv key schedule
            var invKeySchedule = this._invKeySchedule = [];
            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;

                if (invKsRow % 4) {
                    var t = keySchedule[ksRow];
                } else {
                    var t = keySchedule[ksRow - 4];
                }

                if (invKsRow < 4 || ksRow <= 4) {
                    invKeySchedule[invKsRow] = t;
                } else {
                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                }
            }
        },

        encryptBlock: function (M, offset) {
            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
        },

        decryptBlock: function (M, offset) {
            // Swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;

            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

            // Inv swap 2nd and 4th rows
            var t = M[offset + 1];
            M[offset + 1] = M[offset + 3];
            M[offset + 3] = t;
        },

        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
            // Shortcut
            var nRounds = this._nRounds;

            // Get input, add round key
            var s0 = M[offset]     ^ keySchedule[0];
            var s1 = M[offset + 1] ^ keySchedule[1];
            var s2 = M[offset + 2] ^ keySchedule[2];
            var s3 = M[offset + 3] ^ keySchedule[3];

            // Key schedule row counter
            var ksRow = 4;

            // Rounds
            for (var round = 1; round < nRounds; round++) {
                // Shift rows, sub bytes, mix columns, add round key
                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                // Update state
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
            }

            // Shift rows, sub bytes, add round key
            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

            // Set output
            M[offset]     = t0;
            M[offset + 1] = t1;
            M[offset + 2] = t2;
            M[offset + 3] = t3;
        },

        keySize: 256/32
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
     */
    C.AES = BlockCipher._createHelper(AES);
}());


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function (undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-cipher logic
            this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
            // Append
            this._append(dataUpdate);

            // Process available blocks
            return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
                this._append(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
        },

        keySize: 128/32,

        ivSize: 128/32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: (function () {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }

            return function (cipher) {
                return {
                    encrypt: function (message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },

                    decrypt: function (ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            };
        }())
    });

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function () {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
        },

        blockSize: 1
    });

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * Abstract base block cipher mode template.
     */
    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        }
    });

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = C_mode.CBC = (function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // XOR and encrypt
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);

                // Remember this block to use with next block
                this._prevBlock = words.slice(offset, offset + blockSize);
            }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // Remember this block to use with next block
                var thisBlock = words.slice(offset, offset + blockSize);

                // Decrypt and XOR
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);

                // This block becomes the previous block
                this._prevBlock = thisBlock;
            }
        });

        function xorBlock(words, offset, blockSize) {
            // Shortcut
            var iv = this._iv;

            // Choose mixing block
            if (iv) {
                var block = iv;

                // Remove IV for subsequent blocks
                this._iv = undefined;
            } else {
                var block = this._prevBlock;
            }

            // XOR blocks
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }

        return CBC;
    }());

    /**
     * Infinite Garble Extension mode.
     */
    var IGE = C_mode.IGE = (function () {
        /**
         * Abstract base IGE mode.
         */
        var IGE = BlockCipherMode.extend();

        /**
         * IGE encryptor.
         */
        IGE.Encryptor = IGE.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                if (this._ivp === undefined) {
                  this._ivp = this._iv.slice(0, blockSize);
                  this._iv2p = this._iv.slice(blockSize, blockSize + blockSize);
                }


                // Remember this block to use with next block
                var nextIv2p = words.slice(offset, offset + blockSize);

                // XOR with previous ciphertext
                xorBlock(words, this._ivp, offset, blockSize);

                // Block cipher
                cipher.encryptBlock(words, offset);

                // XOR with previous plaintext
                xorBlock(words, this._iv2p, offset, blockSize);

                this._ivp = words.slice(offset, offset + blockSize);
                this._iv2p = nextIv2p;
            }
        });

        /**
         * IGE decryptor.
         */
        IGE.Decryptor = IGE.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                if (this._ivp === undefined) {
                  this._ivp = this._iv.slice(0, blockSize);
                  this._iv2p = this._iv.slice(blockSize, 2 * blockSize);
                }

                // Remember this block to use with next block
                var nextIvp = words.slice(offset, offset + blockSize);

                // XOR with previous ciphertext
                xorBlock(words, this._iv2p, offset, blockSize);

                // Block cipher
                cipher.decryptBlock(words, offset);

                // XOR with previous plaintext
                xorBlock(words, this._ivp, offset, blockSize);

                this._ivp = nextIvp;
                this._iv2p = words.slice(offset, offset + blockSize);
            }
        });

        function xorBlock(words, block, offset, blockSize) {
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }

        return IGE;
    }());

    /**
     * Padding namespace.
     */
    var C_pad = C.pad = {};

    /**
     * PKCS #5/7 padding strategy.
     */
    var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };

    var NoPadding = C_pad.NoPadding = {
        pad: function () {
        },

        unpad: function () {
        }
    };


    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
        }),

        reset: function () {
            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                var modeCreator = mode.createDecryptor;

                // Keep at least one block in the buffer for unpadding
                this._minBufferSize = 1;
            }
            this._mode = modeCreator.call(mode, this, iv && iv.words);
        },

        _doProcessBlock: function (words, offset) {
            this._mode.processBlock(words, offset);
        },

        _doFinalize: function () {
            // Shortcut
            var padding = this.cfg.padding;

            // Finalize
            if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                padding.pad(this._data, this.blockSize);

                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');

                // Unpad data
                padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
        },

        blockSize: 128/32
    });

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
            // Shortcuts
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(ciphertextWords.slice(2, 4));

                // Remove salt from ciphertext
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
    };

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Encrypt
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);

            // Shortcut
            var cipherCfg = encryptor.cfg;

            // Create and return serializable cipher params
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
            } else {
                return ciphertext;
            }
        }
    });

    /**
     * Key derivation function namespace.
     */
    var C_kdf = C.kdf = {};

    /**
     * OpenSSL key derivation function.
     */
    var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function (password, keySize, ivSize, salt) {
            // Generate random salt
            if (!salt) {
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
        }
    });
}());


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var MD5 = C_algo.MD5;

    /**
     * This key derivation function is meant to conform with EVP_BytesToKey.
     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
     */
    var EvpKDF = C_algo.EvpKDF = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
            keySize: 128/32,
            hasher: MD5,
            iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.EvpKDF.create();
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Derives a key from a password.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init hasher
            var hasher = cfg.hasher.create();

            // Initial values
            var derivedKey = WordArray.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                if (block) {
                    hasher.update(block);
                }
                var block = hasher.update(password).finalize(salt);
                hasher.reset();

                // Iterations
                for (var i = 1; i < iterations; i++) {
                    block = hasher.finalize(block);
                    hasher.reset();
                }

                derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });

    /**
     * Derives a key from a password.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     * @param {Object} cfg (Optional) The configuration options to use for this computation.
     *
     * @return {WordArray} The derived key.
     *
     * @static
     *
     * @example
     *
     *     var key = CryptoJS.EvpKDF(password, salt);
     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
     */
    C.EvpKDF = function (password, salt, cfg) {
        return EvpKDF.create(cfg).compute(password, salt);
    };
}());


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

// create custom json serialization format
var JsonFormatter = {
	stringify: function (cipherParams) {
		// create json object with ciphertext
		var jsonObj = {
			ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
		};
		
		// optionally add iv and salt
		if (cipherParams.iv) {
			jsonObj.iv = cipherParams.iv.toString();
		}
		
		if (cipherParams.salt) {
			jsonObj.s = cipherParams.salt.toString();
		}

		// stringify json object
		return JSON.stringify(jsonObj)
	},

	parse: function (jsonStr) {
		// parse json string
		var jsonObj = JSON.parse(jsonStr);
		
		// extract ciphertext from json object, and create cipher params object
		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
		});
		
		// optionally extract iv and salt
		if (jsonObj.iv) {
			cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
		}
            
		if (jsonObj.s) {
			cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
		}
		
		return cipherParams;
	}
};

exports.JsonFormatter = JsonFormatter;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants table
    var T = [];

    // Compute constants
    (function () {
        for (var i = 0; i < 64; i++) {
            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
    }());

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                M[offset_i] = (
                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcuts
            var H = this._hash.words;

            var M_offset_0  = M[offset + 0];
            var M_offset_1  = M[offset + 1];
            var M_offset_2  = M[offset + 2];
            var M_offset_3  = M[offset + 3];
            var M_offset_4  = M[offset + 4];
            var M_offset_5  = M[offset + 5];
            var M_offset_6  = M[offset + 6];
            var M_offset_7  = M[offset + 7];
            var M_offset_8  = M[offset + 8];
            var M_offset_9  = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];

            // Working varialbes
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
            d = II(d, a, b, c, M_offset_7,  10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5,  21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
            d = II(d, a, b, c, M_offset_3,  10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1,  21, T[55]);
            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6,  15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2,  15, T[62]);
            b = II(b, c, d, a, M_offset_9,  21, T[63]);

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
            );
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
            );

            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.MD5('message');
     *     var hash = CryptoJS.MD5(wordArray);
     */
    C.MD5 = Hasher._createHelper(MD5);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacMD5(message, key);
     */
    C.HmacMD5 = Hasher._createHmacHelper(MD5);
}(Math));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var CryptoJS = __webpack_require__(3).CryptoJS;

(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object
    var W = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                   (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                   (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA256('message');
     *     var hash = CryptoJS.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA256(message, key);
     */
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class MTError extends Error {
  static getMessage(code, type, message) {
    return `MT[${code}] ${type}: ${message}`;
  }
  constructor(code, type, message) {
    const fullMessage = MTError.getMessage(code, type, message);
    super(fullMessage);
    this.code = code;
    this.type = type;
  }
}
/* unused harmony export MTError */


class ErrorBadResponse extends MTError {
  constructor(url, originalError = null) {
    super(406, 'NETWORK_BAD_RESPONSE', url);
    if (originalError) this.originalError = originalError;
  }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = ErrorBadResponse;


class ErrorNotFound extends MTError {
  constructor(err) {
    super(404, 'REQUEST_FAILED', err.config.url);
    // this.originalError = err
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ErrorNotFound;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__switch__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__time_manager__ = __webpack_require__(5);








const cachedExportPromise = {};

const protect = ({ code = NaN, type = '' }, { rawError = null }, dcID, baseDcID) => ({
  base: baseDcID,
  errR: rawError,
  code,
  type,
  dcID
});

const patterns = {
  noBaseAuth: ({ code, dcID, base }) => code === 401 && dcID === base,
  noDcAuth: ({ code, dcID, base }) => code === 401 && dcID !== base,
  migrate: ({ code }) => code === 303,
  floodWait: ({ code, errR }) => !errR && code === 420,
  waitFail: ({ code, type, errR }) => !errR && (code === 500 || type === 'MSG_WAIT_FAILED'),
  _: () => true
};

const matchProtect = matched => (error, options, dcID, emit, rejectPromise, requestThunk, apiSavedNet, apiRecall, deferResolve, mtpInvokeApi, mtpGetNetworker, storage) => matched({
  invoke: mtpInvokeApi,
  throwNext: () => rejectPromise(error),
  reject: rejectPromise,
  getNet: mtpGetNetworker,
  error,
  options,
  dcID,
  emit,
  requestThunk,
  apiRecall,
  deferResolve,
  apiSavedNet,
  storage
});

const noBaseAuth = ({ emit, throwNext, storage }) => {
  storage.remove('dc', 'user_auth');
  emit('error.401.base');
  throwNext();
};

const noDcAuth = ({ dcID, reject, apiSavedNet, apiRecall, deferResolve, invoke }) => {
  const importAuth = ({ id, bytes }) => invoke('auth.importAuthorization', { id, bytes }, { dcID, noErrorBox: true });

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["isNil"])(cachedExportPromise[dcID])) {
    const exportDeferred = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__defer__["b" /* default */])();

    invoke('auth.exportAuthorization', { dc_id: dcID }, { noErrorBox: true }).then(importAuth).then(exportDeferred.resolve).catch(exportDeferred.reject);

    cachedExportPromise[dcID] = exportDeferred.promise;
  }

  cachedExportPromise[dcID].then(apiSavedNet).then(apiRecall).then(deferResolve).catch(reject);
};

const migrate = ({ error, dcID, options, reject,
  apiRecall, deferResolve, getNet, storage
}) => {
  const newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2];
  if (newDcID === dcID) return;
  if (options.dcID) options.dcID = newDcID;else storage.set({ dc: /*baseDcID =*/newDcID });

  getNet(newDcID, options).then(apiRecall).then(deferResolve).catch(reject);
};

const floodWait = ({ error, options, throwNext, requestThunk }) => {
  const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10;
  if (waitTime > (options.timeout || 60)) return throwNext();
  requestThunk(waitTime);
};

const waitFail = ({ options, throwNext, requestThunk }) => {
  const now = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__time_manager__["tsNow"])();
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defer__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__smart_timeout__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__crypto__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__secure_random__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__time_manager__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bin__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__vendor_leemon__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__send_plain_req__ = __webpack_require__(31);












// import { ErrorBadResponse } from '../../error'



const primeHex = 'c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d93' + '0f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f6945' + '8705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4a' + 'c8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba7' + '4d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9c' + 'a3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851' + 'f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b';

const asyncLog = (...data) => {
  const time = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__time_manager__["dTime"])();
  console.log(time, ...data);
  // setTimeout(() => console.log(time, ...data), 300)
};
const Auth = ({ Serialization, Deserialization }, { select, prepare }) => {
  const sendPlainReq = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__send_plain_req__["a" /* default */])({ Serialization, Deserialization });

  function mtpSendReqPQ(auth) {
    const deferred = auth.deferred;
    asyncLog('Send req_pq', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["f" /* bytesToHex */])(auth.nonce));

    const request = new Serialization({ mtproto: true });

    request.storeMethod('req_pq', { nonce: auth.nonce });

    const keyFoundCheck = key => key ? auth.publicKey = key : __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(new Error('[MT] No public key found'));

    const factorizeThunk = () => {
      asyncLog('PQ factorization start', auth.pq);
      return __WEBPACK_IMPORTED_MODULE_3__crypto__["b" /* default */].factorize(auth.pq);
    };
    const factDone = ([p, q, it]) => {
      auth.p = p;
      auth.q = q;
      asyncLog('PQ factorization done', it);
      return mtpSendReqDhParams(auth);
    };

    const factFail = error => {
      asyncLog('Worker error', error, error.stack);
      deferred.reject(error);
    };

    const factorizer = deserializer => {
      const response = deserializer.fetchObject('ResPQ');

      if (response._ !== 'resPQ') throw new Error(`[MT] resPQ response invalid: ${response._}`);

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.nonce, response.nonce)) throw new Error('[MT] resPQ nonce mismatch');

      auth.serverNonce = response.server_nonce;
      auth.pq = response.pq;
      auth.fingerprints = response.server_public_key_fingerprints;

      asyncLog('Got ResPQ', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["f" /* bytesToHex */])(auth.serverNonce), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["f" /* bytesToHex */])(auth.pq), auth.fingerprints);

      return select(auth.fingerprints).then(keyFoundCheck).then(factorizeThunk).then(factDone, factFail);
    };

    const sendPlainThunk = () => sendPlainReq(auth.dcUrl, request.getBuffer());

    return prepare().then(sendPlainThunk).then(factorizer, error => {
      console.error(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__time_manager__["dTime"])(), 'req_pq error', error.message);
      deferred.reject(error);
    });
  }

  function mtpSendReqDhParams(auth) {
    const deferred = auth.deferred;

    auth.newNonce = new Array(32);
    __WEBPACK_IMPORTED_MODULE_4__secure_random__["a" /* default */].nextBytes(auth.newNonce);

    const data = new Serialization({ mtproto: true });
    data.storeObject({
      _: 'p_q_inner_data',
      pq: auth.pq,
      p: auth.p,
      q: auth.q,
      nonce: auth.nonce,
      server_nonce: auth.serverNonce,
      new_nonce: auth.newNonce
    }, 'P_Q_inner_data', 'DECRYPTED_DATA');

    const dataWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(data.getBuffer()).concat(data.getBytes());

    const request = new Serialization({ mtproto: true });
    request.storeMethod('req_DH_params', {
      nonce: auth.nonce,
      server_nonce: auth.serverNonce,
      p: auth.p,
      q: auth.q,
      public_key_fingerprint: auth.publicKey.fingerprint,
      encrypted_data: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["v" /* rsaEncrypt */])(auth.publicKey, dataWithHash)
    });

    const afterReqDH = deserializer => {
      const response = deserializer.fetchObject('Server_DH_Params', 'RESPONSE');

      if (response._ !== 'server_DH_params_fail' && response._ !== 'server_DH_params_ok') {
        deferred.reject(new Error(`[MT] Server_DH_Params response invalid: ${response._}`));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.nonce, response.nonce)) {
        deferred.reject(new Error('[MT] Server_DH_Params nonce mismatch'));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) {
        deferred.reject(new Error('[MT] Server_DH_Params server_nonce mismatch'));
        return false;
      }

      if (response._ === 'server_DH_params_fail') {
        const newNonceHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.newNonce).slice(-16);
        if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(newNonceHash, response.new_nonce_hash)) {
          deferred.reject(new Error('[MT] server_DH_params_fail new_nonce_hash mismatch'));
          return false;
        }
        deferred.reject(new Error('[MT] server_DH_params_fail'));
        return false;
      }

      // try {
      mtpDecryptServerDhDataAnswer(auth, response.encrypted_answer);
      // } catch (e) {
      //   deferred.reject(e)
      //   return false
      // }

      mtpSendSetClientDhParams(auth);
    };

    asyncLog('Send req_DH_params');
    return sendPlainReq(auth.dcUrl, request.getBuffer()).then(afterReqDH, deferred.reject);
  }

  function mtpDecryptServerDhDataAnswer(auth, encryptedAnswer) {
    auth.tmpAesKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.newNonce.concat(auth.serverNonce)).concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.serverNonce.concat(auth.newNonce)).slice(0, 12));
    auth.tmpAesIv = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.serverNonce.concat(auth.newNonce)).slice(12).concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])([].concat(auth.newNonce, auth.newNonce)), auth.newNonce.slice(0, 4));

    const answerWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["p" /* aesDecryptSync */])(encryptedAnswer, auth.tmpAesKey, auth.tmpAesIv);

    const hash = answerWithHash.slice(0, 20);
    const answerWithPadding = answerWithHash.slice(20);
    const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["h" /* bytesToArrayBuffer */])(answerWithPadding);

    const deserializer = new Deserialization(buffer, { mtproto: true });
    const response = deserializer.fetchObject('Server_DH_inner_data');

    if (response._ !== 'server_DH_inner_data') throw new Error(`[MT] server_DH_inner_data response invalid`);

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.nonce, response.nonce)) throw new Error('[MT] server_DH_inner_data nonce mismatch');

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) throw new Error('[MT] server_DH_inner_data serverNonce mismatch');

    asyncLog('Done decrypting answer');
    auth.g = response.g;
    auth.dhPrime = response.dh_prime;
    auth.gA = response.g_a;
    auth.serverTime = response.server_time;
    auth.retry = 0;

    mtpVerifyDhParams(auth.g, auth.dhPrime, auth.gA);

    const offset = deserializer.getOffset();

    if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(hash, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(answerWithPadding.slice(0, offset)))) throw new Error('[MT] server_DH_inner_data SHA1-hash mismatch');

    auth.localTime = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__time_manager__["tsNow"])();
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__time_manager__["applyServerTime"])(auth.serverTime, auth.localTime);
  }

  const minSize = Math.ceil(64 / __WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["i" /* bpe */]) + 1;

  const getTwoPow = () => {
    //Dirty hack to count 2^(2048 - 64)
    //This number contains 496 zeroes in hex
    const arr = Array(496).fill('0');
    arr.unshift('1');
    const hex = arr.join('');
    const res = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["a" /* str2bigInt */])(hex, 16, minSize);
    return res;
  };

  const leemonTwoPow = getTwoPow();

  function mtpVerifyDhParams(g, dhPrime, gA) {
    asyncLog('Verifying DH params');
    const dhPrimeHex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["f" /* bytesToHex */])(dhPrime);
    if (g !== 3 || dhPrimeHex !== primeHex)
      // The verified value is from https://core.telegram.org/mtproto/security_guidelines
      throw new Error('[MT] DH params are not verified: unknown dhPrime');
    asyncLog('dhPrime cmp OK');

    // const gABigInt = new BigInteger(bytesToHex(gA), 16)
    // const dhPrimeBigInt = new BigInteger(dhPrimeHex, 16)

    const dhPrimeLeemon = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["a" /* str2bigInt */])(dhPrimeHex, 16, minSize);
    const gALeemon = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["a" /* str2bigInt */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["f" /* bytesToHex */])(gA), 16, minSize);
    const dhDec = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["s" /* dup */])(dhPrimeLeemon);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["o" /* sub_ */])(dhDec, __WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["r" /* one */]);
    // const dhDecStr = bigInt2str(dhDec, 16)
    // const comp = dhPrimeBigInt.subtract(BigInteger.ONE).toString(16)
    // console.log(dhPrimeLeemon, dhDecStr === comp)
    const case1 = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["n" /* greater */])(gALeemon, __WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["r" /* one */]);
    //gABigInt.compareTo(BigInteger.ONE) <= 0
    const case2 = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["n" /* greater */])(dhDec, gALeemon);
    //gABigInt.compareTo(dhPrimeBigInt.subtract(BigInteger.ONE)) >= 0
    if (case1) throw new Error('[MT] DH params are not verified: gA <= 1');

    if (case2) throw new Error('[MT] DH params are not verified: gA >= dhPrime - 1');
    // console.log(dTime(), '1 < gA < dhPrime-1 OK')


    // const two = new BigInteger(null)
    // two.fromInt(2)
    // const twoPow = two.pow(2048 - 64)

    const case3 = !!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["n" /* greater */])(leemonTwoPow, gALeemon);
    //gABigInt.compareTo(twoPow) < 0
    const dhSubPow = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["s" /* dup */])(dhPrimeLeemon);
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["t" /* sub */])(dhSubPow, leemonTwoPow);
    const case4 = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__vendor_leemon__["n" /* greater */])(dhSubPow, gALeemon);
    //gABigInt.compareTo(dhPrimeBigInt.subtract(twoPow)) >= 0
    // console.log(case3 === gABigInt.compareTo(twoPow) < 0)
    if (case3) throw new Error('[MT] DH params are not verified: gA < 2^{2048-64}');
    if (case4) throw new Error('[MT] DH params are not verified: gA > dhPrime - 2^{2048-64}');
    asyncLog('2^{2048-64} < gA < dhPrime-2^{2048-64} OK');

    return true;
  }

  function mtpSendSetClientDhParams(auth) {
    const deferred = auth.deferred;
    const gBytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["u" /* bytesFromHex */])(auth.g.toString(16));

    auth.b = new Array(256);
    __WEBPACK_IMPORTED_MODULE_4__secure_random__["a" /* default */].nextBytes(auth.b);

    const afterPlainRequest = deserializer => {
      const response = deserializer.fetchObject('Set_client_DH_params_answer');

      const onAnswer = authKey => {
        const authKeyHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(authKey),
              authKeyAux = authKeyHash.slice(0, 8),
              authKeyID = authKeyHash.slice(-8);

        asyncLog('Got Set_client_DH_params_answer', response._);
        switch (response._) {
          case 'dh_gen_ok':
            {
              const newNonceHash1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.newNonce.concat([1], authKeyAux)).slice(-16);

              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(newNonceHash1, response.new_nonce_hash1)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash1 mismatch'));
                return false;
              }

              const serverSalt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["w" /* bytesXor */])(auth.newNonce.slice(0, 8), auth.serverNonce.slice(0, 8));
              // console.log('Auth successfull!', authKeyID, authKey, serverSalt)

              auth.authKeyID = authKeyID;
              auth.authKey = authKey;
              auth.serverSalt = serverSalt;

              deferred.resolve(auth);
              break;
            }
          case 'dh_gen_retry':
            {
              const newNonceHash2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.newNonce.concat([2], authKeyAux)).slice(-16);
              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(newNonceHash2, response.new_nonce_hash2)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash2 mismatch'));
                return false;
              }

              return mtpSendSetClientDhParams(auth);
            }
          case 'dh_gen_fail':
            {
              const newNonceHash3 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(auth.newNonce.concat([3], authKeyAux)).slice(-16);
              if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(newNonceHash3, response.new_nonce_hash3)) {
                deferred.reject(new Error('[MT] Set_client_DH_params_answer new_nonce_hash3 mismatch'));
                return false;
              }

              deferred.reject(new Error('[MT] Set_client_DH_params_answer fail'));
              return false;
            }
        }
      };

      if (response._ != 'dh_gen_ok' && response._ != 'dh_gen_retry' && response._ != 'dh_gen_fail') {
        deferred.reject(new Error(`[MT] Set_client_DH_params_answer response invalid: ${response._}`));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.nonce, response.nonce)) {
        deferred.reject(new Error('[MT] Set_client_DH_params_answer nonce mismatch'));
        return false;
      }

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["e" /* bytesCmp */])(auth.serverNonce, response.server_nonce)) {
        deferred.reject(new Error('[MT] Set_client_DH_params_answer server_nonce mismatch'));
        return false;
      }

      return __WEBPACK_IMPORTED_MODULE_3__crypto__["b" /* default */].modPow(auth.gA, auth.b, auth.dhPrime).then(onAnswer);
    };

    const onGb = gB => {
      const data = new Serialization({ mtproto: true });
      data.storeObject({
        _: 'client_DH_inner_data',
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        retry_id: [0, auth.retry++],
        g_b: gB
      }, 'Client_DH_Inner_Data');

      const dataWithHash = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["d" /* sha1BytesSync */])(data.getBuffer()).concat(data.getBytes());

      const encryptedData = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["o" /* aesEncryptSync */])(dataWithHash, auth.tmpAesKey, auth.tmpAesIv);

      const request = new Serialization({ mtproto: true });
      request.storeMethod('set_client_DH_params', {
        nonce: auth.nonce,
        server_nonce: auth.serverNonce,
        encrypted_data: encryptedData
      });

      asyncLog('Send set_client_DH_params');
      return sendPlainReq(auth.dcUrl, request.getBuffer()).then(afterPlainRequest);
    };

    return __WEBPACK_IMPORTED_MODULE_3__crypto__["b" /* default */].modPow(gBytes, auth.b, auth.dhPrime).then(onGb);
  }

  function mtpAuth(dcID, cached, dcUrl) {
    if (cached[dcID]) return cached[dcID].promise;
    asyncLog('mtpAuth');
    const nonce = [];
    for (let i = 0; i < 16; i++) nonce.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__bin__["l" /* nextRandomInt */])(0xFF));

    if (!dcUrl) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(new Error(`[MT] No server found for dc ${dcID} url ${dcUrl}`));

    const auth = {
      dcID,
      dcUrl,
      nonce,
      deferred: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__defer__["b" /* default */])()
    };

    __WEBPACK_IMPORTED_MODULE_2__smart_timeout__["a" /* smartTimeout */].immediate(() => mtpSendReqPQ(auth));

    cached[dcID] = auth.deferred;

    cached[dcID].promise.catch(() => {
      delete cached[dcID];
    });

    return cached[dcID].promise;
  }

  return mtpAuth;
};
/* unused harmony export Auth */

/* harmony default export */ __webpack_exports__["a"] = Auth;

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__http__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__error__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__time_manager__ = __webpack_require__(5);







const is404 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["pathEq"])(['response', 'status'], 404);
const notError = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["allPass"])([__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["has"])('message'), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["has"])('type')]);

const SendPlain = ({ Serialization, Deserialization }) => {
  const onlySendPlainReq = (url, requestBuffer) => {
    const requestLength = requestBuffer.byteLength,
          requestArray = new Int32Array(requestBuffer);

    const header = new Serialization();
    header.storeLongP(0, 0, 'auth_key_id'); // Auth key
    header.storeLong(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__time_manager__["generateID"])(), 'msg_id'); // Msg_id
    header.storeInt(requestLength, 'request_length');

    const headerBuffer = header.getBuffer(),
          headerArray = new Int32Array(headerBuffer);
    const headerLength = headerBuffer.byteLength;

    const resultBuffer = new ArrayBuffer(headerLength + requestLength),
          resultArray = new Int32Array(resultBuffer);

    resultArray.set(headerArray);
    resultArray.set(requestArray, headerArray.length);

    const requestData = resultArray;
    // let reqPromise
    // try {
    const reqPromise = __WEBPACK_IMPORTED_MODULE_2__http__["b" /* default */].post(url, requestData, {
      responseType: 'arraybuffer'
    });
    // } catch (e) {
    //   reqPromise = Promise.reject(new ErrorBadResponse(url, e))
    // }
    return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.props({ url, req: reqPromise });
  };

  const onlySendPlainErr = err => {
    let error;
    switch (true) {
      case is404(err):
        error = new __WEBPACK_IMPORTED_MODULE_3__error__["a" /* ErrorNotFound */](err);
        break;
      case notError(err):
        error = new __WEBPACK_IMPORTED_MODULE_3__error__["b" /* ErrorBadResponse */]('', err);
        break;
      default:
        error = err;
    }
    return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(error);
  };

  const onlySendPlainRes = ({ url, req }) => {
    if (!req.data || !req.data.byteLength) return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(new __WEBPACK_IMPORTED_MODULE_3__error__["b" /* ErrorBadResponse */](url));
    let deserializer;
    try {
      deserializer = new Deserialization(req.data, { mtproto: true });
      const auth_key_id = deserializer.fetchLong('auth_key_id');
      const msg_id = deserializer.fetchLong('msg_id');
      const msg_len = deserializer.fetchInt('msg_len');
    } catch (e) {
      return __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.reject(new __WEBPACK_IMPORTED_MODULE_3__error__["b" /* ErrorBadResponse */](url, e));
    }

    return deserializer;
  };

  const sendPlainReq = (url, requestBuffer) => onlySendPlainReq(url, requestBuffer).then(onlySendPlainRes, onlySendPlainErr);

  return sendPlainReq;
};

/* harmony default export */ __webpack_exports__["a"] = SendPlain;

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bin__ = __webpack_require__(2);



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
  //eslint-disable-next-line
  modulus: 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
  exponent: '010001'
}];

const publicKeysParsed = {}; //TODO Move cache to ApiManager
let prepared = false;

const KeyManager = Serialization => {

  const mapPrepare = ({ modulus, exponent }) => {
    const RSAPublicKey = new Serialization();
    RSAPublicKey.storeBytes(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["u" /* bytesFromHex */])(modulus), 'n');
    RSAPublicKey.storeBytes(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["u" /* bytesFromHex */])(exponent), 'e');

    const buffer = RSAPublicKey.getBuffer();

    const fingerprintBytes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["d" /* sha1BytesSync */])(buffer).slice(-8);
    fingerprintBytes.reverse();

    publicKeysParsed[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["f" /* bytesToHex */])(fingerprintBytes)] = {
      modulus,
      exponent
    };
  };

  const setPrepared = () => {
    prepared = true;
  };

  const prepareRsaKeys = () => prepared ? __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.resolve() : __WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.map(publisKeysHex, mapPrepare).then(setPrepared);

  const selectRsaKey = fingerprints => () => {
    let fingerprintHex, foundKey;
    for (let i = 0; i < fingerprints.length; i++) {
      fingerprintHex = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__bin__["x" /* strDecToHex */])(fingerprints[i]);
      foundKey = publicKeysParsed[fingerprintHex];
      if (foundKey) return Object.assign({ fingerprint: fingerprints[i] }, foundKey);
    }

    return false;
  };

  const selectRsaKeyByFingerPrint = fingerprints => prepareRsaKeys().then(selectRsaKey(fingerprints));

  return {
    prepare: prepareRsaKeys,
    select: selectRsaKeyByFingerPrint
  };
};
/* unused harmony export KeyManager */


/* harmony default export */ __webpack_exports__["a"] = KeyManager;

/***/ }),
/* 33 */
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
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_detect_node___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_detect_node__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ramda___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ramda__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bin__ = __webpack_require__(2);




const toUint32 = buf => {
  let ln, res;
  if (!__WEBPACK_IMPORTED_MODULE_0_detect_node___default.a) //TODO browser behavior not equals, why?
    return new Uint32Array(buf);
  if (buf.readUInt32LE) {
    ln = buf.byteLength / 4;
    res = new Uint32Array(ln);
    for (let i = 0; i < ln; i++) res[i] = buf.readUInt32LE(i * 4);
  } else {
    const data = new DataView(buf);
    ln = data.byteLength / 4;
    res = new Uint32Array(ln);
    for (let i = 0; i < ln; i++) res[i] = data.getUint32(i * 4, true);
  }
  return res;
};

const TL = (api, mtApi) => {

  class Serialization {
    constructor({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) {
      this.storeIntString = (value, field) => {
        const valType = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["type"])(value);
        switch (true) {
          case __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(String, value):
            return this.storeString(value, field);
          case __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Number, value):
            return this.storeInt(value, field);
          default:
            throw new Error(`tl storeIntString field ${field} value type ${valType}`);
        }
      };

      this.storeInt = (i, field = '') => {
        this.writeInt(i, `${field}:int`);
      };

      this.maxLength = startMaxLength;
      this.offset = 0; // in bytes

      this.createBuffer();
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
      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Array, sLong)) return sLong.length === 2 ? this.storeLongP(sLong[0], sLong[1], field) : this.storeIntBytes(sLong, 64, field);

      if (typeof sLong !== 'string') sLong = sLong ? sLong.toString() : '0';
      const [int1, int2] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["y" /* longToInts */])(sLong);
      this.writeInt(int2, `${field}:long[low]`);
      this.writeInt(int1, `${field}:long[high]`);
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
      this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), `${field}:bytes`);

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

      this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), `${field}:int${bits}`);
      this.checkLength(len);

      this.byteView.set(bytes, this.offset);
      this.offset += len;
    }

    storeRawBytes(bytes, field = '') {
      if (bytes instanceof ArrayBuffer) {
        bytes = new Uint8Array(bytes);
      }
      const len = bytes.length;

      this.debug && console.log('>>>', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), field);
      this.checkLength(len);

      this.byteView.set(bytes, this.offset);
      this.offset += len;
    }

    storeMethod(methodName, params) {
      const schema = this.mtproto ? mtApi : api;
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

      this.storeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["z" /* intToUint */])(methodData.id), `${methodName}[id]`);

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

      if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Array, obj)) {
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

      if (!__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["is"])(Object, obj)) throw new Error(`Invalid object for type ${type}`);

      const schema = this.mtproto ? mtApi : api;
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

      if (!isBare) this.writeInt(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["z" /* intToUint */])(constructorData.id), `${field}[${predicate}][id]`);

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

  class Deserialization {
    constructor(buffer, { mtproto = false, override = {} } = {}) {
      this.offset = 0; // in bytes
      this.override = override;

      this.buffer = buffer;
      this.intView = toUint32(this.buffer);
      this.byteView = new Uint8Array(this.buffer);
      this.mtproto = mtproto;
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

      const longDec = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["A" /* bigint */])(iHigh).shiftLeft(32).add(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["A" /* bigint */])(iLow)).toString();

      return longDec;
    }

    fetchBool(field = '') {
      const i = this.readInt(`${field}:bool`);
      switch (i) {
        case 0x997275b5:
          return true;
        case 0xbc799737:
          return false;
        default:
          {
            this.offset -= 4;
            return this.fetchObject('Object', field);
          }
      }
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
      while (this.offset % 4) this.offset++;

      this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), `${field}:bytes`);

      return bytes;
    }

    fetchIntBytes(bits, typed, field = '') {
      if (bits % 32) throw new Error(`Invalid bits: ${bits}`);

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

      this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), `${field}:int${bits}`);

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

      this.debug && console.log('<<<', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["f" /* bytesToHex */])(bytes), field);

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
      const subpart = type.substr(0, 6);
      if (subpart === 'Vector' || subpart === 'vector') {
        if (type.charAt(0) === 'V') {
          const constructor = this.readInt(`${field}[id]`);
          const constructorCmp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["j" /* uintToInt */])(constructor);

          if (constructorCmp === 0x3072cfa1) {
            // Gzip packed
            const compressed = this.fetchBytes(`${field}[packed_string]`);
            const uncompressed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["B" /* gzipUncompress */])(compressed);
            const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["h" /* bytesToArrayBuffer */])(uncompressed);
            const newDeserializer = new Deserialization(buffer);

            return newDeserializer.fetchObject(type, field);
          }
          if (constructorCmp !== 0x1cb5c415) throw new Error(`Invalid vector constructor ${constructor}`);
        }
        const len = this.readInt(`${field}[count]`);
        const result = [];
        if (len > 0) {
          const itemType = type.substr(7, type.length - 8); // for "Vector<itemType>"
          for (let i = 0; i < len; i++) result.push(this.fetchObject(itemType, `${field}[${i}]`));
        }

        return result;
      }

      const schema = this.mtproto ? mtApi : api;
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
        if (!constructorData) throw new Error(`Constructor not found for predicate: ${type}`);
      } else {
        const constructor = this.readInt(`${field}[id]`);
        const constructorCmp = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["j" /* uintToInt */])(constructor);

        if (constructorCmp == 0x3072cfa1) {
          // Gzip packed
          const compressed = this.fetchBytes(`${field}[packed_string]`);
          const uncompressed = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["B" /* gzipUncompress */])(compressed);
          const buffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__bin__["h" /* bytesToArrayBuffer */])(uncompressed);
          const newDeserializer = new Deserialization(buffer);

          return newDeserializer.fetchObject(type, field);
        }

        let index = schema.constructorsIndex;
        if (!index) {
          schema.constructorsIndex = index = {};
          for (let i = 0; i < schema.constructors.length; i++) index[schema.constructors[i].id] = i;
        }
        let i = index[constructorCmp];
        if (i) constructorData = schema.constructors[i];

        fallback = false;
        if (!constructorData && this.mtproto) {
          const schemaFallback = api;
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
          if (type === '#' && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ramda__["isNil"])(result.pFlags)) result.pFlags = {};

          isCond = type.indexOf('?') !== -1;
          if (isCond) {
            condType = type.split('?');
            fieldBit = condType[0].split('.');
            if (!(result[fieldBit[0]] & 1 << fieldBit[1])) continue;
            type = condType[1];
          }

          value = this.fetchObject(type, `${field}[${predicate}][${param.name}]`);

          if (isCond && type === 'true') result.pFlags[param.name] = value;else result[param.name] = value;
        }
      }

      if (fallback) this.mtproto = true;

      return result;
    }

    getOffset() {
      return this.offset;
    }

    fetchEnd() {
      if (this.offset !== this.byteView.length) throw new Error('Fetch end with non-empty buffer');
      return true;
    }

  }

  return { Serialization, Deserialization };
};
/* unused harmony export TL */


/* harmony default export */ __webpack_exports__["a"] = TL;

/***/ }),
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
    var /*
 * Rusha, a JavaScript implementation of the Secure Hash Algorithm, SHA-1,
 * as defined in FIPS PUB 180-1, tuned for high performance with large inputs.
 * (http://github.com/srijs/rusha)
 *
 * Inspired by Paul Johnstons implementation (http://pajhome.org.uk/crypt/md5).
 *
 * Copyright (c) 2013 Sam Rijs (http://awesam.de).
 * Released under the terms of the MIT license as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
    util = {
        getDataType: function (data) {
            if (typeof data === 'string') {
                return 'string';
            }
            if (data instanceof Array) {
                return 'array';
            }
            if (typeof global !== 'undefined' && global.Buffer && global.Buffer.isBuffer(data)) {
                return 'buffer';
            }
            if (data instanceof ArrayBuffer) {
                return 'arraybuffer';
            }
            if (data.buffer instanceof ArrayBuffer) {
                return 'view';
            }
            if (data instanceof Blob) {
                return 'blob';
            }
            throw new Error('Unsupported data type.');
        }
    };
    function Rusha(chunkSize) {
        'use strict';
        var // Private object structure.
        self$2 = { fill: 0 };
        var // Calculate the length of buffer that the sha1 routine uses
        // including the padding.
        padlen = function (len) {
            for (len += 9; len % 64 > 0; len += 1);
            return len;
        };
        var padZeroes = function (bin, len) {
            var h8 = new Uint8Array(bin.buffer);
            var om = len % 4, align = len - om;
            switch (om) {
            case 0:
                h8[align + 3] = 0;
            case 1:
                h8[align + 2] = 0;
            case 2:
                h8[align + 1] = 0;
            case 3:
                h8[align + 0] = 0;
            }
            for (var i$2 = (len >> 2) + 1; i$2 < bin.length; i$2++)
                bin[i$2] = 0;
        };
        var padData = function (bin, chunkLen, msgLen) {
            bin[chunkLen >> 2] |= 128 << 24 - (chunkLen % 4 << 3);
            // To support msgLen >= 2 GiB, use a float division when computing the
            // high 32-bits of the big-endian message length in bits.
            bin[((chunkLen >> 2) + 2 & ~15) + 14] = msgLen / (1 << 29) | 0;
            bin[((chunkLen >> 2) + 2 & ~15) + 15] = msgLen << 3;
        };
        var // Convert a binary string and write it to the heap.
        // A binary string is expected to only contain char codes < 256.
        convStr = function (H8, H32, start, len, off) {
            var str = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = str.charCodeAt(start + 3);
            case 1:
                H8[off + 1 - (om << 1) | 0] = str.charCodeAt(start + 2);
            case 2:
                H8[off + 2 - (om << 1) | 0] = str.charCodeAt(start + 1);
            case 3:
                H8[off + 3 - (om << 1) | 0] = str.charCodeAt(start);
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2] = str.charCodeAt(start + i$2) << 24 | str.charCodeAt(start + i$2 + 1) << 16 | str.charCodeAt(start + i$2 + 2) << 8 | str.charCodeAt(start + i$2 + 3);
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = str.charCodeAt(start + j + 2);
            case 2:
                H8[off + j + 2 | 0] = str.charCodeAt(start + j + 1);
            case 1:
                H8[off + j + 3 | 0] = str.charCodeAt(start + j);
            }
        };
        var // Convert a buffer or array and write it to the heap.
        // The buffer or array is expected to only contain elements < 256.
        convBuf = function (H8, H32, start, len, off) {
            var buf = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = buf[start + 3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[start + 2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[start + 1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[start];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[start + i$2] << 24 | buf[start + i$2 + 1] << 16 | buf[start + i$2 + 2] << 8 | buf[start + i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[start + j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[start + j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[start + j];
            }
        };
        var convBlob = function (H8, H32, start, len, off) {
            var blob = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
            switch (om) {
            case 0:
                H8[off] = buf[3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[0];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[i$2] << 24 | buf[i$2 + 1] << 16 | buf[i$2 + 2] << 8 | buf[i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[j];
            }
        };
        var convFn = function (data) {
            switch (util.getDataType(data)) {
            case 'string':
                return convStr.bind(data);
            case 'array':
                return convBuf.bind(data);
            case 'buffer':
                return convBuf.bind(data);
            case 'arraybuffer':
                return convBuf.bind(new Uint8Array(data));
            case 'view':
                return convBuf.bind(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
            case 'blob':
                return convBlob.bind(data);
            }
        };
        var slice = function (data, offset) {
            switch (util.getDataType(data)) {
            case 'string':
                return data.slice(offset);
            case 'array':
                return data.slice(offset);
            case 'buffer':
                return data.slice(offset);
            case 'arraybuffer':
                return data.slice(offset);
            case 'view':
                return data.buffer.slice(offset);
            }
        };
        var // Precompute 00 - ff strings
        precomputedHex = new Array(256);
        for (var i = 0; i < 256; i++) {
            precomputedHex[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
        var // Convert an ArrayBuffer into its hexadecimal string representation.
        hex = function (arrayBuffer) {
            var binarray = new Uint8Array(arrayBuffer);
            var res = new Array(arrayBuffer.byteLength);
            for (var i$2 = 0; i$2 < res.length; i$2++) {
                res[i$2] = precomputedHex[binarray[i$2]];
            }
            return res.join('');
        };
        var ceilHeapSize = function (v) {
            // The asm.js spec says:
            // The heap object's byteLength must be either
            // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
            // Also, byteLengths smaller than 2^16 are deprecated.
            var p;
            if (// If v is smaller than 2^16, the smallest possible solution
                // is 2^16.
                v <= 65536)
                return 65536;
            if (// If v < 2^24, we round up to 2^n,
                // otherwise we round up to 2^24 * n.
                v < 16777216) {
                for (p = 1; p < v; p = p << 1);
            } else {
                for (p = 16777216; p < v; p += 16777216);
            }
            return p;
        };
        var // Initialize the internal data structures to a new capacity.
        init = function (size) {
            if (size % 64 > 0) {
                throw new Error('Chunk size must be a multiple of 128 bit');
            }
            self$2.offset = 0;
            self$2.maxChunkLen = size;
            self$2.padMaxChunkLen = padlen(size);
            // The size of the heap is the sum of:
            // 1. The padded input message size
            // 2. The extended space the algorithm needs (320 byte)
            // 3. The 160 bit state the algoritm uses
            self$2.heap = new ArrayBuffer(ceilHeapSize(self$2.padMaxChunkLen + 320 + 20));
            self$2.h32 = new Int32Array(self$2.heap);
            self$2.h8 = new Int8Array(self$2.heap);
            self$2.core = new Rusha._core({
                Int32Array: Int32Array,
                DataView: DataView
            }, {}, self$2.heap);
            self$2.buffer = null;
        };
        // Iinitializethe datastructures according
        // to a chunk siyze.
        init(chunkSize || 64 * 1024);
        var initState = function (heap, padMsgLen) {
            self$2.offset = 0;
            var io = new Int32Array(heap, padMsgLen + 320, 5);
            io[0] = 1732584193;
            io[1] = -271733879;
            io[2] = -1732584194;
            io[3] = 271733878;
            io[4] = -1009589776;
        };
        var padChunk = function (chunkLen, msgLen) {
            var padChunkLen = padlen(chunkLen);
            var view = new Int32Array(self$2.heap, 0, padChunkLen >> 2);
            padZeroes(view, chunkLen);
            padData(view, chunkLen, msgLen);
            return padChunkLen;
        };
        var // Write data to the heap.
        write = function (data, chunkOffset, chunkLen, off) {
            convFn(data)(self$2.h8, self$2.h32, chunkOffset, chunkLen, off || 0);
        };
        var // Initialize and call the RushaCore,
        // assuming an input buffer of length len * 4.
        coreCall = function (data, chunkOffset, chunkLen, msgLen, finalize) {
            var padChunkLen = chunkLen;
            write(data, chunkOffset, chunkLen);
            if (finalize) {
                padChunkLen = padChunk(chunkLen, msgLen);
            }
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
        };
        var getRawDigest = function (heap, padMaxChunkLen) {
            var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
            var out = new Int32Array(5);
            var arr = new DataView(out.buffer);
            arr.setInt32(0, io[0], false);
            arr.setInt32(4, io[1], false);
            arr.setInt32(8, io[2], false);
            arr.setInt32(12, io[3], false);
            arr.setInt32(16, io[4], false);
            return out;
        };
        var // Calculate the hash digest as an array of 5 32bit integers.
        rawDigest = this.rawDigest = function (str) {
            var msgLen = str.byteLength || str.length || str.size || 0;
            initState(self$2.heap, self$2.padMaxChunkLen);
            var chunkOffset = 0, chunkLen = self$2.maxChunkLen, last;
            for (chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen) {
                coreCall(str, chunkOffset, chunkLen, msgLen, false);
            }
            coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
            return getRawDigest(self$2.heap, self$2.padMaxChunkLen);
        };
        // The digest and digestFrom* interface returns the hash digest
        // as a hex string.
        this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function (str) {
            return hex(rawDigest(str).buffer);
        };
        this.resetState = function () {
            initState(self$2.heap, self$2.padMaxChunkLen);
            return this;
        };
        this.append = function (chunk) {
            var chunkOffset = 0;
            var chunkLen = chunk.byteLength || chunk.length || chunk.size || 0;
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var inputLen;
            self$2.offset += chunkLen;
            while (chunkOffset < chunkLen) {
                inputLen = Math.min(chunkLen - chunkOffset, self$2.maxChunkLen - turnOffset);
                write(chunk, chunkOffset, inputLen, turnOffset);
                turnOffset += inputLen;
                chunkOffset += inputLen;
                if (turnOffset === self$2.maxChunkLen) {
                    self$2.core.hash(self$2.maxChunkLen, self$2.padMaxChunkLen);
                    turnOffset = 0;
                }
            }
            return this;
        };
        this.getState = function () {
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var heap;
            if (!turnOffset) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                heap = io.buffer.slice(io.byteOffset, io.byteOffset + io.byteLength);
            } else {
                heap = self$2.heap.slice(0);
            }
            return {
                offset: self$2.offset,
                heap: heap
            };
        };
        this.setState = function (state) {
            self$2.offset = state.offset;
            if (state.heap.byteLength === 20) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                io.set(new Int32Array(state.heap));
            } else {
                self$2.h32.set(new Int32Array(state.heap));
            }
            return this;
        };
        var rawEnd = this.rawEnd = function () {
            var msgLen = self$2.offset;
            var chunkLen = msgLen % self$2.maxChunkLen;
            var padChunkLen = padChunk(chunkLen, msgLen);
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
            var result = getRawDigest(self$2.heap, self$2.padMaxChunkLen);
            initState(self$2.heap, self$2.padMaxChunkLen);
            return result;
        };
        this.end = function () {
            return hex(rawEnd().buffer);
        };
    }
    ;
    // The low-level RushCore module provides the heart of Rusha,
    // a high-speed sha1 implementation working on an Int32Array heap.
    // At first glance, the implementation seems complicated, however
    // with the SHA1 spec at hand, it is obvious this almost a textbook
    // implementation that has a few functions hand-inlined and a few loops
    // hand-unrolled.
    Rusha._core = function RushaCore(stdlib, foreign, heap) {
        'use asm';
        var H = new stdlib.Int32Array(heap);
        function hash(k, x) {
            // k in bytes
            k = k | 0;
            x = x | 0;
            var i = 0, j = 0, y0 = 0, z0 = 0, y1 = 0, z1 = 0, y2 = 0, z2 = 0, y3 = 0, z3 = 0, y4 = 0, z4 = 0, t0 = 0, t1 = 0;
            y0 = H[x + 320 >> 2] | 0;
            y1 = H[x + 324 >> 2] | 0;
            y2 = H[x + 328 >> 2] | 0;
            y3 = H[x + 332 >> 2] | 0;
            y4 = H[x + 336 >> 2] | 0;
            for (i = 0; (i | 0) < (k | 0); i = i + 64 | 0) {
                z0 = y0;
                z1 = y1;
                z2 = y2;
                z3 = y3;
                z4 = y4;
                for (j = 0; (j | 0) < 64; j = j + 4 | 0) {
                    t1 = H[i + j >> 2] | 0;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[k + j >> 2] = t1;
                }
                for (j = k + 64 | 0; (j | 0) < (k + 80 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 80 | 0; (j | 0) < (k + 160 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) + 1859775393 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 160 | 0; (j | 0) < (k + 240 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | y1 & y3 | y2 & y3) | 0) + ((t1 + y4 | 0) - 1894007588 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 240 | 0; (j | 0) < (k + 320 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) - 899497514 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                y0 = y0 + z0 | 0;
                y1 = y1 + z1 | 0;
                y2 = y2 + z2 | 0;
                y3 = y3 + z3 | 0;
                y4 = y4 + z4 | 0;
            }
            H[x + 320 >> 2] = y0;
            H[x + 324 >> 2] = y1;
            H[x + 328 >> 2] = y2;
            H[x + 332 >> 2] = y3;
            H[x + 336 >> 2] = y4;
        }
        return { hash: hash };
    };
    if (// If we'e running in Node.JS, export a module.
        true) {
        module.exports = Rusha;
    } else if (// If we're running in a DOM context, export
        // the Rusha object to toplevel.
        typeof window !== 'undefined') {
        window.Rusha = Rusha;
    }
    if (// If we're running in a webworker, accept
        // messages containing a jobid and a buffer
        // or blob object, and return the hash result.
        typeof FileReaderSync !== 'undefined') {
        var reader = new FileReaderSync(), hasher = new Rusha(4 * 1024 * 1024);
        self.onmessage = function onMessage(event) {
            var hash, data = event.data.data;
            try {
                hash = hasher.digest(data);
                self.postMessage({
                    id: event.data.id,
                    hash: hash
                });
            } catch (e) {
                self.postMessage({
                    id: event.data.id,
                    error: e.name
                });
            }
        };
    }
}());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {
	return new Worker(__webpack_require__.p + "hash.worker.js");
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = {
	"constructors": [
		{
			"id": "-1132882121",
			"predicate": "boolFalse",
			"params": [],
			"type": "Bool"
		},
		{
			"id": "-1720552011",
			"predicate": "boolTrue",
			"params": [],
			"type": "Bool"
		},
		{
			"id": "1072550713",
			"predicate": "true",
			"params": [],
			"type": "True"
		},
		{
			"id": "481674261",
			"predicate": "vector",
			"params": [],
			"type": "Vector t"
		},
		{
			"id": "-994444869",
			"predicate": "error",
			"params": [
				{
					"name": "code",
					"type": "int"
				},
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "Error"
		},
		{
			"id": "1450380236",
			"predicate": "null",
			"params": [],
			"type": "Null"
		},
		{
			"id": "2134579434",
			"predicate": "inputPeerEmpty",
			"params": [],
			"type": "InputPeer"
		},
		{
			"id": "2107670217",
			"predicate": "inputPeerSelf",
			"params": [],
			"type": "InputPeer"
		},
		{
			"id": "396093539",
			"predicate": "inputPeerChat",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "InputPeer"
		},
		{
			"id": "-1182234929",
			"predicate": "inputUserEmpty",
			"params": [],
			"type": "InputUser"
		},
		{
			"id": "-138301121",
			"predicate": "inputUserSelf",
			"params": [],
			"type": "InputUser"
		},
		{
			"id": "-208488460",
			"predicate": "inputPhoneContact",
			"params": [
				{
					"name": "client_id",
					"type": "long"
				},
				{
					"name": "phone",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				}
			],
			"type": "InputContact"
		},
		{
			"id": "-181407105",
			"predicate": "inputFile",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "parts",
					"type": "int"
				},
				{
					"name": "name",
					"type": "string"
				},
				{
					"name": "md5_checksum",
					"type": "string"
				}
			],
			"type": "InputFile"
		},
		{
			"id": "-1771768449",
			"predicate": "inputMediaEmpty",
			"params": [],
			"type": "InputMedia"
		},
		{
			"id": "1661770481",
			"predicate": "inputMediaUploadedPhoto",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "file",
					"type": "InputFile"
				},
				{
					"name": "caption",
					"type": "string"
				},
				{
					"name": "stickers",
					"type": "flags.0?Vector<InputDocument>"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "-373312269",
			"predicate": "inputMediaPhoto",
			"params": [
				{
					"name": "id",
					"type": "InputPhoto"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "-104578748",
			"predicate": "inputMediaGeoPoint",
			"params": [
				{
					"name": "geo_point",
					"type": "InputGeoPoint"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "-1494984313",
			"predicate": "inputMediaContact",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "480546647",
			"predicate": "inputChatPhotoEmpty",
			"params": [],
			"type": "InputChatPhoto"
		},
		{
			"id": "-1837345356",
			"predicate": "inputChatUploadedPhoto",
			"params": [
				{
					"name": "file",
					"type": "InputFile"
				}
			],
			"type": "InputChatPhoto"
		},
		{
			"id": "-1991004873",
			"predicate": "inputChatPhoto",
			"params": [
				{
					"name": "id",
					"type": "InputPhoto"
				}
			],
			"type": "InputChatPhoto"
		},
		{
			"id": "-457104426",
			"predicate": "inputGeoPointEmpty",
			"params": [],
			"type": "InputGeoPoint"
		},
		{
			"id": "-206066487",
			"predicate": "inputGeoPoint",
			"params": [
				{
					"name": "lat",
					"type": "double"
				},
				{
					"name": "long",
					"type": "double"
				}
			],
			"type": "InputGeoPoint"
		},
		{
			"id": "483901197",
			"predicate": "inputPhotoEmpty",
			"params": [],
			"type": "InputPhoto"
		},
		{
			"id": "-74070332",
			"predicate": "inputPhoto",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputPhoto"
		},
		{
			"id": "342061462",
			"predicate": "inputFileLocation",
			"params": [
				{
					"name": "volume_id",
					"type": "long"
				},
				{
					"name": "local_id",
					"type": "int"
				},
				{
					"name": "secret",
					"type": "long"
				}
			],
			"type": "InputFileLocation"
		},
		{
			"id": "1996904104",
			"predicate": "inputAppEvent",
			"params": [
				{
					"name": "time",
					"type": "double"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "peer",
					"type": "long"
				},
				{
					"name": "data",
					"type": "string"
				}
			],
			"type": "InputAppEvent"
		},
		{
			"id": "-1649296275",
			"predicate": "peerUser",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "Peer"
		},
		{
			"id": "-1160714821",
			"predicate": "peerChat",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "Peer"
		},
		{
			"id": "-1432995067",
			"predicate": "storage.fileUnknown",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "8322574",
			"predicate": "storage.fileJpeg",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "-891180321",
			"predicate": "storage.fileGif",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "172975040",
			"predicate": "storage.filePng",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "-1373745011",
			"predicate": "storage.filePdf",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "1384777335",
			"predicate": "storage.fileMp3",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "1258941372",
			"predicate": "storage.fileMov",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "1086091090",
			"predicate": "storage.filePartial",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "-1278304028",
			"predicate": "storage.fileMp4",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "276907596",
			"predicate": "storage.fileWebp",
			"params": [],
			"type": "storage.FileType"
		},
		{
			"id": "2086234950",
			"predicate": "fileLocationUnavailable",
			"params": [
				{
					"name": "volume_id",
					"type": "long"
				},
				{
					"name": "local_id",
					"type": "int"
				},
				{
					"name": "secret",
					"type": "long"
				}
			],
			"type": "FileLocation"
		},
		{
			"id": "1406570614",
			"predicate": "fileLocation",
			"params": [
				{
					"name": "dc_id",
					"type": "int"
				},
				{
					"name": "volume_id",
					"type": "long"
				},
				{
					"name": "local_id",
					"type": "int"
				},
				{
					"name": "secret",
					"type": "long"
				}
			],
			"type": "FileLocation"
		},
		{
			"id": "537022650",
			"predicate": "userEmpty",
			"params": [
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "User"
		},
		{
			"id": "1326562017",
			"predicate": "userProfilePhotoEmpty",
			"params": [],
			"type": "UserProfilePhoto"
		},
		{
			"id": "-715532088",
			"predicate": "userProfilePhoto",
			"params": [
				{
					"name": "photo_id",
					"type": "long"
				},
				{
					"name": "photo_small",
					"type": "FileLocation"
				},
				{
					"name": "photo_big",
					"type": "FileLocation"
				}
			],
			"type": "UserProfilePhoto"
		},
		{
			"id": "164646985",
			"predicate": "userStatusEmpty",
			"params": [],
			"type": "UserStatus"
		},
		{
			"id": "-306628279",
			"predicate": "userStatusOnline",
			"params": [
				{
					"name": "expires",
					"type": "int"
				}
			],
			"type": "UserStatus"
		},
		{
			"id": "9203775",
			"predicate": "userStatusOffline",
			"params": [
				{
					"name": "was_online",
					"type": "int"
				}
			],
			"type": "UserStatus"
		},
		{
			"id": "-1683826688",
			"predicate": "chatEmpty",
			"params": [
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "Chat"
		},
		{
			"id": "-652419756",
			"predicate": "chat",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "creator",
					"type": "flags.0?true"
				},
				{
					"name": "kicked",
					"type": "flags.1?true"
				},
				{
					"name": "left",
					"type": "flags.2?true"
				},
				{
					"name": "admins_enabled",
					"type": "flags.3?true"
				},
				{
					"name": "admin",
					"type": "flags.4?true"
				},
				{
					"name": "deactivated",
					"type": "flags.5?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "ChatPhoto"
				},
				{
					"name": "participants_count",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "version",
					"type": "int"
				},
				{
					"name": "migrated_to",
					"type": "flags.6?InputChannel"
				}
			],
			"type": "Chat"
		},
		{
			"id": "120753115",
			"predicate": "chatForbidden",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "Chat"
		},
		{
			"id": "771925524",
			"predicate": "chatFull",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "participants",
					"type": "ChatParticipants"
				},
				{
					"name": "chat_photo",
					"type": "Photo"
				},
				{
					"name": "notify_settings",
					"type": "PeerNotifySettings"
				},
				{
					"name": "exported_invite",
					"type": "ExportedChatInvite"
				},
				{
					"name": "bot_info",
					"type": "Vector<BotInfo>"
				}
			],
			"type": "ChatFull"
		},
		{
			"id": "-925415106",
			"predicate": "chatParticipant",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChatParticipant"
		},
		{
			"id": "-57668565",
			"predicate": "chatParticipantsForbidden",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "self_participant",
					"type": "flags.0?ChatParticipant"
				}
			],
			"type": "ChatParticipants"
		},
		{
			"id": "1061556205",
			"predicate": "chatParticipants",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "participants",
					"type": "Vector<ChatParticipant>"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "ChatParticipants"
		},
		{
			"id": "935395612",
			"predicate": "chatPhotoEmpty",
			"params": [],
			"type": "ChatPhoto"
		},
		{
			"id": "1632839530",
			"predicate": "chatPhoto",
			"params": [
				{
					"name": "photo_small",
					"type": "FileLocation"
				},
				{
					"name": "photo_big",
					"type": "FileLocation"
				}
			],
			"type": "ChatPhoto"
		},
		{
			"id": "-2082087340",
			"predicate": "messageEmpty",
			"params": [
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "Message"
		},
		{
			"id": "-1063525281",
			"predicate": "message",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "out",
					"type": "flags.1?true"
				},
				{
					"name": "mentioned",
					"type": "flags.4?true"
				},
				{
					"name": "media_unread",
					"type": "flags.5?true"
				},
				{
					"name": "silent",
					"type": "flags.13?true"
				},
				{
					"name": "post",
					"type": "flags.14?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "from_id",
					"type": "flags.8?int"
				},
				{
					"name": "to_id",
					"type": "Peer"
				},
				{
					"name": "fwd_from",
					"type": "flags.2?MessageFwdHeader"
				},
				{
					"name": "via_bot_id",
					"type": "flags.11?int"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.3?int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "media",
					"type": "flags.9?MessageMedia"
				},
				{
					"name": "reply_markup",
					"type": "flags.6?ReplyMarkup"
				},
				{
					"name": "entities",
					"type": "flags.7?Vector<MessageEntity>"
				},
				{
					"name": "views",
					"type": "flags.10?int"
				},
				{
					"name": "edit_date",
					"type": "flags.15?int"
				}
			],
			"type": "Message"
		},
		{
			"id": "-1642487306",
			"predicate": "messageService",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "out",
					"type": "flags.1?true"
				},
				{
					"name": "mentioned",
					"type": "flags.4?true"
				},
				{
					"name": "media_unread",
					"type": "flags.5?true"
				},
				{
					"name": "silent",
					"type": "flags.13?true"
				},
				{
					"name": "post",
					"type": "flags.14?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "from_id",
					"type": "flags.8?int"
				},
				{
					"name": "to_id",
					"type": "Peer"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.3?int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "action",
					"type": "MessageAction"
				}
			],
			"type": "Message"
		},
		{
			"id": "1038967584",
			"predicate": "messageMediaEmpty",
			"params": [],
			"type": "MessageMedia"
		},
		{
			"id": "1032643901",
			"predicate": "messageMediaPhoto",
			"params": [
				{
					"name": "photo",
					"type": "Photo"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "1457575028",
			"predicate": "messageMediaGeo",
			"params": [
				{
					"name": "geo",
					"type": "GeoPoint"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "1585262393",
			"predicate": "messageMediaContact",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				},
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "-1618676578",
			"predicate": "messageMediaUnsupported",
			"params": [],
			"type": "MessageMedia"
		},
		{
			"id": "-1230047312",
			"predicate": "messageActionEmpty",
			"params": [],
			"type": "MessageAction"
		},
		{
			"id": "-1503425638",
			"predicate": "messageActionChatCreate",
			"params": [
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "users",
					"type": "Vector<int>"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-1247687078",
			"predicate": "messageActionChatEditTitle",
			"params": [
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "2144015272",
			"predicate": "messageActionChatEditPhoto",
			"params": [
				{
					"name": "photo",
					"type": "Photo"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-1780220945",
			"predicate": "messageActionChatDeletePhoto",
			"params": [],
			"type": "MessageAction"
		},
		{
			"id": "1217033015",
			"predicate": "messageActionChatAddUser",
			"params": [
				{
					"name": "users",
					"type": "Vector<int>"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-1297179892",
			"predicate": "messageActionChatDeleteUser",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "1728035348",
			"predicate": "dialog",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "top_message",
					"type": "int"
				},
				{
					"name": "read_inbox_max_id",
					"type": "int"
				},
				{
					"name": "read_outbox_max_id",
					"type": "int"
				},
				{
					"name": "unread_count",
					"type": "int"
				},
				{
					"name": "notify_settings",
					"type": "PeerNotifySettings"
				},
				{
					"name": "pts",
					"type": "flags.0?int"
				},
				{
					"name": "draft",
					"type": "flags.1?DraftMessage"
				}
			],
			"type": "Dialog"
		},
		{
			"id": "590459437",
			"predicate": "photoEmpty",
			"params": [
				{
					"name": "id",
					"type": "long"
				}
			],
			"type": "Photo"
		},
		{
			"id": "-1836524247",
			"predicate": "photo",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "has_stickers",
					"type": "flags.0?true"
				},
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "sizes",
					"type": "Vector<PhotoSize>"
				}
			],
			"type": "Photo"
		},
		{
			"id": "236446268",
			"predicate": "photoSizeEmpty",
			"params": [
				{
					"name": "type",
					"type": "string"
				}
			],
			"type": "PhotoSize"
		},
		{
			"id": "2009052699",
			"predicate": "photoSize",
			"params": [
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "location",
					"type": "FileLocation"
				},
				{
					"name": "w",
					"type": "int"
				},
				{
					"name": "h",
					"type": "int"
				},
				{
					"name": "size",
					"type": "int"
				}
			],
			"type": "PhotoSize"
		},
		{
			"id": "-374917894",
			"predicate": "photoCachedSize",
			"params": [
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "location",
					"type": "FileLocation"
				},
				{
					"name": "w",
					"type": "int"
				},
				{
					"name": "h",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "PhotoSize"
		},
		{
			"id": "286776671",
			"predicate": "geoPointEmpty",
			"params": [],
			"type": "GeoPoint"
		},
		{
			"id": "541710092",
			"predicate": "geoPoint",
			"params": [
				{
					"name": "long",
					"type": "double"
				},
				{
					"name": "lat",
					"type": "double"
				}
			],
			"type": "GeoPoint"
		},
		{
			"id": "-2128698738",
			"predicate": "auth.checkedPhone",
			"params": [
				{
					"name": "phone_registered",
					"type": "Bool"
				}
			],
			"type": "auth.CheckedPhone"
		},
		{
			"id": "1577067778",
			"predicate": "auth.sentCode",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "phone_registered",
					"type": "flags.0?true"
				},
				{
					"name": "type",
					"type": "auth.SentCodeType"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				},
				{
					"name": "next_type",
					"type": "flags.1?auth.CodeType"
				},
				{
					"name": "timeout",
					"type": "flags.2?int"
				}
			],
			"type": "auth.SentCode"
		},
		{
			"id": "-855308010",
			"predicate": "auth.authorization",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "tmp_sessions",
					"type": "flags.0?int"
				},
				{
					"name": "user",
					"type": "User"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "-543777747",
			"predicate": "auth.exportedAuthorization",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "auth.ExportedAuthorization"
		},
		{
			"id": "-1195615476",
			"predicate": "inputNotifyPeer",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				}
			],
			"type": "InputNotifyPeer"
		},
		{
			"id": "423314455",
			"predicate": "inputNotifyUsers",
			"params": [],
			"type": "InputNotifyPeer"
		},
		{
			"id": "1251338318",
			"predicate": "inputNotifyChats",
			"params": [],
			"type": "InputNotifyPeer"
		},
		{
			"id": "-1540769658",
			"predicate": "inputNotifyAll",
			"params": [],
			"type": "InputNotifyPeer"
		},
		{
			"id": "-265263912",
			"predicate": "inputPeerNotifyEventsEmpty",
			"params": [],
			"type": "InputPeerNotifyEvents"
		},
		{
			"id": "-395694988",
			"predicate": "inputPeerNotifyEventsAll",
			"params": [],
			"type": "InputPeerNotifyEvents"
		},
		{
			"id": "949182130",
			"predicate": "inputPeerNotifySettings",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "show_previews",
					"type": "flags.0?true"
				},
				{
					"name": "silent",
					"type": "flags.1?true"
				},
				{
					"name": "mute_until",
					"type": "int"
				},
				{
					"name": "sound",
					"type": "string"
				}
			],
			"type": "InputPeerNotifySettings"
		},
		{
			"id": "-1378534221",
			"predicate": "peerNotifyEventsEmpty",
			"params": [],
			"type": "PeerNotifyEvents"
		},
		{
			"id": "1830677896",
			"predicate": "peerNotifyEventsAll",
			"params": [],
			"type": "PeerNotifyEvents"
		},
		{
			"id": "1889961234",
			"predicate": "peerNotifySettingsEmpty",
			"params": [],
			"type": "PeerNotifySettings"
		},
		{
			"id": "-1697798976",
			"predicate": "peerNotifySettings",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "show_previews",
					"type": "flags.0?true"
				},
				{
					"name": "silent",
					"type": "flags.1?true"
				},
				{
					"name": "mute_until",
					"type": "int"
				},
				{
					"name": "sound",
					"type": "string"
				}
			],
			"type": "PeerNotifySettings"
		},
		{
			"id": "-2122045747",
			"predicate": "peerSettings",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "report_spam",
					"type": "flags.0?true"
				}
			],
			"type": "PeerSettings"
		},
		{
			"id": "-860866985",
			"predicate": "wallPaper",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "sizes",
					"type": "Vector<PhotoSize>"
				},
				{
					"name": "color",
					"type": "int"
				}
			],
			"type": "WallPaper"
		},
		{
			"id": "1490799288",
			"predicate": "inputReportReasonSpam",
			"params": [],
			"type": "ReportReason"
		},
		{
			"id": "505595789",
			"predicate": "inputReportReasonViolence",
			"params": [],
			"type": "ReportReason"
		},
		{
			"id": "777640226",
			"predicate": "inputReportReasonPornography",
			"params": [],
			"type": "ReportReason"
		},
		{
			"id": "-512463606",
			"predicate": "inputReportReasonOther",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "ReportReason"
		},
		{
			"id": "1496513539",
			"predicate": "userFull",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "blocked",
					"type": "flags.0?true"
				},
				{
					"name": "user",
					"type": "User"
				},
				{
					"name": "about",
					"type": "flags.1?string"
				},
				{
					"name": "link",
					"type": "contacts.Link"
				},
				{
					"name": "profile_photo",
					"type": "flags.2?Photo"
				},
				{
					"name": "notify_settings",
					"type": "PeerNotifySettings"
				},
				{
					"name": "bot_info",
					"type": "flags.3?BotInfo"
				}
			],
			"type": "UserFull"
		},
		{
			"id": "-116274796",
			"predicate": "contact",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "mutual",
					"type": "Bool"
				}
			],
			"type": "Contact"
		},
		{
			"id": "-805141448",
			"predicate": "importedContact",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "client_id",
					"type": "long"
				}
			],
			"type": "ImportedContact"
		},
		{
			"id": "1444661369",
			"predicate": "contactBlocked",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ContactBlocked"
		},
		{
			"id": "-748155807",
			"predicate": "contactStatus",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "status",
					"type": "UserStatus"
				}
			],
			"type": "ContactStatus"
		},
		{
			"id": "986597452",
			"predicate": "contacts.link",
			"params": [
				{
					"name": "my_link",
					"type": "ContactLink"
				},
				{
					"name": "foreign_link",
					"type": "ContactLink"
				},
				{
					"name": "user",
					"type": "User"
				}
			],
			"type": "contacts.Link"
		},
		{
			"id": "-1219778094",
			"predicate": "contacts.contactsNotModified",
			"params": [],
			"type": "contacts.Contacts"
		},
		{
			"id": "1871416498",
			"predicate": "contacts.contacts",
			"params": [
				{
					"name": "contacts",
					"type": "Vector<Contact>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.Contacts"
		},
		{
			"id": "-1387117803",
			"predicate": "contacts.importedContacts",
			"params": [
				{
					"name": "imported",
					"type": "Vector<ImportedContact>"
				},
				{
					"name": "retry_contacts",
					"type": "Vector<long>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.ImportedContacts"
		},
		{
			"id": "471043349",
			"predicate": "contacts.blocked",
			"params": [
				{
					"name": "blocked",
					"type": "Vector<ContactBlocked>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.Blocked"
		},
		{
			"id": "-1878523231",
			"predicate": "contacts.blockedSlice",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "blocked",
					"type": "Vector<ContactBlocked>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.Blocked"
		},
		{
			"id": "364538944",
			"predicate": "messages.dialogs",
			"params": [
				{
					"name": "dialogs",
					"type": "Vector<Dialog>"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.Dialogs"
		},
		{
			"id": "1910543603",
			"predicate": "messages.dialogsSlice",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "dialogs",
					"type": "Vector<Dialog>"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.Dialogs"
		},
		{
			"id": "-1938715001",
			"predicate": "messages.messages",
			"params": [
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "189033187",
			"predicate": "messages.messagesSlice",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "1694474197",
			"predicate": "messages.chats",
			"params": [
				{
					"name": "chats",
					"type": "Vector<Chat>"
				}
			],
			"type": "messages.Chats"
		},
		{
			"id": "-438840932",
			"predicate": "messages.chatFull",
			"params": [
				{
					"name": "full_chat",
					"type": "ChatFull"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.ChatFull"
		},
		{
			"id": "-1269012015",
			"predicate": "messages.affectedHistory",
			"params": [
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				},
				{
					"name": "offset",
					"type": "int"
				}
			],
			"type": "messages.AffectedHistory"
		},
		{
			"id": "1474492012",
			"predicate": "inputMessagesFilterEmpty",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-1777752804",
			"predicate": "inputMessagesFilterPhotos",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-1614803355",
			"predicate": "inputMessagesFilterVideo",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "1458172132",
			"predicate": "inputMessagesFilterPhotoVideo",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-648121413",
			"predicate": "inputMessagesFilterPhotoVideoDocuments",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-1629621880",
			"predicate": "inputMessagesFilterDocument",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "2129714567",
			"predicate": "inputMessagesFilterUrl",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-3644025",
			"predicate": "inputMessagesFilterGif",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "522914557",
			"predicate": "updateNewMessage",
			"params": [
				{
					"name": "message",
					"type": "Message"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1318109142",
			"predicate": "updateMessageID",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "random_id",
					"type": "long"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1576161051",
			"predicate": "updateDeleteMessages",
			"params": [
				{
					"name": "messages",
					"type": "Vector<int>"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1548249383",
			"predicate": "updateUserTyping",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "action",
					"type": "SendMessageAction"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1704596961",
			"predicate": "updateChatUserTyping",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "action",
					"type": "SendMessageAction"
				}
			],
			"type": "Update"
		},
		{
			"id": "125178264",
			"predicate": "updateChatParticipants",
			"params": [
				{
					"name": "participants",
					"type": "ChatParticipants"
				}
			],
			"type": "Update"
		},
		{
			"id": "469489699",
			"predicate": "updateUserStatus",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "status",
					"type": "UserStatus"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1489818765",
			"predicate": "updateUserName",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				},
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1791935732",
			"predicate": "updateUserPhoto",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "photo",
					"type": "UserProfilePhoto"
				},
				{
					"name": "previous",
					"type": "Bool"
				}
			],
			"type": "Update"
		},
		{
			"id": "628472761",
			"predicate": "updateContactRegistered",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1657903163",
			"predicate": "updateContactLink",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "my_link",
					"type": "ContactLink"
				},
				{
					"name": "foreign_link",
					"type": "ContactLink"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1895411046",
			"predicate": "updateNewAuthorization",
			"params": [
				{
					"name": "auth_key_id",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "device",
					"type": "string"
				},
				{
					"name": "location",
					"type": "string"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1519637954",
			"predicate": "updates.state",
			"params": [
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "qts",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "seq",
					"type": "int"
				},
				{
					"name": "unread_count",
					"type": "int"
				}
			],
			"type": "updates.State"
		},
		{
			"id": "1567990072",
			"predicate": "updates.differenceEmpty",
			"params": [
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "seq",
					"type": "int"
				}
			],
			"type": "updates.Difference"
		},
		{
			"id": "16030880",
			"predicate": "updates.difference",
			"params": [
				{
					"name": "new_messages",
					"type": "Vector<Message>"
				},
				{
					"name": "new_encrypted_messages",
					"type": "Vector<EncryptedMessage>"
				},
				{
					"name": "other_updates",
					"type": "Vector<Update>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				},
				{
					"name": "state",
					"type": "updates.State"
				}
			],
			"type": "updates.Difference"
		},
		{
			"id": "-1459938943",
			"predicate": "updates.differenceSlice",
			"params": [
				{
					"name": "new_messages",
					"type": "Vector<Message>"
				},
				{
					"name": "new_encrypted_messages",
					"type": "Vector<EncryptedMessage>"
				},
				{
					"name": "other_updates",
					"type": "Vector<Update>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				},
				{
					"name": "intermediate_state",
					"type": "updates.State"
				}
			],
			"type": "updates.Difference"
		},
		{
			"id": "-484987010",
			"predicate": "updatesTooLong",
			"params": [],
			"type": "Updates"
		},
		{
			"id": "-1857044719",
			"predicate": "updateShortMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "out",
					"type": "flags.1?true"
				},
				{
					"name": "mentioned",
					"type": "flags.4?true"
				},
				{
					"name": "media_unread",
					"type": "flags.5?true"
				},
				{
					"name": "silent",
					"type": "flags.13?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "fwd_from",
					"type": "flags.2?MessageFwdHeader"
				},
				{
					"name": "via_bot_id",
					"type": "flags.11?int"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.3?int"
				},
				{
					"name": "entities",
					"type": "flags.7?Vector<MessageEntity>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "377562760",
			"predicate": "updateShortChatMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "out",
					"type": "flags.1?true"
				},
				{
					"name": "mentioned",
					"type": "flags.4?true"
				},
				{
					"name": "media_unread",
					"type": "flags.5?true"
				},
				{
					"name": "silent",
					"type": "flags.13?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "from_id",
					"type": "int"
				},
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "fwd_from",
					"type": "flags.2?MessageFwdHeader"
				},
				{
					"name": "via_bot_id",
					"type": "flags.11?int"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.3?int"
				},
				{
					"name": "entities",
					"type": "flags.7?Vector<MessageEntity>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "2027216577",
			"predicate": "updateShort",
			"params": [
				{
					"name": "update",
					"type": "Update"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1918567619",
			"predicate": "updatesCombined",
			"params": [
				{
					"name": "updates",
					"type": "Vector<Update>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "seq_start",
					"type": "int"
				},
				{
					"name": "seq",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1957577280",
			"predicate": "updates",
			"params": [
				{
					"name": "updates",
					"type": "Vector<Update>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "seq",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1916114267",
			"predicate": "photos.photos",
			"params": [
				{
					"name": "photos",
					"type": "Vector<Photo>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "photos.Photos"
		},
		{
			"id": "352657236",
			"predicate": "photos.photosSlice",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "photos",
					"type": "Vector<Photo>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "photos.Photos"
		},
		{
			"id": "539045032",
			"predicate": "photos.photo",
			"params": [
				{
					"name": "photo",
					"type": "Photo"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "photos.Photo"
		},
		{
			"id": "157948117",
			"predicate": "upload.file",
			"params": [
				{
					"name": "type",
					"type": "storage.FileType"
				},
				{
					"name": "mtime",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "upload.File"
		},
		{
			"id": "98092748",
			"predicate": "dcOption",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "ipv6",
					"type": "flags.0?true"
				},
				{
					"name": "media_only",
					"type": "flags.1?true"
				},
				{
					"name": "tcpo_only",
					"type": "flags.2?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "ip_address",
					"type": "string"
				},
				{
					"name": "port",
					"type": "int"
				}
			],
			"type": "DcOption"
		},
		{
			"id": "-1704251862",
			"predicate": "config",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "expires",
					"type": "int"
				},
				{
					"name": "test_mode",
					"type": "Bool"
				},
				{
					"name": "this_dc",
					"type": "int"
				},
				{
					"name": "dc_options",
					"type": "Vector<DcOption>"
				},
				{
					"name": "chat_size_max",
					"type": "int"
				},
				{
					"name": "megagroup_size_max",
					"type": "int"
				},
				{
					"name": "forwarded_count_max",
					"type": "int"
				},
				{
					"name": "online_update_period_ms",
					"type": "int"
				},
				{
					"name": "offline_blur_timeout_ms",
					"type": "int"
				},
				{
					"name": "offline_idle_timeout_ms",
					"type": "int"
				},
				{
					"name": "online_cloud_timeout_ms",
					"type": "int"
				},
				{
					"name": "notify_cloud_delay_ms",
					"type": "int"
				},
				{
					"name": "notify_default_delay_ms",
					"type": "int"
				},
				{
					"name": "chat_big_size",
					"type": "int"
				},
				{
					"name": "push_chat_period_ms",
					"type": "int"
				},
				{
					"name": "push_chat_limit",
					"type": "int"
				},
				{
					"name": "saved_gifs_limit",
					"type": "int"
				},
				{
					"name": "edit_time_limit",
					"type": "int"
				},
				{
					"name": "rating_e_decay",
					"type": "int"
				},
				{
					"name": "stickers_recent_limit",
					"type": "int"
				},
				{
					"name": "tmp_sessions",
					"type": "flags.0?int"
				},
				{
					"name": "disabled_features",
					"type": "Vector<DisabledFeature>"
				}
			],
			"type": "Config"
		},
		{
			"id": "-1910892683",
			"predicate": "nearestDc",
			"params": [
				{
					"name": "country",
					"type": "string"
				},
				{
					"name": "this_dc",
					"type": "int"
				},
				{
					"name": "nearest_dc",
					"type": "int"
				}
			],
			"type": "NearestDc"
		},
		{
			"id": "-1987579119",
			"predicate": "help.appUpdate",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "critical",
					"type": "Bool"
				},
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "help.AppUpdate"
		},
		{
			"id": "-1000708810",
			"predicate": "help.noAppUpdate",
			"params": [],
			"type": "help.AppUpdate"
		},
		{
			"id": "415997816",
			"predicate": "help.inviteText",
			"params": [
				{
					"name": "message",
					"type": "string"
				}
			],
			"type": "help.InviteText"
		},
		{
			"id": "1662091044",
			"predicate": "wallPaperSolid",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "bg_color",
					"type": "int"
				},
				{
					"name": "color",
					"type": "int"
				}
			],
			"type": "WallPaper"
		},
		{
			"id": "314359194",
			"predicate": "updateNewEncryptedMessage",
			"params": [
				{
					"name": "message",
					"type": "EncryptedMessage"
				},
				{
					"name": "qts",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "386986326",
			"predicate": "updateEncryptedChatTyping",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1264392051",
			"predicate": "updateEncryption",
			"params": [
				{
					"name": "chat",
					"type": "EncryptedChat"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "956179895",
			"predicate": "updateEncryptedMessagesRead",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "max_date",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1417756512",
			"predicate": "encryptedChatEmpty",
			"params": [
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "1006044124",
			"predicate": "encryptedChatWaiting",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "admin_id",
					"type": "int"
				},
				{
					"name": "participant_id",
					"type": "int"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "-931638658",
			"predicate": "encryptedChatRequested",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "admin_id",
					"type": "int"
				},
				{
					"name": "participant_id",
					"type": "int"
				},
				{
					"name": "g_a",
					"type": "bytes"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "-94974410",
			"predicate": "encryptedChat",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "admin_id",
					"type": "int"
				},
				{
					"name": "participant_id",
					"type": "int"
				},
				{
					"name": "g_a_or_b",
					"type": "bytes"
				},
				{
					"name": "key_fingerprint",
					"type": "long"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "332848423",
			"predicate": "encryptedChatDiscarded",
			"params": [
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "-247351839",
			"predicate": "inputEncryptedChat",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputEncryptedChat"
		},
		{
			"id": "-1038136962",
			"predicate": "encryptedFileEmpty",
			"params": [],
			"type": "EncryptedFile"
		},
		{
			"id": "1248893260",
			"predicate": "encryptedFile",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "size",
					"type": "int"
				},
				{
					"name": "dc_id",
					"type": "int"
				},
				{
					"name": "key_fingerprint",
					"type": "int"
				}
			],
			"type": "EncryptedFile"
		},
		{
			"id": "406307684",
			"predicate": "inputEncryptedFileEmpty",
			"params": [],
			"type": "InputEncryptedFile"
		},
		{
			"id": "1690108678",
			"predicate": "inputEncryptedFileUploaded",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "parts",
					"type": "int"
				},
				{
					"name": "md5_checksum",
					"type": "string"
				},
				{
					"name": "key_fingerprint",
					"type": "int"
				}
			],
			"type": "InputEncryptedFile"
		},
		{
			"id": "1511503333",
			"predicate": "inputEncryptedFile",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputEncryptedFile"
		},
		{
			"id": "-182231723",
			"predicate": "inputEncryptedFileLocation",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputFileLocation"
		},
		{
			"id": "-317144808",
			"predicate": "encryptedMessage",
			"params": [
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				},
				{
					"name": "file",
					"type": "EncryptedFile"
				}
			],
			"type": "EncryptedMessage"
		},
		{
			"id": "594758406",
			"predicate": "encryptedMessageService",
			"params": [
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "EncryptedMessage"
		},
		{
			"id": "-1058912715",
			"predicate": "messages.dhConfigNotModified",
			"params": [
				{
					"name": "random",
					"type": "bytes"
				}
			],
			"type": "messages.DhConfig"
		},
		{
			"id": "740433629",
			"predicate": "messages.dhConfig",
			"params": [
				{
					"name": "g",
					"type": "int"
				},
				{
					"name": "p",
					"type": "bytes"
				},
				{
					"name": "version",
					"type": "int"
				},
				{
					"name": "random",
					"type": "bytes"
				}
			],
			"type": "messages.DhConfig"
		},
		{
			"id": "1443858741",
			"predicate": "messages.sentEncryptedMessage",
			"params": [
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "messages.SentEncryptedMessage"
		},
		{
			"id": "-1802240206",
			"predicate": "messages.sentEncryptedFile",
			"params": [
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "file",
					"type": "EncryptedFile"
				}
			],
			"type": "messages.SentEncryptedMessage"
		},
		{
			"id": "-95482955",
			"predicate": "inputFileBig",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "parts",
					"type": "int"
				},
				{
					"name": "name",
					"type": "string"
				}
			],
			"type": "InputFile"
		},
		{
			"id": "767652808",
			"predicate": "inputEncryptedFileBigUploaded",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "parts",
					"type": "int"
				},
				{
					"name": "key_fingerprint",
					"type": "int"
				}
			],
			"type": "InputEncryptedFile"
		},
		{
			"id": "-364179876",
			"predicate": "updateChatParticipantAdd",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1851755554",
			"predicate": "updateChatParticipantDelete",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1906403213",
			"predicate": "updateDcOptions",
			"params": [
				{
					"name": "dc_options",
					"type": "Vector<DcOption>"
				}
			],
			"type": "Update"
		},
		{
			"id": "-797904407",
			"predicate": "inputMediaUploadedDocument",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "file",
					"type": "InputFile"
				},
				{
					"name": "mime_type",
					"type": "string"
				},
				{
					"name": "attributes",
					"type": "Vector<DocumentAttribute>"
				},
				{
					"name": "caption",
					"type": "string"
				},
				{
					"name": "stickers",
					"type": "flags.0?Vector<InputDocument>"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "1356369070",
			"predicate": "inputMediaUploadedThumbDocument",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "file",
					"type": "InputFile"
				},
				{
					"name": "thumb",
					"type": "InputFile"
				},
				{
					"name": "mime_type",
					"type": "string"
				},
				{
					"name": "attributes",
					"type": "Vector<DocumentAttribute>"
				},
				{
					"name": "caption",
					"type": "string"
				},
				{
					"name": "stickers",
					"type": "flags.0?Vector<InputDocument>"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "444068508",
			"predicate": "inputMediaDocument",
			"params": [
				{
					"name": "id",
					"type": "InputDocument"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "-203411800",
			"predicate": "messageMediaDocument",
			"params": [
				{
					"name": "document",
					"type": "Document"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "1928391342",
			"predicate": "inputDocumentEmpty",
			"params": [],
			"type": "InputDocument"
		},
		{
			"id": "410618194",
			"predicate": "inputDocument",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputDocument"
		},
		{
			"id": "1125058340",
			"predicate": "inputDocumentFileLocation",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "InputFileLocation"
		},
		{
			"id": "922273905",
			"predicate": "documentEmpty",
			"params": [
				{
					"name": "id",
					"type": "long"
				}
			],
			"type": "Document"
		},
		{
			"id": "-2027738169",
			"predicate": "document",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "mime_type",
					"type": "string"
				},
				{
					"name": "size",
					"type": "int"
				},
				{
					"name": "thumb",
					"type": "PhotoSize"
				},
				{
					"name": "dc_id",
					"type": "int"
				},
				{
					"name": "version",
					"type": "int"
				},
				{
					"name": "attributes",
					"type": "Vector<DocumentAttribute>"
				}
			],
			"type": "Document"
		},
		{
			"id": "398898678",
			"predicate": "help.support",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "user",
					"type": "User"
				}
			],
			"type": "help.Support"
		},
		{
			"id": "-1613493288",
			"predicate": "notifyPeer",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				}
			],
			"type": "NotifyPeer"
		},
		{
			"id": "-1261946036",
			"predicate": "notifyUsers",
			"params": [],
			"type": "NotifyPeer"
		},
		{
			"id": "-1073230141",
			"predicate": "notifyChats",
			"params": [],
			"type": "NotifyPeer"
		},
		{
			"id": "1959820384",
			"predicate": "notifyAll",
			"params": [],
			"type": "NotifyPeer"
		},
		{
			"id": "-2131957734",
			"predicate": "updateUserBlocked",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "blocked",
					"type": "Bool"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1094555409",
			"predicate": "updateNotifySettings",
			"params": [
				{
					"name": "peer",
					"type": "NotifyPeer"
				},
				{
					"name": "notify_settings",
					"type": "PeerNotifySettings"
				}
			],
			"type": "Update"
		},
		{
			"id": "381645902",
			"predicate": "sendMessageTypingAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "-44119819",
			"predicate": "sendMessageCancelAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "-1584933265",
			"predicate": "sendMessageRecordVideoAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "-378127636",
			"predicate": "sendMessageUploadVideoAction",
			"params": [
				{
					"name": "progress",
					"type": "int"
				}
			],
			"type": "SendMessageAction"
		},
		{
			"id": "-718310409",
			"predicate": "sendMessageRecordAudioAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "-212740181",
			"predicate": "sendMessageUploadAudioAction",
			"params": [
				{
					"name": "progress",
					"type": "int"
				}
			],
			"type": "SendMessageAction"
		},
		{
			"id": "-774682074",
			"predicate": "sendMessageUploadPhotoAction",
			"params": [
				{
					"name": "progress",
					"type": "int"
				}
			],
			"type": "SendMessageAction"
		},
		{
			"id": "-1441998364",
			"predicate": "sendMessageUploadDocumentAction",
			"params": [
				{
					"name": "progress",
					"type": "int"
				}
			],
			"type": "SendMessageAction"
		},
		{
			"id": "393186209",
			"predicate": "sendMessageGeoLocationAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "1653390447",
			"predicate": "sendMessageChooseContactAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "446822276",
			"predicate": "contacts.found",
			"params": [
				{
					"name": "results",
					"type": "Vector<Peer>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.Found"
		},
		{
			"id": "942527460",
			"predicate": "updateServiceNotification",
			"params": [
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "media",
					"type": "MessageMedia"
				},
				{
					"name": "popup",
					"type": "Bool"
				}
			],
			"type": "Update"
		},
		{
			"id": "-496024847",
			"predicate": "userStatusRecently",
			"params": [],
			"type": "UserStatus"
		},
		{
			"id": "129960444",
			"predicate": "userStatusLastWeek",
			"params": [],
			"type": "UserStatus"
		},
		{
			"id": "2011940674",
			"predicate": "userStatusLastMonth",
			"params": [],
			"type": "UserStatus"
		},
		{
			"id": "-298113238",
			"predicate": "updatePrivacy",
			"params": [
				{
					"name": "key",
					"type": "PrivacyKey"
				},
				{
					"name": "rules",
					"type": "Vector<PrivacyRule>"
				}
			],
			"type": "Update"
		},
		{
			"id": "1335282456",
			"predicate": "inputPrivacyKeyStatusTimestamp",
			"params": [],
			"type": "InputPrivacyKey"
		},
		{
			"id": "-1137792208",
			"predicate": "privacyKeyStatusTimestamp",
			"params": [],
			"type": "PrivacyKey"
		},
		{
			"id": "218751099",
			"predicate": "inputPrivacyValueAllowContacts",
			"params": [],
			"type": "InputPrivacyRule"
		},
		{
			"id": "407582158",
			"predicate": "inputPrivacyValueAllowAll",
			"params": [],
			"type": "InputPrivacyRule"
		},
		{
			"id": "320652927",
			"predicate": "inputPrivacyValueAllowUsers",
			"params": [
				{
					"name": "users",
					"type": "Vector<InputUser>"
				}
			],
			"type": "InputPrivacyRule"
		},
		{
			"id": "195371015",
			"predicate": "inputPrivacyValueDisallowContacts",
			"params": [],
			"type": "InputPrivacyRule"
		},
		{
			"id": "-697604407",
			"predicate": "inputPrivacyValueDisallowAll",
			"params": [],
			"type": "InputPrivacyRule"
		},
		{
			"id": "-1877932953",
			"predicate": "inputPrivacyValueDisallowUsers",
			"params": [
				{
					"name": "users",
					"type": "Vector<InputUser>"
				}
			],
			"type": "InputPrivacyRule"
		},
		{
			"id": "-123988",
			"predicate": "privacyValueAllowContacts",
			"params": [],
			"type": "PrivacyRule"
		},
		{
			"id": "1698855810",
			"predicate": "privacyValueAllowAll",
			"params": [],
			"type": "PrivacyRule"
		},
		{
			"id": "1297858060",
			"predicate": "privacyValueAllowUsers",
			"params": [
				{
					"name": "users",
					"type": "Vector<int>"
				}
			],
			"type": "PrivacyRule"
		},
		{
			"id": "-125240806",
			"predicate": "privacyValueDisallowContacts",
			"params": [],
			"type": "PrivacyRule"
		},
		{
			"id": "-1955338397",
			"predicate": "privacyValueDisallowAll",
			"params": [],
			"type": "PrivacyRule"
		},
		{
			"id": "209668535",
			"predicate": "privacyValueDisallowUsers",
			"params": [
				{
					"name": "users",
					"type": "Vector<int>"
				}
			],
			"type": "PrivacyRule"
		},
		{
			"id": "1430961007",
			"predicate": "account.privacyRules",
			"params": [
				{
					"name": "rules",
					"type": "Vector<PrivacyRule>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "account.PrivacyRules"
		},
		{
			"id": "-1194283041",
			"predicate": "accountDaysTTL",
			"params": [
				{
					"name": "days",
					"type": "int"
				}
			],
			"type": "AccountDaysTTL"
		},
		{
			"id": "314130811",
			"predicate": "updateUserPhone",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "phone",
					"type": "string"
				}
			],
			"type": "Update"
		},
		{
			"id": "1815593308",
			"predicate": "documentAttributeImageSize",
			"params": [
				{
					"name": "w",
					"type": "int"
				},
				{
					"name": "h",
					"type": "int"
				}
			],
			"type": "DocumentAttribute"
		},
		{
			"id": "297109817",
			"predicate": "documentAttributeAnimated",
			"params": [],
			"type": "DocumentAttribute"
		},
		{
			"id": "1662637586",
			"predicate": "documentAttributeSticker",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "mask",
					"type": "flags.1?true"
				},
				{
					"name": "alt",
					"type": "string"
				},
				{
					"name": "stickerset",
					"type": "InputStickerSet"
				},
				{
					"name": "mask_coords",
					"type": "flags.0?MaskCoords"
				}
			],
			"type": "DocumentAttribute"
		},
		{
			"id": "1494273227",
			"predicate": "documentAttributeVideo",
			"params": [
				{
					"name": "duration",
					"type": "int"
				},
				{
					"name": "w",
					"type": "int"
				},
				{
					"name": "h",
					"type": "int"
				}
			],
			"type": "DocumentAttribute"
		},
		{
			"id": "-1739392570",
			"predicate": "documentAttributeAudio",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "voice",
					"type": "flags.10?true"
				},
				{
					"name": "duration",
					"type": "int"
				},
				{
					"name": "title",
					"type": "flags.0?string"
				},
				{
					"name": "performer",
					"type": "flags.1?string"
				},
				{
					"name": "waveform",
					"type": "flags.2?bytes"
				}
			],
			"type": "DocumentAttribute"
		},
		{
			"id": "358154344",
			"predicate": "documentAttributeFilename",
			"params": [
				{
					"name": "file_name",
					"type": "string"
				}
			],
			"type": "DocumentAttribute"
		},
		{
			"id": "-244016606",
			"predicate": "messages.stickersNotModified",
			"params": [],
			"type": "messages.Stickers"
		},
		{
			"id": "-1970352846",
			"predicate": "messages.stickers",
			"params": [
				{
					"name": "hash",
					"type": "string"
				},
				{
					"name": "stickers",
					"type": "Vector<Document>"
				}
			],
			"type": "messages.Stickers"
		},
		{
			"id": "313694676",
			"predicate": "stickerPack",
			"params": [
				{
					"name": "emoticon",
					"type": "string"
				},
				{
					"name": "documents",
					"type": "Vector<long>"
				}
			],
			"type": "StickerPack"
		},
		{
			"id": "-395967805",
			"predicate": "messages.allStickersNotModified",
			"params": [],
			"type": "messages.AllStickers"
		},
		{
			"id": "-302170017",
			"predicate": "messages.allStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				},
				{
					"name": "sets",
					"type": "Vector<StickerSet>"
				}
			],
			"type": "messages.AllStickers"
		},
		{
			"id": "-1369215196",
			"predicate": "disabledFeature",
			"params": [
				{
					"name": "feature",
					"type": "string"
				},
				{
					"name": "description",
					"type": "string"
				}
			],
			"type": "DisabledFeature"
		},
		{
			"id": "-1721631396",
			"predicate": "updateReadHistoryInbox",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "max_id",
					"type": "int"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "791617983",
			"predicate": "updateReadHistoryOutbox",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "max_id",
					"type": "int"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-2066640507",
			"predicate": "messages.affectedMessages",
			"params": [
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "messages.AffectedMessages"
		},
		{
			"id": "1599050311",
			"predicate": "contactLinkUnknown",
			"params": [],
			"type": "ContactLink"
		},
		{
			"id": "-17968211",
			"predicate": "contactLinkNone",
			"params": [],
			"type": "ContactLink"
		},
		{
			"id": "646922073",
			"predicate": "contactLinkHasPhone",
			"params": [],
			"type": "ContactLink"
		},
		{
			"id": "-721239344",
			"predicate": "contactLinkContact",
			"params": [],
			"type": "ContactLink"
		},
		{
			"id": "2139689491",
			"predicate": "updateWebPage",
			"params": [
				{
					"name": "webpage",
					"type": "WebPage"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-350980120",
			"predicate": "webPageEmpty",
			"params": [
				{
					"name": "id",
					"type": "long"
				}
			],
			"type": "WebPage"
		},
		{
			"id": "-981018084",
			"predicate": "webPagePending",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "WebPage"
		},
		{
			"id": "-897446185",
			"predicate": "webPage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "display_url",
					"type": "string"
				},
				{
					"name": "type",
					"type": "flags.0?string"
				},
				{
					"name": "site_name",
					"type": "flags.1?string"
				},
				{
					"name": "title",
					"type": "flags.2?string"
				},
				{
					"name": "description",
					"type": "flags.3?string"
				},
				{
					"name": "photo",
					"type": "flags.4?Photo"
				},
				{
					"name": "embed_url",
					"type": "flags.5?string"
				},
				{
					"name": "embed_type",
					"type": "flags.5?string"
				},
				{
					"name": "embed_width",
					"type": "flags.6?int"
				},
				{
					"name": "embed_height",
					"type": "flags.6?int"
				},
				{
					"name": "duration",
					"type": "flags.7?int"
				},
				{
					"name": "author",
					"type": "flags.8?string"
				},
				{
					"name": "document",
					"type": "flags.9?Document"
				}
			],
			"type": "WebPage"
		},
		{
			"id": "-1557277184",
			"predicate": "messageMediaWebPage",
			"params": [
				{
					"name": "webpage",
					"type": "WebPage"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "2079516406",
			"predicate": "authorization",
			"params": [
				{
					"name": "hash",
					"type": "long"
				},
				{
					"name": "flags",
					"type": "int"
				},
				{
					"name": "device_model",
					"type": "string"
				},
				{
					"name": "platform",
					"type": "string"
				},
				{
					"name": "system_version",
					"type": "string"
				},
				{
					"name": "api_id",
					"type": "int"
				},
				{
					"name": "app_name",
					"type": "string"
				},
				{
					"name": "app_version",
					"type": "string"
				},
				{
					"name": "date_created",
					"type": "int"
				},
				{
					"name": "date_active",
					"type": "int"
				},
				{
					"name": "ip",
					"type": "string"
				},
				{
					"name": "country",
					"type": "string"
				},
				{
					"name": "region",
					"type": "string"
				}
			],
			"type": "Authorization"
		},
		{
			"id": "307276766",
			"predicate": "account.authorizations",
			"params": [
				{
					"name": "authorizations",
					"type": "Vector<Authorization>"
				}
			],
			"type": "account.Authorizations"
		},
		{
			"id": "-1764049896",
			"predicate": "account.noPassword",
			"params": [
				{
					"name": "new_salt",
					"type": "bytes"
				},
				{
					"name": "email_unconfirmed_pattern",
					"type": "string"
				}
			],
			"type": "account.Password"
		},
		{
			"id": "2081952796",
			"predicate": "account.password",
			"params": [
				{
					"name": "current_salt",
					"type": "bytes"
				},
				{
					"name": "new_salt",
					"type": "bytes"
				},
				{
					"name": "hint",
					"type": "string"
				},
				{
					"name": "has_recovery",
					"type": "Bool"
				},
				{
					"name": "email_unconfirmed_pattern",
					"type": "string"
				}
			],
			"type": "account.Password"
		},
		{
			"id": "-1212732749",
			"predicate": "account.passwordSettings",
			"params": [
				{
					"name": "email",
					"type": "string"
				}
			],
			"type": "account.PasswordSettings"
		},
		{
			"id": "-2037289493",
			"predicate": "account.passwordInputSettings",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "new_salt",
					"type": "flags.0?bytes"
				},
				{
					"name": "new_password_hash",
					"type": "flags.0?bytes"
				},
				{
					"name": "hint",
					"type": "flags.0?string"
				},
				{
					"name": "email",
					"type": "flags.1?string"
				}
			],
			"type": "account.PasswordInputSettings"
		},
		{
			"id": "326715557",
			"predicate": "auth.passwordRecovery",
			"params": [
				{
					"name": "email_pattern",
					"type": "string"
				}
			],
			"type": "auth.PasswordRecovery"
		},
		{
			"id": "673687578",
			"predicate": "inputMediaVenue",
			"params": [
				{
					"name": "geo_point",
					"type": "InputGeoPoint"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "address",
					"type": "string"
				},
				{
					"name": "provider",
					"type": "string"
				},
				{
					"name": "venue_id",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "2031269663",
			"predicate": "messageMediaVenue",
			"params": [
				{
					"name": "geo",
					"type": "GeoPoint"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "address",
					"type": "string"
				},
				{
					"name": "provider",
					"type": "string"
				},
				{
					"name": "venue_id",
					"type": "string"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "-1551583367",
			"predicate": "receivedNotifyMessage",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "flags",
					"type": "int"
				}
			],
			"type": "ReceivedNotifyMessage"
		},
		{
			"id": "1776236393",
			"predicate": "chatInviteEmpty",
			"params": [],
			"type": "ExportedChatInvite"
		},
		{
			"id": "-64092740",
			"predicate": "chatInviteExported",
			"params": [
				{
					"name": "link",
					"type": "string"
				}
			],
			"type": "ExportedChatInvite"
		},
		{
			"id": "1516793212",
			"predicate": "chatInviteAlready",
			"params": [
				{
					"name": "chat",
					"type": "Chat"
				}
			],
			"type": "ChatInvite"
		},
		{
			"id": "-613092008",
			"predicate": "chatInvite",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "channel",
					"type": "flags.0?true"
				},
				{
					"name": "broadcast",
					"type": "flags.1?true"
				},
				{
					"name": "public",
					"type": "flags.2?true"
				},
				{
					"name": "megagroup",
					"type": "flags.3?true"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "ChatPhoto"
				},
				{
					"name": "participants_count",
					"type": "int"
				},
				{
					"name": "participants",
					"type": "flags.4?Vector<User>"
				}
			],
			"type": "ChatInvite"
		},
		{
			"id": "-123931160",
			"predicate": "messageActionChatJoinedByLink",
			"params": [
				{
					"name": "inviter_id",
					"type": "int"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "1757493555",
			"predicate": "updateReadMessagesContents",
			"params": [
				{
					"name": "messages",
					"type": "Vector<int>"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-4838507",
			"predicate": "inputStickerSetEmpty",
			"params": [],
			"type": "InputStickerSet"
		},
		{
			"id": "-1645763991",
			"predicate": "inputStickerSetID",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputStickerSet"
		},
		{
			"id": "-2044933984",
			"predicate": "inputStickerSetShortName",
			"params": [
				{
					"name": "short_name",
					"type": "string"
				}
			],
			"type": "InputStickerSet"
		},
		{
			"id": "-852477119",
			"predicate": "stickerSet",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "installed",
					"type": "flags.0?true"
				},
				{
					"name": "archived",
					"type": "flags.1?true"
				},
				{
					"name": "official",
					"type": "flags.2?true"
				},
				{
					"name": "masks",
					"type": "flags.3?true"
				},
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "short_name",
					"type": "string"
				},
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "StickerSet"
		},
		{
			"id": "-1240849242",
			"predicate": "messages.stickerSet",
			"params": [
				{
					"name": "set",
					"type": "StickerSet"
				},
				{
					"name": "packs",
					"type": "Vector<StickerPack>"
				},
				{
					"name": "documents",
					"type": "Vector<Document>"
				}
			],
			"type": "messages.StickerSet"
		},
		{
			"id": "-787638374",
			"predicate": "user",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "self",
					"type": "flags.10?true"
				},
				{
					"name": "contact",
					"type": "flags.11?true"
				},
				{
					"name": "mutual_contact",
					"type": "flags.12?true"
				},
				{
					"name": "deleted",
					"type": "flags.13?true"
				},
				{
					"name": "bot",
					"type": "flags.14?true"
				},
				{
					"name": "bot_chat_history",
					"type": "flags.15?true"
				},
				{
					"name": "bot_nochats",
					"type": "flags.16?true"
				},
				{
					"name": "verified",
					"type": "flags.17?true"
				},
				{
					"name": "restricted",
					"type": "flags.18?true"
				},
				{
					"name": "min",
					"type": "flags.20?true"
				},
				{
					"name": "bot_inline_geo",
					"type": "flags.21?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "flags.0?long"
				},
				{
					"name": "first_name",
					"type": "flags.1?string"
				},
				{
					"name": "last_name",
					"type": "flags.2?string"
				},
				{
					"name": "username",
					"type": "flags.3?string"
				},
				{
					"name": "phone",
					"type": "flags.4?string"
				},
				{
					"name": "photo",
					"type": "flags.5?UserProfilePhoto"
				},
				{
					"name": "status",
					"type": "flags.6?UserStatus"
				},
				{
					"name": "bot_info_version",
					"type": "flags.14?int"
				},
				{
					"name": "restriction_reason",
					"type": "flags.18?string"
				},
				{
					"name": "bot_inline_placeholder",
					"type": "flags.19?string"
				}
			],
			"type": "User"
		},
		{
			"id": "-1032140601",
			"predicate": "botCommand",
			"params": [
				{
					"name": "command",
					"type": "string"
				},
				{
					"name": "description",
					"type": "string"
				}
			],
			"type": "BotCommand"
		},
		{
			"id": "-1729618630",
			"predicate": "botInfo",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "description",
					"type": "string"
				},
				{
					"name": "commands",
					"type": "Vector<BotCommand>"
				}
			],
			"type": "BotInfo"
		},
		{
			"id": "-1560655744",
			"predicate": "keyboardButton",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "2002815875",
			"predicate": "keyboardButtonRow",
			"params": [
				{
					"name": "buttons",
					"type": "Vector<KeyboardButton>"
				}
			],
			"type": "KeyboardButtonRow"
		},
		{
			"id": "-1606526075",
			"predicate": "replyKeyboardHide",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "selective",
					"type": "flags.2?true"
				}
			],
			"type": "ReplyMarkup"
		},
		{
			"id": "-200242528",
			"predicate": "replyKeyboardForceReply",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "single_use",
					"type": "flags.1?true"
				},
				{
					"name": "selective",
					"type": "flags.2?true"
				}
			],
			"type": "ReplyMarkup"
		},
		{
			"id": "889353612",
			"predicate": "replyKeyboardMarkup",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "resize",
					"type": "flags.0?true"
				},
				{
					"name": "single_use",
					"type": "flags.1?true"
				},
				{
					"name": "selective",
					"type": "flags.2?true"
				},
				{
					"name": "rows",
					"type": "Vector<KeyboardButtonRow>"
				}
			],
			"type": "ReplyMarkup"
		},
		{
			"id": "2072935910",
			"predicate": "inputPeerUser",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputPeer"
		},
		{
			"id": "-668391402",
			"predicate": "inputUser",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputUser"
		},
		{
			"id": "-1350696044",
			"predicate": "help.appChangelogEmpty",
			"params": [],
			"type": "help.AppChangelog"
		},
		{
			"id": "1181279933",
			"predicate": "help.appChangelog",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "help.AppChangelog"
		},
		{
			"id": "-1148011883",
			"predicate": "messageEntityUnknown",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "-100378723",
			"predicate": "messageEntityMention",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1868782349",
			"predicate": "messageEntityHashtag",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1827637959",
			"predicate": "messageEntityBotCommand",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1859134776",
			"predicate": "messageEntityUrl",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1692693954",
			"predicate": "messageEntityEmail",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "-1117713463",
			"predicate": "messageEntityBold",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "-2106619040",
			"predicate": "messageEntityItalic",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "681706865",
			"predicate": "messageEntityCode",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1938967520",
			"predicate": "messageEntityPre",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				},
				{
					"name": "language",
					"type": "string"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "1990644519",
			"predicate": "messageEntityTextUrl",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				},
				{
					"name": "url",
					"type": "string"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "301019932",
			"predicate": "updateShortSentMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "out",
					"type": "flags.1?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "media",
					"type": "flags.9?MessageMedia"
				},
				{
					"name": "entities",
					"type": "flags.7?Vector<MessageEntity>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-292807034",
			"predicate": "inputChannelEmpty",
			"params": [],
			"type": "InputChannel"
		},
		{
			"id": "-1343524562",
			"predicate": "inputChannel",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputChannel"
		},
		{
			"id": "-1109531342",
			"predicate": "peerChannel",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				}
			],
			"type": "Peer"
		},
		{
			"id": "548253432",
			"predicate": "inputPeerChannel",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputPeer"
		},
		{
			"id": "-1588737454",
			"predicate": "channel",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "creator",
					"type": "flags.0?true"
				},
				{
					"name": "kicked",
					"type": "flags.1?true"
				},
				{
					"name": "left",
					"type": "flags.2?true"
				},
				{
					"name": "editor",
					"type": "flags.3?true"
				},
				{
					"name": "moderator",
					"type": "flags.4?true"
				},
				{
					"name": "broadcast",
					"type": "flags.5?true"
				},
				{
					"name": "verified",
					"type": "flags.7?true"
				},
				{
					"name": "megagroup",
					"type": "flags.8?true"
				},
				{
					"name": "restricted",
					"type": "flags.9?true"
				},
				{
					"name": "democracy",
					"type": "flags.10?true"
				},
				{
					"name": "signatures",
					"type": "flags.11?true"
				},
				{
					"name": "min",
					"type": "flags.12?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "flags.13?long"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "username",
					"type": "flags.6?string"
				},
				{
					"name": "photo",
					"type": "ChatPhoto"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "version",
					"type": "int"
				},
				{
					"name": "restriction_reason",
					"type": "flags.9?string"
				}
			],
			"type": "Chat"
		},
		{
			"id": "-2059962289",
			"predicate": "channelForbidden",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "broadcast",
					"type": "flags.5?true"
				},
				{
					"name": "megagroup",
					"type": "flags.8?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "Chat"
		},
		{
			"id": "2131196633",
			"predicate": "contacts.resolvedPeer",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.ResolvedPeer"
		},
		{
			"id": "-1009430225",
			"predicate": "channelFull",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "can_view_participants",
					"type": "flags.3?true"
				},
				{
					"name": "can_set_username",
					"type": "flags.6?true"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "about",
					"type": "string"
				},
				{
					"name": "participants_count",
					"type": "flags.0?int"
				},
				{
					"name": "admins_count",
					"type": "flags.1?int"
				},
				{
					"name": "kicked_count",
					"type": "flags.2?int"
				},
				{
					"name": "read_inbox_max_id",
					"type": "int"
				},
				{
					"name": "read_outbox_max_id",
					"type": "int"
				},
				{
					"name": "unread_count",
					"type": "int"
				},
				{
					"name": "chat_photo",
					"type": "Photo"
				},
				{
					"name": "notify_settings",
					"type": "PeerNotifySettings"
				},
				{
					"name": "exported_invite",
					"type": "ExportedChatInvite"
				},
				{
					"name": "bot_info",
					"type": "Vector<BotInfo>"
				},
				{
					"name": "migrated_from_chat_id",
					"type": "flags.4?int"
				},
				{
					"name": "migrated_from_max_id",
					"type": "flags.4?int"
				},
				{
					"name": "pinned_msg_id",
					"type": "flags.5?int"
				}
			],
			"type": "ChatFull"
		},
		{
			"id": "182649427",
			"predicate": "messageRange",
			"params": [
				{
					"name": "min_id",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "MessageRange"
		},
		{
			"id": "-1725551049",
			"predicate": "messages.channelMessages",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "-1781355374",
			"predicate": "messageActionChannelCreate",
			"params": [
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-352032773",
			"predicate": "updateChannelTooLong",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "pts",
					"type": "flags.0?int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1227598250",
			"predicate": "updateChannel",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1656358105",
			"predicate": "updateNewChannelMessage",
			"params": [
				{
					"name": "message",
					"type": "Message"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1108669311",
			"predicate": "updateReadChannelInbox",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1015733815",
			"predicate": "updateDeleteChannelMessages",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "messages",
					"type": "Vector<int>"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1734268085",
			"predicate": "updateChannelMessageViews",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "views",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1041346555",
			"predicate": "updates.channelDifferenceEmpty",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "final",
					"type": "flags.0?true"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "timeout",
					"type": "flags.1?int"
				}
			],
			"type": "updates.ChannelDifference"
		},
		{
			"id": "1091431943",
			"predicate": "updates.channelDifferenceTooLong",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "final",
					"type": "flags.0?true"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "timeout",
					"type": "flags.1?int"
				},
				{
					"name": "top_message",
					"type": "int"
				},
				{
					"name": "read_inbox_max_id",
					"type": "int"
				},
				{
					"name": "read_outbox_max_id",
					"type": "int"
				},
				{
					"name": "unread_count",
					"type": "int"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "updates.ChannelDifference"
		},
		{
			"id": "543450958",
			"predicate": "updates.channelDifference",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "final",
					"type": "flags.0?true"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "timeout",
					"type": "flags.1?int"
				},
				{
					"name": "new_messages",
					"type": "Vector<Message>"
				},
				{
					"name": "other_updates",
					"type": "Vector<Update>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "updates.ChannelDifference"
		},
		{
			"id": "-1798033689",
			"predicate": "channelMessagesFilterEmpty",
			"params": [],
			"type": "ChannelMessagesFilter"
		},
		{
			"id": "-847783593",
			"predicate": "channelMessagesFilter",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "exclude_new_messages",
					"type": "flags.1?true"
				},
				{
					"name": "ranges",
					"type": "Vector<MessageRange>"
				}
			],
			"type": "ChannelMessagesFilter"
		},
		{
			"id": "367766557",
			"predicate": "channelParticipant",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-1557620115",
			"predicate": "channelParticipantSelf",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-1861910545",
			"predicate": "channelParticipantModerator",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-1743180447",
			"predicate": "channelParticipantEditor",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-1933187430",
			"predicate": "channelParticipantKicked",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "kicked_by",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-471670279",
			"predicate": "channelParticipantCreator",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "ChannelParticipant"
		},
		{
			"id": "-566281095",
			"predicate": "channelParticipantsRecent",
			"params": [],
			"type": "ChannelParticipantsFilter"
		},
		{
			"id": "-1268741783",
			"predicate": "channelParticipantsAdmins",
			"params": [],
			"type": "ChannelParticipantsFilter"
		},
		{
			"id": "1010285434",
			"predicate": "channelParticipantsKicked",
			"params": [],
			"type": "ChannelParticipantsFilter"
		},
		{
			"id": "-1299865402",
			"predicate": "channelRoleEmpty",
			"params": [],
			"type": "ChannelParticipantRole"
		},
		{
			"id": "-1776756363",
			"predicate": "channelRoleModerator",
			"params": [],
			"type": "ChannelParticipantRole"
		},
		{
			"id": "-2113143156",
			"predicate": "channelRoleEditor",
			"params": [],
			"type": "ChannelParticipantRole"
		},
		{
			"id": "-177282392",
			"predicate": "channels.channelParticipants",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "participants",
					"type": "Vector<ChannelParticipant>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "channels.ChannelParticipants"
		},
		{
			"id": "-791039645",
			"predicate": "channels.channelParticipant",
			"params": [
				{
					"name": "participant",
					"type": "ChannelParticipant"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "channels.ChannelParticipant"
		},
		{
			"id": "-636267638",
			"predicate": "chatParticipantCreator",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "ChatParticipant"
		},
		{
			"id": "-489233354",
			"predicate": "chatParticipantAdmin",
			"params": [
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "inviter_id",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "ChatParticipant"
		},
		{
			"id": "1855224129",
			"predicate": "updateChatAdmins",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "enabled",
					"type": "Bool"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1232070311",
			"predicate": "updateChatParticipantAdmin",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "is_admin",
					"type": "Bool"
				},
				{
					"name": "version",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "1371385889",
			"predicate": "messageActionChatMigrateTo",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-1336546578",
			"predicate": "messageActionChannelMigrateFrom",
			"params": [
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "-1328445861",
			"predicate": "channelParticipantsBots",
			"params": [],
			"type": "ChannelParticipantsFilter"
		},
		{
			"id": "-236044656",
			"predicate": "help.termsOfService",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "help.TermsOfService"
		},
		{
			"id": "1753886890",
			"predicate": "updateNewStickerSet",
			"params": [
				{
					"name": "stickerset",
					"type": "messages.StickerSet"
				}
			],
			"type": "Update"
		},
		{
			"id": "196268545",
			"predicate": "updateStickerSetsOrder",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "masks",
					"type": "flags.0?true"
				},
				{
					"name": "order",
					"type": "Vector<long>"
				}
			],
			"type": "Update"
		},
		{
			"id": "1135492588",
			"predicate": "updateStickerSets",
			"params": [],
			"type": "Update"
		},
		{
			"id": "372165663",
			"predicate": "foundGif",
			"params": [
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "thumb_url",
					"type": "string"
				},
				{
					"name": "content_url",
					"type": "string"
				},
				{
					"name": "content_type",
					"type": "string"
				},
				{
					"name": "w",
					"type": "int"
				},
				{
					"name": "h",
					"type": "int"
				}
			],
			"type": "FoundGif"
		},
		{
			"id": "-1670052855",
			"predicate": "foundGifCached",
			"params": [
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "Photo"
				},
				{
					"name": "document",
					"type": "Document"
				}
			],
			"type": "FoundGif"
		},
		{
			"id": "1212395773",
			"predicate": "inputMediaGifExternal",
			"params": [
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "q",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "1158290442",
			"predicate": "messages.foundGifs",
			"params": [
				{
					"name": "next_offset",
					"type": "int"
				},
				{
					"name": "results",
					"type": "Vector<FoundGif>"
				}
			],
			"type": "messages.FoundGifs"
		},
		{
			"id": "-402498398",
			"predicate": "messages.savedGifsNotModified",
			"params": [],
			"type": "messages.SavedGifs"
		},
		{
			"id": "772213157",
			"predicate": "messages.savedGifs",
			"params": [
				{
					"name": "hash",
					"type": "int"
				},
				{
					"name": "gifs",
					"type": "Vector<Document>"
				}
			],
			"type": "messages.SavedGifs"
		},
		{
			"id": "-1821035490",
			"predicate": "updateSavedGifs",
			"params": [],
			"type": "Update"
		},
		{
			"id": "691006739",
			"predicate": "inputBotInlineMessageMediaAuto",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "caption",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "1036876423",
			"predicate": "inputBotInlineMessageText",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.0?true"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "entities",
					"type": "flags.1?Vector<MessageEntity>"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "750510426",
			"predicate": "inputBotInlineResult",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "title",
					"type": "flags.1?string"
				},
				{
					"name": "description",
					"type": "flags.2?string"
				},
				{
					"name": "url",
					"type": "flags.3?string"
				},
				{
					"name": "thumb_url",
					"type": "flags.4?string"
				},
				{
					"name": "content_url",
					"type": "flags.5?string"
				},
				{
					"name": "content_type",
					"type": "flags.5?string"
				},
				{
					"name": "w",
					"type": "flags.6?int"
				},
				{
					"name": "h",
					"type": "flags.6?int"
				},
				{
					"name": "duration",
					"type": "flags.7?int"
				},
				{
					"name": "send_message",
					"type": "InputBotInlineMessage"
				}
			],
			"type": "InputBotInlineResult"
		},
		{
			"id": "175419739",
			"predicate": "botInlineMessageMediaAuto",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "caption",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "BotInlineMessage"
		},
		{
			"id": "-1937807902",
			"predicate": "botInlineMessageText",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.0?true"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "entities",
					"type": "flags.1?Vector<MessageEntity>"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "BotInlineMessage"
		},
		{
			"id": "-1679053127",
			"predicate": "botInlineResult",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "title",
					"type": "flags.1?string"
				},
				{
					"name": "description",
					"type": "flags.2?string"
				},
				{
					"name": "url",
					"type": "flags.3?string"
				},
				{
					"name": "thumb_url",
					"type": "flags.4?string"
				},
				{
					"name": "content_url",
					"type": "flags.5?string"
				},
				{
					"name": "content_type",
					"type": "flags.5?string"
				},
				{
					"name": "w",
					"type": "flags.6?int"
				},
				{
					"name": "h",
					"type": "flags.6?int"
				},
				{
					"name": "duration",
					"type": "flags.7?int"
				},
				{
					"name": "send_message",
					"type": "BotInlineMessage"
				}
			],
			"type": "BotInlineResult"
		},
		{
			"id": "627509670",
			"predicate": "messages.botResults",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "gallery",
					"type": "flags.0?true"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "next_offset",
					"type": "flags.1?string"
				},
				{
					"name": "switch_pm",
					"type": "flags.2?InlineBotSwitchPM"
				},
				{
					"name": "results",
					"type": "Vector<BotInlineResult>"
				}
			],
			"type": "messages.BotResults"
		},
		{
			"id": "1417832080",
			"predicate": "updateBotInlineQuery",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "query",
					"type": "string"
				},
				{
					"name": "geo",
					"type": "flags.0?GeoPoint"
				},
				{
					"name": "offset",
					"type": "string"
				}
			],
			"type": "Update"
		},
		{
			"id": "239663460",
			"predicate": "updateBotInlineSend",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "query",
					"type": "string"
				},
				{
					"name": "geo",
					"type": "flags.0?GeoPoint"
				},
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "msg_id",
					"type": "flags.1?InputBotInlineMessageID"
				}
			],
			"type": "Update"
		},
		{
			"id": "1358283666",
			"predicate": "inputMessagesFilterVoice",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "928101534",
			"predicate": "inputMessagesFilterMusic",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "-1107622874",
			"predicate": "inputPrivacyKeyChatInvite",
			"params": [],
			"type": "InputPrivacyKey"
		},
		{
			"id": "1343122938",
			"predicate": "privacyKeyChatInvite",
			"params": [],
			"type": "PrivacyKey"
		},
		{
			"id": "524838915",
			"predicate": "exportedMessageLink",
			"params": [
				{
					"name": "link",
					"type": "string"
				}
			],
			"type": "ExportedMessageLink"
		},
		{
			"id": "-947462709",
			"predicate": "messageFwdHeader",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "from_id",
					"type": "flags.0?int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "channel_id",
					"type": "flags.1?int"
				},
				{
					"name": "channel_post",
					"type": "flags.2?int"
				}
			],
			"type": "MessageFwdHeader"
		},
		{
			"id": "457133559",
			"predicate": "updateEditChannelMessage",
			"params": [
				{
					"name": "message",
					"type": "Message"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1738988427",
			"predicate": "updateChannelPinnedMessage",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1799538451",
			"predicate": "messageActionPinMessage",
			"params": [],
			"type": "MessageAction"
		},
		{
			"id": "1923290508",
			"predicate": "auth.codeTypeSms",
			"params": [],
			"type": "auth.CodeType"
		},
		{
			"id": "1948046307",
			"predicate": "auth.codeTypeCall",
			"params": [],
			"type": "auth.CodeType"
		},
		{
			"id": "577556219",
			"predicate": "auth.codeTypeFlashCall",
			"params": [],
			"type": "auth.CodeType"
		},
		{
			"id": "1035688326",
			"predicate": "auth.sentCodeTypeApp",
			"params": [
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "auth.SentCodeType"
		},
		{
			"id": "-1073693790",
			"predicate": "auth.sentCodeTypeSms",
			"params": [
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "auth.SentCodeType"
		},
		{
			"id": "1398007207",
			"predicate": "auth.sentCodeTypeCall",
			"params": [
				{
					"name": "length",
					"type": "int"
				}
			],
			"type": "auth.SentCodeType"
		},
		{
			"id": "-1425815847",
			"predicate": "auth.sentCodeTypeFlashCall",
			"params": [
				{
					"name": "pattern",
					"type": "string"
				}
			],
			"type": "auth.SentCodeType"
		},
		{
			"id": "629866245",
			"predicate": "keyboardButtonUrl",
			"params": [
				{
					"name": "text",
					"type": "string"
				},
				{
					"name": "url",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "1748655686",
			"predicate": "keyboardButtonCallback",
			"params": [
				{
					"name": "text",
					"type": "string"
				},
				{
					"name": "data",
					"type": "bytes"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "-1318425559",
			"predicate": "keyboardButtonRequestPhone",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "-59151553",
			"predicate": "keyboardButtonRequestGeoLocation",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "90744648",
			"predicate": "keyboardButtonSwitchInline",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "same_peer",
					"type": "flags.0?true"
				},
				{
					"name": "text",
					"type": "string"
				},
				{
					"name": "query",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "1218642516",
			"predicate": "replyInlineMarkup",
			"params": [
				{
					"name": "rows",
					"type": "Vector<KeyboardButtonRow>"
				}
			],
			"type": "ReplyMarkup"
		},
		{
			"id": "-1324486149",
			"predicate": "messages.botCallbackAnswer",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "alert",
					"type": "flags.1?true"
				},
				{
					"name": "has_url",
					"type": "flags.3?true"
				},
				{
					"name": "message",
					"type": "flags.0?string"
				},
				{
					"name": "url",
					"type": "flags.2?string"
				}
			],
			"type": "messages.BotCallbackAnswer"
		},
		{
			"id": "-415938591",
			"predicate": "updateBotCallbackQuery",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "msg_id",
					"type": "int"
				},
				{
					"name": "chat_instance",
					"type": "long"
				},
				{
					"name": "data",
					"type": "flags.0?bytes"
				},
				{
					"name": "game_short_name",
					"type": "flags.1?string"
				}
			],
			"type": "Update"
		},
		{
			"id": "649453030",
			"predicate": "messages.messageEditData",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "caption",
					"type": "flags.0?true"
				}
			],
			"type": "messages.MessageEditData"
		},
		{
			"id": "-469536605",
			"predicate": "updateEditMessage",
			"params": [
				{
					"name": "message",
					"type": "Message"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "pts_count",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-190472735",
			"predicate": "inputBotInlineMessageMediaGeo",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "geo_point",
					"type": "InputGeoPoint"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "-1431327288",
			"predicate": "inputBotInlineMessageMediaVenue",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "geo_point",
					"type": "InputGeoPoint"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "address",
					"type": "string"
				},
				{
					"name": "provider",
					"type": "string"
				},
				{
					"name": "venue_id",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "766443943",
			"predicate": "inputBotInlineMessageMediaContact",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "982505656",
			"predicate": "botInlineMessageMediaGeo",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "geo",
					"type": "GeoPoint"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "BotInlineMessage"
		},
		{
			"id": "1130767150",
			"predicate": "botInlineMessageMediaVenue",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "geo",
					"type": "GeoPoint"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "address",
					"type": "string"
				},
				{
					"name": "provider",
					"type": "string"
				},
				{
					"name": "venue_id",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "BotInlineMessage"
		},
		{
			"id": "904770772",
			"predicate": "botInlineMessageMediaContact",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "BotInlineMessage"
		},
		{
			"id": "-1462213465",
			"predicate": "inputBotInlineResultPhoto",
			"params": [
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "InputPhoto"
				},
				{
					"name": "send_message",
					"type": "InputBotInlineMessage"
				}
			],
			"type": "InputBotInlineResult"
		},
		{
			"id": "-459324",
			"predicate": "inputBotInlineResultDocument",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "title",
					"type": "flags.1?string"
				},
				{
					"name": "description",
					"type": "flags.2?string"
				},
				{
					"name": "document",
					"type": "InputDocument"
				},
				{
					"name": "send_message",
					"type": "InputBotInlineMessage"
				}
			],
			"type": "InputBotInlineResult"
		},
		{
			"id": "400266251",
			"predicate": "botInlineMediaResult",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "type",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "flags.0?Photo"
				},
				{
					"name": "document",
					"type": "flags.1?Document"
				},
				{
					"name": "title",
					"type": "flags.2?string"
				},
				{
					"name": "description",
					"type": "flags.3?string"
				},
				{
					"name": "send_message",
					"type": "BotInlineMessage"
				}
			],
			"type": "BotInlineResult"
		},
		{
			"id": "-1995686519",
			"predicate": "inputBotInlineMessageID",
			"params": [
				{
					"name": "dc_id",
					"type": "int"
				},
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputBotInlineMessageID"
		},
		{
			"id": "-103646630",
			"predicate": "updateInlineBotCallbackQuery",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "msg_id",
					"type": "InputBotInlineMessageID"
				},
				{
					"name": "chat_instance",
					"type": "long"
				},
				{
					"name": "data",
					"type": "flags.0?bytes"
				},
				{
					"name": "game_short_name",
					"type": "flags.1?string"
				}
			],
			"type": "Update"
		},
		{
			"id": "1008755359",
			"predicate": "inlineBotSwitchPM",
			"params": [
				{
					"name": "text",
					"type": "string"
				},
				{
					"name": "start_param",
					"type": "string"
				}
			],
			"type": "InlineBotSwitchPM"
		},
		{
			"id": "863093588",
			"predicate": "messages.peerDialogs",
			"params": [
				{
					"name": "dialogs",
					"type": "Vector<Dialog>"
				},
				{
					"name": "messages",
					"type": "Vector<Message>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				},
				{
					"name": "state",
					"type": "updates.State"
				}
			],
			"type": "messages.PeerDialogs"
		},
		{
			"id": "-305282981",
			"predicate": "topPeer",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "rating",
					"type": "double"
				}
			],
			"type": "TopPeer"
		},
		{
			"id": "-1419371685",
			"predicate": "topPeerCategoryBotsPM",
			"params": [],
			"type": "TopPeerCategory"
		},
		{
			"id": "344356834",
			"predicate": "topPeerCategoryBotsInline",
			"params": [],
			"type": "TopPeerCategory"
		},
		{
			"id": "104314861",
			"predicate": "topPeerCategoryCorrespondents",
			"params": [],
			"type": "TopPeerCategory"
		},
		{
			"id": "-1122524854",
			"predicate": "topPeerCategoryGroups",
			"params": [],
			"type": "TopPeerCategory"
		},
		{
			"id": "371037736",
			"predicate": "topPeerCategoryChannels",
			"params": [],
			"type": "TopPeerCategory"
		},
		{
			"id": "-75283823",
			"predicate": "topPeerCategoryPeers",
			"params": [
				{
					"name": "category",
					"type": "TopPeerCategory"
				},
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "peers",
					"type": "Vector<TopPeer>"
				}
			],
			"type": "TopPeerCategoryPeers"
		},
		{
			"id": "-567906571",
			"predicate": "contacts.topPeersNotModified",
			"params": [],
			"type": "contacts.TopPeers"
		},
		{
			"id": "1891070632",
			"predicate": "contacts.topPeers",
			"params": [
				{
					"name": "categories",
					"type": "Vector<TopPeerCategoryPeers>"
				},
				{
					"name": "chats",
					"type": "Vector<Chat>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "contacts.TopPeers"
		},
		{
			"id": "892193368",
			"predicate": "messageEntityMentionName",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "546203849",
			"predicate": "inputMessageEntityMentionName",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "length",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "MessageEntity"
		},
		{
			"id": "975236280",
			"predicate": "inputMessagesFilterChatPhotos",
			"params": [],
			"type": "MessagesFilter"
		},
		{
			"id": "634833351",
			"predicate": "updateReadChannelOutbox",
			"params": [
				{
					"name": "channel_id",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "Update"
		},
		{
			"id": "-299124375",
			"predicate": "updateDraftMessage",
			"params": [
				{
					"name": "peer",
					"type": "Peer"
				},
				{
					"name": "draft",
					"type": "DraftMessage"
				}
			],
			"type": "Update"
		},
		{
			"id": "-1169445179",
			"predicate": "draftMessageEmpty",
			"params": [],
			"type": "DraftMessage"
		},
		{
			"id": "-40996577",
			"predicate": "draftMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.1?true"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.0?int"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "entities",
					"type": "flags.3?Vector<MessageEntity>"
				},
				{
					"name": "date",
					"type": "int"
				}
			],
			"type": "DraftMessage"
		},
		{
			"id": "-1615153660",
			"predicate": "messageActionHistoryClear",
			"params": [],
			"type": "MessageAction"
		},
		{
			"id": "82699215",
			"predicate": "messages.featuredStickersNotModified",
			"params": [],
			"type": "messages.FeaturedStickers"
		},
		{
			"id": "-123893531",
			"predicate": "messages.featuredStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				},
				{
					"name": "sets",
					"type": "Vector<StickerSetCovered>"
				},
				{
					"name": "unread",
					"type": "Vector<long>"
				}
			],
			"type": "messages.FeaturedStickers"
		},
		{
			"id": "1461528386",
			"predicate": "updateReadFeaturedStickers",
			"params": [],
			"type": "Update"
		},
		{
			"id": "186120336",
			"predicate": "messages.recentStickersNotModified",
			"params": [],
			"type": "messages.RecentStickers"
		},
		{
			"id": "1558317424",
			"predicate": "messages.recentStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				},
				{
					"name": "stickers",
					"type": "Vector<Document>"
				}
			],
			"type": "messages.RecentStickers"
		},
		{
			"id": "-1706939360",
			"predicate": "updateRecentStickers",
			"params": [],
			"type": "Update"
		},
		{
			"id": "1338747336",
			"predicate": "messages.archivedStickers",
			"params": [
				{
					"name": "count",
					"type": "int"
				},
				{
					"name": "sets",
					"type": "Vector<StickerSetCovered>"
				}
			],
			"type": "messages.ArchivedStickers"
		},
		{
			"id": "946083368",
			"predicate": "messages.stickerSetInstallResultSuccess",
			"params": [],
			"type": "messages.StickerSetInstallResult"
		},
		{
			"id": "904138920",
			"predicate": "messages.stickerSetInstallResultArchive",
			"params": [
				{
					"name": "sets",
					"type": "Vector<StickerSetCovered>"
				}
			],
			"type": "messages.StickerSetInstallResult"
		},
		{
			"id": "1678812626",
			"predicate": "stickerSetCovered",
			"params": [
				{
					"name": "set",
					"type": "StickerSet"
				},
				{
					"name": "cover",
					"type": "Document"
				}
			],
			"type": "StickerSetCovered"
		},
		{
			"id": "-1574314746",
			"predicate": "updateConfig",
			"params": [],
			"type": "Update"
		},
		{
			"id": "861169551",
			"predicate": "updatePtsChanged",
			"params": [],
			"type": "Update"
		},
		{
			"id": "-1252045032",
			"predicate": "inputMediaPhotoExternal",
			"params": [
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "-437690244",
			"predicate": "inputMediaDocumentExternal",
			"params": [
				{
					"name": "url",
					"type": "string"
				},
				{
					"name": "caption",
					"type": "string"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "872932635",
			"predicate": "stickerSetMultiCovered",
			"params": [
				{
					"name": "set",
					"type": "StickerSet"
				},
				{
					"name": "covers",
					"type": "Vector<Document>"
				}
			],
			"type": "StickerSetCovered"
		},
		{
			"id": "-1361650766",
			"predicate": "maskCoords",
			"params": [
				{
					"name": "n",
					"type": "int"
				},
				{
					"name": "x",
					"type": "double"
				},
				{
					"name": "y",
					"type": "double"
				},
				{
					"name": "zoom",
					"type": "double"
				}
			],
			"type": "MaskCoords"
		},
		{
			"id": "-1744710921",
			"predicate": "documentAttributeHasStickers",
			"params": [],
			"type": "DocumentAttribute"
		},
		{
			"id": "1251549527",
			"predicate": "inputStickeredMediaPhoto",
			"params": [
				{
					"name": "id",
					"type": "InputPhoto"
				}
			],
			"type": "InputStickeredMedia"
		},
		{
			"id": "70813275",
			"predicate": "inputStickeredMediaDocument",
			"params": [
				{
					"name": "id",
					"type": "InputDocument"
				}
			],
			"type": "InputStickeredMedia"
		},
		{
			"id": "-1107729093",
			"predicate": "game",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				},
				{
					"name": "short_name",
					"type": "string"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "description",
					"type": "string"
				},
				{
					"name": "photo",
					"type": "Photo"
				},
				{
					"name": "document",
					"type": "flags.0?Document"
				}
			],
			"type": "Game"
		},
		{
			"id": "1336154098",
			"predicate": "inputBotInlineResultGame",
			"params": [
				{
					"name": "id",
					"type": "string"
				},
				{
					"name": "short_name",
					"type": "string"
				},
				{
					"name": "send_message",
					"type": "InputBotInlineMessage"
				}
			],
			"type": "InputBotInlineResult"
		},
		{
			"id": "1262639204",
			"predicate": "inputBotInlineMessageGame",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "InputBotInlineMessage"
		},
		{
			"id": "-580219064",
			"predicate": "sendMessageGamePlayAction",
			"params": [],
			"type": "SendMessageAction"
		},
		{
			"id": "-38694904",
			"predicate": "messageMediaGame",
			"params": [
				{
					"name": "game",
					"type": "Game"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "-750828557",
			"predicate": "inputMediaGame",
			"params": [
				{
					"name": "id",
					"type": "InputGame"
				}
			],
			"type": "InputMedia"
		},
		{
			"id": "53231223",
			"predicate": "inputGameID",
			"params": [
				{
					"name": "id",
					"type": "long"
				},
				{
					"name": "access_hash",
					"type": "long"
				}
			],
			"type": "InputGame"
		},
		{
			"id": "-1020139510",
			"predicate": "inputGameShortName",
			"params": [
				{
					"name": "bot_id",
					"type": "InputUser"
				},
				{
					"name": "short_name",
					"type": "string"
				}
			],
			"type": "InputGame"
		},
		{
			"id": "1358175439",
			"predicate": "keyboardButtonGame",
			"params": [
				{
					"name": "text",
					"type": "string"
				}
			],
			"type": "KeyboardButton"
		},
		{
			"id": "-1834538890",
			"predicate": "messageActionGameScore",
			"params": [
				{
					"name": "game_id",
					"type": "long"
				},
				{
					"name": "score",
					"type": "int"
				}
			],
			"type": "MessageAction"
		},
		{
			"id": "1493171408",
			"predicate": "highScore",
			"params": [
				{
					"name": "pos",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "int"
				},
				{
					"name": "score",
					"type": "int"
				}
			],
			"type": "HighScore"
		},
		{
			"id": "-1707344487",
			"predicate": "messages.highScores",
			"params": [
				{
					"name": "scores",
					"type": "Vector<HighScore>"
				},
				{
					"name": "users",
					"type": "Vector<User>"
				}
			],
			"type": "messages.HighScores"
		}
	],
	"methods": [
		{
			"id": "-878758099",
			"method": "invokeAfterMsg",
			"params": [
				{
					"name": "msg_id",
					"type": "long"
				},
				{
					"name": "query",
					"type": "!X"
				}
			],
			"type": "X"
		},
		{
			"id": "1036301552",
			"method": "invokeAfterMsgs",
			"params": [
				{
					"name": "msg_ids",
					"type": "Vector<long>"
				},
				{
					"name": "query",
					"type": "!X"
				}
			],
			"type": "X"
		},
		{
			"id": "1877286395",
			"method": "auth.checkPhone",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				}
			],
			"type": "auth.CheckedPhone"
		},
		{
			"id": "-2035355412",
			"method": "auth.sendCode",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "allow_flashcall",
					"type": "flags.0?true"
				},
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "current_number",
					"type": "flags.0?Bool"
				},
				{
					"name": "api_id",
					"type": "int"
				},
				{
					"name": "api_hash",
					"type": "string"
				}
			],
			"type": "auth.SentCode"
		},
		{
			"id": "453408308",
			"method": "auth.signUp",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				},
				{
					"name": "phone_code",
					"type": "string"
				},
				{
					"name": "first_name",
					"type": "string"
				},
				{
					"name": "last_name",
					"type": "string"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "-1126886015",
			"method": "auth.signIn",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				},
				{
					"name": "phone_code",
					"type": "string"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "1461180992",
			"method": "auth.logOut",
			"params": [],
			"type": "Bool"
		},
		{
			"id": "-1616179942",
			"method": "auth.resetAuthorizations",
			"params": [],
			"type": "Bool"
		},
		{
			"id": "1998331287",
			"method": "auth.sendInvites",
			"params": [
				{
					"name": "phone_numbers",
					"type": "Vector<string>"
				},
				{
					"name": "message",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-440401971",
			"method": "auth.exportAuthorization",
			"params": [
				{
					"name": "dc_id",
					"type": "int"
				}
			],
			"type": "auth.ExportedAuthorization"
		},
		{
			"id": "-470837741",
			"method": "auth.importAuthorization",
			"params": [
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "-841733627",
			"method": "auth.bindTempAuthKey",
			"params": [
				{
					"name": "perm_auth_key_id",
					"type": "long"
				},
				{
					"name": "nonce",
					"type": "long"
				},
				{
					"name": "expires_at",
					"type": "int"
				},
				{
					"name": "encrypted_message",
					"type": "bytes"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1669245048",
			"method": "account.registerDevice",
			"params": [
				{
					"name": "token_type",
					"type": "int"
				},
				{
					"name": "token",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1707432768",
			"method": "account.unregisterDevice",
			"params": [
				{
					"name": "token_type",
					"type": "int"
				},
				{
					"name": "token",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-2067899501",
			"method": "account.updateNotifySettings",
			"params": [
				{
					"name": "peer",
					"type": "InputNotifyPeer"
				},
				{
					"name": "settings",
					"type": "InputPeerNotifySettings"
				}
			],
			"type": "Bool"
		},
		{
			"id": "313765169",
			"method": "account.getNotifySettings",
			"params": [
				{
					"name": "peer",
					"type": "InputNotifyPeer"
				}
			],
			"type": "PeerNotifySettings"
		},
		{
			"id": "-612493497",
			"method": "account.resetNotifySettings",
			"params": [],
			"type": "Bool"
		},
		{
			"id": "2018596725",
			"method": "account.updateProfile",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "first_name",
					"type": "flags.0?string"
				},
				{
					"name": "last_name",
					"type": "flags.1?string"
				},
				{
					"name": "about",
					"type": "flags.2?string"
				}
			],
			"type": "User"
		},
		{
			"id": "1713919532",
			"method": "account.updateStatus",
			"params": [
				{
					"name": "offline",
					"type": "Bool"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1068696894",
			"method": "account.getWallPapers",
			"params": [],
			"type": "Vector<WallPaper>"
		},
		{
			"id": "-1374118561",
			"method": "account.reportPeer",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "reason",
					"type": "ReportReason"
				}
			],
			"type": "Bool"
		},
		{
			"id": "227648840",
			"method": "users.getUsers",
			"params": [
				{
					"name": "id",
					"type": "Vector<InputUser>"
				}
			],
			"type": "Vector<User>"
		},
		{
			"id": "-902781519",
			"method": "users.getFullUser",
			"params": [
				{
					"name": "id",
					"type": "InputUser"
				}
			],
			"type": "UserFull"
		},
		{
			"id": "-995929106",
			"method": "contacts.getStatuses",
			"params": [],
			"type": "Vector<ContactStatus>"
		},
		{
			"id": "583445000",
			"method": "contacts.getContacts",
			"params": [
				{
					"name": "hash",
					"type": "string"
				}
			],
			"type": "contacts.Contacts"
		},
		{
			"id": "-634342611",
			"method": "contacts.importContacts",
			"params": [
				{
					"name": "contacts",
					"type": "Vector<InputContact>"
				},
				{
					"name": "replace",
					"type": "Bool"
				}
			],
			"type": "contacts.ImportedContacts"
		},
		{
			"id": "-1902823612",
			"method": "contacts.deleteContact",
			"params": [
				{
					"name": "id",
					"type": "InputUser"
				}
			],
			"type": "contacts.Link"
		},
		{
			"id": "1504393374",
			"method": "contacts.deleteContacts",
			"params": [
				{
					"name": "id",
					"type": "Vector<InputUser>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "858475004",
			"method": "contacts.block",
			"params": [
				{
					"name": "id",
					"type": "InputUser"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-448724803",
			"method": "contacts.unblock",
			"params": [
				{
					"name": "id",
					"type": "InputUser"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-176409329",
			"method": "contacts.getBlocked",
			"params": [
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "contacts.Blocked"
		},
		{
			"id": "-2065352905",
			"method": "contacts.exportCard",
			"params": [],
			"type": "Vector<int>"
		},
		{
			"id": "1340184318",
			"method": "contacts.importCard",
			"params": [
				{
					"name": "export_card",
					"type": "Vector<int>"
				}
			],
			"type": "User"
		},
		{
			"id": "1109588596",
			"method": "messages.getMessages",
			"params": [
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "1799878989",
			"method": "messages.getDialogs",
			"params": [
				{
					"name": "offset_date",
					"type": "int"
				},
				{
					"name": "offset_id",
					"type": "int"
				},
				{
					"name": "offset_peer",
					"type": "InputPeer"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "messages.Dialogs"
		},
		{
			"id": "-1347868602",
			"method": "messages.getHistory",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "offset_id",
					"type": "int"
				},
				{
					"name": "offset_date",
					"type": "int"
				},
				{
					"name": "add_offset",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "int"
				},
				{
					"name": "min_id",
					"type": "int"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "-732523960",
			"method": "messages.search",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "q",
					"type": "string"
				},
				{
					"name": "filter",
					"type": "MessagesFilter"
				},
				{
					"name": "min_date",
					"type": "int"
				},
				{
					"name": "max_date",
					"type": "int"
				},
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "238054714",
			"method": "messages.readHistory",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "messages.AffectedMessages"
		},
		{
			"id": "469850889",
			"method": "messages.deleteHistory",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "just_clear",
					"type": "flags.0?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "messages.AffectedHistory"
		},
		{
			"id": "-1510897371",
			"method": "messages.deleteMessages",
			"params": [
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.AffectedMessages"
		},
		{
			"id": "94983360",
			"method": "messages.receivedMessages",
			"params": [
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "Vector<ReceivedNotifyMessage>"
		},
		{
			"id": "-1551737264",
			"method": "messages.setTyping",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "action",
					"type": "SendMessageAction"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-91733382",
			"method": "messages.sendMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.1?true"
				},
				{
					"name": "silent",
					"type": "flags.5?true"
				},
				{
					"name": "background",
					"type": "flags.6?true"
				},
				{
					"name": "clear_draft",
					"type": "flags.7?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.0?int"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				},
				{
					"name": "entities",
					"type": "flags.3?Vector<MessageEntity>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-923703407",
			"method": "messages.sendMedia",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "silent",
					"type": "flags.5?true"
				},
				{
					"name": "background",
					"type": "flags.6?true"
				},
				{
					"name": "clear_draft",
					"type": "flags.7?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.0?int"
				},
				{
					"name": "media",
					"type": "InputMedia"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1888354709",
			"method": "messages.forwardMessages",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "silent",
					"type": "flags.5?true"
				},
				{
					"name": "background",
					"type": "flags.6?true"
				},
				{
					"name": "with_my_score",
					"type": "flags.8?true"
				},
				{
					"name": "from_peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "Vector<int>"
				},
				{
					"name": "random_id",
					"type": "Vector<long>"
				},
				{
					"name": "to_peer",
					"type": "InputPeer"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-820669733",
			"method": "messages.reportSpam",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1460572005",
			"method": "messages.hideReportSpam",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				}
			],
			"type": "Bool"
		},
		{
			"id": "913498268",
			"method": "messages.getPeerSettings",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				}
			],
			"type": "PeerSettings"
		},
		{
			"id": "1013621127",
			"method": "messages.getChats",
			"params": [
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.Chats"
		},
		{
			"id": "998448230",
			"method": "messages.getFullChat",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "messages.ChatFull"
		},
		{
			"id": "-599447467",
			"method": "messages.editChatTitle",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-900957736",
			"method": "messages.editChatPhoto",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "photo",
					"type": "InputChatPhoto"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-106911223",
			"method": "messages.addChatUser",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "fwd_limit",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-530505962",
			"method": "messages.deleteChatUser",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "Updates"
		},
		{
			"id": "164303470",
			"method": "messages.createChat",
			"params": [
				{
					"name": "users",
					"type": "Vector<InputUser>"
				},
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-304838614",
			"method": "updates.getState",
			"params": [],
			"type": "updates.State"
		},
		{
			"id": "168039573",
			"method": "updates.getDifference",
			"params": [
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "date",
					"type": "int"
				},
				{
					"name": "qts",
					"type": "int"
				}
			],
			"type": "updates.Difference"
		},
		{
			"id": "-256159406",
			"method": "photos.updateProfilePhoto",
			"params": [
				{
					"name": "id",
					"type": "InputPhoto"
				}
			],
			"type": "UserProfilePhoto"
		},
		{
			"id": "1328726168",
			"method": "photos.uploadProfilePhoto",
			"params": [
				{
					"name": "file",
					"type": "InputFile"
				}
			],
			"type": "photos.Photo"
		},
		{
			"id": "-2016444625",
			"method": "photos.deletePhotos",
			"params": [
				{
					"name": "id",
					"type": "Vector<InputPhoto>"
				}
			],
			"type": "Vector<long>"
		},
		{
			"id": "-1291540959",
			"method": "upload.saveFilePart",
			"params": [
				{
					"name": "file_id",
					"type": "long"
				},
				{
					"name": "file_part",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-475607115",
			"method": "upload.getFile",
			"params": [
				{
					"name": "location",
					"type": "InputFileLocation"
				},
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "upload.File"
		},
		{
			"id": "-990308245",
			"method": "help.getConfig",
			"params": [],
			"type": "Config"
		},
		{
			"id": "531836966",
			"method": "help.getNearestDc",
			"params": [],
			"type": "NearestDc"
		},
		{
			"id": "-1372724842",
			"method": "help.getAppUpdate",
			"params": [],
			"type": "help.AppUpdate"
		},
		{
			"id": "1862465352",
			"method": "help.saveAppLog",
			"params": [
				{
					"name": "events",
					"type": "Vector<InputAppEvent>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1295590211",
			"method": "help.getInviteText",
			"params": [],
			"type": "help.InviteText"
		},
		{
			"id": "-1848823128",
			"method": "photos.getUserPhotos",
			"params": [
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "max_id",
					"type": "long"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "photos.Photos"
		},
		{
			"id": "865483769",
			"method": "messages.forwardMessage",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "random_id",
					"type": "long"
				}
			],
			"type": "Updates"
		},
		{
			"id": "651135312",
			"method": "messages.getDhConfig",
			"params": [
				{
					"name": "version",
					"type": "int"
				},
				{
					"name": "random_length",
					"type": "int"
				}
			],
			"type": "messages.DhConfig"
		},
		{
			"id": "-162681021",
			"method": "messages.requestEncryption",
			"params": [
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "random_id",
					"type": "int"
				},
				{
					"name": "g_a",
					"type": "bytes"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "1035731989",
			"method": "messages.acceptEncryption",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "g_b",
					"type": "bytes"
				},
				{
					"name": "key_fingerprint",
					"type": "long"
				}
			],
			"type": "EncryptedChat"
		},
		{
			"id": "-304536635",
			"method": "messages.discardEncryption",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "Bool"
		},
		{
			"id": "2031374829",
			"method": "messages.setEncryptedTyping",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "typing",
					"type": "Bool"
				}
			],
			"type": "Bool"
		},
		{
			"id": "2135648522",
			"method": "messages.readEncryptedHistory",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "max_date",
					"type": "int"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1451792525",
			"method": "messages.sendEncrypted",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "data",
					"type": "bytes"
				}
			],
			"type": "messages.SentEncryptedMessage"
		},
		{
			"id": "-1701831834",
			"method": "messages.sendEncryptedFile",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "data",
					"type": "bytes"
				},
				{
					"name": "file",
					"type": "InputEncryptedFile"
				}
			],
			"type": "messages.SentEncryptedMessage"
		},
		{
			"id": "852769188",
			"method": "messages.sendEncryptedService",
			"params": [
				{
					"name": "peer",
					"type": "InputEncryptedChat"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "data",
					"type": "bytes"
				}
			],
			"type": "messages.SentEncryptedMessage"
		},
		{
			"id": "1436924774",
			"method": "messages.receivedQueue",
			"params": [
				{
					"name": "max_qts",
					"type": "int"
				}
			],
			"type": "Vector<long>"
		},
		{
			"id": "-562337987",
			"method": "upload.saveBigFilePart",
			"params": [
				{
					"name": "file_id",
					"type": "long"
				},
				{
					"name": "file_part",
					"type": "int"
				},
				{
					"name": "file_total_parts",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "bytes"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1769565673",
			"method": "initConnection",
			"params": [
				{
					"name": "api_id",
					"type": "int"
				},
				{
					"name": "device_model",
					"type": "string"
				},
				{
					"name": "system_version",
					"type": "string"
				},
				{
					"name": "app_version",
					"type": "string"
				},
				{
					"name": "lang_code",
					"type": "string"
				},
				{
					"name": "query",
					"type": "!X"
				}
			],
			"type": "X"
		},
		{
			"id": "-1663104819",
			"method": "help.getSupport",
			"params": [],
			"type": "help.Support"
		},
		{
			"id": "916930423",
			"method": "messages.readMessageContents",
			"params": [
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.AffectedMessages"
		},
		{
			"id": "655677548",
			"method": "account.checkUsername",
			"params": [
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1040964988",
			"method": "account.updateUsername",
			"params": [
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "User"
		},
		{
			"id": "301470424",
			"method": "contacts.search",
			"params": [
				{
					"name": "q",
					"type": "string"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "contacts.Found"
		},
		{
			"id": "-623130288",
			"method": "account.getPrivacy",
			"params": [
				{
					"name": "key",
					"type": "InputPrivacyKey"
				}
			],
			"type": "account.PrivacyRules"
		},
		{
			"id": "-906486552",
			"method": "account.setPrivacy",
			"params": [
				{
					"name": "key",
					"type": "InputPrivacyKey"
				},
				{
					"name": "rules",
					"type": "Vector<InputPrivacyRule>"
				}
			],
			"type": "account.PrivacyRules"
		},
		{
			"id": "1099779595",
			"method": "account.deleteAccount",
			"params": [
				{
					"name": "reason",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "150761757",
			"method": "account.getAccountTTL",
			"params": [],
			"type": "AccountDaysTTL"
		},
		{
			"id": "608323678",
			"method": "account.setAccountTTL",
			"params": [
				{
					"name": "ttl",
					"type": "AccountDaysTTL"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-627372787",
			"method": "invokeWithLayer",
			"params": [
				{
					"name": "layer",
					"type": "int"
				},
				{
					"name": "query",
					"type": "!X"
				}
			],
			"type": "X"
		},
		{
			"id": "-113456221",
			"method": "contacts.resolveUsername",
			"params": [
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "contacts.ResolvedPeer"
		},
		{
			"id": "149257707",
			"method": "account.sendChangePhoneCode",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "allow_flashcall",
					"type": "flags.0?true"
				},
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "current_number",
					"type": "flags.0?Bool"
				}
			],
			"type": "auth.SentCode"
		},
		{
			"id": "1891839707",
			"method": "account.changePhone",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				},
				{
					"name": "phone_code",
					"type": "string"
				}
			],
			"type": "User"
		},
		{
			"id": "479598769",
			"method": "messages.getAllStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "messages.AllStickers"
		},
		{
			"id": "954152242",
			"method": "account.updateDeviceLocked",
			"params": [
				{
					"name": "period",
					"type": "int"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1738800940",
			"method": "auth.importBotAuthorization",
			"params": [
				{
					"name": "flags",
					"type": "int"
				},
				{
					"name": "api_id",
					"type": "int"
				},
				{
					"name": "api_hash",
					"type": "string"
				},
				{
					"name": "bot_auth_token",
					"type": "string"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "623001124",
			"method": "messages.getWebPagePreview",
			"params": [
				{
					"name": "message",
					"type": "string"
				}
			],
			"type": "MessageMedia"
		},
		{
			"id": "-484392616",
			"method": "account.getAuthorizations",
			"params": [],
			"type": "account.Authorizations"
		},
		{
			"id": "-545786948",
			"method": "account.resetAuthorization",
			"params": [
				{
					"name": "hash",
					"type": "long"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1418342645",
			"method": "account.getPassword",
			"params": [],
			"type": "account.Password"
		},
		{
			"id": "-1131605573",
			"method": "account.getPasswordSettings",
			"params": [
				{
					"name": "current_password_hash",
					"type": "bytes"
				}
			],
			"type": "account.PasswordSettings"
		},
		{
			"id": "-92517498",
			"method": "account.updatePasswordSettings",
			"params": [
				{
					"name": "current_password_hash",
					"type": "bytes"
				},
				{
					"name": "new_settings",
					"type": "account.PasswordInputSettings"
				}
			],
			"type": "Bool"
		},
		{
			"id": "174260510",
			"method": "auth.checkPassword",
			"params": [
				{
					"name": "password_hash",
					"type": "bytes"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "-661144474",
			"method": "auth.requestPasswordRecovery",
			"params": [],
			"type": "auth.PasswordRecovery"
		},
		{
			"id": "1319464594",
			"method": "auth.recoverPassword",
			"params": [
				{
					"name": "code",
					"type": "string"
				}
			],
			"type": "auth.Authorization"
		},
		{
			"id": "-1080796745",
			"method": "invokeWithoutUpdates",
			"params": [
				{
					"name": "query",
					"type": "!X"
				}
			],
			"type": "X"
		},
		{
			"id": "2106086025",
			"method": "messages.exportChatInvite",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "ExportedChatInvite"
		},
		{
			"id": "1051570619",
			"method": "messages.checkChatInvite",
			"params": [
				{
					"name": "hash",
					"type": "string"
				}
			],
			"type": "ChatInvite"
		},
		{
			"id": "1817183516",
			"method": "messages.importChatInvite",
			"params": [
				{
					"name": "hash",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "639215886",
			"method": "messages.getStickerSet",
			"params": [
				{
					"name": "stickerset",
					"type": "InputStickerSet"
				}
			],
			"type": "messages.StickerSet"
		},
		{
			"id": "-946871200",
			"method": "messages.installStickerSet",
			"params": [
				{
					"name": "stickerset",
					"type": "InputStickerSet"
				},
				{
					"name": "archived",
					"type": "Bool"
				}
			],
			"type": "messages.StickerSetInstallResult"
		},
		{
			"id": "-110209570",
			"method": "messages.uninstallStickerSet",
			"params": [
				{
					"name": "stickerset",
					"type": "InputStickerSet"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-421563528",
			"method": "messages.startBot",
			"params": [
				{
					"name": "bot",
					"type": "InputUser"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "start_param",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1189013126",
			"method": "help.getAppChangelog",
			"params": [],
			"type": "help.AppChangelog"
		},
		{
			"id": "-993483427",
			"method": "messages.getMessagesViews",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "Vector<int>"
				},
				{
					"name": "increment",
					"type": "Bool"
				}
			],
			"type": "Vector<int>"
		},
		{
			"id": "-871347913",
			"method": "channels.readHistory",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "max_id",
					"type": "int"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-2067661490",
			"method": "channels.deleteMessages",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.AffectedMessages"
		},
		{
			"id": "-787622117",
			"method": "channels.deleteUserHistory",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "messages.AffectedHistory"
		},
		{
			"id": "-32999408",
			"method": "channels.reportSpam",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1814580409",
			"method": "channels.getMessages",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "id",
					"type": "Vector<int>"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "618237842",
			"method": "channels.getParticipants",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "filter",
					"type": "ChannelParticipantsFilter"
				},
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "channels.ChannelParticipants"
		},
		{
			"id": "1416484774",
			"method": "channels.getParticipant",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "channels.ChannelParticipant"
		},
		{
			"id": "176122811",
			"method": "channels.getChannels",
			"params": [
				{
					"name": "id",
					"type": "Vector<InputChannel>"
				}
			],
			"type": "messages.Chats"
		},
		{
			"id": "141781513",
			"method": "channels.getFullChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				}
			],
			"type": "messages.ChatFull"
		},
		{
			"id": "-192332417",
			"method": "channels.createChannel",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "broadcast",
					"type": "flags.0?true"
				},
				{
					"name": "megagroup",
					"type": "flags.1?true"
				},
				{
					"name": "title",
					"type": "string"
				},
				{
					"name": "about",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "333610782",
			"method": "channels.editAbout",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "about",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-344583728",
			"method": "channels.editAdmin",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "role",
					"type": "ChannelParticipantRole"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1450044624",
			"method": "channels.editTitle",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "title",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-248621111",
			"method": "channels.editPhoto",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "photo",
					"type": "InputChatPhoto"
				}
			],
			"type": "Updates"
		},
		{
			"id": "283557164",
			"method": "channels.checkUsername",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "890549214",
			"method": "channels.updateUsername",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "username",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "615851205",
			"method": "channels.joinChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-130635115",
			"method": "channels.leaveChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				}
			],
			"type": "Updates"
		},
		{
			"id": "429865580",
			"method": "channels.inviteToChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "users",
					"type": "Vector<InputUser>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1502421484",
			"method": "channels.kickFromChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "kicked",
					"type": "Bool"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-950663035",
			"method": "channels.exportInvite",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				}
			],
			"type": "ExportedChatInvite"
		},
		{
			"id": "-1072619549",
			"method": "channels.deleteChannel",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1154295872",
			"method": "updates.getChannelDifference",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "filter",
					"type": "ChannelMessagesFilter"
				},
				{
					"name": "pts",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "updates.ChannelDifference"
		},
		{
			"id": "-326379039",
			"method": "messages.toggleChatAdmins",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "enabled",
					"type": "Bool"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1444503762",
			"method": "messages.editChatAdmin",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "is_admin",
					"type": "Bool"
				}
			],
			"type": "Bool"
		},
		{
			"id": "363051235",
			"method": "messages.migrateChat",
			"params": [
				{
					"name": "chat_id",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1640190800",
			"method": "messages.searchGlobal",
			"params": [
				{
					"name": "q",
					"type": "string"
				},
				{
					"name": "offset_date",
					"type": "int"
				},
				{
					"name": "offset_peer",
					"type": "InputPeer"
				},
				{
					"name": "offset_id",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "messages.Messages"
		},
		{
			"id": "889286899",
			"method": "help.getTermsOfService",
			"params": [],
			"type": "help.TermsOfService"
		},
		{
			"id": "2016638777",
			"method": "messages.reorderStickerSets",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "masks",
					"type": "flags.0?true"
				},
				{
					"name": "order",
					"type": "Vector<long>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "864953444",
			"method": "messages.getDocumentByHash",
			"params": [
				{
					"name": "sha256",
					"type": "bytes"
				},
				{
					"name": "size",
					"type": "int"
				},
				{
					"name": "mime_type",
					"type": "string"
				}
			],
			"type": "Document"
		},
		{
			"id": "-1080395925",
			"method": "messages.searchGifs",
			"params": [
				{
					"name": "q",
					"type": "string"
				},
				{
					"name": "offset",
					"type": "int"
				}
			],
			"type": "messages.FoundGifs"
		},
		{
			"id": "-2084618926",
			"method": "messages.getSavedGifs",
			"params": [
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "messages.SavedGifs"
		},
		{
			"id": "846868683",
			"method": "messages.saveGif",
			"params": [
				{
					"name": "id",
					"type": "InputDocument"
				},
				{
					"name": "unsave",
					"type": "Bool"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1364105629",
			"method": "messages.getInlineBotResults",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "bot",
					"type": "InputUser"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "geo_point",
					"type": "flags.0?InputGeoPoint"
				},
				{
					"name": "query",
					"type": "string"
				},
				{
					"name": "offset",
					"type": "string"
				}
			],
			"type": "messages.BotResults"
		},
		{
			"id": "-346119674",
			"method": "messages.setInlineBotResults",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "gallery",
					"type": "flags.0?true"
				},
				{
					"name": "private",
					"type": "flags.1?true"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "results",
					"type": "Vector<InputBotInlineResult>"
				},
				{
					"name": "cache_time",
					"type": "int"
				},
				{
					"name": "next_offset",
					"type": "flags.2?string"
				},
				{
					"name": "switch_pm",
					"type": "flags.3?InlineBotSwitchPM"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1318189314",
			"method": "messages.sendInlineBotResult",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "silent",
					"type": "flags.5?true"
				},
				{
					"name": "background",
					"type": "flags.6?true"
				},
				{
					"name": "clear_draft",
					"type": "flags.7?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.0?int"
				},
				{
					"name": "random_id",
					"type": "long"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "id",
					"type": "string"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1231065863",
			"method": "channels.toggleInvites",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "enabled",
					"type": "Bool"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-934882771",
			"method": "channels.exportMessageLink",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "ExportedMessageLink"
		},
		{
			"id": "527021574",
			"method": "channels.toggleSignatures",
			"params": [
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "enabled",
					"type": "Bool"
				}
			],
			"type": "Updates"
		},
		{
			"id": "-1490162350",
			"method": "channels.updatePinnedMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "silent",
					"type": "flags.0?true"
				},
				{
					"name": "channel",
					"type": "InputChannel"
				},
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "1056025023",
			"method": "auth.resendCode",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				}
			],
			"type": "auth.SentCode"
		},
		{
			"id": "520357240",
			"method": "auth.cancelCode",
			"params": [
				{
					"name": "phone_number",
					"type": "string"
				},
				{
					"name": "phone_code_hash",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-39416522",
			"method": "messages.getMessageEditData",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "int"
				}
			],
			"type": "messages.MessageEditData"
		},
		{
			"id": "-829299510",
			"method": "messages.editMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.1?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "message",
					"type": "flags.11?string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				},
				{
					"name": "entities",
					"type": "flags.3?Vector<MessageEntity>"
				}
			],
			"type": "Updates"
		},
		{
			"id": "319564933",
			"method": "messages.editInlineBotMessage",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.1?true"
				},
				{
					"name": "id",
					"type": "InputBotInlineMessageID"
				},
				{
					"name": "message",
					"type": "flags.11?string"
				},
				{
					"name": "reply_markup",
					"type": "flags.2?ReplyMarkup"
				},
				{
					"name": "entities",
					"type": "flags.3?Vector<MessageEntity>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-2130010132",
			"method": "messages.getBotCallbackAnswer",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "game",
					"type": "flags.1?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "msg_id",
					"type": "int"
				},
				{
					"name": "data",
					"type": "flags.0?bytes"
				}
			],
			"type": "messages.BotCallbackAnswer"
		},
		{
			"id": "-920136629",
			"method": "messages.setBotCallbackAnswer",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "alert",
					"type": "flags.1?true"
				},
				{
					"name": "query_id",
					"type": "long"
				},
				{
					"name": "message",
					"type": "flags.0?string"
				},
				{
					"name": "url",
					"type": "flags.2?string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-728224331",
			"method": "contacts.getTopPeers",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "correspondents",
					"type": "flags.0?true"
				},
				{
					"name": "bots_pm",
					"type": "flags.1?true"
				},
				{
					"name": "bots_inline",
					"type": "flags.2?true"
				},
				{
					"name": "groups",
					"type": "flags.10?true"
				},
				{
					"name": "channels",
					"type": "flags.15?true"
				},
				{
					"name": "offset",
					"type": "int"
				},
				{
					"name": "limit",
					"type": "int"
				},
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "contacts.TopPeers"
		},
		{
			"id": "451113900",
			"method": "contacts.resetTopPeerRating",
			"params": [
				{
					"name": "category",
					"type": "TopPeerCategory"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				}
			],
			"type": "Bool"
		},
		{
			"id": "764901049",
			"method": "messages.getPeerDialogs",
			"params": [
				{
					"name": "peers",
					"type": "Vector<InputPeer>"
				}
			],
			"type": "messages.PeerDialogs"
		},
		{
			"id": "-1137057461",
			"method": "messages.saveDraft",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "no_webpage",
					"type": "flags.1?true"
				},
				{
					"name": "reply_to_msg_id",
					"type": "flags.0?int"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "message",
					"type": "string"
				},
				{
					"name": "entities",
					"type": "flags.3?Vector<MessageEntity>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1782549861",
			"method": "messages.getAllDrafts",
			"params": [],
			"type": "Updates"
		},
		{
			"id": "766298703",
			"method": "messages.getFeaturedStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "messages.FeaturedStickers"
		},
		{
			"id": "1527873830",
			"method": "messages.readFeaturedStickers",
			"params": [
				{
					"name": "id",
					"type": "Vector<long>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1587647177",
			"method": "messages.getRecentStickers",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "attached",
					"type": "flags.0?true"
				},
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "messages.RecentStickers"
		},
		{
			"id": "958863608",
			"method": "messages.saveRecentSticker",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "attached",
					"type": "flags.0?true"
				},
				{
					"name": "id",
					"type": "InputDocument"
				},
				{
					"name": "unsave",
					"type": "Bool"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1986437075",
			"method": "messages.clearRecentStickers",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "attached",
					"type": "flags.0?true"
				}
			],
			"type": "Bool"
		},
		{
			"id": "1475442322",
			"method": "messages.getArchivedStickers",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "masks",
					"type": "flags.0?true"
				},
				{
					"name": "offset_id",
					"type": "long"
				},
				{
					"name": "limit",
					"type": "int"
				}
			],
			"type": "messages.ArchivedStickers"
		},
		{
			"id": "353818557",
			"method": "account.sendConfirmPhoneCode",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "allow_flashcall",
					"type": "flags.0?true"
				},
				{
					"name": "hash",
					"type": "string"
				},
				{
					"name": "current_number",
					"type": "flags.0?Bool"
				}
			],
			"type": "auth.SentCode"
		},
		{
			"id": "1596029123",
			"method": "account.confirmPhone",
			"params": [
				{
					"name": "phone_code_hash",
					"type": "string"
				},
				{
					"name": "phone_code",
					"type": "string"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1920105769",
			"method": "channels.getAdminedPublicChannels",
			"params": [],
			"type": "messages.Chats"
		},
		{
			"id": "1706608543",
			"method": "messages.getMaskStickers",
			"params": [
				{
					"name": "hash",
					"type": "int"
				}
			],
			"type": "messages.AllStickers"
		},
		{
			"id": "-866424884",
			"method": "messages.getAttachedStickers",
			"params": [
				{
					"name": "media",
					"type": "InputStickeredMedia"
				}
			],
			"type": "Vector<StickerSetCovered>"
		},
		{
			"id": "-1907842680",
			"method": "auth.dropTempAuthKeys",
			"params": [
				{
					"name": "except_auth_keys",
					"type": "Vector<long>"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-1896289088",
			"method": "messages.setGameScore",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "edit_message",
					"type": "flags.0?true"
				},
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "score",
					"type": "int"
				}
			],
			"type": "Updates"
		},
		{
			"id": "363700068",
			"method": "messages.setInlineGameScore",
			"params": [
				{
					"name": "flags",
					"type": "#"
				},
				{
					"name": "edit_message",
					"type": "flags.0?true"
				},
				{
					"name": "id",
					"type": "InputBotInlineMessageID"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				},
				{
					"name": "score",
					"type": "int"
				}
			],
			"type": "Bool"
		},
		{
			"id": "-400399203",
			"method": "messages.getGameHighScores",
			"params": [
				{
					"name": "peer",
					"type": "InputPeer"
				},
				{
					"name": "id",
					"type": "int"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "messages.HighScores"
		},
		{
			"id": "258170395",
			"method": "messages.getInlineGameHighScores",
			"params": [
				{
					"name": "id",
					"type": "InputBotInlineMessageID"
				},
				{
					"name": "user_id",
					"type": "InputUser"
				}
			],
			"type": "messages.HighScores"
		}
	]
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = {
	"constructors": [
		{
			"id": "481674261",
			"predicate": "vector",
			"params": [],
			"type": "Vector t"
		},
		{
			"id": "85337187",
			"predicate": "resPQ",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "pq",
					"type": "bytes"
				},
				{
					"name": "server_public_key_fingerprints",
					"type": "Vector<long>"
				}
			],
			"type": "ResPQ"
		},
		{
			"id": "-2083955988",
			"predicate": "p_q_inner_data",
			"params": [
				{
					"name": "pq",
					"type": "bytes"
				},
				{
					"name": "p",
					"type": "bytes"
				},
				{
					"name": "q",
					"type": "bytes"
				},
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "new_nonce",
					"type": "int256"
				}
			],
			"type": "P_Q_inner_data"
		},
		{
			"id": "2043348061",
			"predicate": "server_DH_params_fail",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "new_nonce_hash",
					"type": "int128"
				}
			],
			"type": "Server_DH_Params"
		},
		{
			"id": "-790100132",
			"predicate": "server_DH_params_ok",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "encrypted_answer",
					"type": "bytes"
				}
			],
			"type": "Server_DH_Params"
		},
		{
			"id": "-1249309254",
			"predicate": "server_DH_inner_data",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "g",
					"type": "int"
				},
				{
					"name": "dh_prime",
					"type": "bytes"
				},
				{
					"name": "g_a",
					"type": "bytes"
				},
				{
					"name": "server_time",
					"type": "int"
				}
			],
			"type": "Server_DH_inner_data"
		},
		{
			"id": "1715713620",
			"predicate": "client_DH_inner_data",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "retry_id",
					"type": "long"
				},
				{
					"name": "g_b",
					"type": "bytes"
				}
			],
			"type": "Client_DH_Inner_Data"
		},
		{
			"id": "1003222836",
			"predicate": "dh_gen_ok",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "new_nonce_hash1",
					"type": "int128"
				}
			],
			"type": "Set_client_DH_params_answer"
		},
		{
			"id": "1188831161",
			"predicate": "dh_gen_retry",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "new_nonce_hash2",
					"type": "int128"
				}
			],
			"type": "Set_client_DH_params_answer"
		},
		{
			"id": "-1499615742",
			"predicate": "dh_gen_fail",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "new_nonce_hash3",
					"type": "int128"
				}
			],
			"type": "Set_client_DH_params_answer"
		},
		{
			"id": "-212046591",
			"predicate": "rpc_result",
			"params": [
				{
					"name": "req_msg_id",
					"type": "long"
				},
				{
					"name": "result",
					"type": "Object"
				}
			],
			"type": "RpcResult"
		},
		{
			"id": "558156313",
			"predicate": "rpc_error",
			"params": [
				{
					"name": "error_code",
					"type": "int"
				},
				{
					"name": "error_message",
					"type": "string"
				}
			],
			"type": "RpcError"
		},
		{
			"id": "1579864942",
			"predicate": "rpc_answer_unknown",
			"params": [],
			"type": "RpcDropAnswer"
		},
		{
			"id": "-847714938",
			"predicate": "rpc_answer_dropped_running",
			"params": [],
			"type": "RpcDropAnswer"
		},
		{
			"id": "-1539647305",
			"predicate": "rpc_answer_dropped",
			"params": [
				{
					"name": "msg_id",
					"type": "long"
				},
				{
					"name": "seq_no",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "int"
				}
			],
			"type": "RpcDropAnswer"
		},
		{
			"id": "155834844",
			"predicate": "future_salt",
			"params": [
				{
					"name": "valid_since",
					"type": "int"
				},
				{
					"name": "valid_until",
					"type": "int"
				},
				{
					"name": "salt",
					"type": "long"
				}
			],
			"type": "FutureSalt"
		},
		{
			"id": "-1370486635",
			"predicate": "future_salts",
			"params": [
				{
					"name": "req_msg_id",
					"type": "long"
				},
				{
					"name": "now",
					"type": "int"
				},
				{
					"name": "salts",
					"type": "vector<future_salt>"
				}
			],
			"type": "FutureSalts"
		},
		{
			"id": "880243653",
			"predicate": "pong",
			"params": [
				{
					"name": "msg_id",
					"type": "long"
				},
				{
					"name": "ping_id",
					"type": "long"
				}
			],
			"type": "Pong"
		},
		{
			"id": "-501201412",
			"predicate": "destroy_session_ok",
			"params": [
				{
					"name": "session_id",
					"type": "long"
				}
			],
			"type": "DestroySessionRes"
		},
		{
			"id": "1658015945",
			"predicate": "destroy_session_none",
			"params": [
				{
					"name": "session_id",
					"type": "long"
				}
			],
			"type": "DestroySessionRes"
		},
		{
			"id": "-1631450872",
			"predicate": "new_session_created",
			"params": [
				{
					"name": "first_msg_id",
					"type": "long"
				},
				{
					"name": "unique_id",
					"type": "long"
				},
				{
					"name": "server_salt",
					"type": "long"
				}
			],
			"type": "NewSession"
		},
		{
			"id": "1945237724",
			"predicate": "msg_container",
			"params": [
				{
					"name": "messages",
					"type": "vector<%Message>"
				}
			],
			"type": "MessageContainer"
		},
		{
			"id": "1538843921",
			"predicate": "message",
			"params": [
				{
					"name": "msg_id",
					"type": "long"
				},
				{
					"name": "seqno",
					"type": "int"
				},
				{
					"name": "bytes",
					"type": "int"
				},
				{
					"name": "body",
					"type": "Object"
				}
			],
			"type": "Message"
		},
		{
			"id": "-530561358",
			"predicate": "msg_copy",
			"params": [
				{
					"name": "orig_message",
					"type": "Message"
				}
			],
			"type": "MessageCopy"
		},
		{
			"id": "812830625",
			"predicate": "gzip_packed",
			"params": [
				{
					"name": "packed_data",
					"type": "bytes"
				}
			],
			"type": "Object"
		},
		{
			"id": "1658238041",
			"predicate": "msgs_ack",
			"params": [
				{
					"name": "msg_ids",
					"type": "Vector<long>"
				}
			],
			"type": "MsgsAck"
		},
		{
			"id": "-1477445615",
			"predicate": "bad_msg_notification",
			"params": [
				{
					"name": "bad_msg_id",
					"type": "long"
				},
				{
					"name": "bad_msg_seqno",
					"type": "int"
				},
				{
					"name": "error_code",
					"type": "int"
				}
			],
			"type": "BadMsgNotification"
		},
		{
			"id": "-307542917",
			"predicate": "bad_server_salt",
			"params": [
				{
					"name": "bad_msg_id",
					"type": "long"
				},
				{
					"name": "bad_msg_seqno",
					"type": "int"
				},
				{
					"name": "error_code",
					"type": "int"
				},
				{
					"name": "new_server_salt",
					"type": "long"
				}
			],
			"type": "BadMsgNotification"
		},
		{
			"id": "2105940488",
			"predicate": "msg_resend_req",
			"params": [
				{
					"name": "msg_ids",
					"type": "Vector<long>"
				}
			],
			"type": "MsgResendReq"
		},
		{
			"id": "-630588590",
			"predicate": "msgs_state_req",
			"params": [
				{
					"name": "msg_ids",
					"type": "Vector<long>"
				}
			],
			"type": "MsgsStateReq"
		},
		{
			"id": "81704317",
			"predicate": "msgs_state_info",
			"params": [
				{
					"name": "req_msg_id",
					"type": "long"
				},
				{
					"name": "info",
					"type": "bytes"
				}
			],
			"type": "MsgsStateInfo"
		},
		{
			"id": "-1933520591",
			"predicate": "msgs_all_info",
			"params": [
				{
					"name": "msg_ids",
					"type": "Vector<long>"
				},
				{
					"name": "info",
					"type": "bytes"
				}
			],
			"type": "MsgsAllInfo"
		},
		{
			"id": "661470918",
			"predicate": "msg_detailed_info",
			"params": [
				{
					"name": "msg_id",
					"type": "long"
				},
				{
					"name": "answer_msg_id",
					"type": "long"
				},
				{
					"name": "bytes",
					"type": "int"
				},
				{
					"name": "status",
					"type": "int"
				}
			],
			"type": "MsgDetailedInfo"
		},
		{
			"id": "-2137147681",
			"predicate": "msg_new_detailed_info",
			"params": [
				{
					"name": "answer_msg_id",
					"type": "long"
				},
				{
					"name": "bytes",
					"type": "int"
				},
				{
					"name": "status",
					"type": "int"
				}
			],
			"type": "MsgDetailedInfo"
		}
	],
	"methods": [
		{
			"id": "1615239032",
			"method": "req_pq",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				}
			],
			"type": "ResPQ"
		},
		{
			"id": "-686627650",
			"method": "req_DH_params",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "p",
					"type": "bytes"
				},
				{
					"name": "q",
					"type": "bytes"
				},
				{
					"name": "public_key_fingerprint",
					"type": "long"
				},
				{
					"name": "encrypted_data",
					"type": "bytes"
				}
			],
			"type": "Server_DH_Params"
		},
		{
			"id": "-184262881",
			"method": "set_client_DH_params",
			"params": [
				{
					"name": "nonce",
					"type": "int128"
				},
				{
					"name": "server_nonce",
					"type": "int128"
				},
				{
					"name": "encrypted_data",
					"type": "bytes"
				}
			],
			"type": "Set_client_DH_params_answer"
		},
		{
			"id": "1491380032",
			"method": "rpc_drop_answer",
			"params": [
				{
					"name": "req_msg_id",
					"type": "long"
				}
			],
			"type": "RpcDropAnswer"
		},
		{
			"id": "-1188971260",
			"method": "get_future_salts",
			"params": [
				{
					"name": "num",
					"type": "int"
				}
			],
			"type": "FutureSalts"
		},
		{
			"id": "2059302892",
			"method": "ping",
			"params": [
				{
					"name": "ping_id",
					"type": "long"
				}
			],
			"type": "Pong"
		},
		{
			"id": "-213746804",
			"method": "ping_delay_disconnect",
			"params": [
				{
					"name": "ping_id",
					"type": "long"
				},
				{
					"name": "disconnect_delay",
					"type": "int"
				}
			],
			"type": "Pong"
		},
		{
			"id": "-414113498",
			"method": "destroy_session",
			"params": [
				{
					"name": "session_id",
					"type": "long"
				}
			],
			"type": "DestroySessionRes"
		},
		{
			"id": "-1835453025",
			"method": "http_wait",
			"params": [
				{
					"name": "max_delay",
					"type": "int"
				},
				{
					"name": "wait_after",
					"type": "int"
				},
				{
					"name": "max_wait",
					"type": "int"
				}
			],
			"type": "HttpWait"
		}
	]
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(124);

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(6))(127);

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__smart_timeout__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "smartTimeout", function() { return __WEBPACK_IMPORTED_MODULE_0__smart_timeout__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defer__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "blueDefer", function() { return __WEBPACK_IMPORTED_MODULE_1__defer__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__crypto__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "CryptoWorker", function() { return __WEBPACK_IMPORTED_MODULE_2__crypto__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bin__ = __webpack_require__(2);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bin", function() { return __WEBPACK_IMPORTED_MODULE_3__bin__["bin"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__for_each__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_4__for_each__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__service_api_manager_index_js__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ApiManager", function() { return __WEBPACK_IMPORTED_MODULE_5__service_api_manager_index_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__store__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "PureStorage", function() { return __WEBPACK_IMPORTED_MODULE_6__store__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__service_time_manager__ = __webpack_require__(5);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpTimeManager", function() { return __WEBPACK_IMPORTED_MODULE_7__service_time_manager__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__service_dc_configurator__ = __webpack_require__(15);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpDcConfigurator", function() { return __WEBPACK_IMPORTED_MODULE_8__service_dc_configurator__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__service_secure_random__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MtpSecureRandom", function() { return __WEBPACK_IMPORTED_MODULE_9__service_secure_random__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__service_networker__ = __webpack_require__(16);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "MtpNetworker", function() { return __WEBPACK_IMPORTED_MODULE_10__service_networker__; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__http__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "httpClient", function() { return __WEBPACK_IMPORTED_MODULE_11__http__["a"]; });
// import 'setimmediate'























console.info('source loaded');


/* harmony default export */ __webpack_exports__["default"] = __WEBPACK_IMPORTED_MODULE_5__service_api_manager_index_js__["a" /* ApiManager */];

/***/ })
/******/ ]);
});
//# sourceMappingURL=mtproto2-browser.js.map