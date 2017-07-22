//@flow

import uuid from 'uuid/v4'
import { type Defer } from '../../util/defer'
import blueDefer from '../../util/defer'

export type ApiMethod = {
  method: string,
  params: { [arg: string]: * }
}

export type RequestOptions = {|
  dc: number | '@@home',
  requestID: string
|}

class ApiRequest {
  data: ApiMethod
  requestID: string = uuid()
  defer: Defer
  deferFinal: Defer
  invoke: () => void
  options: RequestOptions
  constructor(data: ApiMethod,
              options: RequestOptions,
              invoke: (val: ApiRequest) => any) {
    this.data = data
    this.options = options
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

export type { ApiRequest as Request }

export default ApiRequest
