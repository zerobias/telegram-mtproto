//@flow

import Bluebird from 'bluebird'

const cancelToken = Symbol('cancel token')

const timeoutRefs = new WeakSet

export const pause = (delay: number): Promise<void> => new Bluebird(r => setTimeout(r, delay))

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
  Bluebird
    .resolve()
    .then(() => fn(...args))

export function immediateWrap<T, A>(fn: (arg: A) => T): (arg: A) => Promise<T> {
  return (arg: A): Promise<T> => Bluebird.resolve().then(() => fn(arg))
}

smartTimeout.immediate = immediate
smartTimeout.cancel = cancel

export default smartTimeout