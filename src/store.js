import Promise from 'bluebird'

import { clone, unapply, pipe, omit, flip, props } from 'ramda'

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


const flatProps = pipe(flip(props), unapply)

export const AsyncStorage = () => {
  let store = {}

  const flatGet = flatProps(store)
  const set = obj => store = { ...store, ...obj }
  const remove = keys => store = omit(keys, store)
  const clr = () => store = {}
  return {
    get     : (...keys) => Promise.resolve(flatGet(...keys)),
    set     : obj => Promise.resolve(set(obj)),
    remove  : (...keys) => Promise.resolve(remove(keys)),
    clear   : () => Promise.resolve(clr()),
    noPrefix: () => ({}),
  }
}

export const PureStorage = AsyncStorage() /*{
  get     : (...keys) => new Promise(rs => ConfigStorage.get(keys, rs)),
  set     : obj => new Promise(rs => ConfigStorage.set(obj, rs)),
  remove  : (...keys) => new Promise(rs => ConfigStorage.remove(...keys, rs)),
  noPrefix: () => ConfigStorage.noPrefix(),
  clear   : () => new Promise(rs => ConfigStorage.clear(rs))
}*/
