//@flow

import { Stream, of, zip } from 'most'

import { MAIN, NET } from '../action'
import { NetMessage } from '../../service/networker/net-message'
import { apiMessage, encryptApiBytes, mtMessage } from '../../service/chain/encrypted-message'
import Config from '../../config-provider'
import NetworkerThread from '../../service/networker/index'
import { Serialization } from '../../tl/index'
import { ErrorBadResponse, ErrorBadRequest } from '../../error'
import { httpClient } from '../../http'
import signal from '../signal'
import { faucet } from '../../pull-stream'

function wait<Value>(val: Promise<Value>): Stream<Value> {
  return of(val).awaitPromises()
}

const waitRequest = (url, data, config) =>
  wait(httpClient.post(url, data, config))

const faucetC =
  (source: Stream<*>) =>
    faucet(source, signal.active).stream
type NetRequestPayload = {
  payload: {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread,
  },
  type: 'send request',
}
const netRequest = (action: Stream<*>) =>
  action
    .thru(e => NET.SEND_REQUEST.stream(e))
    .thru(faucetC)
    .map(
      ({ payload }: NetRequestPayload) => {
        const { message, thread } = payload
        const apiBytes = apiMessage({
          ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, thread.uid).writer,
          serverSalt: thread.serverSalt,
          sessionID : thread.sessionID,
          message
        })
        return { ...payload, apiBytes } })
    .chain(
      ({ apiBytes, thread, ...rest }) =>
        zip((opts, data) => ({ thread, ...opts, ...data }),
            of(rest),
            wait(encryptApiBytes({
              bytes  : apiBytes,
              authKey: thread.authKeyUint8 }))))
    .map(({ options, ...rest }) => ({
      ...rest,
      options: {
        responseType: 'arraybuffer', ...options } }))
    .map(({ encryptedBytes, thread, msgKey, ...rest }) => {
      const request = new Serialization({
        startMaxLength: encryptedBytes.byteLength + 256
      }, thread.uid).writer

      const mtBytes = mtMessage({
        ctx      : request,
        authKeyID: thread.authKeyID,
        msgKey,
        encryptedBytes
      })
      const url = Config.dcMap(thread.uid, thread.dcID)
      return { thread, mtBytes, url, ...rest } })
    .chain(
      ({ options, mtBytes, url, ...rest }) =>
        zip((opts, result) => ({ ...opts, options, url, result }),
            of(rest),
            waitRequest(url, mtBytes, options)))
    .map(
      async({ thread, options, message, noResponseMsgs, url, result, }) => {

        try {
          // const result = await httpClient.post(url, mtBytes, options)
          console.log(result.data)
          if (!result.data.byteLength) {
            const err = new ErrorBadResponse(url, result)
            thread.emit('response-raw', err)
            return Promise.reject(err)
          }
          const response = await thread.parseResponse(result.data)
          await thread.requestPerformer(message, noResponseMsgs, response)
          thread.emit('response-raw', {
            data      : result.data,
            status    : result.status,
            statusText: result.statusText,
            message,
            options
          })
          return {
            data      : response,
            status    : result.status,
            statusText: result.statusText,
            message,
            options
          }
        } catch (error) {
          const err = new ErrorBadRequest(url, error)
          thread.emit('response-raw', err)
          return Promise.reject(err)
        }
      })
    .awaitPromises()
    .map(NET.RECIEVE_RESPONSE.action)
    .recoverWith(err => of(NET.NETWORK_ERROR.action(err)))


export default netRequest
