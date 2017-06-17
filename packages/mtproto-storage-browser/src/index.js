// @flow

import Bluebird from 'bluebird'
import localforage from 'localforage'

import type { LocalForage } from 'localforage'
import type { AsyncStorage } from 'mtproto-shared'
import Logger from 'mtproto-logger'
const log = Logger`browser-storage`

const defaultStorage = localforage.createInstance({
  driver: localforage.LOCALSTORAGE
})

class BrowserStorage implements AsyncStorage {
  storage: LocalForage

  constructor(storage: LocalForage = defaultStorage) {
    this.storage = storage
  }

  get(key: string) {
    return this.storage.getItem(key)
  }

  set(key: string, val: mixed) {
    return this.storage.setItem(key, val)
  }

  async remove(...keys: string[]) {
    await Bluebird.map(keys, this.storage.removeItem.bind(this.storage))
  }

  clear() {
    return this.storage.clear()
  }
}

export { BrowserStorage as Storage }

export default BrowserStorage