//@flow
import Bluebird from 'bluebird'
import { parse, format } from 'path'
import {
  readJsonSync,
  outputJsonSync,
  pathExistsSync,
} from 'fs-extra'

// import { type AsyncStorage } from 'mtproto-shared'

// import Logger from 'mtproto-logger'
// const log = Logger`json-storage`

type Data = { [key: string]: any }

export class JsonStorage {
  file: string
  constructor(file: string, data?: Data) {
    this.file = normalizePath(file)
    if (!pathExistsSync(this.file) || !!data)
      outputJsonSync(this.file, data || {})
  }
  get(key: string): Promise<any> {
    return Bluebird.resolve(readJsonSync(this.file)[key])
  }

  set(key: string, val: any): Promise<void> {
    const data = readJsonSync(this.file)
    data[key] = val
    outputJsonSync(this.file, data)
    return Bluebird.resolve()
  }

  has(key: string): Promise<boolean> {
    return Bluebird.resolve(!!readJsonSync(this.file)[key])
  }

  remove(...keys: string[]): Promise<void> {
    const data = readJsonSync(this.file)
    for (const key of keys) {
      delete data[key]
    }
    outputJsonSync(this.file, data)
    return Bluebird.resolve()
  }
  clear(): Promise<void> {
    outputJsonSync(this.file, {})
    return Bluebird.resolve()
  }
}

function normalizePath(filepath: string) {
  const parsed = parse(filepath)
  if (parsed.ext !== '.json')
    return format({ ...parsed, ext: '.json' })
  return filepath
}

export { JsonStorage as Storage }

export default JsonStorage
