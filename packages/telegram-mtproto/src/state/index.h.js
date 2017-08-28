//@flow

import { type AxiosXHR } from 'axios'

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

export opaque type UID: string = string
declare export function toUID(x: string): UID
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

export type CommandList = {
  commands: string[],
  msgs: string[],
  byMsg: { [msg: string]: string },
  byCommand: { [command: string]: string },
}

export type Client = {
  uid: string,
  homeDc: number,
  seq: {
    [dc: number]: number,
  },
  command: CommandList,
  pendingAck: { [dc: number]: string[] },
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
  dc: DCNumber,
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

export type OnReceiveResponse = {
  message: NetMessage,
  noResponseMsgs: string[],
  result: AxiosXHR<ArrayBuffer>,
  thread: NetworkerThread,
  dc: DCNumber,
  uid: UID,
}

export type OnNetSend = {
  message: NetMessage,
  threadID: string,
  thread: NetworkerThread,
  noResponseMsgs: string[],
}
