//     PublicKey class
//
// This class represents a Public Key

const keyStore = new Map()

class PublicKey {
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
