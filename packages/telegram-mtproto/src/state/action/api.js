//@flow

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import { doubleCreator, type ActionPair } from '../helpers'
import { type MTP } from '../../mtp.h'
import { type MessageUnit } from '../../task/index.h'
import { type OnRequestDone, type ApiNewRequest } from '../index.h'

/*export type ApiCallResult = MessageUnit[]  {
  message: NetMessage,
  thread: NetworkerThread,
  result: {
    messageID: string,
    //$ FlowIssue
    response: MTP,
    seqNo: number,
    sessionID: Uint8Array,
  },
  normalized: MessageUnit[]
} */

type ApiMeta = string

type Api = {
  REQUEST: {
    NEW: ActionPair<'api/request new', ApiNewRequest, ApiMeta>,
    DONE: ActionPair<'api/request done', OnRequestDone>,
  },
  TASK: {
    NEW: ActionPair<'api/task new', any>,
    DONE: ActionPair<'api/task done', MessageUnit[]>,
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
    DONE: doubleCreator('api/request done'),
  },
  TASK: {
    NEW : doubleCreator('api/task new'),
    DONE: doubleCreator('api/task done'),
  }
}
