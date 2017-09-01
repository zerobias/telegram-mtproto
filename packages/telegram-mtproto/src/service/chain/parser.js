//@flow

import { readResponse, getDataWithPad, readHash, parsedResponse } from './parse-response'
import { Deserialization } from '../../tl'
import { NetMessage } from '../networker/net-message'

import {
  type CryptoKey,
  type DCNumber,
  type UID,
} from 'Newtype'

import { convertToUint8Array } from 'Bin'

export type ParserContext = {
  responseBuffer: ArrayBuffer,
  uid: UID,
  dc: DCNumber,
  authKeyID: CryptoKey,
  authKey: CryptoKey,
  // authKeyUint8: Uint8Array,
  thisSessionID: number[],
  prevSessionID: number[],
  getMsgById: ({ req_msg_id: string }) => NetMessage,
}

export default async function parser({
  responseBuffer,
  uid,
  dc,
  authKeyID,
  authKey,
  thisSessionID,
  prevSessionID,
  getMsgById,
}: ParserContext): Promise<{
  response: Object,
  messageID: string,
  sessionID: Uint8Array,
  seqNo: number
}> {

  const { msgKey, encryptedData } = readResponse({
    reader       : new Deserialization(responseBuffer, {}, uid),
    response     : responseBuffer,
    authKeyStored: [...authKeyID]
  })

  const dataWithPadding = await getDataWithPad({
    authKey: convertToUint8Array(authKey),
    msgKey,
    encryptedData
  })

  const {
    hashData,
    seqNo,
    messageID,
    buffer,
    sessionID,
  } = readHash({
    reader        : new Deserialization(dataWithPadding, { mtproto: true }, uid),
    currentSession: thisSessionID,
    prevSession   : prevSessionID,
    dataWithPadding,
    uid,
  })

  const deserializerOptions = {
    mtproto: true,
    getter : getMsgById
  }
  //$FlowIssue
  const response: Object = await parsedResponse({
    hashData,
    msgKey,
    reader: new Deserialization(buffer, deserializerOptions, uid)
  })

  return {
    response,
    messageID,
    sessionID,
    seqNo
  }
}
