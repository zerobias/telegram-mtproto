//@flow

import Bluebird from 'bluebird'
import { type AxiosXHR } from 'axios'
import { has, pathEq, allPass } from 'ramda'

import httpClient from '../../http'
import { ErrorBadResponse, ErrorNotFound } from '../../error'
import { generateID } from '../time-manager'
import { readLong, readInt } from '../../tl/reader'
import { writeLong, writeLongP, writeInt } from '../../tl/writer'
import Config from '../../config-provider'
import { Serialization, Deserialization } from '../../tl'

const is404 = pathEq(['response', 'status'], 404)
const notError = allPass([has('message'), has('type')])

const reqOpts = {
  responseType: 'arraybuffer'
}

const SendPlain = (uid: string) => {
  function onlySendPlainReq(requestBuffer: ArrayBuffer) {
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

    return resultArray
  }

  const onlySendPlainErr = (err) => {
    let error
    switch (true) {
      case is404(err):
        error = new ErrorNotFound(err)
        break
      case notError(err):
        error = new ErrorBadResponse('', err)
        break
      default:
        error = err
    }
    Config.emit(uid)('response-raw', error)
    return Bluebird.reject(error)
  }

  const onlySendPlainRes = (url: string) => (req: AxiosXHR<ArrayBuffer>) => {
    if (!req.data || !req.data.byteLength) {
      const error = new ErrorBadResponse(url)
      Config.emit(uid)('response-raw', error)
      return Bluebird.reject(error)
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
      return Bluebird.reject(error)
    }
    Config.emit(uid)('response-raw', {
      data      : req.data,
      status    : req.status,
      statusText: req.statusText
    })
    return deserializer
  }

  const sendPlainReq = (url: string, requestBuffer: ArrayBuffer) =>
    Bluebird
      .resolve()
      .then(() => onlySendPlainReq(requestBuffer))
      .then((bytes) => httpClient.post(url, bytes, reqOpts))
      .then(onlySendPlainRes(url), onlySendPlainErr)

  return sendPlainReq
}

export default SendPlain
