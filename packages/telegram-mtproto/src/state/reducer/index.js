//@flow

/* eslint-disable object-shorthand */

import { combineReducers, type Reducer } from 'redux'
import { createReducer } from 'redux-act'
import { Map } from 'immutable'
import { Maybe } from 'apropos'
const { fromNullable } = Maybe
import {
  append,
  contains,
  without,
  map,
  takeLast,
  pipe,
  concat,
  tail,
  head,
  remove,
} from 'ramda'
// import { Pure, liftF } from '@safareli/free'
// import { of, Left, Right } from 'apropos'
// import { Maybe } from 'folktale/maybe'
import type {
  ApiNewRequest,
  State,
  Client,
  ClientList,
  InitType,
  OnAckAdd,
  OnStorageImported,
  OnRecovery,
  OnDcDetected,
  Instance,
} from '../index.h'
import {
  trimType,
} from '../helpers'
import {
  type UID,
  toUID,
  type DCNumber,
} from 'Newtype'
import { MAIN, NET, API } from 'Action'
import keyStorage, { KeyStorage } from 'Util/key-storage'
import { mapGet } from 'Util/immutable'
import { KeyValue } from 'Monad'
import { sha1BytesSync } from 'Bin'
import { NetMessage } from '../../service/networker/net-message'
import requestWatch from './request'
import progress from './progress'
import ApiRequest from '../../service/main/request'
import Config from 'ConfigProvider'

import {
  type PUnitList,
  type MessageUnit,
} from '../../task/index.h'

const initial: any = {}

declare var req: ApiRequest

const uid = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: string, payload: InitType) => payload.uid,
}, '')

type AckMap = { [dc: number]: string[] }

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

const homeDc = createReducer({
  //$off
  [MAIN.STORAGE_IMPORTED]: (state: number, { home }: OnStorageImported) => home,
  //$off
  [MAIN.DC_DETECTED]     : (state: number, { dc }: OnDcDetected) => dc,
  //$FlowIssue
  [MAIN.DC_CHANGED]      : (state: number, { newDC }: OnDcDetected) => newDC,
}, 2)

const dcDetected = createReducer({
  //$off
  [MAIN.DC_DETECTED]: () => true,
  //$off
  [MAIN.DC_REJECTED]: () => false,
}, false)


const lastMessages = createReducer({
  //$off
  [API.TASK.DONE]: (state: UID[], payload: MessageUnit[]): UID[] => pipe(
    map(unit => /*:: toUID( */ unit.id /*:: ) */),
    concat(state),
    takeLast(100),
  )(payload)
}, [])

const authData = (() => {
  const salt = createReducer({
    //$off
    [MAIN.AUTH.RESOLVE]    : (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.serverSalt),
    //$off
    [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { salt }: OnStorageImported) => state.merge(salt),
    // '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.salt),
    //$off
    [MAIN.RECOVERY_MODE]   : (state: KeyStorage, { halt, recovery }: OnRecovery): KeyStorage =>
      state.remove(halt)
  }, keyStorage())

  const auth = createReducer({
    //$off
    [MAIN.STORAGE_IMPORTED]: (state: KeyStorage, { auth }: OnStorageImported) => state.merge(auth),
    // '[01] action carrier'  : (state: KeyStorage, payload: PUnitList) => state.merge(payload.summary.auth),
    //$off
    [MAIN.AUTH.RESOLVE]    : (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.authKey),
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
    [MAIN.AUTH.RESOLVE] : (state: KeyStorage, payload: OnAuthResolve) => state.set(payload.dc, payload.authKeyID),
    //$off
    [MAIN.RECOVERY_MODE]: (state: KeyStorage, { halt, recovery }: OnRecovery): KeyStorage =>
      state.remove(halt)
  }, keyStorage())

  const makeAuthID = (auth: number[] | false): number[] | false => Array.isArray(auth)
    ? sha1BytesSync(auth).slice(-8)
    : false

  return { auth, salt, authID }
})()

function commandReducer(
  state: KeyValue<string, string> = KeyValue.empty(),
  action: any
): KeyValue<string, string> {
  switch ( trimType(action.type) ) {
    case 'networker/sent add': {
      const payload: NetMessage[] = action.payload
      const apiRequests = payload
        .filter(msg => msg.isAPI)
        .map(({ msg_id, requestID }) => [msg_id, requestID || ''])
      return state.push(apiRequests)
    }
    case 'main/recovery mode': return state
    default: return state
  }
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
  progress,
  command   : commandReducer,
  request   : clientRequest,
  lastMessages,
  dcDetected,
  ...authData,
  pendingAck,
  status    : createReducer({}, {}),
  homeStatus: createReducer({}, false),
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

function decoratedClient(state: Client, action: $off): Client {
  const currentState = requestWatch(client(state, action), action)
  const status = statusWatch(currentState)
  const homeStatus = status
    .maybeGetK(currentState.homeDc)
    .fold(() => false, x => x.snd())
  return {
    ...currentState,
    status,
    homeStatus,
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

const instance: Reducer<Instance> = combineReducers({
  uid
})
const instanceReducer: Reducer<Map<UID, Instance>> =
(state: Map<UID, Instance> = Map([]), action: any) =>
  actionUID(action)
    .fold(() =>  state, uid => instanceUpdate(state, uid, action))

function instanceUpdate(
  state: Map<UID, Instance>,
  uid: UID,
  action: any
) {
  const inst = mapGet(uid, state)
  const newState = inst.fold(
    () => instance(initial, action),
    current => instance(current, action)
  )
  return state.set(uid, newState)
}

function actionUID(action: Object): Maybe<UID> {
  return fromNullable(action.uid)
}

function idsReducer(state: string[], uid: string): string[] {
  return contains(uid, state)
    ? state
    : append(uid, state)
}

const mainReducer: Reducer<State> = combineReducers({
  client  : clientReducer,
  instance: instanceReducer,
})

export default mainReducer
