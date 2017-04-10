// import Promise from 'bluebird'

import clone from 'ramda/src/clone'

export const ValueStore = () => {
  let val = null

  return {
    get: () => clone(val),
    set: newVal => val = newVal
  }
}

export const ValueStoreMap = () => {
  const val = new Map

  return {
    get: key => clone(val.get(key)),
    set: (key, newVal) => val.set(key, newVal)
  }
}

export const TimeOffset = ValueStore()
