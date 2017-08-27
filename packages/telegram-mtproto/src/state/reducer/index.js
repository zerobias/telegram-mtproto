//@flow

/* eslint-disable object-shorthand */

import { combineReducers, type Reducer } from 'redux'
import { createReducer } from 'redux-act'
import {
  append,
  contains,
  isEmpty,
  dissoc,
  assoc,
  without,
  filter,
  map,
  lens,
  over,
  chain,
  values,
  takeLast,
} from 'ramda'
import { of, Left, Right } from 'apropos'

import {
  type MessageHistory,
  type OnRequestDone,
  type State,
  type Client,
  type ClientList,
  type InitType,
  type OnSetStatus,
  type OnSeqSet,
  type OnAckAdd,
  type OnStorageImported,
} from '../index.h'
import {
  type Carrier,
} from '../carrier'
import { MAIN, NET, API, AUTH } from 'Action'
import keyStorage, { KeyStorage } from '../../util/key-storage'
import { convertToUint8Array, convertToArrayBuffer, sha1BytesSync, bytesToHex } from '../../bin'

import { guardedReducer } from '../helpers'
// import networker from './networker-state'
import request from './request'
import status from './status'
import { statuses } from '../../status'
import { netStatuses, type NetStatus } from '../../net-status'

import { type PUnitList } from '../../task/index.h'

const initial: any = {}

const active = createReducer({
  //$FlowIssue
  [MAIN.ACTIVATED]: () => true,
}, false)

const uid = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: string, payload: InitType) => payload.uid,
}, '')

const invoke = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: $PropertyType<InitType, 'invoke'>, payload: InitType) => payload.invoke,
}, () => {})

const storageSet = createReducer({
  //$FlowIssue
  [MAIN.INIT]           : (state: StorageSet, payload: InitType) => payload.storageSet,
  //$off
  [AUTH.SET_SERVER_SALT]: (state: StorageSet, payload: number[], { id }: { id: number }) => {
    state(`dc${id}_server_salt`, bytesToHex(payload))
    return state
  },
  //$off
  [AUTH.SET_AUTH_KEY]: (state: StorageSet, payload: number[], { id }: { id: number }) => {
    state(`dc${id}_auth_key`, bytesToHex(payload))
    return state
  },
}, () => Promise.resolve(void 0))

const storageRemove = createReducer({
  //$FlowIssue
  [MAIN.INIT]      : (state: StorageRemove, payload: InitType) => payload.storageRemove,
  //$off
  [MAIN.AUTH_UNREG]: (state: StorageRemove, payload: number) => {
    state(`dc${payload}_auth_key`, `dc${payload}_server_salt`)
    return state
  },
}, () => Promise.resolve(void 0))

const messageHistory = createReducer({
  //$ FlowIssue
  // [API.REQUEST.DONE]: (state: MessageHistory[], { normalized }: OnRequestDone) =>
  //   state.concat(normalized.map(msg => ({
  //     id       : msg.id,
  //     seq      : msg.seq,
  //     direction: 'in',
  //     message  : msg,
  //   }))),
  // //$ FlowIssue
  // [NET.SEND]: (state: MessageHistory[], payload) =>
  //   append({
  //     id       : payload.message.msg_id,
  //     seq      : payload.message.seq_no,
  //     direction: 'out',
  //     message  : payload.message,
  //   }, state),
}, [])

type AckMap = { [dc: number]: string[] }
type NetStatusMap = { [dc: number]: NetStatus }
type SeqMap = { [dc: number]: number }

const ackDefault: AckMap = initial
const pendingAck = createReducer({
  //$off
  [NET.ACK_ADD]: (state: AckMap, { dc, ack }: OnAckAdd): AckMap => {
    const dcAcks = state[dc] || []
    const updated = [...new Set([...dcAcks, ...ack])]
    return { ...state, [dc]: updated }
  },
  //$off
  [NET.ACK_DELETE]: (state: AckMap, { dc, ack }: OnAckAdd): AckMap => {
    const dcAcks = state[dc] || []
    const updated = without(ack, dcAcks)
    return { ...state, [dc]: updated }
  },
}, ackDefault)

// const guardedHomeDc = guardedReducer([
//   (_, payload) => payload.flags.homeDC
// ], (state: number, payload: Carrier) => payload.homeDC)

const homeDc = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: number, { home }: OnStorageImported) => home,
  //$off
  [MAIN.DC_DETECTED]     : (state: number, pay: { newDC: number }) => typeof pay === 'number'
    ? pay
    : pay.newDC,
  //$FlowIssue
  [MAIN.DC_CHANGED]: (state: number, { newDC }: { newDC: number }) => newDC,
}, 2)

const iNetStatus: NetStatusMap = initial
const iSeq: SeqMap = initial

const netStatus = createReducer({
  '[01] action carrier': (state: NetStatusMap, payload: PUnitList) => ({ ...state, ...payload.statuses }),
  //$off
  [MAIN.AUTH_UNREG]    : (state: NetStatusMap, payload: number) => ({ ...state, [payload]: netStatuses.halt }),
  //$off
  [NET.STATUS_SET]     : (state: NetStatusMap, payload: OnSetStatus) => ({
    ...state,
    ...payload.reduce((acc, { dc, status }) => ({ ...acc, [dc]: status }), {})
  })
}, iNetStatus)



const seq = createReducer({
  //$off
  [NET.SEQ_SET]: (state: SeqMap, { dc, seq }: OnSeqSet): SeqMap => assoc(dc, seq, state)
}, iSeq)

const salt = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { salt }: OnStorageImported) => state.merge(salt),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.salt),
  //$off
  [AUTH.SET_SERVER_SALT] : (state: KeyStorage, payload: number[], { id }: { id: number }) => state.set(id, payload)
}, keyStorage())

const auth = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { auth }: OnStorageImported) => state.merge(auth),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.auth),
  //$off
  [AUTH.SET_AUTH_KEY]    : (state: KeyStorage, payload: number[], { id }: { id: number }) => state.set(id, payload)
}, keyStorage())

const authID = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { auth }: OnStorageImported) => state.merge(map(makeAuthID, auth)),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) =>
  //$off
    state.merge(map(makeAuthID, payload.summary.auth)),
  //$off
  [AUTH.SET_AUTH_KEY]: (state: KeyStorage, payload: number[], { id }: { id: number }) => {
    const sha1 = sha1BytesSync(payload)
    const authID = sha1.slice(-8)
    return state.set(id, authID)
  }
}, keyStorage())

const makeAuthID = (auth: number[] | false): number[] | false => Array.isArray(auth)
  ? sha1BytesSync(auth).slice(-8)
  : false

// const session = createReducer({
//   //$ off
//   [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { session }: OnStorageImported) => state.merge(session),
//   '[01] action carrier': (state: KeyStorage, payload: PUnitList) => state.merge(
//     //$ off
//     map(mapSession, payload.summary.session)
//   ),
//   //$ off
//   [AUTH.SET_SESSION_ID]: (state: KeyStorage, payload: number[], { id }: { id: number }) => state.set(id, payload),
// }, keyStorage())


// const mapSession = (obj): number[] | false => typeof obj === 'object'
//   ? obj.session
//   : false

const lastMessages = (state: string[], payload: PUnitList) => {
  const newMsgs: string[] = state.concat(...values(payload.summary.lastMessages))
  console.warn(newMsgs)
  return takeLast(100, newMsgs)
}

const client: Reducer<Client> = combineReducers({
  uid,
  homeDc,
  seq,
  salt,
  auth,
  authID,
})

const clientReducer: Reducer<ClientList> = (state: ClientList = { ids: [] }, action: any) => {
  if (typeof action.uid !== 'string') return state
  const uid: string = action.uid
  const oldValue = state[uid]
  const newValue = client(oldValue, action)
  if (oldValue === newValue) return state
  return {
    ...state,
    [uid]: newValue,
    ids  : contains(uid, state.ids)
      ? state.ids
      : append(uid, state.ids)
  }
}

const mainReducer: Reducer<State> = combineReducers({
  client      : clientReducer,
  status,
  netStatus,
  pendingAck,
  invoke,
  storageSet,
  storageRemove,
  active,
  homeDc,
  uid,
  messageHistory,
  request,
  lastMessages: createReducer({
    '[01] action carrier': lastMessages
  }, [])
})

const fullStateReducer: Reducer<State> = createReducer({
  '[00] action carrier': (state: State, payload: Carrier) => {
    // const either = of({ state, payload })
    //   .logic({
    //     cond: ({ payload: { flags } }) => flags.networker && flags.auth,
    //     pass: x => x,
    //     fail: ({ state }) => state,
    //   })
    //   .mapL((st) => st ? st : state)
    //   .logic({
    //     cond: ({ payload: { flags } }) => flags.networker && flags.auth,
    //     pass: ({ payload, state: { networker } }) => ({ payload, newState: networker }),
    //     fail: ({ state }) => state,
    //   })
    if (!payload.flags.networker || !payload.flags.auth) return state
    let newState = state.networker
    for (const id of payload.networker.ids) {
      const keys = payload.networker[id]
      if (newState.has(id)) {
        let net = newState.get(id)
        if (!isEmpty(keys.authKey))
          net = {
            ...net,
            authKey   : keys.authKey,
            authSubKey: {
              authKeyUint8 : convertToUint8Array(keys.authKey),
              authKeyBuffer: convertToArrayBuffer(keys.authKey),
              authKeyID    : sha1BytesSync(keys.authKey).slice(-8),
            },
          }
        else
          net = {
            ...net,
            status    : statuses.init,
            authKey   : [],
            authSubKey: {
              authKeyUint8 : new Uint8Array([]),
              authKeyBuffer: new Uint8Array([]).buffer,
              authKeyID    : []
            }
          }
        if (!isEmpty(keys.salt))
          net = { ...net, salt: keys.salt }
        else
          net = {
            ...net,
            status    : statuses.init,
            authKey   : [],
            authSubKey: {
              authKeyUint8 : new Uint8Array([]),
              authKeyBuffer: new Uint8Array([]).buffer,
              authKeyID    : []
            }
          }
        if (!isEmpty(keys.session))
          net = { ...net, session: keys.session }
        newState = newState.set(id, net)
      }
    }
    return { ...state, networker: newState }
  },
  //$off
  [MAIN.AUTH_UNREG]: (state: State, payload: number) => {
    const { networker, netStatus, auth } = state
    const newState = {
      ...state,
      auth     : auth.remove(payload),
      netStatus: { ...netStatus, [payload]: netStatuses.load }
    }
    if (!networker.has(payload)) return newState
    const net = networker.get(payload)
    const updated = {
      ...net,
      status: statuses.init,
    }
    return {
      ...newState,
      networker: networker.set(payload, updated)
    }
  }
}, {})

function statusWatcher(state: State) {
  const dcList = [...new Set([].concat(
    state.auth.ids,
    state.salt.ids,
    // state.session.ids,
  ))].map(dc => ({
    dc,
    auth: state.auth.get(dc),
    salt: state.salt.get(dc),
    // session: state.session.get(dc),
  }))
  let statuses = state.netStatus
  for (const data of dcList) {
    if (!data.auth || !data.salt/*  || !data.session */) {
      statuses = { ...statuses, [data.dc]: netStatuses.load }
    } else
      statuses = { ...statuses, [data.dc]: netStatuses.active }
  }
  return { ...state, netStatus: statuses }
}

const reducer: Reducer<State> = (state, payload: any) =>
  statusWatcher(
    fullStateReducer(
      mainReducer(state, payload),
      payload
    )
  )

export default reducer
