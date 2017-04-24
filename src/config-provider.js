//@flow

import uuid from 'uuid/v4'

import { ProviderRegistryError } from './error'
import type { TLSchema } from './tl/index.h'
import Layout from './layout'

type InstanceConfig = {|
  uid: string,
  signIn: boolean,
  schema: {|
    apiSchema: TLSchema,
    mtSchema: TLSchema
  |},
  layer: {|
    apiLayer: Layout,
    mtLayer: Layout,
  |},
  timerOffset: number,
  lastMessageID: [number, number]
|}

type Provider = {
  [uid: string]: InstanceConfig
}

type InstanceDiff = {
  uid: string,
  timerOffset: number,
  lastMessageID: [number, number]
}


const provider: Provider = { }


const Config = {
  signIn: {
    get: (uid: string) => getConfig(uid).signIn,
    set(uid: string, value: boolean) {
      getConfig(uid).signIn = value
    }
  },

  layer: {
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
}

export function getConfig(uid: string) {
  const config = provider[uid]
  if (config == null) throw new ProviderRegistryError(uid)
  return config
}


export function registerInstance(config: $Diff<InstanceConfig, InstanceDiff>) {
  const uid = uuid()
  //$FlowIssue
  const fullConfig: InstanceConfig = { ...config, uid, timerOffset: 0, lastMessageID: [0, 0] }
  provider[uid] = fullConfig
  return uid
}

export default Config
