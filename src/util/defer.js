//@flow

import Bluebird from 'bluebird'

const createResolver = () => {

}

/**
 * Defered promise like in Q and $q
 */
export const blueDefer: () => $Shape<Bluebird.Defer> = () => {
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