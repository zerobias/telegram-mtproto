//@flow

import { readResponse, getDataWithPad, readHash, parsedResponse } from './parse-response'
import { Deserialization } from '../../tl'
import { NetMessage } from '../networker/net-message'

export type ParserContext = {
  responseBuffer: ArrayBuffer,
  uid: string,
  authKeyID: number[],
  authKeyUint8: Uint8Array,
  thisSessionID: number[],
  prevSessionID: number[],
  getMsgById: ({ req_msg_id: string }) => NetMessage,
}

async function parser({
  responseBuffer,
  uid,
  authKeyID,
  authKeyUint8,
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
    authKeyStored: authKeyID
  })

  const dataWithPadding = await getDataWithPad({
    authKey: authKeyUint8,
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
    dataWithPadding
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

export default parser
