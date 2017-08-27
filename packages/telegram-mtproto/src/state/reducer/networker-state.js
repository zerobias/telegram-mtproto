//@flow

/* eslint-disable object-shorthand */

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { uniq, without, append, omit, fromPairs } from 'ramda'

import { NETWORKER_STATE, AUTH, NET, API, MAIN } from 'Action'
import List from 'Util/immutable-list'
import { NetMessage } from '../../service/networker/net-message'
import { convertToUint8Array, convertToArrayBuffer, sha1BytesSync } from '../../bin'
import { indexed } from '../../util/indexed-reducer'
import { type OnRequestDone } from '../index.h'
import Status, { statuses, type ModuleStatus } from '../../status'

class BatchList {
  deleted: string[]
  inserted: string[]
  constructor(list: string[], deleted: string[] = []) {
    this.inserted = list
    this.deleted = deleted
  }
  insert(list: string[]) {
    const toInsert = without(this.deleted, list)
    const toDeleted = without(list, this.deleted)
    const joined = uniq([...this.inserted, ...toInsert])
    return new BatchList(joined, toDeleted)
  }
  remove(list: string[]) {
    const toInsert = without(list, this.inserted)
    const toDeleted = without(this.inserted, list)
    const joined = uniq([...this.deleted, ...toDeleted])
    return new BatchList(toInsert, joined)
  }
  static of(list: string[]) {
    return new BatchList(list)
  }
  static empty() {
    return BatchList.of([])
  }
}

const status = createReducer({
  //$off
  [NETWORKER_STATE.SET_STATUS]: (state: ModuleStatus, payload: ModuleStatus) => payload,
  //$off
  [MAIN.DC_DETECTED]          : (state: ModuleStatus) => Status.max(state, statuses.loaded),
  //$off
  [MAIN.AUTH_UNREG]           : () => statuses.init,
}, statuses.init)

const requestMap = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.SENT.ADD]: (state: {[key: string]: string}, payload: NetMessage[]) => {
    const pairs: [string, NetMessage][] = payload
      .filter(message => typeof message.requestID === 'string')
      .map(message => [message.requestID/*:: || '' */, message])

    const obj = fromPairs(pairs)
    return { ...state, ...obj }
  },
  //$FlowIssue
  [API.REQUEST.DONE]: (state: {[key: string]: string}, normalized: OnRequestDone) => {
    const ids = normalized
      .filter(msg => msg.flags.api && msg.api.resolved)
      .map(msg => msg.api.apiID)
    return omit(ids, state)
  }
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
  [NETWORKER_STATE.SENT.ADD]: (state: List<NetMessage, string>, payload: NetMessage[]) =>
    payload.reduce((st, value) => st.set(value.msg_id, value), state),
  //$FlowIssue
  [NETWORKER_STATE.SENT.DEL]: (state: List<NetMessage, string>, payload: NetMessage[]) =>
    payload.reduce((acc, val) => acc.delete(val.msg_id), state),
}, List.empty())

const pending = createReducer({
  //$FlowIssue
  [NETWORKER_STATE.PENDING.ADD]: (state: BatchList, payload: string[]) =>
    state.insert(payload),
  //$FlowIssue
  [NETWORKER_STATE.PENDING.DEL]: (state: BatchList, payload: string[]) =>
    state.remove(payload),
}, BatchList.empty())

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

const reducer = indexed('networker')({
  dc,
  resend,
  status,
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
