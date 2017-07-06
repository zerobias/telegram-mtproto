//@flow

import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
import { composeWithDevTools } from 'remote-redux-devtools'

import rootReducer from './reducer'
import rootEpic from './epic'


const composeEnhancers = composeWithDevTools({ realtime: true, hostname: 'localhost', port: 8000 })
function configureStore(rootReducer: *, initialState: *) {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const enhancers = composeEnhancers(
    applyMiddleware(
      epicMiddleware
    )
  )

  const store = createStore(
    rootReducer,
    initialState,
    enhancers)

  return store
}

const store = configureStore(rootReducer, {})

export default store
setTimeout(
  () => store.dispatch({ type: '[2] test', payload: 'ok' }), 5e3)

export const dispatch = store.dispatch
