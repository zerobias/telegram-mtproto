//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import ApiRequest from '../../service/main/request'
import { type ActionPair } from '../helpers'
import { doubleCreator } from '../helpers'


type Main = {
  TEST: ActionPair<'test', string>,
  INIT: ActionPair<'init', string>,
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
  NETWORK_ERROR: ActionPair<'net/error', any>,
}

export const MAIN: Main = {
  TEST     : doubleCreator('test'),
  INIT     : doubleCreator('init'),
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

export type ApiCallResult = {
  message: NetMessage,
  result: {
    messageID: string,
    response: Object,
    seqNo: number,
    sessionID: Uint8Array,
  }
}

type Api = {
  NEW_REQUEST: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
  DONE_REQUEST: ActionPair<'api/request done', any, ApiMeta>,
  CALL_TASK: ActionPair<'api/call-task new', any>,
  CALL_RESULT: ActionPair<'api/call-task done', ApiCallResult>,
}

export const API: Api = {
  NEW_REQUEST : doubleCreator('api/request new', apiMeta),
  DONE_REQUEST: doubleCreator('api/request done', apiMeta),
  CALL_TASK   : doubleCreator('api/call-task new'),
  CALL_RESULT : doubleCreator('api/call-task done'),
}
