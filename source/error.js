
export class MTError extends Error {
  static getMessage(code, type, message) {
    return `MT[${code}] ${type}: ${message}`
  }
  constructor(code, type, message) {
    const fullMessage = MTError.getMessage(code, type, message)
    super(fullMessage)
    this.code = code
    this.type = type
  }
}

export class ErrorBadResponse extends MTError {
  constructor(url, originalError = null) {
    super(406, 'NETWORK_BAD_RESPONSE', url)
    if (originalError)
      this.originalError = originalError
  }
}

export class ErrorNotFound extends MTError {
  constructor(err) {
    super(404, 'REQUEST_FAILED', err.config.url)
    // this.originalError = err
  }
}