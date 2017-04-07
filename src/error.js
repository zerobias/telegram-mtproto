//@flow

import type { TypeBuffer } from './tl/type-buffer'

Error.stackTraceLimit = 25

export class MTError extends Error {
  static getMessage(code: number, type: string, message: string) {
    return `MT[${code}] ${type}: ${message}`
  }
  code: number
  type: string
  constructor(code: number, type: string, message: string) {
    const fullMessage = MTError.getMessage(code, type, message)
    super(fullMessage)
    this.code = code
    this.type = type
  }
}

export class ErrorBadResponse extends MTError {
  originalError: Error
  constructor(url: string, originalError?: Error | null = null) {
    super(406, 'NETWORK_BAD_RESPONSE', url)
    if (originalError)
      this.originalError = originalError
  }
}

export class ErrorBadRequest extends MTError {
  originalError: Error
  constructor(url: string, originalError?: Error | null = null) {
    super(406, 'NETWORK_BAD_REQUEST', url)
    if (originalError)
      this.originalError = originalError
  }
}

export class ErrorNotFound extends MTError {
  constructor(err: Object) {
    super(404, 'REQUEST_FAILED', err.config.url)
      // this.originalError = err
  }
}

export class TypeBufferIntError extends MTError {
  static getTypeBufferMessage(ctx: TypeBuffer) {
    const offset = ctx.offset
    const length = ctx.intView.length * 4
    return `Can not get next int: offset ${offset} length: ${length}`
  }
  typeBuffer: TypeBuffer
  constructor(ctx: TypeBuffer) {
    const message = TypeBufferIntError.getTypeBufferMessage(ctx)
    super(800, 'NO_NEXT_INT', message)
    this.typeBuffer = ctx
  }
}

export class AuthKeyError extends MTError {
  constructor() {
    super(401, 'AUTH_KEY_EMPTY', '')
  }
}