//@flow

import List from '../util/immutable-list'
import { NetMessage } from '../service/networker/net-message'

export type MessageHistory = {
  id: string,
  seqNo: number,
  direction: 'in' | 'out'
}

export type State = {
  _: true,
  active: boolean,
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

