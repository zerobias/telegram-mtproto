//@flow

import List from 'Util/immutable-list'
import { NetMessage } from '../service/networker/net-message'
import { type ModuleStatus } from '../status'
import { type InitType } from './action'

export type MessageHistory = {
  id: string,
  seqNo: number,
  direction: 'in' | 'out'
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
    requestMap: { [req: string]: string },
  }, number>
}

