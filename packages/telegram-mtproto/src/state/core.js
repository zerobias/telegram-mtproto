//@flow
import { type Stream } from 'most'
import { async } from 'most-subject'
import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
import { composeWithDevTools } from 'remote-redux-devtools'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

import { type State } from './index.h'
import rootReducer from './reducer'
import rootEpic from './epic'
import { skipEmptyMiddleware, batch, normalizeActions } from './middleware'

let composeEnhancers = compose

// if (isNode === false && typeof window === 'object')
//   composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
if (process.env.NODE_ENV !== 'test')
  composeEnhancers = composeWithDevTools({
    realtime: true,
    hostname: 'localhost',
    port    : 8000,
    maxAge  : 200
  })

function configureStore(rootReducer: *, initialState: *) {
  const epicMiddleware = createEpicMiddleware(rootEpic)
  const enhancers = composeEnhancers(
    applyMiddleware(
      normalizeActions({ meta: {} }),
      batch({
        networker: [
          'sent add',
          'sent delete',
          'pending add',
        ]
      }),
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

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}

const rootSignal: Subject<State> = async()
export const root: Stream<State> = rootSignal.multicast()

store.subscribe(
  () => rootSignal.next(store.getState())
)

export default store

export const dispatch = store.dispatch
