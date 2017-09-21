const { createStore, applyMiddleware } = require('redux')

const { default: rootReducer } = require('../packages/telegram-mtproto/lib/state/reducer')

const composeEnhancers = require('remote-redux-devtools').composeWithDevTools({
  realtime             : true,
  hostname             : 'localhost',
  port                 : 8000,
  maxAge               : 600,
  suppressConnectErrors: true,
})

const enh = composeEnhancers(
  applyMiddleware()
)

const store = createStore(
  rootReducer,
  {},
  enh)

setInterval(() => store, 2e3)
