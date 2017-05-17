//@flow

import EventEmitter from 'eventemitter2'

import { ApiManager } from '../api-manager'
import MemoryStorage from '../../plugins/memory-storage'
import Layout from '../../layout'

import configValidator from './config-validation'
import generateInvokeLayer from './invoke-layer-generator'
import { curriedRegister } from '../../config-provider'
import State from './state'

import Logger from 'mtproto-logger'
const log = Logger`main`

import parseServerConfig from '../../config-check/dc'
import streamBus from '../../event/stream-bus'
import { ScopedEmitter } from '../../event'
import { type AsyncStorage } from '../../plugins/index.h'
import { type TLSchema } from '../../tl/index.h'
import { type ApiConfig, type ConfigType, type StrictConfig, type PublicKey } from './index.h'
import { type Emit, type On } from 'eventemitter2'
import { type ProcessMessage } from '../emit.h'
// import type { ApiManagerInstance } from '../api-manager/index.h'

const api57 = require('../../../schema/api-57.json')
const mtproto57 = require('../../../schema/mtproto-57.json')

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

const generateLayers = (api: TLSchema, mt: TLSchema) => ({
  apiLayer: new Layout(api),
  mtLayer : new Layout(mt),
})

class MTProto {
  config: StrictConfig
  uid: string
  emitter: EventEmitter = new EventEmitter({
    wildcard: true
  })
  api: ApiManager
  on: On = this.emitter.on.bind(this.emitter)
  emit: Emit = this.emitter.emit.bind(this.emitter)
  storage: AsyncStorage
  state = new State
  defaultDC: number = 2
  bus: *
  constructor(config: ConfigType) {
    const fullConfig = configNormalization(config)
    const dcMap = parseServerConfig(config.server)
    this.config = fullConfig
    const { apiLayer, mtLayer } = generateLayers(this.config.schema, this.config.mtSchema)
    const { uid, next } = curriedRegister()
    next({
      signIn     : false,
      emit       : this.emit,
      rootEmitter: new ScopedEmitter(uid, this.emitter),
      schema     : {
        apiSchema: fullConfig.schema,
        mtSchema : fullConfig.mtSchema
      },
      layer: {
        apiLayer,
        mtLayer
      },
      dcMap
    })
    this.uid = uid
    this.storage = fullConfig.app.storage
    this.api = new ApiManager(fullConfig, uid)
    this.emitter.on('*', (data, ...rest) => {
      log('event')(data)
      if (rest.length > 0)
        log('event', 'rest')(rest)
    })
    this.bus = streamBus(this)
  }

  processMessage = ({ threadID, message }: $PropertyType<ProcessMessage, 'value'>) => {
    const networker = this.state.threads.get(threadID)
    if (networker == null) return
    log('observer', 'type')(message._, networker.dcID)
  }
}

export default MTProto

const configNormalization = (config: ConfigType): StrictConfig => {
  const {
    server = {},
    api = {},
    app: {
      storage = new MemoryStorage,
      publicKeys = publisKeysHex
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
    app: { storage, publicKeys },
    schema,
    mtSchema
  }
  configValidator(fullCfg)
  return fullCfg
}

export type { MTProto }

/**
*  Server public key, obtained from here: https://core.telegram.org/api/obtaining_api_id
*
* -----BEGIN RSA PUBLIC KEY-----
* MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zw = rzKOaaQdr01vAbU4E1pvkfj4sqDsm6
* lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
* an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
* Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
* 8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
* Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
* -----END RSA PUBLIC KEY-----
*/

const publisKeysHex: PublicKey[] = [{
  modulus:
  'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f' +
  '8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e5802' +
  '30e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b' +
  '8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d86' +
  '6b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b' +
  '6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083' +
  'a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde7' +
  '4a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
  exponent: '010001'
}]

