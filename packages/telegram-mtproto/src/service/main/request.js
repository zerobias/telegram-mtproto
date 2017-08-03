//@flow

import uuid from 'uuid/v4'
import { type Defer } from 'Util/defer'
import blueDefer from 'Util/defer'

export type ApiMethod = {
  method: string,
  params: { [arg: string]: * }
}

export type RequestOptions = {
  dc: number | '@@home',
  requestID: string
}

class ApiRequest {
  data: ApiMethod
  requestID: string = uuid()
  defer: Defer
  deferFinal: Defer
  invoke: () => void
  needAuth: boolean
  options: RequestOptions
  constructor(data: ApiMethod,
              options: RequestOptions,
              invoke: (val: ApiRequest) => any) {
    this.data = data
    this.options = options
    this.needAuth = !allowNoAuth(data.method)
    // this.messageID = options.messageID
    Object.defineProperty(this, 'defer', {
      value     : blueDefer(),
      enumerable: false,
      writable  : true,
    })
    Object.defineProperty(this, 'deferFinal', {
      value     : blueDefer(),
      enumerable: false,
      writable  : true,
    })
    Object.defineProperty(this, 'invoke', {
      value     : () => { invoke(this) },
      enumerable: false,
      writable  : true,
    })
  }
}

const noAuthMethods = [
  'auth.sendCode',
  'auth.sendCall',
  'auth.checkPhone',
  'auth.signUp',
  'auth.signIn',
  'auth.importAuthorization',
  'help.getConfig',
  'help.getNearestDc',
]

const allowNoAuth = (method: string) =>
  noAuthMethods.indexOf(method) > -1

export default ApiRequest
