//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { MAIN } from '../action'

const active = createReducer({
  //$FlowIssue
  [MAIN.ACTIVATED.action]: () => true,
}, false)

const uid = createReducer({
  //$FlowIssue
  [MAIN.SWITCH_ON.action]: (state, payload: string) => payload,
}, ' ')

const mainReducer = combineReducers({
  _: () => true,
  active,
  uid,
})

export default mainReducer
