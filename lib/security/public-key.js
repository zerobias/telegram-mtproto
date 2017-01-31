'use strict'

const keyStore = new Map()

/**
 * Represents a Public Key
 *
 * @class PublicKey
 */
class PublicKey {
  /**
   * Requires the fingerprint, the modulus and the exponent
   *
   * @param {any} { fingerprint, modulus, exponent }
   *
   * @memberOf PublicKey
   */
  constructor({ fingerprint, modulus, exponent }) {
    this.fingerprint = fingerprint
    this.modulus = modulus
    this.exponent = exponent
  }
  getFingerprint() {
    return this.fingerprint
  }

  getModulus() {
    return this.modulus
  }

  getExponent() {
    return this.exponent
  }
  /**
   * Requires the fingerprint, the modulus and the exponent
   *
   * @static
   *
   * @param {any} { fingerprint, modulus, exponent }
   *
   * @memberOf PublicKey
   */
  static addKey(params) {
    const newKey = new PublicKey(params)
    keyStore.set(newKey.fingerprint, newKey)
  }

  static retrieveKey(fingerprint) {
    return keyStore.get(fingerprint)
  }

  static keys() {
    return keyStore
  }
}

module.exports = exports = PublicKey
