//@flow

import Bluebird from 'bluebird'

import { toPairs } from 'ramda'

import { type AsyncStorage } from 'mtproto-shared'


/**
 * Basic storage implementation.
 * Saves data in memory
 *
 * @export
 * @class MemoryStorage
 * @implements {AsyncStorage}
 */
export class MemoryStorage implements AsyncStorage {
  store: Map<string, any> = new Map


  constructor(data?: { [key: string]: * }) {
    if (data != null)
      for (const [key, value] of toPairs(data))
        this.store.set(key, value)
  }


  get(key: string) {
    return Bluebird.resolve(this.store.get(key))
  }

  set(key: string, val: any) {
    this.store.set(key, val)
    return Bluebird.resolve()
  }

  remove(...keys: string[]) {
    keys.map(e => this.store.delete(e))
    return Bluebird.resolve()
  }

  clear() {
    this.store.clear()
    return Bluebird.resolve()
  }
}



export default MemoryStorage