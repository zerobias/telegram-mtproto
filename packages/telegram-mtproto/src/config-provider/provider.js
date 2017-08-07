//@flow

import { ProviderRegistryError } from '../error'
import { type TLSchema } from '../tl/index.h'
import { type Emit, type EventEmitterType } from 'eventemitter2'
import Layout from '../layout'

const provider: Provider = { }

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

type InstanceDiff = {
  timerOffset: number,
  lastMessageID: [number, number]
}

type Provider = {
  [uid: string]: InstanceConfig
}
