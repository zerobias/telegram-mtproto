//@flow

import Promise from 'bluebird'

const cancelToken = Symbol('cancel token')

const timeoutRefs = new WeakSet

const pause = (delay: number): Promise<void> => new Promise(r => setTimeout(r, delay))

export const smartTimeout = (fn, delay = 0, ...args) => {
  const newToken = Symbol('cancel id')
  const checkRun = () => {
    if (timeoutRefs.has(newToken)) {
      timeoutRefs.delete(newToken)
      return fn(...args)
    } else return false
  }
  const promise = pause(delay).then(checkRun)
  promise[cancelToken] = newToken
  return promise
}

smartTimeout.cancel = promise => {
  if (!promise || !promise[cancelToken]) return false
  const token = promise[cancelToken]
  return timeoutRefs.has(token)
    ? timeoutRefs.delete(token)
    : false
}

export const immediate = (fn, ...args) =>
  Promise
    .resolve()
    .then(() => fn(...args))


export const delayedCall =
  <T, Args>(fn: (...args: Args[]) => T, delay = 0, ...args: Args[]) =>
    pause(delay)
      .then(() => fn(...args))

smartTimeout.immediate = immediate
smartTimeout.promise = delayedCall

export default smartTimeout