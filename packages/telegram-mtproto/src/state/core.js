//@flow
import { type Stream, from } from 'most'
// import { async } from 'most-subject'
import isNode from 'detect-node'
import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

import { type State } from './index.h'
import rootReducer from './reducer'
import rootEpic from './epic'
import { skipEmptyMiddleware, normalizeActions, extendActions } from './middleware'
import { emitState, onDispatch } from './portal'

let composeEnhancers = compose

if (!__DEV__) {
  if (isNode === false && typeof window === 'object')
    composeEnhancers =
      //eslint-disable-next-line
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
}

if (__DEV__) {
  composeEnhancers = require('remote-redux-devtools').composeWithDevTools({
    realtime             : true,
    hostname             : 'localhost',
    port                 : 8000,
    maxAge               : 200,
    suppressConnectErrors: true,
  })

  process.on('unhandledRejection', val => {
    console.log(val)
    console.trace('on')
  })
}

function configureStore(rootReducer: *, initialState: *) {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const enhancers = composeEnhancers(
    applyMiddleware(
      normalizeActions({ meta: {} }),
      // batch({
      //   networker: [
      //     'sent add',
      //     'sent delete',
      //     'pending add',
      //   ]
      // }),
      skipEmptyMiddleware,
      extendActions,
      // debounceMiddleware,
      epicMiddleware
    )
  )

  //$FlowIssue
  const store = createStore(
    rootReducer,
    initialState,
    enhancers)

  return store
}

const store = configureStore(rootReducer, {})

onDispatch(store.dispatch)

const rootStream: Stream<State> = from(store).multicast()

rootStream.observe(emitState)

export default store

declare var __DEV__: boolean
