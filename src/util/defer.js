//@flow

import Bluebird from 'bluebird'

export type Defer = $Shape<Bluebird.Defer>

/**
 * Defered promise like in Q and $q
 */
export const blueDefer: () => Defer = () => {
  let resolve, reject
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