//@flow

import Main from './index'

import { type ConfigType } from './index.h'
import { type ApiManagerInstance, type LeftOptions } from '../api-manager/index.h'

function MTProto(config: ConfigType = {}): ApiManagerInstance {
  const mtproto = new Main(config)

  const api = mtproto.api

  function telegram(method: string,
                    params: Object,
                    options: LeftOptions = {}) {
    return api.mtpInvokeApi(method, params, options)
  }

  telegram.on = api.on
  telegram.emit = api.emit
  telegram.cache = api.cache
  telegram.storage = api.storage
  telegram.uid = mtproto.uid
  telegram.bus = mtproto.bus
  telegram.mtproto = mtproto
  return telegram
}

export default MTProto