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

export type Action<Tag = 'action', Payload = {}> = {
  (payload: Payload): Action<Tag, Payload>,
  getType(): Tag,
  type: Tag,
  payload: Payload,
}

export const actionSelector =
  (action: any): ActionCreator<any, any> =>
    (stream) => select(action, stream)

interface ActionPair<Type, Payload> {
  action: Action<Type, Payload>,
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
  }>,
  RECIEVE_RESPONSE: ActionPair<'recieve response', any>,
  NETWORK_ERROR: ActionPair<'network error', any>,
}

const doubleCreator = <Type, Payload>(tag: Type): ActionPair<Type, Payload> => {
  const action: Action<Type, Payload> = createAction(tag)
  const stream: ActionCreator<Type, Payload> = actionSelector(action.getType())
  return {
    action, stream, type: action.getType()
  }
}

export const MAIN: Main = {
  TEST     : doubleCreator('test'),
  SWITCH_ON: doubleCreator('module loaded'),
  ACTIVATED: doubleCreator('instance activated'),
}

export const NET: Net = {
  SEND_REQUEST    : doubleCreator('send request'),
  RECIEVE_RESPONSE: doubleCreator('recieve response'),
  NETWORK_ERROR   : doubleCreator('network error'),
}

type Auth = {
  SET_AUTH_KEY: ActionPair<'set auth key', number[]>,
  SET_SERVER_SALT: ActionPair<'set server salt', number[]>,
  SET_SESSION_ID: ActionPair<'set session id', number[]>,
}

export const AUTH: Auth = {
  SET_AUTH_KEY   : doubleCreator('set auth key'),
  SET_SERVER_SALT: doubleCreator('set server salt'),
  SET_SESSION_ID : doubleCreator('set session id'),
}

type NetworkerState = {
  RESEND: {
    ADD: ActionPair<'networker/resend add', string[]>,
    DEL: ActionPair<'networker/resend delete', string[]>,
  },
  SENT: {
    ADD: ActionPair<'networker/sent add', NetMessage>,
    DEL: ActionPair<'networker/sent delete', NetMessage[]>,
  },
  PENDING: {
    ADD: ActionPair<'networker/pending add', string[]>,
    DEL: ActionPair<'networker/pending delete', string[]>,
  },
}

export const NETWORKER_STATE: NetworkerState = {
  RESEND: {
    ADD: doubleCreator('networker/resend add'),
    DEL: doubleCreator('networker/resend delete'),
  },
  SENT: {
    ADD: doubleCreator('networker/sent add'),
    DEL: doubleCreator('networker/sent delete'),
  },
  PENDING: {
    ADD: doubleCreator('networker/pending add'),
    DEL: doubleCreator('networker/pending delete'),
  },
}
