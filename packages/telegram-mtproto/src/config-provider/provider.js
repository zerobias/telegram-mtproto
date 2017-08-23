//@flow
import { Fluture } from 'fluture'
import { ProviderRegistryError } from '../error'
import { type TLSchema } from '../tl/index.h'
import { type PublicKey, type PublicKeyExtended } from '../service/main/index.h'
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
    keyManager   : keyManagerNotInited,
    timerOffset  : 0,
    seq          : {},
    session      : {},
    authRequest  : {},
    publicKeys   : {},
    lastMessageID: [0, 0]
  }
  provider[fullConfig.uid] = fullConfig
}

function keyManagerNotInited(/*::fingerprints: string[] */): PublicKeyExtended {
  throw new Error(`Key manager not inited`)
}

type InstanceConfig = {|
  +uid: string,
  emit: Emit,
  +rootEmitter: EventEmitterType,
  publicKeys: { [key: string]: PublicKey },
  keyManager(fingerprints: string[]): PublicKeyExtended,
  authRequest: { [dc: number]: Fluture<*, *> },
  signIn: boolean,
  seq: { [dc: number]: number },
  session: { [dc: number]: number[] },
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
