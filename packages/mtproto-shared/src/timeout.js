//@flow

import Promise from 'bluebird'

const cancelToken = Symbol('cancel token')

const timeoutRefs = new WeakSet

export const pause = (delay: number): Bluebird$Promise<void> => new Promise(r => setTimeout(r, delay))

export const smartTimeout = <T, +A, +Args: Array<A>>(fn: (...args: Args) => T, delay?: number = 0, ...args: Args) => {
  const newToken = Symbol('cancel id')
  const checkRun = () => {
    if (timeoutRefs.has(newToken)) {
      timeoutRefs.delete(newToken)
      return fn(...args)
    } else return false
  }
  const promise = pause(delay).then(checkRun)
  //$FlowIssue
  promise[cancelToken] = newToken
  return promise
}

const cancel = promise => {
  if (!promise || !promise[cancelToken]) return false
  const token = promise[cancelToken]
  return timeoutRefs.has(token)
    ? timeoutRefs.delete(token)
    : false
}

export const immediate = <T, +A, +Args: Array<A>>(fn: (...args: Args) => T, ...args: Args): Promise<T> =>
  Promise
    .resolve()
    .then(() => fn(...args))

export const immediateWrap =
  <+T, +A, +Args: Array<A>>(fn: (...args: Args) => T) =>
    (...args: Args): Promise<T> =>
      Promise
        .resolve()
        .then(() => fn(...args))

export const delayedCall =
  <T, +A, +Args: Array<A>>(fn: (...args: Args) => T, delay?: number = 0, ...args: Args) =>
    pause(delay)
      .then(() => fn(...args))

smartTimeout.immediate = immediate
smartTimeout.promise = delayedCall
smartTimeout.cancel = cancel

export default smartTimeout