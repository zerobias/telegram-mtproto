//@flow

import Main from './index'

import type { ConfigType } from './index.h'
import type { ApiManagerInstance } from '../api-manager/index.h'

function MTProto(config: ConfigType = {}): ApiManagerInstance {
  const mtproto = new Main(config)
  return mtproto.api
}

export default MTProto