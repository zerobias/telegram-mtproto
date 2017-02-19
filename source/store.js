import Promise from 'bluebird'

import { clone, merge, unnest,
  lensPath, unapply, pipe,
  set, split, chain, memoize,
  complement, is, isEmpty, either, reject, over,
  isNil, view, when, __, dissocPath, has, curry,
  objOf, prop, compose, lensProp, omit,
  flip, props } from 'ramda'

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

const flatArgs = unapply( unnest )
const splitter = chain(split('.'))
const rejecter = either(
  complement(
    is(String)),
  isEmpty)


const flatPath = memoize(pipe(
  flatArgs,
  splitter,
  reject(rejecter)))

const pipeWith = (ln, ctx) =>
  (...funcs) =>
    pipe(view(ln), ...funcs)(ctx)

export class SyncStorage {
  constructor(def = {}) {
    this.storage = def
  }
  set = val => this.storage = val
  fpSave = func => pipe( func, this.set )
  createOnNil = when(
    pipe(view(__, this.storage), isNil),
    this.fpSave( set(__, {}, this.storage) )
  )
  set save(val) {
    this.storage = merge(this.storage, val)
  }
  subtree = (...pathKeys) => {
    const args = flatPath(...pathKeys)
    const ln = lensPath(args)
    this.createOnNil(ln)
    //console.log(this.lensNil(ln))
    const pipeWithLn = pipeWith(ln, this.storage)
    const overSubtree = fn => this.fpSave( over(ln, fn ) )(this.storage)
    return {
      // has   : field => overSubtree( has ( field ) ),
      field: key => ({
        has     : () => pipeWithLn( has ( key ) ),
        view    : () => pipeWithLn( prop ( key ) ),
        set     : val => overSubtree( merge( objOf(key, val) ) ),
        pipeWith: (...funcs) => pipeWithLn( prop ( key ), ...funcs ),
        pipeOver: (...funcs) => this.fpSave(
          over(
            compose( ln, lensProp(key) ),
            pipe(...funcs)
          )
        )(this.storage),
        remove: () => overSubtree( omit([ key ]) )
      }),
      has    : key => pipeWithLn( has ( key ) ),
      view   : () => view(ln, this.storage),
      set    : this.fpSave( set(ln, __, this.storage) ),
      over   : overSubtree,
      remove : () => this.fpSave( dissocPath(args) )(this.storage),
      without: (...keys) => overSubtree( omit(keys) )
    }
  }
}

export const innerStore = new SyncStorage