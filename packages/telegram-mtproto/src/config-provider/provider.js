//@flow
import { Fluture } from 'fluture'
import { type Emit } from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'

import { ProviderRegistryError } from '../error'
import { type TLSchema } from '../tl/index.h'
import { type DCNumber } from 'Newtype'
import {
  type PublicKey,
  type PublicKeyExtended,
  type ApiConfig,
} from '../service/main/index.h'
import ScopedEmitter from '../event/scoped-emitter'
import NetworkerThread from '../service/networker'
import Layout from '../layout'
import L1Cache from '../l1-cache'
import StorageAdapter from '../storage-adapter'

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
    keyManager    : keyManagerNotInited,
    //$off
    storageAdapter: new StorageAdapter(config.storage),
    timerOffset   : 0,
    seq           : {},
    session       : {},
    fastCache     : {},
    thread        : {},
    authRequest   : {},
    halt          : {},
    publicKeys    : {},
    lastMessageID : [0, 0]
  }
  provider[fullConfig.uid] = fullConfig
}

function keyManagerNotInited(/*::fingerprints: string[] */): PublicKeyExtended {
  throw new Error(`Key manager not inited`)
}

type InstanceConfig = {
  /*::+*/uid: string,
  emit: Emit,
  /*::+*/rootEmitter: ScopedEmitter,
  /*::+*/storage: AsyncStorage,
  /*::+*/storageAdapter: StorageAdapter,
  /*::+*/apiConfig: ApiConfig,
  publicKeys: { [key: string]: PublicKey },
  keyManager: (fingerprints: string[]) => PublicKeyExtended,
  authRequest: { [dc: number]: Fluture<*, *> },
  seq: { [dc: number]: number },
  session: { [dc: number]: number[] },
  halt: { [dc: number]: boolean },
  thread: { [dc: number]: NetworkerThread },
  fastCache: { [dc: number]: L1Cache },
  /*::+*/schema: {|
    apiSchema: TLSchema,
    mtSchema: TLSchema
  |},
  /*::+*/layer: {|
    apiLayer: Layout,
    mtLayer: Layout,
  |},
  timerOffset: number,
  lastMessageID: [number, number],
  dcMap: Map<DCNumber, string>
}

type InstanceDiff = {
  timerOffset: number,
  lastMessageID: [number, number],
  /*::+*/storageAdapter: StorageAdapter,
  authRequest: { [dc: number]: Fluture<*, *> },
  thread: { [dc: number]: NetworkerThread },
  halt: { [dc: number]: boolean },
  fastCache: { [dc: number]: L1Cache },
  keyManager(fingerprints: string[]): PublicKeyExtended,
  publicKeys: { [key: string]: PublicKey },
  seq: { [dc: number]: number },
  session: { [dc: number]: number[] },
}

type Provider = {
  [uid: string]: InstanceConfig
}
