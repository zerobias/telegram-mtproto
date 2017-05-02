//@flow

import memoizee from 'memoizee'

type Memoize = <S>(fn: S, opts: ?Object) => S
export const memoize: Memoize = memoizee
const memoConfig = {
  length   : 1,
  primitive: true
}

export const makeMemoized = <S, T>(fn: (obj: S) => T): (obj: S) => T => memoize(fn, memoConfig)

export default makeMemoized
