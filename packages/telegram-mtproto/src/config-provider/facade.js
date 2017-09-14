//@flow

// import { Just, Nothing, fromNullable, Maybe } from 'folktale/maybe'

import { Maybe } from 'apropos'
const { fromNullable } = Maybe

import { type PublicKey } from '../service/main/index.h'
import { type DCNumber } from 'Newtype'
import getCrypto from '../co-worker'
import { getConfig } from './provider'
import random from '../service/secure-random'
import KeyManager from '../service/authorizer/rsa-keys-manger'
import NetworkerThread from '../service/networker'
import L1Cache from '../l1-cache'

const Config = {
  halt: {
    get(uid: string, dc: number): boolean {
      const val = getConfig(uid).halt[dc]
      if (typeof val !== 'boolean') {
        Config.halt.set(uid, dc, false)
        return false
      }
      return val
    },
    set(uid: string, dc: number, val: boolean) {
      getConfig(uid).halt[dc] = val
    }
  },
  // invoke(method: string, params: Object = {}, opts: Object = {}) {
  //
  // },
  seq: {
    get(uid: string, dc: number) {
      const seq = getConfig(uid).seq[dc]
      if (typeof seq !== 'number') {
        Config.seq.set(uid, dc, 1)
        return 1
      }
      return seq
    },
    set(uid: string, dc: number, newSeq: number) {
      getConfig(uid).seq[dc] = newSeq
    }
  },
  apiConfig: {
    get(uid: string) {
      return getConfig(uid).apiConfig
    }
  },
  thread: {
    set(uid: string, dc: DCNumber, thread: NetworkerThread) {
      getConfig(uid).thread[dc] = thread
    },
    get(uid: string, dc: DCNumber) {
      return fromNullable(getConfig(uid).thread[dc])
    },
  },
  storage: {
    get(uid: string, key: string): Promise<mixed> {
      return getConfig(uid).storage.get(key)
    },
    set(uid: string, key: string, value: any): Promise<void> {
      return getConfig(uid).storage.set(key, value)
    },
    has(uid: string, key: string): Promise<boolean> {
      return getConfig(uid).storage.has(key)
    },
    remove(uid: string, ...keys: string[]): Promise<void> {
      return getConfig(uid).storage.remove(...keys)
    },
  },
  storageAdapter: {
    get: {
      authKey(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.getAuthKey(dc)
      },
      authID(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.getAuthID(dc)
      },
      salt(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.getSalt(dc)
      },
      dc(uid: string) {
        return getConfig(uid).storageAdapter.getDC()
      },
      nearestDC(uid: string) {
        return getConfig(uid).storageAdapter.getNearestDC()
      },
    },
    set: {
      authKey(uid: string, dc: number, data: number[]) {
        return getConfig(uid).storageAdapter.setAuthKey(dc, data)
      },
      authID(uid: string, dc: number, data: number[]) {
        return getConfig(uid).storageAdapter.setAuthID(dc, data)
      },
      salt(uid: string, dc: number, data: number[]) {
        return getConfig(uid).storageAdapter.setSalt(dc, data)
      },
      dc(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.setDC(dc)
      },
      nearestDC(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.setNearestDC(dc)
      },
    },
    remove: {
      authKey(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.removeAuthKey(dc)
      },
      authID(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.removeAuthID(dc)
      },
      salt(uid: string, dc: number) {
        return getConfig(uid).storageAdapter.removeSalt(dc)
      },
      dc(uid: string) {
        return getConfig(uid).storageAdapter.removeDC()
      },
      nearestDC(uid: string) {
        return getConfig(uid).storageAdapter.removeNearestDC()
      },
    },
  },
  fastCache: {
    get(uid: string, dc: DCNumber) {
      return getConfig(uid).fastCache[dc | 0]
    },
    init(uid: string, dc: DCNumber) {
      getConfig(uid).fastCache[dc | 0] = L1Cache.of()
    }
  },
  publicKeys: {
    get(uid: string, keyHex: string): PublicKey | false {
      return getConfig(uid).publicKeys[keyHex] || false
    },
    set(uid: string, keyHex: string, key: PublicKey) {
      getConfig(uid).publicKeys[keyHex] = key
    },
    init(uid: string, keys: PublicKey[]) {
      getConfig(uid).keyManager = KeyManager(uid, keys, Config.publicKeys)
    },
    select(uid: string, fingerprints: string[]) {
      return getConfig(uid).keyManager(fingerprints)
    },
  },
  authRequest: {
    get(uid: string, dc: number) {
      return getConfig(uid).authRequest[dc]
    },
    set(uid: string, dc: number, req: *) {
      getConfig(uid).authRequest[dc] = req
    },
    remove(uid: string, dc: number) {
      delete getConfig(uid).authRequest[dc]
    },
  },
  session: {
    get(uid: string, dc: number) {
      let session = getConfig(uid).session[dc]
      if (!Array.isArray(session)) {
        session = new Array(8)
        random(session)
        Config.session.set(uid, dc, session)
      }
      return session
    },
    set(uid: string, dc: number, session: number[]) {
      getConfig(uid).session[dc] = session
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
  dcMap(uid: string, id: DCNumber) {
    const dc = getConfig(uid).dcMap.get(id)
    if (typeof dc !== 'string')
      throw new Error(`Wrong dc id! ${id}`)
    return dc
  },
  dcList(uid: string) {
    return [...getConfig(uid).dcMap.keys()]
  },
  common: getCrypto()
}

export default Config
