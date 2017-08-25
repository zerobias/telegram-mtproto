//@flow

import Bluebird from 'bluebird'

const cancelToken = Symbol('cancel token')

const timeoutRefs = new WeakSet

export const pause = (delay: number): Promise<void> => new Bluebird(r => setTimeout(r, delay))

export function smartTimeout<T, /*::+*/A, /*::+*/Args: Array<A>>(
  fn: (...args: Args) => T,
  delay?: number = 0,
  ...args: Args
) {
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

const immediateRun = (function() {
  if (typeof setImmediate === 'function')
    return setImmediate
  return function(escaped, arg1) {
    setTimeout(escaped, 0, arg1)
  }
})()

function runner({ rs, rj, fn, args }) {
  const result = fn.apply(fn, args)
  if (result != null && typeof result.then === 'function')
    result.then(rs, rj)
  else
    rs(result)
}

function resolveTick(fn, args) {
  return function resolveInner(rs, rj){
    immediateRun(runner, { rs, rj, fn, args })
  }
}

export function immediate<O>(
  fn: (...args: Array<any>) => O,
  ...args: Array<any>
): Promise<O> {
  return new Bluebird(resolveTick(fn, args))
}

export function immediateWrap<T, A>(fn: (arg: A) => T): (arg: A) => Promise<T> {
  return (arg: A): Promise<T> => new Bluebird(resolveTick(fn, [arg]))
}

smartTimeout.cancel = cancel

export default smartTimeout