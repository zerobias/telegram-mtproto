//@flow
import { Fluture } from 'fluture'
import { type Emit } from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'

import { ProviderRegistryError } from '../error'
import { type TLSchema } from '../tl/index.h'
import { type DCNumber } from 'Newtype'
import { isMock } from 'Runtime'
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
  if (config == null) {
    // if (isMock) {
    //   const { registerMock } = require('../service/main')
    //   registerMock({}, uid)
    //   return provider[uid]
    // }
    throw new ProviderRegistryError(uid)
  }
  return config
}

export function registerInstance(config: $Diff<InstanceConfig, InstanceDiff>) {
  const fullConfig: InstanceConfig = {
    ...config,
    keyManager    : keyManagerNotInited,
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
  authRequest: { [dc: DCNumber]: Fluture<*, *> },
  seq: { [dc: DCNumber]: number },
  session: { [dc: DCNumber]: number[] },
  halt: { [dc: DCNumber]: boolean },
  thread: { [dc: DCNumber]: NetworkerThread },
  fastCache: { [dc: DCNumber]: L1Cache },
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
  authRequest: { [dc: DCNumber]: Fluture<*, *> },
  thread: { [dc: DCNumber]: NetworkerThread },
  halt: { [dc: DCNumber]: boolean },
  fastCache: { [dc: DCNumber]: L1Cache },
  keyManager(fingerprints: string[]): PublicKeyExtended,
  publicKeys: { [key: string]: PublicKey },
  seq: { [dc: DCNumber]: number },
  session: { [dc: DCNumber]: number[] },
}

type Provider = {
  [uid: string]: InstanceConfig
}
