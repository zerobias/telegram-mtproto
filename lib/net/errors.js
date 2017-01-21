
class NetworkError extends Error {
  static getMessage(code, message, data) {
    return `[Network] ${code} ${message} ${data}`
  }
  constructor({ statusCode, statusMessage }, data) {
    const message = NetworkError.getMessage(statusCode, statusMessage, data)
    super(message)
  }
}

module.exports = {
  NetworkError
}