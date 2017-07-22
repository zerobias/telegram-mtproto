//@flow

import type { $AxiosXHR } from 'axios'

import stackCleaner from './util/clean-stack'
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
    this.stack = stackCleaner(this.stack)
  }
}

export class ErrorBadResponse extends MTError {
  originalError: Error | $AxiosXHR<any>
  constructor(url: string, originalError?: Error | null | $AxiosXHR<any> = null) {
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
  constructor(err: { config: { url: string } }) {
    super(404, 'REQUEST_FAILED', err.config.url)
      // this.originalError = err
  }
}

export class DcUrlError extends MTError {
  constructor(dcID: number, dc: string | boolean) {
    super(860, 'WRONG_DC_URL', `Wrong url! dcID ${dcID}, url ${dc.toString()}`)
      // this.originalError = err
  }
}

export type RpcErrorType = {
  error_message?: string,
  error_code?: number,
}

export class RpcError extends MTError {
  originalError: *
  constructor(code: number, type: string, message: string, originalError: *) {
    super(code, type, message)
    this.originalError = originalError
  }
}

export class RpcApiError extends MTError {
  constructor(code: number, message: string) {
    super(code, 'RpcApiError', '')
    this.message = message
  }
  static of(data: {
    _: 'rpc_error',
    error_code: number,
    error_message: string,
  }): RpcApiError {
    return new RpcApiError(data.error_code, data.error_message)
  }
  toValue() {
    return {
      type   : 'RpcApiError',
      code   : this.code,
      message: this.message
    }
  }
  toJSON() {
    return this.toValue()
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

export class ProviderRegistryError extends MTError {
  constructor(uid: string) {
    super(850, 'NO_INSTANCE', `Lib instance ${uid} not found in registry`)
  }
}
