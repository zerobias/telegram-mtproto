//@flow

import { reject, Fluture, of } from 'fluture'

import { send } from '../../http'
import { ErrorBadResponse, ErrorNotFound } from '../../error'
import { generateID } from '../time-manager'
import { readLong, readInt } from '../../tl/reader'
import { writeLong, writeLongP, writeInt } from '../../tl/writer'
import Config from 'ConfigProvider'
import { Serialization, Deserialization } from '../../tl'

export default function sendPlain(
  uid: string,
  url: string
) {
  const sendData = send(url)
  const onRes = plainRequest(uid, url)

  return (buffer: ArrayBuffer) =>
    onlySendPlainReq(uid, buffer)
      .chain(sendData)
      .mapRej(onlySendPlainErr)
      .chain(onRes)
}

const plainRequest = (uid, url) => req =>
  onlySendPlain(uid, url, req)

function onlySendPlainReq(uid: string, requestBuffer: ArrayBuffer) {
  const requestLength = requestBuffer.byteLength,
        requestArray = new Int32Array(requestBuffer)

  const header = new Serialization({}, uid)
  const headBox = header.writer

  writeLongP(headBox, 0, 0, 'auth_key_id') // Auth key
  writeLong(headBox, generateID(uid), 'msg_id') // Msg_id
  writeInt(headBox, requestLength, 'request_length')

  const headerBuffer: ArrayBuffer = headBox.getBuffer(),
        headerArray = new Int32Array(headerBuffer)
  const headerLength = headerBuffer.byteLength

  const resultBuffer = new ArrayBuffer(headerLength + requestLength),
        resultArray = new Int32Array(resultBuffer)

  resultArray.set(headerArray)
  resultArray.set(requestArray, headerArray.length)

  return of(resultArray)
}

function onlySendPlainErr(err) {
  if (err && err.response && err.response.status === 404)
    return new ErrorNotFound(err)
  return err
}

function onlySendPlain(
  uid: string,
  url: string,
  req/*::: **/
): Fluture<Deserialization, ErrorBadResponse> {
  if (!req.data || !req.data.byteLength) {
    const error = new ErrorBadResponse(url)
    Config.emit(uid)('response-raw', error)
    return reject(error)
  }

  let deserializer
  try {
    deserializer = new Deserialization(req.data, { mtproto: true }, uid)
    const ctx = deserializer.typeBuffer
    readLong(ctx, 'auth_key_id')
    readLong(ctx, 'msg_id')
    readInt(ctx, 'msg_len')
  } catch (e) {
    const error = new ErrorBadResponse(url, e)
    Config.emit(uid)('response-raw', error)
    return reject(error)
  }
  Config.emit(uid)('response-raw', {
    data      : req.data,
    status    : req.status,
    statusText: req.statusText
  })
  return of(deserializer)
}
