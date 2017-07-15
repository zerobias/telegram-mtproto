//@flow

import uuid from 'uuid/v4'
// import isNode from 'detect-node'

import { ProviderRegistryError } from './error'
import { type TLSchema } from './tl/index.h'
import { type Emit, type EventEmitterType } from 'eventemitter2'
import Layout from './layout'
import cryptoCommon from './co-worker/common-provider'
import getCrypto from './co-worker'

type InstanceConfig = {|
  +uid: string,
  emit: Emit,
  +rootEmitter: EventEmitterType,
  signIn: boolean,
  +schema: {|
    apiSchema: TLSchema,
    mtSchema: TLSchema
  |},
  +layer: {|
    apiLayer: Layout,
    mtLayer: Layout,
  |},
  timerOffset: number,
  lastMessageID: [number, number],
  dcMap: Map<number, string>
|}

type Provider = {
  [uid: string]: InstanceConfig
}

type InstanceDiff = {
  timerOffset: number,
  lastMessageID: [number, number]
}


const provider: Provider = { }

const common = {
  ...cryptoCommon
}

const Config = {
  signIn: {
    get: (uid: string) => getConfig(uid).signIn,
    set(uid: string, value: boolean) {
      getConfig(uid).signIn = value
    }
  },
  rootEmitter: (uid: string) => getConfig(uid).rootEmitter,
  emit       : (uid: string) => getConfig(uid).emit,
  layer      : {
    apiLayer: (uid: string) => getConfig(uid).layer.apiLayer,
    mtLayer : (uid: string) => getConfig(uid).layer.mtLayer,
  },
  schema: {
    get      : (uid: string) => getConfig(uid).schema,
    apiSchema: (uid: string) => getConfig(uid).schema.apiSchema,
    mtSchema : (uid: string) => getConfig(uid).schema.mtSchema,
  },
  timerOffset: {
    get: (uid: string) => getConfig(uid).timerOffset,
    set(uid: string, value: number) {
      getConfig(uid).timerOffset = value
    }
  },
  lastMessageID: {
    get: (uid: string) => getConfig(uid).lastMessageID,
    set(uid: string, value: [number, number]) {
      getConfig(uid).lastMessageID = value
    }
  },
  dcMap(uid: string, id: number) {
    const dc = getConfig(uid).dcMap.get(id)
    if (typeof dc !== 'string')
      throw new Error(`Wrong dc id! ${id}`)
    return dc
  },
  common
}

export type Common = typeof Config.common;

Config.common.Crypto = getCrypto(Config.common)

export function getConfig(uid: string) {
  const config = provider[uid]
  if (config == null) throw new ProviderRegistryError(uid)
  return config
}

export function registerInstance(config: $Diff<InstanceConfig, InstanceDiff>) {
  const fullConfig: InstanceConfig = {
    //$FlowIssue
    ...config,
    timerOffset  : 0,
    lastMessageID: [0, 0]
  }
  provider[fullConfig.uid] = fullConfig
}

export default Config
