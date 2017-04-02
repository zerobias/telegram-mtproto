//@flow

import Main from './index'

import type { ConfigType } from './index.h'
import type { ApiManagerInstance, LeftOptions } from '../api-manager/index.h'

function MTProto(config: ConfigType = {}): ApiManagerInstance {
  const mtproto = new Main(config)

  const api = mtproto.api

  function telegram(method: string,
                    params: Object,
                    options: LeftOptions = {}) {
    return api.mtpInvokeApi(method, params, options)
  }

  telegram.setUserAuth = api.setUserAuth
  telegram.on = api.on
  telegram.emit = api.emit
  telegram.storage = api.storage

  return telegram
}

export default MTProto