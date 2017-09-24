//@flow

import { type AxiosXHR } from 'axios'
import { OrderedSet, Map, OrderedMap } from 'immutable'

import ApiRequest from '../service/main/request'
import { NetMessage } from '../service/networker/net-message'
import NetworkerThread from '../service/networker'
import { type MessageUnit } from '../task/index.h'
import { KeyStorage } from 'Util/key-storage'
import { KeyValue } from 'Monad'
import {
  type CryptoKey,
  toCryptoKey,
  type DCNumber,
  toDCNumber,
  type UID,
  toUID,
} from 'Newtype'
export type MessageHistory = {
  id: string,
  seq: number,
  direction: 'in' | 'out',
  message: MessageUnit
}

export type OnRecovery = {
  halt: DCNumber,
  recovery: DCNumber,
}

export type InitType = {
  uid: UID,
}

export type ApiNewRequest = {
  netReq: ApiRequest,
  method: string,
  params: { [key: string]: mixed },
  timestamp: number,
}

export type CommandList = {
  commands: string[],
  msgs: string[],
  byMsg: { [msg: string]: string },
  byCommand: { [command: string]: string },
}

export type RequestResult = { +_: string, +[key: string]: any }

export type Progress = {
  idle: ApiRequest[],
  current: ApiRequest[],
  done: ApiRequest[],
  result: KeyValue<string, RequestResult[]>,
}

export type Client = {
  uid: string,
  homeDc: DCNumber,
  dcDetected: boolean,
  command: KeyValue<string, string>,
  request: KeyValue<UID, ApiRequest>,
  pendingAck: { [dc: number]: string[] },
  lastMessages: UID[],
  progress: Progress,
  salt: KeyStorage,
  auth: KeyStorage,
  authID: KeyStorage,
  homeStatus: boolean,
  authImported: Map<DCNumber, boolean>,
  status: KeyValue<DCNumber, boolean>,
}

export type Instance = {
  uid: UID,
  homeDc: DCNumber,
  dcDetected: boolean,
  lastMessages: OrderedSet<UID>,
  message: OrderedMap<string, NetMessage>,
  messagePending: OrderedSet<string>,
  apiPending: OrderedSet<string>,
  messageApiLink: OrderedMap<string, UID>,
}

export type ClientList = {
  ids: string[],
  [uid: string]: Client,
}

export type State = {
  client: ClientList,
  instance: Map<UID, Instance>,
}

export type OnSeqSet = {
  dc: number,
  seq: number,
}

export type OnAckAdd = {
  dc: DCNumber,
  ack: string[]
}

export type OnNewTask = ApiRequest[]

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
  +home: DCNumber,
  +uid: UID,
}

export type OnReceiveResponse = {
  message: NetMessage,
  noResponseMsgs: string[],
  result: AxiosXHR<ArrayBuffer>,
  thread: NetworkerThread,
  dc: DCNumber,
  uid: UID,
}

export type OnNetEncrypt = {
  message: NetMessage,
  thread: NetworkerThread,
  noResponseMsgs: string[],
}

export type OnNetSend = {
  mtBytes: Int32Array,
  url: string,
  message: NetMessage,
  dc: DCNumber,
  uid: UID,
  thread: NetworkerThread,
  noResponseMsgs: string[],
}

export type OnDcDetected = {
  dc: DCNumber,
  uid: UID,
}

export type OnNext = {
  dc: DCNumber,
  uid: UID,
}

export type OnAuthResolve = {
  dc: DCNumber,
  uid: UID,
  authKey: CryptoKey,
  authKeyID: CryptoKey,
  serverSalt: CryptoKey,
}

export type OnAuthImport = {
  dc: DCNumber,
  uid: UID,
}
