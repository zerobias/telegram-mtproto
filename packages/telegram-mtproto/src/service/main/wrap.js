//@flow

import { Fluture } from 'fluture'
import { MTError } from '../../error'

import Main from './index'

import invoke from '../invoke'
import {
  type ConfigType,
  type ApiManagerInstance,
  type LeftOptions,
} from './index.h'

import { type Response } from 'Newtype'

export default function MTProto(config: ConfigType = {}): ApiManagerInstance {
  const mtproto = new Main(config)
  const uid = mtproto.uid

  function telegram(
    method: string,
    params?: Object,
    options?: LeftOptions
  ) {
    return invoke(uid, method, params, options).promise()
  }

  function futureRequest(
    method: string,
    params?: Object,
    options?: LeftOptions
  ): Fluture<Response, MTError> {
    return invoke(uid, method, params, options)
  }

  telegram.on = mtproto.on
  telegram.emit = mtproto.emit
  telegram.storage = mtproto.storage
  telegram.uid = mtproto.uid
  telegram.bus = mtproto.bus
  telegram.mtproto = mtproto
  telegram.future = futureRequest
  if (__DEV__)
    telegram.api = mtproto
  return telegram
}
