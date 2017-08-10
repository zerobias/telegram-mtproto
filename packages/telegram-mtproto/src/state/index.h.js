//@flow

import List from '../util/immutable-list'
import ApiRequest from '../service/main/request'
import { NetMessage } from '../service/networker/net-message'
import { type ModuleStatus } from '../status'
import { type InitType } from './action'
import { type MTP } from '../mtp.h'
import NetworkerThread from '../service/networker'
import { type MessageUnit } from '../task/index.h'
export type MessageHistory = {
  id: string,
  seq: number,
  direction: 'in' | 'out',
  message: MessageUnit
}

export type ApiNewRequest = {
  netReq: ApiRequest,
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

export type State = {
  _: true,
  active: boolean,
  invoke: $PropertyType<InitType, 'invoke'>,
  storageSet: $PropertyType<InitType, 'storageSet'>,
  status: ModuleStatus,
  homeDc: number,
  uid: string,
  messageHistory: MessageHistory[],
  networker: List<{
    dc: string,
    sent: List<NetMessage, string>,
    authKey: number[],
    authSubKey: {
      authKeyUint8: Uint8Array,
      authKeyBuffer: ArrayBuffer,
      authKeyID: number[],
    },
    salt: number[],
    session: number[],
    requestMap: { [req: string]: NetMessage },
  }, number>,
  request: {
    api: List<ApiNewRequest, string>
  },
}

export type OnRequestDone = {
  message: NetMessage,
  thread: NetworkerThread,
  result: {
    messageID: string,
    response: MTP,
    seqNo: number,
    sessionID: Uint8Array,
  },
  normalized: MessageUnit[],
}
