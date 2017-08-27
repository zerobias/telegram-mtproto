//@flow

export type MessageTypes =
  | 'msg_container'
  | 'bad_server_salt'
  | 'bad_msg_notification'
  | 'message'
  | 'new_session_created'
  | 'msgs_ack'
  | 'msg_detailed_info'
  | 'msg_new_detailed_info'
  | 'msgs_state_info'
  | 'rpc_result'
  | 'rpc_error'


export type APIObject = {
  _: string,
  [field: string]: any,
}

export type MTPᐸRpcResultᐳ = {
  _: 'rpc_result',
  req_msg_id: string,
  result?: APIObject
}

export type MTPᐸRpcErrorᐳ = {
  _: 'rpc_error',
  error_code: number,
  error_message: string,
}

export type MTPᐸAckᐳ = {
  _: 'msgs_ack',
  msg_ids: string[],
}

export type MTPᐸMessageᐳ = {
  _: 'message',
  msg_id: string,
  seqno: number,
  bytes: number,
  body: MTPᐸRpcResultᐳ,
}

export type MTPᐸContainerᐳ = {
  _: 'msg_container',
  messages: MTPᐸMessageᐳ[],
}

export type MTP =
  | MTPᐸRpcResultᐳ
  | MTPᐸAckᐳ
  | MTPᐸContainerᐳ
  | MTPᐸRpcErrorᐳ

export type ᐸMTᐳNewSessionCreated = {
  +_: string & 'new_session_created',
  +first_msg_id: string,
  +unique_id: string,
  +server_salt: string,
}

export type ᐸMTᐳBadSalt = {
  +_: string & 'bad_server_salt',
  +bad_msg_id: string,
  +bad_msg_seqno: number,
  +error_code: number,
  +new_server_salt: string,
}

export type ᐸMTᐳBadNotification = {
  +_: string & 'bad_msg_notification',
  +bad_msg_id: string,
  +bad_msg_seqno: number,
  +error_code: number,
}

export type ᐸMTᐳRpcResult = {
  +_: string & 'rpc_result',
  +req_msg_id: string,
  +result?: APIObject
}
