//@flow

import { append, without, contains, into } from 'ramda'
// import { Maybe, Just, Nothing } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { Just, Nothing } = Maybe

import { Tuple, TupleT } from './tuple'


export class KeyValue<Key, Val> {
  pairs: Array<Tuple<Key, Val>>
  values: Array<Val>
  keys: Array<Key>
  length: number
  constructor(pairs: Array<Tuple<Key, Val>>) {
    this.pairs /*::; const c */ = pairs
    this.length /*::; const l */ = pairs.length
  }
  get keys(): Array<Key> {
    return this.pairs.map(pair => pair.fst())
  }
  get values(): Array<Val> {
    return this.pairs.map(pair => pair.snd())
  }
  toValue() {
    return this.pairs.map(e => e.toValue())
  }
  inspect() {
    return this.toJSON()
  }
  toJSON() {
    if (this.length === 0) return 'empty'
    const pairs = this.pairs.map(e => e.toValue())
    if (String(this.keys[0]) === '[object Object]')
      return pairs
    return into({}, e => e, pairs)
  }
  hasKey(key: Key): boolean {
    return contains(key, this.keys)
  }
  hasValue(value: Val): boolean {
    return contains(value, this.values)
  }
  maybeGetK(key: Key): Maybe<Tuple<Key, Val>> {
    if (!this.hasKey(key)) return Nothing()
    return Just(unsafeGetK(this.pairs, this.keys, key))
  }
  maybeGetV(value: Val): Maybe<Tuple<Key, Val>> {
    if (!this.hasValue(value)) return Nothing()
    return Just(unsafeGetV(this.pairs, this.values, value))
  }
  push(list: [Key, Val][]): KeyValue<Key, Val> {
    const pairs = TupleT.fromArray(list)
    const result = pairs.reduce(
      (acc, val) => this.pairs.some(x => x.eqFirst(val))
        ? acc
        : append(val, acc)
      ,
      []
    )
    return new KeyValue(this.pairs.concat(result))
  }
  removeK(key: Key): KeyValue<Key, Val> {
    if (this.hasKey(key))
      return new KeyValue(without([
        unsafeGetK(this.pairs, this.keys, key)
      ], this.pairs))
    return this
  }
  removeV(value: Val): KeyValue<Key, Val> {
    if (this.hasValue(value))
      return new KeyValue(without([
        unsafeGetV(this.pairs, this.values, value)
      ], this.pairs))
    return this
  }
  extend<Valʹ>(fn: (x: Tuple<Key, Val>) => Valʹ): KeyValue<Key, Valʹ> {
    const extend = (tuple: Tuple<Key, Val>): Tuple<Key, Valʹ> => tuple.extend(fn)
    const pairs: Array<Tuple<Key, Valʹ>> = this.pairs.map(extend)
    return new KeyValue( pairs )
  }
  static empty<+Keyʹ, +Valʹ>(): KeyValue<Keyʹ, Valʹ> {
    return new KeyValue([])
  }
  static of<Keyʹ, Valʹ>(pairs: Array<Tuple<Keyʹ, Valʹ>>): KeyValue<Keyʹ, Valʹ> {
    return new KeyValue(pairs)
  }
}


function unsafeGetK<Key, Val>(
  pairs: $ReadOnlyArray<Tuple<Key, Val>>,
  keys: $ReadOnlyArray<Key>,
  key: Key
): Tuple<Key, Val> {
  return pairs[keys.indexOf(key)]
}
function unsafeGetV<Key, Val>(
  pairs: $ReadOnlyArray<Tuple<Key, Val>>,
  values: $ReadOnlyArray<Val>,
  value: Val
): Tuple<Key, Val> {
  return pairs[values.indexOf(value)]
}
