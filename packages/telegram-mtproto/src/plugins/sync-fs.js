//@flow

import { readJsonSync, writeJsonSync } from 'fs-extra'

export default class SyncFS {
  constructor(file: string) {
    this.file = file
  }
  get(key: string) {
    return Promise.resolve(readJsonSync(this.file)[key])
  }

  set(key: string, val: any) {
    const data = readJsonSync(this.file)
    data[key] = val
    writeJsonSync(this.file, data)
    return Promise.resolve()
  }

  has(key: string) {
    return Promise.resolve(!!readJsonSync(this.file)[key])
  }

  remove(...keys: string[]) {
    const data = readJsonSync(this.file)
    for (const key of keys) {
      delete data[key]
    }
    writeJsonSync(this.file, data)
    return Promise.resolve()
  }
  clear() {
    writeJsonSync(this.file, {})
    return Promise.resolve()
  }
}
