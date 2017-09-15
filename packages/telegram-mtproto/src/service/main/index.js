//@flow

import EventEmitter, {
  type EventEmitterType,
  type Emit,
  type On,
} from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'

import Config, { registerInstance } from 'ConfigProvider'
import { type UID } from 'Newtype'

import Logger from 'mtproto-logger'
const log = Logger`main`

import streamBus, { type Bus } from '../../event/stream-bus'
import { scopedEmitter } from '../../event'
import { type ConfigType, type StrictConfig } from './index.h'
import { dispatch } from 'State'
import { emitter } from '../../state/portal'
import { MAIN } from 'Action/main'
import loadStorage from './load-storage'
import { init } from './init'

class MTProto {
  config: StrictConfig
  uid: UID
  emitter: EventEmitterType & EventEmitter = new EventEmitter({
    wildcard: true
  })
  on: On = this.emitter.on.bind(this.emitter)
  emit: Emit = this.emitter.emit.bind(this.emitter)
  storage: AsyncStorage
  defaultDC: number = 2
  bus: Bus
  load: () => Promise<void>
  activated: boolean = true
  constructor(config: ConfigType) {
    emitter.emit('cleanup')
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
      emit       : this.emit,
      rootEmitter: scopedEmitter(uid, this.emitter),
      schema     : {
        apiSchema: fullConfig.schema,
        mtSchema : fullConfig.mtSchema
      },
      apiConfig: fullConfig.api,
      storage,
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
    Config.publicKeys.init(uid, fullConfig.app.publicKeys)
    // this.api = new ApiManager(fullConfig, uid)
    this.bus = streamBus(this)
    dispatch(MAIN.INIT({
      uid,
    }), uid)
    const load = async() => {
      if (this.activated)
        await loadStorage(dcMap, uid)
    }
    this.load = load
    setTimeout(load, 1e3)
  }
}

export default MTProto

export type { MTProto }
