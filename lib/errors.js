'use strict'
class NetworkError extends Error {
  static getMessage(code, message, data) {
    return `${code} ${message} ${data}`
  }
  constructor({ statusCode, statusMessage }, data) {
    const message = NetworkError.getMessage(statusCode, statusMessage, data)
    super(message)
    this.name = 'Network'
  }
}

class NonceError extends Error {
  static getMessage(needs, has) {
    return `Nonce mismatch. Needs ${needs} has ${has}`
  }
  constructor(clientNonce, respNonce) {
    const message = NonceError.getMessage(clientNonce, respNonce)
    super(message)
    this.name = 'Nonce'
  }
}

class FingerprintError extends Error {
  static getMessage() {
    return `Fingerprints from server not found in keyStore.`
  }
  constructor() {
    const message = FingerprintError.getMessage()
    super(message)
    this.name = 'Fingerprint'
  }
}

module.exports = {
  NetworkError,
  NonceError,
  FingerprintError
}