//@flow

import {
  dissoc,
  without,
  filter,
} from 'ramda'

// import { Just, Nothing, Maybe } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { Just, Nothing } = Maybe

export class KeyStorage {
  keyMap: { [dc: string]: number[] }
  ids: number[]
  get length(): number {
    return this.ids.length
  }
  constructor(keyMap: { [dc: string]: number[] }, ids: number[]) {
    Object.defineProperties(this, {
      keyMap: {
        value: keyMap
      },
      ids: {
        value: ids,
      }
    })
  }
  has(dc: number | string) {
    if (!isFinite(dc)) return false
    return this.ids.indexOf(parseInt(dc, 10)) > -1
  }
  get(dc: number | string) {
    if (!this.has(dc)) return false
    return this.keyMap[String(dc)]
  }
  getMaybe(dc: number | string): Maybe<number[]> {
    if (!this.has(dc)) return Nothing()
    const result = this.keyMap[String(dc)]
    if (Array.isArray(result) && result.length > 0) {
      return Just(result)
    }
    return Nothing()
  }
  set(dc: number | string, value: number[]) {
    if (!isFinite(dc)) return this
    const dcN = parseInt(dc, 10)
    return new KeyStorage({
      ...this.keyMap,
      [String(dc)]: value,
    }, [
      ...new Set([...this.ids, dcN])
    ])
  }
  remove(dc: number | string) {
    if (!this.has(dc)) return this
    const dcN = parseInt(dc, 10)
    return new KeyStorage(
      dissoc(String(dc), this.keyMap),
      without([dcN], this.ids)
    )
  }
  merge(obj: { [dc: any]: number[] | false }) {
    if (__DEV__)
      console.warn(obj)
    const rawResult = { ...this.keyMap, ...obj }
    const result = filter(e => Array.isArray(e), rawResult)
    return new KeyStorage(
      result,
      numberKeys(result)
    )
  }
  toValue() {
    return this.keyMap
  }
  toJSON() {
    return this.toValue()
  }

  static of(keyMap?: { [dc: any]: number[] }) {
    let fullKeyMap = keyMap
    if (!fullKeyMap) {
      const emptyKeyMap: any = {}
      fullKeyMap = emptyKeyMap
    }
    const ids = numberKeys(fullKeyMap)
    return new KeyStorage(fullKeyMap, ids)
  }
}

export default function of(keyMap?: { [dc: any]: number[] }) {
  let fullKeyMap = keyMap
  if (!fullKeyMap) {
    const emptyKeyMap: any = {}
    fullKeyMap = emptyKeyMap
  }
  const ids = numberKeys(fullKeyMap)
  return new KeyStorage(fullKeyMap, ids)
}


const numberKeys = obj => Object
  .keys(obj)
  .filter(isFinite)
  .map(e => parseInt(e, 10))
