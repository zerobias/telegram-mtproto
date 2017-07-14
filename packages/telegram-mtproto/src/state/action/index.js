//@flow

import { createAction } from 'redux-act'
import { type AxiosXHR } from 'axios'
import { select } from 'redux-most'
import { Stream } from 'most'

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import ApiRequest from '../../service/main/request'

type ActionCreator<Type, Payload> =
  (stream: Stream<any>) =>
    Stream<Action<Type, Payload>>

declare class Act<Tag = 'action'> { toString(): Tag }

export type Action<Tag = 'action', Payload = {}, Meta = void> = {
  (payload: Payload, meta: Meta): Action<Tag, Payload>,
  // (payload: Payload): Action<Tag, Payload>,
  getType(): Tag,
  type: Tag,
  payload: Payload,
}

export const actionSelector =
  (action: any): ActionCreator<any, any> =>
    (stream) => select(action, stream)

type ActionPair<Type, Payload, Meta = void> = Action<Type, Payload, Meta> & {
  stream: ActionCreator<Type, Payload>,
  type: Type,
}

type Main = {
  TEST: ActionPair<'test', string>,
  SWITCH_ON: ActionPair<'module loaded', string>,
  ACTIVATED: ActionPair<'instance activated', void>,
}

export type NetIncomingData = {
  message: NetMessage,
  result: {
    response: Object,
    messageID: string,
    sessionID: Uint8Array,
    seqNo: number
  },
  thread: NetworkerThread
}

type Net = {
  SEND: ActionPair<'net/send', {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread,
    noResponseMsgs: string[],
  }, NetworkerMeta>,
  RECEIVE_RESPONSE: ActionPair<'net/response', {
    message: NetMessage,
    noResponseMsgs: string[],
    result: AxiosXHR<ArrayBuffer>,
    thread: NetworkerThread
  }>,
  INCOMING_DATA: ActionPair<'net/data', NetIncomingData>,
  NETWORK_ERROR: ActionPair<'net/error', any>,
}

const doubleCreator =
<Type, Payload, Meta>(tag: Type, meta?: (pl: Payload, meta: Meta) => any): ActionPair<Type, Payload, Meta> => {

  const action: ActionPair<Type, Payload> = typeof meta === 'function'
    ? createAction(tag, (x) => x, meta)
    : createAction(tag)
  const stream: ActionCreator<Type, Payload> = actionSelector(action.getType())
  Object.defineProperties(action, {
    stream: {
      value     : stream,
      enumerable: false,
    },
    type: {
      value     : action.getType(),
      enumerable: false,
    }
  })
  return action
}

export const MAIN: Main = {
  TEST     : doubleCreator('test'),
  SWITCH_ON: doubleCreator('module loaded'),
  ACTIVATED: doubleCreator('instance activated'),
}

const networkerMeta = (_: any, dc: number) => ({ _: 'networker', id: dc })
const apiMeta = (_: any, id: string) => ({ _: 'api', id })
type ApiMeta = string
export type ApiMetaPL = {
  _: 'api',
  id: string,
}
type NetworkerMeta = number

export const NET: Net = {
  SEND            : doubleCreator('net/send', networkerMeta),
  RECEIVE_RESPONSE: doubleCreator('net/response'),
  INCOMING_DATA   : doubleCreator('net/data'),
  NETWORK_ERROR   : doubleCreator('net/error'),
}

type Auth = {
  SET_AUTH_KEY: ActionPair<'auth/auth_key set', number[], NetworkerMeta>,
  SET_SERVER_SALT: ActionPair<'auth/server_salt set', number[], NetworkerMeta>,
  SET_SESSION_ID: ActionPair<'auth/session_id set', number[], NetworkerMeta>,
}

export const AUTH: Auth = {
  SET_AUTH_KEY   : doubleCreator('auth/auth_key set', networkerMeta),
  SET_SERVER_SALT: doubleCreator('auth/server_salt set', networkerMeta),
  SET_SESSION_ID : doubleCreator('auth/session_id set', networkerMeta),
}

type NetworkerState = {
  RESEND: {
    ADD: ActionPair<'networker/resend add', string[], NetworkerMeta>,
    DEL: ActionPair<'networker/resend delete', string[], NetworkerMeta>,
  },
  SENT: {
    ADD: ActionPair<'networker/sent add', NetMessage, NetworkerMeta>,
    DEL: ActionPair<'networker/sent delete', NetMessage[], NetworkerMeta>,
  },
  PENDING: {
    ADD: ActionPair<'networker/pending add', string[], NetworkerMeta>,
    DEL: ActionPair<'networker/pending delete', string[], NetworkerMeta>,
  },
}

export const NETWORKER_STATE: NetworkerState = {
  RESEND: {
    ADD: doubleCreator('networker/resend add', networkerMeta),
    DEL: doubleCreator('networker/resend delete', networkerMeta),
  },
  SENT: {
    ADD: doubleCreator('networker/sent add', networkerMeta),
    DEL: doubleCreator('networker/sent delete', networkerMeta),
  },
  PENDING: {
    ADD: doubleCreator('networker/pending add', networkerMeta),
    DEL: doubleCreator('networker/pending delete', networkerMeta),
  },
}

export type ApiNewRequest = {
  netReq: ApiRequest,
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

type Api = {
  NEW_REQUEST: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
  DONE_REQUEST: ActionPair<'api/request done', any, ApiMeta>,
  CALL_TASK: ActionPair<'api/call-task new', any, ApiMeta>,
  CALL_RESULT: ActionPair<'api/call-task done', Object, ApiMeta>,
}

export const API: Api = {
  NEW_REQUEST : doubleCreator('api/request new', apiMeta),
  DONE_REQUEST: doubleCreator('api/request done', apiMeta),
  CALL_TASK   : doubleCreator('api/call-task new', apiMeta),
  CALL_RESULT : doubleCreator('api/call-task done', apiMeta),
}
