//@flow

// import { Maybe, fromNullable } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { fromNullable } = Maybe

import blueDefer, { type Defer } from 'Util/defer'
import {
  type DCNumber,
  type UID,
} from 'Newtype'
import uuid from 'Util/uuid'

export type ApiMethod = {
  method: string,
  params: { [arg: string]: any }
}

export type RequestOptions = {
  dc: DCNumber,
  requestID: string,
  resultType: string,
}


export default class ApiRequest {
  data: ApiMethod
  //$off
  requestID: UID = uuid()
  uid: UID
  defer: Defer
  deferFinal: Defer
  needAuth: boolean
  options: RequestOptions
  dc: Maybe<DCNumber>
  constructor(
    data: ApiMethod,
    options: RequestOptions,
    uid: UID,
    dc?: DCNumber
  ) {
    this.dc = fromNullable(dc)
    options.requestID = this.requestID
    this.uid = uid
    this.data = data
    this.options = options
    this.needAuth = !allowNoAuth(data.method)
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
