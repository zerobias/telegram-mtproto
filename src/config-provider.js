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
  |}
|}

type Registry = {
  [uid: string]: InstanceConfig
}



const registry: Registry = { }


export function getConfig(uid: string) {
  if (registry[uid] == null) throw new ProviderRegistryError(uid)
  return registry[uid]
}


export function registerInstance(config: $Diff<InstanceConfig, { uid: string }>) {
  const uid = uuid()
  //$FlowIssue
  const fullConfig: InstanceConfig = { ...config, uid }
  registry[uid] = fullConfig
  return uid
}
