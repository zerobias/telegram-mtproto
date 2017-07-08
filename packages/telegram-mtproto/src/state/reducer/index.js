//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { append, map } from 'ramda'

import { type MessageHistory } from '../index.h'
import { MAIN, NET } from '../action'
import List from '../../util/immutable-list'
import networker from './networker-state'

const active = createReducer({
  //$FlowIssue
  [MAIN.ACTIVATED]: () => true,
}, false)

const uid = createReducer({
  //$FlowIssue
  [MAIN.SWITCH_ON]: (state, payload: string) => payload,
}, ' ')

const messageHistory = createReducer({
  //$FlowIssue
  [NET.RECIEVE_RESPONSE]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.data.messageID,
      seqNo    : payload.data.seqNo,
      direction: 'in' }, state),
  //$FlowIssue
  [NET.SEND_REQUEST]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.message.msg_id,
      seqNo    : payload.message.seq_no,
      direction: 'out' }, state),
}, [])

const mainReducer = combineReducers({
  _: () => true,
  active,
  uid,
  messageHistory,
  networker,
})

export default mainReducer
