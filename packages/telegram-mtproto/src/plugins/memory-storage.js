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
  store: Map<string, any>

  constructor(data?: { [key: string]: any }) {
    if (data != null)
      this.store = new Map(toPairs(data))
    else
      this.store = new Map
  }


  get(key: string) {
    return Bluebird.resolve(this.store.get(key))
  }

  set(key: string, val: any) {
    this.store.set(key, val)
    return Bluebird.resolve()
  }

  has(key: string) {
    return Bluebird.resolve(this.store.has(key))
  }

  remove(...keys: string[]) {
    keys.map(e => this.store.delete(e))
    return Bluebird.resolve()
  }


  /**
   * @deprecated
   */
  clear() {
    this.store.clear()
    return Bluebird.resolve()
  }
}



export default MemoryStorage