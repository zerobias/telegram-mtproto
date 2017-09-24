//@flow

/* eslint-disable object-shorthand */

import { combineReducers, type Reducer } from 'redux'
import { createReducer } from 'redux-act'
import { Map, OrderedSet, OrderedMap } from 'immutable'
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
  zip,
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
  makeReducer,
  type ActReducer,
} from '../helpers'
import {
  type UID,
  toUID,
  toDCNumber,
  type DCNumber,
} from 'Newtype'
import { MAIN, NET, API } from 'Action'
import keyStorage, { KeyStorage } from 'Util/key-storage'
import { mapGet } from 'Util/immutable'
import { KeyValue } from 'Monad'
import { sha1BytesSync } from 'Bin'
import { NetMessage, NetContainer } from '../../service/networker/net-message'
import requestWatch from './request'
import progress from './progress'
import ApiRequest from '../../service/main/request'
import { queryRequest } from '../query'
import Config from 'ConfigProvider'

import {
  type PUnitList,
  type MessageUnit,
} from '../../task/index.h'

const initial: any = {}

declare var req: ApiRequest
declare var uidFake: UID

const uid = createReducer({
  //$FlowIssue
  [MAIN.INIT]: (state: string, payload: InitType) => payload.uid,
}, '')

type AckMap = { [dc: DCNumber]: string[] }

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
  //$off
  [MAIN.RECOVERY_MODE]: (state: AckMap, { halt, recovery }: OnRecovery): AckMap =>  ({
    ...state,
    [halt]: [],
  })
}, ackDefault)

const getDC = n => /*::toDCNumber*/(parseInt(n, 10))

const homeDc: ActReducer<DCNumber> = makeReducer(/*::toDCNumber*/(2))
  .on(MAIN.STORAGE_IMPORTED, (state, { home }) => getDC(home))
  .on(MAIN.DC_DETECTED, (state, { dc }) => getDC(dc))

const dcDetected = makeReducer(false)
  .on(MAIN.DC_DETECTED, () => true)
  .on(MAIN.DC_REJECTED, () => false)


const lastMessages = createReducer({
  //$off
  [API.TASK.DONE]: (state: UID[], payload: MessageUnit[]): UID[] => pipe(
    map(unit => /*:: toUID( */ unit.id /*:: ) */),
    concat(state),
    takeLast(100),
  )(payload)
}, [])

const authData = (() => {
  const salt = makeReducer(keyStorage())
    .on(MAIN.AUTH.RESOLVE,
        (state, payload): KeyStorage => state.set(payload.dc, payload.serverSalt))
    .on(MAIN.STORAGE_IMPORTED,
        (state, { salt }): KeyStorage => state.merge(salt))
    .on(MAIN.RECOVERY_MODE,
        (state, { halt }): KeyStorage => state.remove(halt))

  const auth = makeReducer(keyStorage())
    .on(MAIN.AUTH.RESOLVE,
        (state, payload) => state.set(payload.dc, payload.authKey))
    .on(MAIN.STORAGE_IMPORTED,
        (state, { auth }) => state.merge(auth))
    .on(MAIN.RECOVERY_MODE,
        (state, { halt }) => state.remove(halt))

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

const isValidMessage = msg =>
  msg.flags.api
  && msg.flags.body
  && !msg.flags.error
  && msg.api.resolved

const isAuthImport = msg => msg.data.method === 'auth.importAuthorization'

const authImported: ActReducer<Map<DCNumber, boolean>> =
makeReducer(Map([]))
  .on(API.TASK.DONE,
      (state, payload): Map<DCNumber, boolean> => {
        const valid = payload
          .filter(isValidMessage)
          .reduce(
            (acc, msg) => queryRequest(msg.uid, msg.methodResult.outID).fold(
              () => acc,
              req => [...acc, req]), [])
          .filter(isAuthImport)
          .reduce(
            (acc, val) => val.dc.fold(
              () => acc,
              dc => [...acc, [dc, true]]), [])

        return state.merge(valid)
      })

const clientRequest: ActReducer<KeyValue<UID, ApiRequest>> =
makeReducer(KeyValue.empty())
  .on(API.REQUEST.NEW,
      (state, { netReq }): KeyValue<UID, ApiRequest> =>
        state.push([[netReq.requestID, netReq]]))

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
  authImported,
  status    : createReducer({}, {}),
  homeStatus: createReducer({}, false),
})

function statusWatch(state: Client) {
  const dcList = Config.dcList(state.uid)
  const singleStatus = dc =>
    state.auth.has(dc)
    && state.authID.has(dc)
    && state.salt.has(dc)
    && (
      (state.authImported.get(dc) === true)
      || (state.homeDc === dc)
    )
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

const unitIDS = map((unit: MessageUnit) => /*:: toUID( */ unit.id /*:: ) */)

const lastMessagesImm: ActReducer<OrderedSet<UID>> =
makeReducer(OrderedSet.of(/*:: uidFake */))
  .on(API.TASK.DONE, (state, payload): OrderedSet<UID> => state
    .concat(unitIDS(payload))
    .slice(-100))

const message: ActReducer<OrderedMap<string, NetMessage>> =
makeReducer(OrderedMap([]))
  .on(NET.SEND, (state, payload): OrderedMap<string, NetMessage> => state
    .set(payload.message.msg_id, payload.message))

const messagePending: ActReducer<OrderedSet<string>> =
makeReducer(OrderedSet.of(/*:: '' */))
  .on(NET.SEND,
      (state, { message }): OrderedSet<string> => state
        .add(message.msg_id)
        .concat(...(message.inner || []))
  )
  .on(NET.RECEIVE_RESPONSE,
      (state, { message }): OrderedSet<string> => state
        .remove(message.msg_id)
        .subtract(message.inner || [])
  )

const getStrings = (arr: any[] = []) => arr.filter(e => typeof e === 'string')

const apiPending: ActReducer<OrderedSet<string>> =
  makeReducer(OrderedSet.of(/*:: '' */))
    //$off
    .on(NET.SEND,
        (state, { message }): OrderedSet<string> => state
          .concat(...getStrings(message.innerAPI)))
    //$off
    .on(NET.RECEIVE_RESPONSE,
        (state, { message }): OrderedSet<string> => state
          .subtract(getStrings(message.innerAPI)))

const messageApiLink: ActReducer<OrderedMap<string, UID>> =
  makeReducer(OrderedMap([]))
    .on(NET.SEND,
        (state, { message }): OrderedMap<string, UID> => state
          .merge(getApiPairs(message))
          // .concat(...getStrings(message.innerAPI))
    )
    // .on(NET.RECEIVE_RESPONSE,
    //     (state, { message }): OrderedMap<string, UID> => state
    //       .subtract(getStrings(message.innerAPI))
    // )

function getApiPairs(message: NetMessage): Array<[string, UID]> {
  if (message instanceof NetContainer && message.innerAPI != null) {
    const pairs = zip(message.inner, message.innerAPI)
    //$off
    const result: Array<[string, UID]> = pairs.filter(([, uid]) => typeof uid === 'string')
    return result
  }
  if (message.isAPI && message.requestID != null && message.requestID !== '') {
    //$off
    const result: Array<[string, UID]> = [[message.msg_id, message.requestID]]
    return result
  }
  return []
}

const instance: Reducer<Instance> = combineReducers({
  uid,
  homeDc,
  dcDetected,
  lastMessages: lastMessagesImm,
  message,
  messagePending,
  apiPending,
  messageApiLink,
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
