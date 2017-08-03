//@flow

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import ApiRequest from '../../service/main/request'
import { type ActionPair } from '../helpers'
import { doubleCreator } from '../helpers'
import { type MTP } from '../../mtp.h'

export type ApiNewRequest = {
  netReq: ApiRequest,
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

export type ApiCallResult = {
  message: NetMessage,
  thread: NetworkerThread,
  result: {
    messageID: string,
    //$ FlowIssue
    response: MTP,
    seqNo: number,
    sessionID: Uint8Array,
  }
}

type ApiMeta = string

type Api = {
  REQUEST: {
    NEW: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
    DONE: ActionPair<'api/request done', any, ApiMeta>,
  },
  TASK: {
    NEW: ActionPair<'api/task new', any>,
    DONE: ActionPair<'api/task done', ApiCallResult>,
  },
}

export type ApiMetaPL = {
  _: 'api',
  id: string,
}

const apiMeta = (_: any, id: string) => ({ _: 'api', id })


export const API: Api = {
  REQUEST: {
    NEW : doubleCreator('api/request new', apiMeta),
    DONE: doubleCreator('api/request done', apiMeta),
  },
  TASK: {
    NEW : doubleCreator('api/task new'),
    DONE: doubleCreator('api/task done'),
  }
}
