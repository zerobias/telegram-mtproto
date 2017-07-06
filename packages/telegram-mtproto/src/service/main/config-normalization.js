//@flow

import MemoryStorage from '../../plugins/memory-storage'

import configValidator from './config-validation'
import generateInvokeLayer from './invoke-layer-generator'

import type { TLSchema } from '../../tl/index.h'
import type { ApiConfig, ConfigType, StrictConfig } from './index.h'
import publisKeys from './public-keys'

const api57: TLSchema = require('../../../schema/api-57.json')
const mtproto57: TLSchema = require('../../../schema/mtproto-57.json')

const apiConfig: ApiConfig = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631,
  device_model   : 'Unknown UserAgent',
  system_version : 'Unknown Platform',
  app_version    : '1.0.1',
  lang_code      : 'en'
}

const configNormalization = (config: ConfigType): StrictConfig => {
  const {
    server = {},
    api = {},
    app: {
      storage = new MemoryStorage,
      publicKeys = publisKeys,
      plugins = [],
    } = {},
    schema = api57,
    mtSchema = mtproto57,
  } = config
  const apiNormalized = { ...apiConfig, ...api }
  const invokeLayer = generateInvokeLayer(apiNormalized.layer)
  apiNormalized.invokeWithLayer = invokeLayer
  const fullCfg = {
    server,
    api: apiNormalized,
    app: { storage, publicKeys, plugins },
    schema,
    mtSchema
  }
  configValidator(fullCfg)
  return fullCfg
}

export default configNormalization
