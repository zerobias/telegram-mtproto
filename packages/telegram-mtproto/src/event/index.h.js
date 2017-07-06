//@flow

import { NetMessage } from '../service/networker/net-message'
import { RpcError } from '../error'

export type OnRpcError = {
  threadID: string,
  networkerDC: number,
  error: RpcError,
  sentMessage: NetMessage,
  message: { _: string, req_msg_id: string, [key: string]: any }
}

export type ApiObject = {
  _: string,
  msg_id: string,
  body: Object,
  [key: string]: mixed
}
