//@flow

import uuid from 'uuid/v4'
import type { Defer } from '../../util/defer'
import blueDefer from '../../util/defer'

export type ApiMethod = {
  method: string,
  params: { [arg: string]: * }
}

// type Defer = {
//   resolve<T>(rs: T): void,
//   reject<E>(rs: E): void,
//   promise: Promise<*>
// }

export type RequestStatus =
  'wait'
  | 'request'
  | 'stale'
  | 'done'
  | 'error'

export type RequestOptions = {|
  dc: number | '@@home',
  requestID: string
|}

class ApiRequest {
  data: ApiMethod
  requestID: string = uuid()
  defer: Defer = blueDefer()
  // status: RequestStatus = 'wait'
  options: RequestOptions
  constructor(data: ApiMethod,
              options: RequestOptions) {
    this.data = data
    this.options = options
  }
}

export type { ApiRequest as Request }

export default ApiRequest
