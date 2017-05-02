//@flow

import Promise from 'bluebird'

import toPairs from 'ramda/src/toPairs'

import type { AsyncStorage } from './index.h'


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


  constructor(data?: { [key: number]: * }) {
    if (data != null)
      for (const [key, value] of toPairs(data))
        this.store.set(key, value)
  }


  get(key: string) {
    return Promise.resolve(this.store.get(key))
  }

  set(key: string, val: any) {
    this.store.set(key, val)
    return Promise.resolve()
  }

  remove(...keys: string[]) {
    const results = keys.map(e => this.store.delete(e))
    return Promise.resolve(results)
  }

  clear() {
    this.store.clear()
    return Promise.resolve()
  }
}

export default MemoryStorage