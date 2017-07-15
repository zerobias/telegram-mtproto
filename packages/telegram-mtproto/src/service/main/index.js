//@flow

import uuid from 'uuid/v4'
import EventEmitter from 'eventemitter2'

import { ApiManager } from '../api-manager'
import Layout from '../../layout'

import configNormalization from './config-normalization'
import { registerInstance } from '../../config-provider'
import State from './state'

import Logger from 'mtproto-logger'
const log = Logger`main`

import parseServerConfig from '../../config-check/dc'
import streamBus from '../../event/stream-bus'
import { ScopedEmitter } from '../../event'
import { type AsyncStorage } from '../../plugins/index.h'
import { type TLSchema } from '../../tl/index.h'
import { type ConfigType, type StrictConfig } from './index.h'
import { type Emit, type On } from 'eventemitter2'
import { dispatch } from '../../state/core'
import { MAIN } from '../../state/action'


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
    const uid = uuid()
    dispatch(MAIN.INIT(uid))
    const fullConfig = configNormalization(config)
    const dcMap = parseServerConfig(config.server)
    this.config = fullConfig
    const { apiLayer, mtLayer } = generateLayers(this.config.schema, this.config.mtSchema)
    this.uid = uid
    registerInstance({
      uid,
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
    setTimeout(() => dispatch(MAIN.SWITCH_ON(uid)), 3e1)

  }
}

export default MTProto

export type { MTProto }
