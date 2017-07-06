//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { append } from 'ramda'

import { MAIN, NET } from '../action'

const active = createReducer({
  //$FlowIssue
  [MAIN.ACTIVATED.action]: () => true,
}, false)

const uid = createReducer({
  //$FlowIssue
  [MAIN.SWITCH_ON.action]: (state, payload: string) => payload,
}, ' ')

const messageHistory = createReducer({
  //$FlowIssue
  [NET.RECIEVE_RESPONSE.action]: (state: { id: string, seqNo: number }[], payload) =>
    append({
      id   : payload.data.messageID,
      seqNo: payload.data.seqNo }, state),
}, [])

const mainReducer = combineReducers({
  _: () => true,
  active,
  uid,
  messageHistory,
})

export default mainReducer
