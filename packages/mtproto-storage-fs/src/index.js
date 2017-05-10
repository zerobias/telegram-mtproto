//@flow

import Bluebird from 'bluebird'
import {
  readJson,
  outputJson,
  ensureFileSync,
  readJsonSync,
  outputJsonSync
} from 'fs-extra'
import { watch } from 'chokidar'

import type { AsyncStorage } from 'mtproto-shared'

import Logger from 'mtproto-logger'
const log = Logger`reactive-storage`

export class FileStorage implements AsyncStorage {
  filepath: string
  data: { [key: string]: * }
  allowRead: boolean = true
  readInterval: number = 2e3
  timeoutID: number = -Infinity

  constructor(filepath: string, data?: { [key: string]: * }) {
    this.filepath = filepath.substr(-5) === '.json'
      ? filepath
      : `${filepath}.json`
    if (data != null)
      this.data = data

    // process.on('beforeExit', () => {
    //   watcher.close()
    // })
    this.init()
  }
  init() { //TODO make async
    const data = ensureSync(this.filepath)
    if (!this.data)
      this.data = data
    const watcher = watch(this.filepath, {
      useFsEvents    : false,
      disableGlobbing: true,
      persistent     : false,
      atomic         : true,
    })
    watcher.on('change', async (stats: any) => {
      log('change')(stats)
      log('allowRead')(this.allowRead)
      if (this.allowRead) {
        const result = await readJson(this.filepath)
        this.data = result
      }
    })
  }
  allowReadNow = () => {
    this.allowRead = true
  }
  reReadProtect = () => {
    this.allowRead = false
    clearTimeout(this.timeoutID)
    this.timeoutID = setTimeout(this.allowReadNow, this.readInterval)
  }

  async save() {
    this.reReadProtect()
    await outputJson(this.filepath, this.data, { spaces: 2 })
    this.reReadProtect()
  }

  get(key: string) {
    const data = this.data[key]
    log('get', `key ${key}`)(data)
    return Bluebird.resolve(data)
  }

  async set(key: string, val: any): Promise<void> {
    this.data[key] = val
    log('set', `key ${key}`)(val)
    await this.save()
  }

  async remove(...keys: string[]): Promise<void> {
    const data = this.data
    for (const key of keys)
      delete data[key]
    log('remove')(keys)
    await this.save()
  }

  async clear() {
    this.data = {}
    log('clear')('ok')
    await this.save()
  }
}

function ensureSync(filepath: string) {
  ensureFileSync(filepath)
  let fileData = null
  try {
    fileData = readJsonSync(filepath)
  } catch (err) {
    log(`init`, `error`)(err)
  }
  if (fileData === null) {
    outputJsonSync(filepath, {})
    fileData = {}
  }
  return fileData
}

export { FileStorage as Storage }

export default FileStorage
