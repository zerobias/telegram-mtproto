//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { uniq, without, append, assoc, dissoc } from 'ramda'

import { NETWORKER_STATE, AUTH, NET, API } from '../action'
import { type TaskEndData } from '../epic/task'
import List from '../../util/immutable-list'
import { NetMessage } from '../../service/networker/net-message'
import { convertToUint8Array, convertToArrayBuffer, sha1BytesSync } from '../../bin'
import { indexed } from '../../util/indexed-reducer'


const requestMap = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.SENT.ADD]: (state: {[key: string]: string}, payload: NetMessage) =>
    typeof payload.requestID === 'string'
      ? assoc(payload.msg_id, payload.requestID, state)
      : state,
  //$ FlowIssue
  // [API.DONE_REQUEST]: (state: {[key: string]: string}, { messages }: TaskEndData) =>
  //   messages.reduce((acc: {[key: string]: string}, val) => {
  //     const id = val.merge().ids.req
  //     const field = acc[id]
  //     if (field != null) {
  //       return dissoc(id, acc)
  //     }
  //     return acc
  //   }, state)
}, {})

const resend = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.RESEND.ADD]: (state: string[], payload: string[]) =>
    uniq([...state, ...payload]),
  //$FlowIssue
  [NETWORKER_STATE.RESEND.DEL]: (state: string[], payload: string[]) =>
    without(payload, state),
}, [])

const sent = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.SENT.ADD]: (state: List<NetMessage, string>, payload: NetMessage) =>
    state.set(payload.uid, payload),
  //$FlowIssue
  [NETWORKER_STATE.SENT.DEL]: (state: List<NetMessage, string>, payload: NetMessage[]) =>
    payload.reduce((acc, val) => acc.delete(val.uid), state),
}, List.empty())

const pending = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.PENDING.ADD]: (state: string[], payload: string[]) =>
    uniq([...state, ...payload]),
  //$FlowIssue
  [NETWORKER_STATE.PENDING.DEL]: (state: string[], payload: string[]) =>
    without(payload, state),
}, [])

const authKey = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY]: (state: number[], payload: number[]) => payload,
}, [])

const authKeyUint8 = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY]: (state: Uint8Array, payload: number[]) => convertToUint8Array(payload),
}, new Uint8Array([]))

const authKeyBuffer = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY]: (state: ArrayBuffer, payload: number[]) => convertToArrayBuffer(payload),
}, new ArrayBuffer(0))

const authKeyID = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY]: (state: number[], payload: number[]) => sha1BytesSync(payload).slice(-8),
}, [])

const authSubKey = combineReducers({
  authKeyUint8,
  authKeyBuffer,
  authKeyID,
})

const salt = createReducer({
  //$FlowIssue
  [AUTH.SET_SERVER_SALT]: (state: number[], payload: number[]) => payload,
}, [])

const session = createReducer({
  //$FlowIssue
  [AUTH.SET_SESSION_ID]: (state: number[], payload: number[]) => payload,
}, [])

const sessionHistory = createReducer({
  //$FlowIssue
  [AUTH.SET_SESSION_ID]: (state: number[][], payload: number[]) => append(payload, state),
}, [])

const dc = createReducer({
  //$FlowIssue
  [NET.SEND]: (state: string, payload): string =>
    payload.thread.threadID
}, '')


const connectionInited = createReducer({

}, false)

const seq = createReducer({

}, 1)

const reducer = indexed('networker')({
  seq,
  connectionInited,
  dc,
  resend,
  sent,
  pending,
  authKey,
  authSubKey,
  salt,
  session,
  sessionHistory,
  requestMap,
})

export default reducer
