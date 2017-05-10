//@flow

import Bluebird from 'bluebird'

// export type Defer = $Shape<Bluebird.Defer>

export type Defer = {
  resolve<T>(rs: T): void,
  reject<E>(rs: E): void,
  promise: Bluebird<*>
}

const filler: (value: *) => void = (value) => {
  throw new Error(`Filler must not be called!`)
}

/**
 * Defered promise like in Q and $q
 */
export const blueDefer = (): Defer => {
  let resolve = filler,
      reject = filler
  const promise = new Bluebird((rs, rj) => {
    resolve = rs
    reject = rj
  })
  return {
    resolve,
    reject,
    promise
  }
}

export default blueDefer
