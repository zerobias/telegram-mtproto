//@flow

import { combineReducers } from 'redux'

import List from './immutable-list'

export function indexedReducer<Meta, Id: number | string>(
  metaIndexGetter: (meta: Meta) => Id,
  metaChecker: (meta: mixed) => boolean
) {
  return function(handlers: mixed) {
    const singleReducer = typeof handlers === 'function'
      ? handlers
      : combineReducers(handlers)
    const wrapHandler = action => val => singleReducer(val, action)
    return function reducer(state: List<any, Id> = List.empty(), action: {
      type: string,
      payload: mixed,
      meta: Meta
    }) {
      const meta = action.meta
      if (!metaChecker(meta))
        return state
      const index = metaIndexGetter(meta)
      const subState: List<any, Id> = state.has(index)
        ? state
        : state.set(index, {})
      const newState: List<any, Id> = subState.update(index, wrapHandler(action))
      return newState
    }
  }
}

export function indexed<Id: number | string, Name: string>(metaName: Name) {
  function metaChecker(meta: mixed): boolean %checks {
    return typeof meta === 'object'
      && meta != null
      && meta._ === metaName
  }
  function metaIndexGetter(meta: { _: Name, id: Id }): Id {
    return meta.id
  }
  return indexedReducer(metaIndexGetter, metaChecker)
}


