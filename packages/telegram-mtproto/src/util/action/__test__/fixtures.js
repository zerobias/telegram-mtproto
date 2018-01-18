//@flow

import {createStore, applyMiddleware, type Middleware, type Store, type Reducer} from 'redux'
import {actionMiddleware, type Action, action, AsyncAction} from '..'
// import {normalizeActions, tryAddUid} from '../../../state/middleware'

export const fooAction = (): Action<{foo: 'bar'}> => action(
  'action'
)

export function delay<A>(data: A, time: number = 500): Promise<A> {
  return new Promise(rs => setTimeout(rs, time, data))
}

export const fooAsyncAction = (): AsyncAction<{foo: 'bar'}, 'bar'> => {
  const action = new AsyncAction('async-action')
  action.serve(({foo}: {foo: 'bar'}) => delay(foo))
  return action
}

function genericRootReducer<T>(actionSpy): Reducer<T> {
  return (state: T, action) => {
    actionSpy(action)
    return state
  }
}

export function fooStore(
  actionSpy: * = jest.fn(),
  rootReducer: Reducer<*> = genericRootReducer(actionSpy)
) {
  const state = {foo: 'bar'}
  // const addUid: Middleware<typeof state> = (tryAddUid/*:::any*/)
  const actionMid: Middleware<typeof state> = (actionMiddleware()/*:::any*/)

  const store: Store<typeof state> = createStore(
    rootReducer,
    state,
    applyMiddleware(
      // normalizeActions({ meta: {} }),
      // addUid,
      actionMid
    )
  )
  return store
}

export function getSend<S>(store: Store<S>) {
  const send: (<T>(x: T) => T) = (store.dispatch: any)
  return send
}

