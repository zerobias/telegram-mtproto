import Promise from 'bluebird'
/**
 * Defered promise like in Q and $q
 *
 * @returns {{ resolve: (res: any) => void, reject: (res: any) => void, promise: Promise<{}> }}
 */
export const blueDefer = () => {
  let resolve, reject
  const promise = new Promise((rs, rj) => {
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