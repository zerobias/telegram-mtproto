//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { append } from 'ramda'

import { type MessageHistory } from '../index.h'
import { MAIN, NET } from '../action'
import List from '../../util/immutable-list'
import networker from './networker-state'

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
  [NET.RECIEVE_RESPONSE.action]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.data.messageID,
      seqNo    : payload.data.seqNo,
      direction: 'in' }, state),
  //$FlowIssue
  [NET.SEND_REQUEST.action]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.message.msg_id,
      seqNo    : payload.message.seq_no,
      direction: 'out' }, state),
}, [])

const dc = createReducer({
  //$FlowIssue
  [NET.SEND_REQUEST.action]: (state: List<{ id: string }, number>, payload) =>
    state.set(payload.thread.dcID, { id: payload.thread.threadID })
}, List.empty())

const mainReducer = combineReducers({
  _: () => true,
  active,
  uid,
  messageHistory,
  dc,
  networker,
})

export default mainReducer
