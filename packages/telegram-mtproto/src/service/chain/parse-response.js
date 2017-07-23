//@flow

import { Deserialization } from '../../tl/index'
import { bytesCmp, bytesToHex, convertToUint8Array, bytesToArrayBuffer, bytesFromArrayBuffer } from '../../bin'
import CryptoWorker from '../../crypto'
import getMsgKeyIv from './msg-key'
import { readLong } from '../../tl/reader'

type ReadResponse = {
  response: ArrayBuffer | Buffer,
  reader: Deserialization,
  authKeyStored: number[]
}

type GetDataWithPad = {
  authKey: Uint8Array,
  msgKey: Uint8Array,
  encryptedData: Uint8Array
}

type ReadHash = {
  reader: Deserialization,
  currentSession: number[],
  prevSession: number[],
  dataWithPadding: ArrayBuffer
}

type ParsedResponse = {
  hashData: Uint8Array,
  msgKey: Uint8Array,
  reader: Deserialization,
}


export function readResponse({ response, reader, authKeyStored }: ReadResponse) {
  const authKeyID = reader.fetchIntBytes(64, 'auth_key_id')
  if (!bytesCmp(authKeyID, authKeyStored)) {
    throw new Error(`[MT] Invalid server auth_key_id: ${  bytesToHex(authKeyID)}`)
  }
  const msgKey = reader.fetchIntBytes(128, 'msg_key')
  const encryptedData = reader.fetchRawBytes(
    response.byteLength - reader.getOffset(),
    'encrypted_data')
  return {
    msgKey,
    encryptedData
  }
}


export async function getDataWithPad({ authKey, msgKey, encryptedData }: GetDataWithPad) {
  const [aesKey, aesIv] = await getMsgKeyIv(authKey, msgKey, false)
  const dataWithPadding = await CryptoWorker.aesDecrypt(encryptedData, aesKey, aesIv)
  return dataWithPadding
}

export function readHash({ reader, currentSession, prevSession, dataWithPadding }: ReadHash) {
  reader.fetchIntBytes(64, 'salt')
  const sessionID = reader.fetchIntBytes(64, 'session_id')
  const messageID = readLong(reader.typeBuffer, 'message_id')

  const isInvalidSession = !bytesCmp(sessionID, currentSession) && (!prevSession
    //eslint-disable-next-line
    || !bytesCmp(sessionID, prevSession));
  if (isInvalidSession) {
    console.warn('Sessions', sessionID, currentSession, prevSession)
    throw new Error(`[MT] Invalid server session_id: ${ bytesToHex(sessionID) }`)
  }

  const seqNo = reader.fetchInt('seq_no')

  let offset = reader.getOffset()
  const totalLength = dataWithPadding.byteLength

  const messageBodyLength = reader.fetchInt('message_data[length]')
  if (messageBodyLength % 4
    || messageBodyLength > totalLength - offset) {
    throw new Error(`[MT] Invalid body length: ${  messageBodyLength}`)
  }
  const messageBody = reader.fetchRawBytes(messageBodyLength, 'message_data')

  const buffer = bytesToArrayBuffer(messageBody)

  offset = reader.getOffset()
  const paddingLength = totalLength - offset
  if (paddingLength < 0 || paddingLength > 15)
    throw new Error(`[MT] Invalid padding length: ${paddingLength}`)
  const hashData =
    convertToUint8Array(dataWithPadding)
      .subarray(0, offset)

  return {
    hashData,
    seqNo,
    messageID,
    sessionID,
    buffer
  }
}


export async function parsedResponse({ hashData, msgKey, reader }: ParsedResponse) {
  const dataHash = await CryptoWorker.sha1Hash(hashData)

  if (!bytesCmp(msgKey, bytesFromArrayBuffer(dataHash).slice(-16))) {
    console.warn(msgKey, bytesFromArrayBuffer(dataHash))
    throw new Error('[MT] server msgKey mismatch')
  }
  const response = reader.fetchObject('', 'INPUT')

  return response
}
