//@flow

import { Stream, of, zip, throwError } from 'most'
import { type AxiosXHR } from 'axios'
import Logger from 'mtproto-logger'
const log = Logger`net-request`

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

const makeApiBytes = ({ message, uid, authData }) =>
  apiMessage({
    ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, uid).writer,
    serverSalt: authData.salt,
    sessionID : authData.session,
    message
  })
const intoError = (data, url: string) => throwError(new ErrorBadResponse(url, data))

const encryptedBytes = (opts: *) =>
  encryptApiBytes({
    bytes  : makeApiBytes(opts),
    authKey: opts.authData.authKeyUint8
  })
//$FlowIssue
const waitRequest = (url, data, config): Stream<AxiosXHR<ArrayBuffer>> =>
  wait(httpClient.post(url, data, config))
    .chain(response =>
      response.data instanceof ArrayBuffer
        ? of(response)
        : intoError(response, url))

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

const getAuthData = (id: number) =>
  signal.networker
    .map(e => e.get(id))
    .map(({ authKey, authSubKey, salt, session }) => ({
      authKey,
      session,
      salt,
      ...authSubKey,
    }))

const netRequest = (action: Stream<*>) =>
  action
    .thru(e => NET.SEND_REQUEST.stream(e))
    .thru(faucetC)
    .map(({ payload }: NetRequestPayload) => payload)
    .chain(opts =>
      getAuthData(opts.thread.dcID)
        .map((authData: *) => ({
          ...opts,
          uid: opts.thread.uid, authData,
          dc : opts.thread.dcID,
        })))
    .chain((opts) =>
      zip((opts, data) => ({ ...opts, ...data }),
          of(opts),
          wait(encryptedBytes(opts))))
    .map((opts) => ({
      ...opts,
      options: {
        responseType: 'arraybuffer', ...opts.options } }))
    .map(({ encryptedBytes, authData, uid, dc, msgKey, ...rest }) => {
      const request = new Serialization({
        startMaxLength: encryptedBytes.byteLength + 256
      }, uid).writer

      const mtBytes = mtMessage({
        ctx      : request,
        authKeyID: authData.authKeyID,
        msgKey,
        encryptedBytes
      })
      const url = Config.dcMap(uid, dc)
      return { mtBytes, url, ...rest } })
    .chain(
      ({ options, mtBytes, url, ...rest }) =>
        zip((opts, result) => ({ ...opts, options, url, result }),
            of(rest),
            waitRequest(url, mtBytes, options)))
    .chain((opts) =>
      zip((opts, response) => ({ ...opts, response }),
          of(opts),
          wait(opts.thread.parseResponse(opts.result.data))
            .recoverWith(err => intoError(err, opts.url))))
    .chain((opts) =>
      zip(x => x,
          of(opts),
          wait(opts.thread.requestPerformer(opts.message,
                                            opts.noResponseMsgs,
                                            opts.response))
            .recoverWith(err => intoError(err, opts.url))))
    .map(({ options, message, result, response }) => ({
      data      : response,
      status    : result.status,
      statusText: result.statusText,
      message,
      options
    }))
    .tap(log`response-raw`)
    .map(NET.RECIEVE_RESPONSE)
    .recoverWith(err => of(NET.NETWORK_ERROR(err)).delay(15))


export default netRequest
