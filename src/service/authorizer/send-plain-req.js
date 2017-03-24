//@flow

import Promise from 'bluebird'

import has from 'ramda/src/has'
import pathEq from 'ramda/src/pathEq'
import allPass from 'ramda/src/allPass'

import httpClient from '../../http'
import { ErrorBadResponse, ErrorNotFound } from '../../error'
import { generateID } from '../time-manager'
import { WriteMediator } from '../../tl'

import type { TLFabric } from '../../tl'

const is404 = pathEq(['response', 'status'], 404)
const notError = allPass([has('message'), has('type')])

const SendPlain = ({ Serialization, Deserialization }: TLFabric) => {
  const onlySendPlainReq = (url: string, requestBuffer: ArrayBuffer) => {
    const requestLength = requestBuffer.byteLength,
          requestArray = new Int32Array(requestBuffer)

    const header = Serialization()
    const headBox = header.writer

    WriteMediator.longP(headBox, 0, 0, 'auth_key_id') // Auth key
    WriteMediator.long(headBox, generateID(), 'msg_id') // Msg_id
    WriteMediator.int(headBox, requestLength, 'request_length')

    const headerBuffer: ArrayBuffer = headBox.getBuffer(),
          headerArray = new Int32Array(headerBuffer)
    const headerLength = headerBuffer.byteLength

    const resultBuffer = new ArrayBuffer(headerLength + requestLength),
          resultArray = new Int32Array(resultBuffer)

    resultArray.set(headerArray)
    resultArray.set(requestArray, headerArray.length)

    const requestData = resultArray
    // let reqPromise
    // try {
    const reqPromise = httpClient.post(url, requestData, {
      responseType: 'arraybuffer'
    })
    // } catch (e) {
    //   reqPromise = Promise.reject(new ErrorBadResponse(url, e))
    // }
    return Promise.props({ url, req: reqPromise })
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
    return Promise.reject(error)
  }

  const onlySendPlainRes = ({ url, req }) => {
    if (!req.data || !req.data.byteLength)
      return Promise.reject(new ErrorBadResponse(url))
    let deserializer
    try {
      deserializer = Deserialization(req.data, { mtproto: true })
      deserializer.fetchLong('auth_key_id')
      deserializer.fetchLong('msg_id')
      deserializer.fetchInt('msg_len')
    } catch (e) {
      return Promise.reject(new ErrorBadResponse(url, e))
    }

    return deserializer
  }

  const sendPlainReq = (url: string, requestBuffer: ArrayBuffer) =>
    onlySendPlainReq(url, requestBuffer)
      .then(
        onlySendPlainRes,
        onlySendPlainErr)

  return sendPlainReq
}

export default SendPlain