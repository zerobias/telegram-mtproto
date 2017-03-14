import Promise from 'bluebird'

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
export const dcList = ValueStoreMap()

export const AsyncStorage = () => {
  const store = new Map

  const get = key => store.get(key)
  const set = (key, val) => store.set(key, val)
  const remove = keys => keys.map(e => store.delete(e))
  const clr = () => store.clear()
  return {
    get     : (key) => Promise.resolve(get(key)),
    set     : (key, val) => Promise.resolve(set(key, val)),
    remove  : (...keys) => Promise.resolve(remove(keys)),
    clear   : () => Promise.resolve(clr()),
    noPrefix: () => ({}),
    store
  }
}

export const PureStorage = AsyncStorage() /*{
  get     : (...keys) => new Promise(rs => ConfigStorage.get(keys, rs)),
  set     : obj => new Promise(rs => ConfigStorage.set(obj, rs)),
  remove  : (...keys) => new Promise(rs => ConfigStorage.remove(...keys, rs)),
  noPrefix: () => ConfigStorage.noPrefix(),
  clear   : () => new Promise(rs => ConfigStorage.clear(rs))
}*/
