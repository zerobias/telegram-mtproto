//@flow
import isNode from 'detect-node'
import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
// import { composeWithDevTools } from 'remote-redux-devtools'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

import rootReducer from './reducer'
import rootEpic from './epic'
import { rootSignal } from './signal'
import { skipEmptyMiddleware } from './middleware'

let composeEnhancers = compose

if (isNode === false && typeof window === 'object')
  composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// composeEnhancers = composeWithDevTools({
//   realtime: true,
//   hostname: 'localhost',
//   port    : 8000,
//   maxAge  : 200
// })
function configureStore(rootReducer: *, initialState: *) {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const enhancers = composeEnhancers(
    applyMiddleware(
      skipEmptyMiddleware,
      // debounceMiddleware,
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

store.subscribe(
  () => rootSignal.next(store.getState())
)

export default store

export const dispatch = store.dispatch
