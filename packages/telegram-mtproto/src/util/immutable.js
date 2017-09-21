//@flow

import { Map } from 'immutable'
import { Maybe } from 'apropos'

const { fromNullable } = Maybe

export function mapGet<K, V>(key: K, map: Map<K, V>): Maybe<V> {
  return fromNullable(map.get(key))
}
