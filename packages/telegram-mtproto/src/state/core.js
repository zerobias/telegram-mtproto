//@flow
import { type Stream, from } from 'most'
// import { async } from 'most-subject'
import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-most'
// import { composeWithDevTools } from 'remote-redux-devtools'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

import Status, { type ModuleStatus } from '../status'
import { type State } from './index.h'
import rootReducer from './reducer'
import rootEpic from './epic'
import { batch, normalizeActions, extendActions } from './middleware'

let composeEnhancers = compose

// if (isNode === false && typeof window === 'object')
//   composeEnhancers =
//     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// if (process.env.NODE_ENV !== 'test')
// composeEnhancers = composeWithDevTools({
//   realtime: true,
//   hostname: 'localhost',
//   port    : 8000,
//   maxAge  : 200,
//   suppressConnectErrors: false,
// })

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
      // skipEmptyMiddleware,
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

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}
export const dispatch = store.dispatch

export const root: Stream<State> = from(store).multicast()

export default store

export function afterStatus(status: ModuleStatus) {
  return root
    .map(state => state.status)
    .map(current => Status.gte(current, status))
    .skipRepeats()
}
