//@flow

/* eslint-disable object-shorthand */

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { append } from 'ramda'

import { type MessageHistory } from '../index.h'
import { MAIN, NET, API, type NetIncomingData, type InitType } from 'Action'
import { type TaskEndData } from '../epic/task'

import networker from './networker-state'
import request from './request'
import status from './status'

const active = createReducer({
  //$FlowIssue
  [MAIN.ACTIVATED]: () => true,
}, false)

const uid = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: string, payload: InitType) => payload.uid,
}, ' ')

const invoke = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: $PropertyType<InitType, 'invoke'>, payload: InitType) => payload.invoke,
}, () => {})

const storageSet = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: $PropertyType<InitType, 'storageSet'>, payload: InitType) => payload.storageSet,
}, () => {})

const messageHistory = createReducer({
  //$FlowIssue
  [API.REQUEST.DONE]: (state: MessageHistory[], data: NetIncomingData & TaskEndData) => {
    // console.log(data)
    const { result, thread, messages, ...rest } = data
    // console.log(result)
    // console.log(rest)
    return append({
      messages,
      direction: 'in' }, state)
  },
  //$FlowIssue
  [NET.SEND]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.message.msg_id,
      seqNo    : payload.message.seq_no,
      direction: 'out' }, state),
}, [])

const homeDc = createReducer({
  //$FlowIssue
  [MAIN.DC_DETECTED]: (state: number, payload: number) => payload,
  //$FlowIssue
  [MAIN.DC_CHANGED] : (state: number, payload: number) => payload,
}, 2)

const mainReducer = combineReducers({
  status,
  invoke,
  storageSet,
  active,
  homeDc,
  uid,
  messageHistory,
  networker,
  request,
})

export default mainReducer
