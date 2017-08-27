//@flow

/*:: import List from '../util/immutable-list'
import ApiRequest from '../service/main/request'
import { NetMessage } from '../service/networker/net-message'
import NetworkerThread from '../service/networker' */
import { type ModuleStatus } from '../status'
import { type NetStatus } from '../net-status'
import { type MTP } from '../mtp.h'
import { type MessageUnit } from '../task/index.h'
import { KeyStorage } from '../util/key-storage'
export type MessageHistory = {
  id: string,
  seq: number,
  direction: 'in' | 'out',
  message: MessageUnit
}

/*::
export opaque type CryptoKey: number[] = number[]
declare export function toCryptoKey(x: number[]): CryptoKey

export opaque type DCNumber: number = number
declare export function toDCNumber(x: number): DCNumber
*/


export type InitType = {
  uid: string,
  invoke: (method: string, options: Object, opts: any) => Promise<any>,
  storageSet: (key: string, value: any) => Promise<void>,
  storageRemove: (...key: string[]) => Promise<void>,
}

export type ApiNewRequest = {
  netReq: ApiRequest,
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

export type NetState = {
  dc: string,
  sent: List<NetMessage, string>,
  status: ModuleStatus,
  authKey: number[],
  authSubKey: {
    authKeyUint8: Uint8Array,
    authKeyBuffer: ArrayBuffer,
    authKeyID: number[],
  },
  salt: number[],
  session: number[],
  requestMap: { [req: string]: NetMessage },
}

export type Client = {
  uid: string,
  homeDc: number,
  seq: {
    [dc: number]: number,
  },
  salt: KeyStorage,
  auth: KeyStorage,
  authID: KeyStorage,
}

export type ClientList = {
  ids: string[],
  [uid: string]: Client,
}

export type State = {
  active: boolean,
  client: ClientList,
  pendingAck: { [dc: number]: string[] },
  netStatus: { [dc: number]: NetStatus },
  invoke: (method: string, options: Object, opts: any) => Promise<any>,
  storageSet: (key: string, value: any) => Promise<void>,
  storageRemove: (...key: string[]) => Promise<void>,
  status: ModuleStatus,
  homeDc: number,
  uid: string,
  messageHistory: MessageHistory[],
  request: {
    api: List<ApiNewRequest, string>
  },
}

export type OnSetStatus = {
  dc: number,
  status: NetStatus,
}[]

export type OnSeqSet = {
  dc: number,
  seq: number,
}

export type OnAckAdd = {
  dc: number,
  ack: string[]
}

export type OnRequestDone = MessageUnit[]/* {
  message: NetMessage,
  thread: NetworkerThread,
  result: {
    messageID: string,
    response: MTP,
    seqNo: number,
    sessionID: Uint8Array,
  },
  normalized: MessageUnit[],
} */

export type OnStorageImported = {
  +auth: { [dc: number]: number[] },
  +salt: { [dc: number]: number[] },
  +session: { [dc: number]: number[] },
  +home: number,
}
