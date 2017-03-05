//@flow

import Promise from 'bluebird'
import { pathEq, allPass, has } from 'ramda'

import httpClient from '../../http'
import { ErrorBadResponse, ErrorNotFound } from '../../error'
import { generateID } from '../time-manager'

const is404 = pathEq(['response', 'status'], 404)
const notError = allPass([has('message'), has('type')])

export type TLs = { Serialization: any, Deserialization: any }

const SendPlain = ({ Serialization, Deserialization }: TLs) => {
  const onlySendPlainReq = (url: string, requestBuffer: ArrayBuffer) => {
    const requestLength = requestBuffer.byteLength,
          requestArray = new Int32Array(requestBuffer)

    const header = new Serialization()
    header.storeLongP(0, 0, 'auth_key_id') // Auth key
    header.storeLong(generateID(), 'msg_id') // Msg_id
    header.storeInt(requestLength, 'request_length')

    const headerBuffer: ArrayBuffer = header.getBuffer(),
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
      deserializer = new Deserialization(req.data, { mtproto: true })
      const auth_key_id = deserializer.fetchLong('auth_key_id')
      const msg_id = deserializer.fetchLong('msg_id')
      const msg_len = deserializer.fetchInt('msg_len')
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