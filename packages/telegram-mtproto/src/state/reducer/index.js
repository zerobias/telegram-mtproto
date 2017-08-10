//@flow

/* eslint-disable object-shorthand */

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { append } from 'ramda'

import { type MessageHistory, type OnRequestDone } from '../index.h'
import { MAIN, NET, API, type NetIncomingData, type InitType } from 'Action'

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
  [API.REQUEST.DONE]: (state: MessageHistory[], { normalized }: OnRequestDone) =>
    state.concat(normalized.map(msg => ({
      id       : msg.id,
      seq      : msg.seq,
      direction: 'in',
      message  : msg,
    }))),
  //$FlowIssue
  [NET.SEND]: (state: MessageHistory[], payload) =>
    append({
      id       : payload.message.msg_id,
      seq      : payload.message.seq_no,
      direction: 'out',
      message  : payload.message,
    }, state),
}, [])

const homeDc = createReducer({
  //$FlowIssue
  [MAIN.DC_DETECTED]: (state: number, pay: { newDC: number }) => typeof pay === 'number'
    ? pay
    : pay.newDC,
  //$FlowIssue
  [MAIN.DC_CHANGED] : (state: number, { newDC }: { newDC: number }) => newDC,
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

// const Computed

export default mainReducer
