//@flow

/* eslint-disable object-shorthand */

import { combineReducers, type Reducer } from 'redux'
import { createReducer } from 'redux-act'
import {
  append,
  contains,
  without,
  map,
  values,
  takeLast,
} from 'ramda'
// import { Pure, liftF } from '@safareli/free'
// import { of, Left, Right } from 'apropos'
// import { Maybe, Just, Nothing } from 'folktale/maybe'

import type {
  ApiNewRequest,
  State,
  Client,
  ClientList,
  InitType,
  OnSetStatus,
  OnAckAdd,
  OnStorageImported,
  OnRecovery,
  OnDcDetected,
  OnAuthResolve,
} from '../index.h'
import { trimType } from '../helpers'
import {
  type UID,
  type DCNumber,
} from 'Newtype'
import { MAIN, NET, API, AUTH } from 'Action'
import keyStorage, { KeyStorage } from 'Util/key-storage'
import {  KeyValue } from 'Monad'
import { sha1BytesSync } from 'Bin'
import { NetMessage } from '../../service/networker/net-message'
// import networker from './networker-state'
import ApiRequest from '../../service/main/request'
import request from './request'
import { netStatuses, type NetStatus } from 'NetStatus'
import Config from 'ConfigProvider'

import { type PUnitList } from '../../task/index.h'

const initial: any = {}

const uid = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: string, payload: InitType) => payload.uid,
}, '')

// const storageSet = createReducer({
//   //$ FlowIssue
//   [MAIN.INIT]           : (state: StorageSet, payload: InitType) => payload.storageSet,
//   //$ off
//   [AUTH.SET_SERVER_SALT]: (state: StorageSet, payload: number[], { id }: { id: number }) => {
//     state(`dc${id}_server_salt`, bytesToHex(payload))
//     return state
//   },
//   //$ off
//   [AUTH.SET_AUTH_KEY]: (state: StorageSet, payload: number[], { id }: { id: number }) => {
//     state(`dc${id}_auth_key`, bytesToHex(payload))
//     return state
//   },
// }, () => Promise.resolve(void 0))

// const storageRemove = createReducer({
//   //$ FlowIssue
//   [MAIN.INIT]      : (state: StorageRemove, payload: InitType) => payload.storageRemove,
//   //$ off
//   [MAIN.AUTH_UNREG]: (state: StorageRemove, payload: number) => {
//     state(`dc${payload}_auth_key`, `dc${payload}_server_salt`)
//     return state
//   },
// }, () => Promise.resolve(void 0))

type AckMap = { [dc: number]: string[] }
type NetStatusMap = { [dc: number]: NetStatus }

const ackDefault: AckMap = initial
const pendingAck = createReducer({
  //$off
  [NET.ACK_ADD]: (state: AckMap, { dc, ack }: OnAckAdd): AckMap => {
    const dcAcks = state[dc] || []
    const updated = [...new Set([...dcAcks, ...ack])]
    return { ...state, [dc | 0]: updated }
  },
  //$off
  [NET.ACK_DELETE]: (state: AckMap, { dc, ack }: OnAckAdd): AckMap => {
    const dcAcks = state[dc] || []
    const updated = without(ack, dcAcks)
    return { ...state, [dc | 0]: updated }
  },
  //$off
  [MAIN.RECOVERY_MODE]: (state: AckMap, { halt, recovery }: OnRecovery): AckMap =>  ({
    ...state,
    [halt]: [],
  })
}, ackDefault)

// const guardedHomeDc = guardedReducer([
//   (_, payload) => payload.flags.homeDC
// ], (state: number, payload: Carrier) => payload.homeDC)

const homeDc = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: number, { home }: OnStorageImported) => home,
  //$off
  [MAIN.DC_DETECTED]     : (state: number, { dc }: OnDcDetected) => dc,
  //$FlowIssue
  [MAIN.DC_CHANGED]      : (state: number, { newDC }: OnDcDetected) => newDC,
}, 2)

const iNetStatus: NetStatusMap = initial

const netStatus = createReducer({
  // '[01] action carrier': (state: NetStatusMap, payload: PUnitList) => ({ ...state, ...payload.statuses }),
  // //$off
  // [MAIN.AUTH_UNREG]    : (state: NetStatusMap, payload: number) => ({ ...state, [payload]: netStatuses.halt }),
  // //$off
  // [NET.STATUS_SET]     : (state: NetStatusMap, payload: OnSetStatus) => ({
  //   ...state,
  //   ...payload.reduce((acc, { dc, status }) => ({ ...acc, [dc]: status }), {})
  // })
}, {
  2: 'active'
})

const dcDetected = createReducer({
  //$off
  [MAIN.DC_DETECTED]: () => true,
  //$off
  [MAIN.DC_REJECTED]: () => false,
}, false)

const salt = createReducer({
  //$off
  // [MAIN.AUTH.RESOLVE]    : (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.serverSalt),
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { salt }: OnStorageImported) => state.merge(salt),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.salt),
  //$off
  [AUTH.SET_SERVER_SALT] : (state: KeyStorage, payload: number[], { id }: { id: number }) => state.set(id, payload),
  //$off
  [MAIN.RECOVERY_MODE]   : (state: KeyStorage, { halt, recovery }: OnRecovery): KeyStorage =>
    state.remove(halt)
}, keyStorage())

const auth = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { auth }: OnStorageImported) => state.merge(auth),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.auth),
  //$off
  // [MAIN.AUTH.RESOLVE]    : (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.authKey),
  //$off
  [AUTH.SET_AUTH_KEY]    : (state: KeyStorage, payload: number[], { id }: { id: number }) => state.set(id, payload),
  //$off
  [MAIN.RECOVERY_MODE]   : (state: KeyStorage, { halt, recovery }: OnRecovery): KeyStorage =>
    state.remove(halt)
}, keyStorage())

const authID = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { auth }: OnStorageImported) => state.merge(map(makeAuthID, auth)),
  '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) =>
  //$off
    state.merge(map(makeAuthID, payload.summary.auth)),
  //$off
  // [MAIN.AUTH.RESOLVE]: (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.authKeyID),
  //$off
  [AUTH.SET_AUTH_KEY]: (state: KeyStorage, payload: number[], { id }: { id: number }) => {
    const sha1 = sha1BytesSync(payload)
    const authID = sha1.slice(-8)
    return state.set(id, authID)
  },
  //$off
  [MAIN.RECOVERY_MODE]: (state: KeyStorage, { halt, recovery }: OnRecovery): KeyStorage =>
    state.remove(halt)
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


function commandReducer(
  state: KeyValue<string, string> = KeyValue.empty(),
  action: any
): KeyValue<string, string> {
  const typeName = trimType(action.type)
  if (typeName === 'main/recovery mode') return state
  if (typeName !== 'networker/sent add') return state
  const payload: NetMessage[] = action.payload
  const apiRequests = payload
    .filter(msg => msg.isAPI)
    .map(({ msg_id, requestID }) => [msg_id, requestID || ''])
  return state.push(apiRequests)
}

const clientRequest = createReducer({
  //$off
  [API.REQUEST.NEW]: (
    state: KeyValue<UID, ApiRequest>,
    { netReq }: ApiNewRequest
  ): KeyValue<UID, ApiRequest> =>
    state.push([[netReq.requestID, netReq]])
}, KeyValue.empty())

const client: Reducer<Client> = combineReducers({
  uid,
  homeDc,
  command: commandReducer,
  request: clientRequest,
  dcDetected,
  netStatus,
  // seq,
  salt,
  auth,
  authID,
  pendingAck,
  status : createReducer({}, {})
})

function statusWatch(state: Client) {
  const dcList = Config.dcList(state.uid)
  const singleStatus = dc =>
    state.auth.has(dc)
    && state.authID.has(dc)
    && state.salt.has(dc)
  const kv: KeyValue<DCNumber, boolean> = KeyValue.empty()
  return kv.push(
    dcList
      .map(dc => [dc, singleStatus(dc)]))
}

const decoratedClient: Reducer<Client & { status: KeyValue<DCNumber, boolean> }> =
(state, action) => {
  const currentState = client(state, action)
  return {
    ...currentState,
    status: statusWatch(currentState)
  }
}

const clientReducer: Reducer<ClientList> = (state: ClientList = { ids: [] }, action: any) => {
  if (typeof action.uid !== 'string') return state
  const uid: string = action.uid
  const oldValue = state[uid]
  const newValue = decoratedClient(oldValue, action)
  if (oldValue === newValue) return state
  return {
    ...state,
    [uid]: newValue,
    ids  : idsReducer(state.ids, uid)
  }
}

const mainReducer: Reducer<State> = combineReducers({
  client      : clientReducer,
  request,
  lastMessages: createReducer({
    '[01] action carrier': lastMessages
  }, [])
})

function idsReducer(state: string[], uid: string): string[] {
  return contains(uid, state)
    ? state
    : append(uid, state)
}

// const fullStateReducer: Reducer<State> = createReducer({
//   '[00] action carrier': (state: State, payload: Carrier) => {
//     // const either = of({ state, payload })
//     //   .logic({
//     //     cond: ({ payload: { flags } }) => flags.networker && flags.auth,
//     //     pass: x => x,
//     //     fail: ({ state }) => state,
//     //   })
//     //   .mapL((st) => st ? st : state)
//     //   .logic({
//     //     cond: ({ payload: { flags } }) => flags.networker && flags.auth,
//     //     pass: ({ payload, state: { networker } }) => ({ payload, newState: networker }),
//     //     fail: ({ state }) => state,
//     //   })
//     if (!payload.flags.networker || !payload.flags.auth) return state
//     let newState = state.networker
//     for (const id of payload.networker.ids) {
//       const keys = payload.networker[id]
//       if (newState.has(id)) {
//         let net = newState.get(id)
//         if (!isEmpty(keys.authKey))
//           net = {
//             ...net,
//             authKey   : keys.authKey,
//             authSubKey: {
//               authKeyUint8 : convertToUint8Array(keys.authKey),
//               authKeyBuffer: convertToArrayBuffer(keys.authKey),
//               authKeyID    : sha1BytesSync(keys.authKey).slice(-8),
//             },
//           }
//         else
//           net = {
//             ...net,
//             status    : statuses.init,
//             authKey   : [],
//             authSubKey: {
//               authKeyUint8 : new Uint8Array([]),
//               authKeyBuffer: new Uint8Array([]).buffer,
//               authKeyID    : []
//             }
//           }
//         if (!isEmpty(keys.salt))
//           net = { ...net, salt: keys.salt }
//         else
//           net = {
//             ...net,
//             status    : statuses.init,
//             authKey   : [],
//             authSubKey: {
//               authKeyUint8 : new Uint8Array([]),
//               authKeyBuffer: new Uint8Array([]).buffer,
//               authKeyID    : []
//             }
//           }
//         if (!isEmpty(keys.session))
//           net = { ...net, session: keys.session }
//         newState = newState.set(id, net)
//       }
//     }
//     return { ...state, networker: newState }
//   },
//   //$ off
//   [MAIN.AUTH_UNREG]: (state: State, payload: number) => {
//     const { networker, netStatus, auth } = state
//     const newState = {
//       ...state,
//       auth     : auth.remove(payload),
//       netStatus: { ...netStatus, [payload]: netStatuses.load }
//     }
//     if (!networker.has(payload)) return newState
//     const net = networker.get(payload)
//     const updated = {
//       ...net,
//       status: statuses.init,
//     }
//     return {
//       ...newState,
//       networker: networker.set(payload, updated)
//     }
//   }
// }, {})

// const reducer: Reducer<State> = (state, payload: any) =>
//   statusWatcher(
//     fullStateReducer(
//       mainReducer(state, payload),
//       payload
//     )
//   )

export default mainReducer
