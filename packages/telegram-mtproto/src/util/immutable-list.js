//@flow

import { dissoc, without, equals } from 'ramda'

//$FlowIssue
interface ImmuList<T, Id: string | number> {
  ids: Id[],
  $SymbolIterator: Iterator<[Id, T]>,
  [id: Id]: T,
}

export default class List<T, Id: string | number> implements ImmuList<T, Id> {
  ids: Id[]
  length: number
  idType: 'string' | 'number'
  props: { [id: Id]: Property }
  $SymbolIterator: Iterator<[Id, T]>
  constructor(ids: Id[], props: { [id: Id]: Property }) {
    this.length = ids.length
    this.ids = ids
    let idType
    if (ids.length === 0)
      idType = 'string'
    else
      idType = typeof ids[0]
    //$FlowIssue
    Object.defineProperty(this, 'idType', {
      value     : idType,
      enumerable: false
    })
    Object.defineProperty(this, 'props', {
      value     : props,
      enumerable: false
    })
    Object.defineProperties(this, props)
  }
  //$FlowIssue
  * [Symbol.iterator]() {
    for (const id of this.ids)
      yield ([id, this[id]])
  }
  has(id: Id): boolean {
    return this.ids.indexOf(id) !== -1
  }
  get(id: Id): T {
    //$FlowIssue
    return this[id]
  }
  set(id: Id, value: T): List<T, Id> {
    const already = this.has(id)
    let ids
    if (already) {
      const current = this.get(id)
      if (value === current || equals(current, value))
        return this
      ids = this.ids
    } else
      ids = [...this.ids, id]
    const props: { [id: Id]: Property } = { ...this.props, [id]: makeProperty(value) }
    return new List(ids, props)
  }
  delete(id: Id): List<T, Id> {
    if (this.has(id) === false)
      return this
    const ids: Id[] = without([id], this.ids)
    const props: { [id: Id]: Property } = dissoc(id, this.props)
    return new List(ids, props)
  }
  update(id: Id, fn: (val: T) => T): List<T, Id> {
    const val = this.get(id)
    const updated = fn(val)
    const result: List<T, Id> = this.set(id, updated)
    return result
  }
  map<S>(fn: (val: T) => S): List<S, Id> {
    const ids = this.ids
    const props: { [id: Id]: Property } = {}
    for (const id of ids) {
      const val: T = this.get(id)
      const mapped: S = fn(val)
      props[id] = makeProperty(mapped)
    }
    return new List(ids, props)
  }
  reduce<B>(fn: (acc: B, val: T) => B, base: B): B {
    //$FlowIssue
    const result = this.ids.reduce((acc: B, val: Id) => (fn(acc, this[val])), base)
    return result
  }
  static empty<S, Key: string | number>(): List<S, Key> {
    return new List([], {})
  }
  static of<S, Key: string | number>(
    list: S[],
    mapper?: (val: S, i: number) => Key): List<S, Key> {
    const mapping = typeof mapper === 'function'
      ? mapper
      : (_, i): $FlowIssue => i
    const ids: Key[] = list.map(mapping)
    const props: { [id: Key]: Property } = {}
    let i = 0
    for (const key of ids) {
      const val = list[i++]
      props[key] = makeProperty(val)
    }
    return new List(ids, props)
  }
  toValue() {
    switch (this.idType) {
      case 'number': return toValueArr(this.ids, this)
      case 'string': return this
      default: return this
    }
  }
  toJSON() {
    return this.toValue()
  }
}

type Property = {
  value: any,
  enumerable: true,
  configurable: false,
  writable: false,
}

const makeProperty = (val: any): Property => ({
  value       : val,
  enumerable  : true,
  configurable: false,
  writable    : false,
})

//$FlowIssue
function toValueArr<T>(ids: number[], values: *): T[] {
  const result = new Array(ids.length)
  for (const id of ids)
    result[id] = values[id]
  return result
}

