//@flow

import omit from 'ramda/src/omit'
import Promise from 'bluebird'

import type { AsyncStorage } from '../index.h'

import { readData, writeData } from './fixtures'

import Logger from '../../util/log'
const log = Logger`simple-file-storage`


/**
 * ### *Basic* file storage realisation
 *
 * Limitations:
 * * `filepath` must exists
 * * `filepath` must be valid JSON (just `{}` for empty store)
 * * No auto close descriptor
 *
 * @export
 * @class SimpleFileStorage
 * @implements {AsyncStorage}
 */
export class SimpleFileStorage implements AsyncStorage {
  filepath: string
  data: { [key: string]: * } = {}
  init = false

  /**
   * Usage
   *
   *     const storage = new SimpleFileStorage('./filestore.json')
   *     const telegram = MTProto({ app: { storage } })
   *
   * @param {string} filepath Path to your file
   * @param {object} [data] Import stored data (if you have so)
   *
   */
  constructor(filepath: string, data?: { [key: string]: * }) {
    this.filepath = filepath
    if (data != null)
      this.data = data
    setInterval(() => this.save(), 500)
  }

  save() {
    const str = JSON.stringify(this.data)
    return writeData(this.filepath, str)
  }

  async get(key: string): Promise<*> {
    if (!this.init) {
      const pureData = await readData(this.filepath)
      const parsed = JSON.parse(pureData)
      this.data = parsed
      log('get', 'parsed')('%O', parsed)
      this.init = Date.now()
    }
    const data = this.data[key]
    log('get')(`key %O data %O`, key, data)
    return Promise.resolve(data)
  }

  set(key: string, val: any): Promise<void> {
    this.data[key] = val
    return Promise.resolve()
  }

  remove(...keys: string[]): Promise<void> {
    this.data = omit(keys, this.data)
    return Promise.resolve()
  }

  async clear(): Promise<void> {
    this.data = {}
    await this.save()
  }
}

export default SimpleFileStorage