//@flow
import { parse, format } from 'path'
import Bluebird from 'bluebird'
import {
  ensureFileSync,
  readJsonSync,
  outputJsonSync
} from 'fs-extra'

import writeJson from 'write-json-file'

import { periodic } from 'most'
import { isEmpty, reject, isNil, fromPairs } from 'ramda'

import { type AsyncStorage } from 'mtproto-shared'

import Logger from 'mtproto-logger'
const log = Logger`json-storage`

const PERIOD = 3000

const jsonOpts = { indent: 2 }

type Data = { [key: string]: any }

const clock = periodic(PERIOD).multicast()

const skipVoids: (x: Data) => Data = reject(isNil)


export class JsonStorage implements AsyncStorage {
  filepath: string
  data: Data
  hasUpdate: boolean = false
  writes = clock
    .filter(() => this.hasUpdate)
  stopWatch: () => void

  constructor(filepath: string, data?: Data) {
    const fileName = normalizePath(filepath)
    this.filepath = fileName
    if (data)
      this.data = data
    Object.defineProperties(this, {
      writes: {
        value: this.writes
      },
    })
    const loaded = ensureSync(fileName)
    if (!this.data)
      this.data = loaded
    this.startWatch()
  }
  startWatch() {
    const { unsubscribe } = this.writes.subscribe({
      next: () => { this.save() },
      error(err) { log`error`(err.message) },
      complete() {
        log`stop`('JsonStorage watcher inactive')
      }
    })
    this.stopWatch = unsubscribe
  }

  async save() {
    try {
      await writeJson(this.filepath, this.data, jsonOpts)
      this.hasUpdate = false
    } catch (error) {
      this.hasUpdate = true
      log`save failure`(error.message)
    }
  }

  get(key: string): Promise<any> {
    const data = this.data[key]
    log('get', `key ${key}`)(data)
    return Bluebird.resolve(data)
  }
  setData(data: Data) {
    if (isEmpty(data)) return
    this.hasUpdate = true
    this.data = skipVoids({ ...this.data, ...data })
  }
  set(key: string, val: any): Promise<void> {
    this.setData({ [key]: val })
    log`set key`(key)
    return Bluebird.resolve()
  }

  remove(...keys: string[]): Promise<void> {
    const saved = omitKeys(keys)
    log`remove`(keys)
    this.setData(saved)
    return Bluebird.resolve()
  }

  clear(): Promise<void> {
    this.data = {}
    this.hasUpdate = true
    log`clear`('ok')
    return Bluebird.resolve()
  }
}

const omitKey = (key: string) => [key, void 0]
const omitKeys = (keys: string[]) => fromPairs(keys.map(omitKey))

function ensureSync(filepath: string) {
  ensureFileSync(filepath)
  let fileData = null
  try {
    fileData = readJsonSync(filepath)
  } catch (err) {
    log`init, error`(err)
  }
  if (fileData === null) {
    outputJsonSync(filepath, {})
    fileData = {}
  }
  return fileData
}

function normalizePath(filepath: string) {
  const parsed = parse(filepath)
  if (parsed.ext !== '.json')
    return format({ ...parsed, ext: '.json' })
  return filepath
}

export { JsonStorage as Storage }

export default JsonStorage
