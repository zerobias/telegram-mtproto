//@flow

import { createAction } from 'redux-act'

import { select } from 'redux-most'
import { Stream } from 'most'
import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'

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

type Net = {
  SEND_REQUEST: ActionPair<'send request', {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread
  }, NetworkerMeta>,
  RECIEVE_RESPONSE: ActionPair<'recieve response', any>,
  NETWORK_ERROR: ActionPair<'network error', any>,
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
type NetworkerMeta = number

export const NET: Net = {
  SEND_REQUEST    : doubleCreator('send request', networkerMeta),
  RECIEVE_RESPONSE: doubleCreator('recieve response'),
  NETWORK_ERROR   : doubleCreator('network error'),
}

type Auth = {
  SET_AUTH_KEY: ActionPair<'set auth key', number[], NetworkerMeta>,
  SET_SERVER_SALT: ActionPair<'set server salt', number[], NetworkerMeta>,
  SET_SESSION_ID: ActionPair<'set session id', number[], NetworkerMeta>,
}

export const AUTH: Auth = {
  SET_AUTH_KEY   : doubleCreator('set auth key', networkerMeta),
  SET_SERVER_SALT: doubleCreator('set server salt', networkerMeta),
  SET_SESSION_ID : doubleCreator('set session id', networkerMeta),
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
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

type Api = {
  NEW_REQUEST: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
  DONE_REQUEST: ActionPair<'api/request done', ApiNewRequest, ApiMeta>,
  CALL_TASK: ActionPair<'api/call-task new', any, ApiMeta>,
  CALL_RESULT: ActionPair<'api/call-task done', Object, ApiMeta>,
}

export const API: Api = {
  NEW_REQUEST : doubleCreator('api/request new', apiMeta),
  DONE_REQUEST: doubleCreator('api/request done', apiMeta),
  CALL_TASK   : doubleCreator('api/call-task new', apiMeta),
  CALL_RESULT : doubleCreator('api/call-task done', apiMeta),
}
