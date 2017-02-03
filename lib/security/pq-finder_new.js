'use strict'
const BigInteger = require('big-integer')

/**
 * Find the `PQ pair with P < Q` starting from a `BigInteger` value
 *
 * @class PQFinder
 */
class PQFinder {
  /**
   * The constructor may be called either giving a `Buffer` with the binary image or
   * a `String / Number` representation of the `BigInteger` number
   *
   * @param {Buffer|string|number} pqNumber
   *
   * @memberOf PQFinder
   */
  constructor(pqNumber) {
    this._pqNumber = switchTyping(pqNumber)
  }
  /**
   * Get the original PQ pair number.
   *
   * @returns
   *
   * @memberOf PQFinder
   */
  getPQPairNumber() {
    return this._pqNumber
  }

  /**
   * Calculates the pair P and Q with p < q and returns an array where `p = [0] and q = [1]`
   *
   * @returns {[number, number]}
   *
   * @memberOf PQFinder
   */
  findPQ() {
    if (!this._pq) {
      const num = this._pqNumber
      let prime
      for (let i = 0; i < 3; i++) {
        const q = BigInteger((nextRandom(128) & 15) + 17)
        let x = BigInteger(nextRandom(1000000000) + 1)
        let y = BigInteger(x)
        const lim = 1 << (i + 18)
        for (let j = 1; j < lim; j++) {
          let a = BigInteger(x)
          let b = BigInteger(x)
          let c = BigInteger(q)
          while (!b.isZero()) {
            if (!b.and(BigInteger.one).isZero()) {
              c = c.add(a)
              if (c.gt(num))
                c = c.subtract(num)
            }
            a = a.add(a)
            if (a.gt(num))
              a = a.subtract(num)
            b = b.shiftRight(1)
          }
          x = BigInteger(c)
          const z = y.gt(x) ? y.subtract(x) : x.subtract(y)
          prime = BigInteger.gcd(z, num)
          if (prime.notEquals(BigInteger.one))
            break
          if ((j & (j - 1)) === 0)
            y = BigInteger(x)
        }
        if (prime.gt(BigInteger.one))
          break
      }
      const cofactor = num.divide(prime)
      this._pq = cofactor.gt(prime)
        ? [prime, cofactor]
        : [cofactor, prime]
    }
    return this._pq
  }

  /**
   * Returns a new Buffer for each P and Q value as array
   *
   * @returns {[new Buffer]}
   *
   * @memberOf PQFinder
   */
  getPQAsBuffer() {
    return this.findPQ().map(toRawBytes)
  }
}

const toRawBytes = bigNum => {
  const str = bigNum.toString(16)
  const byteArray = []
  for (let i = 0; i < str.length; i += 2) {
    const byte = parseInt(str.substr(i, 2), 16)
    byteArray.push(byte)
  }
  return new Buffer(byteArray)
}

PQFinder.toRawBytes = toRawBytes

const isType = {
  number: e => typeof e === 'number',
  string: e => typeof e === 'string'
}

const switchTyping = obj => {
  let conv
  switch (true) {
    case isType.number(obj):
    case isType.string(obj): conv = obj; break
    default: conv = parseInt(obj.toString('hex'), 16)
  }
  return new BigInteger(conv)
}

const nextRandom = max => Math.floor(Math.random() * max)

module.exports = exports = PQFinder
