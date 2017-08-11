//@flow
import { parse, format } from 'path'
import Bluebird from 'bluebird'
import {
  outputJson,
  ensureFileSync,
  readJsonSync,
  outputJsonSync
} from 'fs-extra'

import Emitter from 'events'

import { fromEvent, awaitPromises, periodic, Stream } from 'most'
import { isEmpty, reject, isNil, complement as not, fromPairs } from 'ramda'

import { type AsyncStorage } from 'mtproto-shared'

import Logger from 'mtproto-logger'
const log = Logger`json-storage`

const PERIOD = 3000

type Data = { [key: string]: any }

const clock = periodic(PERIOD).multicast()

const accInit: Data = {/*::_: 0*/}

const chunkedStream = (stream: Stream<Data>) => clock
  .map(() => stream
    .until(clock)
    .reduce((acc, val): Data => ({ ...acc, ...val }), accInit))
  .thru(awaitPromises)
  .filter(not(isEmpty))

const skipVoids: (x: Data) => Data = reject(isNil)

export class JsonStorage implements AsyncStorage {
  filepath: string
  data: Data

  emitter = new Emitter
  writes = fromEvent('write', this.emitter)
    .thru(chunkedStream)
    .map(data => ({ ...this.data, ...data }))
    .map(skipVoids)
    .observe(val => save(this.filepath, val))

  constructor(filepath: string, data?: Data) {
    this.filepath = normalizePath(filepath)
    if (data != null)
      this.data = data
    Object.defineProperties(this, {
      emitter: {
        value: this.emitter
      },
      writes: {
        value: this.writes
      }
    })
    this.init()
  }
  init() { //TODO make async
    const data = ensureSync(this.filepath)
    if (!this.data)
      this.data = data
  }

  save() {
    return save(this.filepath, this.data)
  }

  get(key: string): Promise<any> {
    const data = this.data[key]
    log('get', `key ${key}`)(data)
    return Bluebird.resolve(data)
  }
  sendToSave(data: Data) {
    this.data = { ...this.data, ...data }
    this.emitter.emit('write', data)
  }
  set(key: string, val: any): Promise<void> {
    this.sendToSave({ [key]: val })
    log('set', `key ${key}`)(val)
    return Bluebird.resolve()
  }

  remove(...keys: string[]): Promise<void> {
    const saved = fromPairs(keys.map(key => [key, void 0]))
    log`remove`(keys)
    this.sendToSave(saved)
    return Bluebird.resolve()
  }

  clear(): Promise<void> {
    this.data = {}
    this.sendToSave(accInit)
    log`clear`('ok')
    return Bluebird.resolve()
  }
}

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

async function save(filepath: string, data: Data) {
  try {
    await outputJson(filepath, data, { spaces: 2 })
  } catch (error) {
    log`save failure`(error.message)
  }
}

export { JsonStorage as Storage }

export default JsonStorage
