const cancelToken = Symbol('cancel token')

const timeoutRefs = new WeakSet

const pause = delay => new Promise(r => setTimeout(r, delay))

export const smartTimeout = (fn, delay, ...args) => {
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

smartTimeout.promise = (fn, delay = 0, ...args) => pause(delay)
  .then(() => fn(...args))

export default smartTimeout