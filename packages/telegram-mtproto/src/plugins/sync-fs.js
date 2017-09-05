//@flow

import {
  readJsonSync,
  writeJsonSync,
} from 'fs-extra'

export default class SyncFS {
  file: string
  constructor(file: string) {
    this.file = file
  }
  get(key: string): Promise<any> {
    return Promise.resolve(readJsonSync(this.file)[key])
  }

  set(key: string, val: any): Promise<void> {
    const data = readJsonSync(this.file)
    data[key] = val
    writeJsonSync(this.file, data)
    return Promise.resolve()
  }

  has(key: string): Promise<boolean> {
    return Promise.resolve(!!readJsonSync(this.file)[key])
  }

  remove(...keys: string[]): Promise<void> {
    const data = readJsonSync(this.file)
    for (const key of keys) {
      delete data[key]
    }
    writeJsonSync(this.file, data)
    return Promise.resolve()
  }
  clear(): Promise<void> {
    writeJsonSync(this.file, {})
    return Promise.resolve()
  }
}
