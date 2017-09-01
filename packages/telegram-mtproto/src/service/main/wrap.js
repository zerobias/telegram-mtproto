//@flow

import { encaseP2, Fluture } from 'fluture'
import { MTError } from '../../error'

import Main from './index'

import { type ConfigType } from './index.h'
import { type ApiManagerInstance, type LeftOptions } from '../api-manager/index.h'

import { type Response } from 'Newtype'

export default function MTProto(config: ConfigType = {}): ApiManagerInstance {
  const mtproto = new Main(config)

  const api = mtproto.api

  function telegram(method: string,
                    params: Object,
                    options: LeftOptions = {}) {
    return api.mtpInvokeApi(method, params, options)
  }

  function futureRequest(method: string, params: Object = {}): Fluture<Response, MTError> {
    return encaseP2(api.mtpInvokeApi, method, params)
  }

  telegram.on = api.on
  telegram.emit = api.emit
  telegram.storage = api.storage
  telegram.uid = mtproto.uid
  telegram.bus = mtproto.bus
  telegram.mtproto = mtproto
  telegram.future = futureRequest
  if (__DEV__)
    telegram.api = api
  return telegram
}
