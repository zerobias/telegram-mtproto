//@flow

import EventEmitter from 'eventemitter2'

import { ApiManager } from '../api-manager'
import { registerInstance } from '../../config-provider'
import State from './state'

import Logger from 'mtproto-logger'
const log = Logger`main`

import streamBus, { type Bus } from '../../event/stream-bus'
import { ScopedEmitter } from '../../event'
import { type AsyncStorage } from '../../plugins/index.h'
import { type ConfigType, type StrictConfig } from './index.h'
import { type Emit, type On } from 'eventemitter2'
import { dispatch } from '../../state/core'
import { MAIN } from 'Action/main'
import loadStorage from './load-storage'
import { init } from './init'

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
  bus: Bus
  load: () => Promise<void>
  activated: boolean = true
  constructor(config: ConfigType) {
    const {
      uid,
      fullConfig,
      dcMap,
      storage,
      layer,
    } = init(config)
    this.config = fullConfig
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
      layer,
      dcMap
    })
    this.storage = storage
    this.emitter.on('*', (data, ...rest) => {
      log('event')(data)
      if (rest.length > 0)
        log('event', 'rest')(rest)
    })
    this.emitter.on('deactivate', () => {
      this.activated = false
    })
    this.api = new ApiManager(fullConfig, uid)
    this.bus = streamBus(this)
    dispatch(MAIN.INIT({
      uid,
      invoke    : this.api.mtpInvokeApi,
      storageSet: (key: string, value: mixed) => storage.set(key, value)
    }))
    const load = async() => {
      if (this.activated)
        await loadStorage(storage, dcMap, this.api.networkSetter)
    }
    this.load = load
    setTimeout(load, 1e3)
  }
}

export default MTProto

export type { MTProto }
