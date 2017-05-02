//@flow

import uuid from 'uuid/v4'

export type ApiMethod = {
  method: string,
  params: { [arg: string]: * }
}

type Defer = {
  resolve<T>(rs: T): void,
  reject<E>(rs: E): void,
  promise: Promise<*>
}

export type RequestStatus =
  'wait'
  | 'request'
  | 'stale'
  | 'done'
  | 'error'

export type RequestOptions = {
  dc: number | '@@home'
}

class Request {
  data: ApiMethod
  requestID: string = uuid()
  defer: Defer
  // status: RequestStatus = 'wait'
  options: RequestOptions
  constructor(data: ApiMethod,
              options: RequestOptions,
              defer: Defer) {
    this.data = data
    this.defer = defer
    this.options = options
  }
}

export type { Request }

export default Request
