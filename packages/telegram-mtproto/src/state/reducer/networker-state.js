//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { uniq, without, append } from 'ramda'

import { NETWORKER_STATE, AUTH } from '../action'
import List from '../../util/immutable-list'
import { NetMessage } from '../../service/networker/net-message'
import { convertToUint8Array, convertToArrayBuffer, sha1BytesSync } from '../../bin'

const resend = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.RESEND.ADD.action]: (state: string[], payload: string[]) =>
    uniq([...state, ...payload]),
  //$FlowIssue
  [NETWORKER_STATE.RESEND.DEL.action]: (state: string[], payload: string[]) =>
    without(payload, state),
}, [])

const sent = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.SENT.ADD.action]: (state: List<NetMessage, string>, payload: NetMessage) =>
    state.set(payload.uid, payload),
  //$FlowIssue
  [NETWORKER_STATE.SENT.DEL.action]: (state: List<NetMessage, string>, payload: NetMessage[]) =>
    payload.reduce((acc, val) => acc.delete(val.uid), state),
}, List.empty())

const pending = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.PENDING.ADD.action]: (state: string[], payload: string[]) =>
    uniq([...state, ...payload]),
  //$FlowIssue
  [NETWORKER_STATE.PENDING.DEL.action]: (state: string[], payload: string[]) =>
    without(payload, state),
}, [])

const authKey = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY.action]: (state: number[], payload: number[]) => payload,
}, [])

const authKeyUint8 = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY.action]: (state: Uint8Array, payload: number[]) => convertToUint8Array(payload),
}, new Uint8Array([]))

const authKeyBuffer = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY.action]: (state: ArrayBuffer, payload: number[]) => convertToArrayBuffer(payload),
}, new ArrayBuffer(0))

const authKeyID = createReducer({
  //$FlowIssue
  [AUTH.SET_AUTH_KEY.action]: (state: number[], payload: number[]) => sha1BytesSync(payload).slice(-8),
}, [])

const authSubKey = combineReducers({
  authKeyUint8,
  authKeyBuffer,
  authKeyID,
})

const salt = createReducer({
  //$FlowIssue
  [AUTH.SET_SERVER_SALT.action]: (state: number[], payload: number[]) => payload,
}, [])

const session = createReducer({
  //$FlowIssue
  [AUTH.SET_SESSION_ID.action]: (state: number[], payload: number[]) => payload,
}, [])

const sessionHistory = createReducer({
  //$FlowIssue
  [AUTH.SET_SESSION_ID.action]: (state: number[][], payload: number[]) => append(payload, state),
}, [])

const reducer = combineReducers({
  resend,
  sent,
  pending,
  authKey,
  authSubKey,
  salt,
  session,
  sessionHistory,
})

export default reducer
