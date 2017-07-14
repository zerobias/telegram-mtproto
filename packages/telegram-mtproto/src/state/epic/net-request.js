//@flow

import { Stream, of, zip } from 'most'
import { equals } from 'ramda'

import Logger from 'mtproto-logger'
const log = Logger`net-request`

import { API, NET } from '../action'
import { NetMessage } from '../../service/networker/net-message'
import { apiMessage, encryptApiBytes, mtMessage } from '../../service/chain/encrypted-message'
import Config from '../../config-provider'
import NetworkerThread from '../../service/networker/index'
import { Serialization } from '../../tl/index'
import { httpClient } from '../../http'
import { homeDc, uid, active } from '../signal'
import { faucet } from '../../pull-stream'
import jsonError from '../../util/json-error'

function wait<Value>(val: Promise<Value>): Stream<Value> {
  return of(val).awaitPromises()
}

const makeApiBytes = ({ message, thread }) =>
  apiMessage({
    ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, thread.uid).writer,
    serverSalt: thread.serverSalt,
    sessionID : thread.sessionID,
    message
  })

const encryptedBytes = (opts: *) =>
  encryptApiBytes({
    bytes  : makeApiBytes(opts),
    authKey: opts.thread.authKeyUint8
  })

const faucetC =
  (source: Stream<*>) =>
    faucet(source, active).stream
type NetRequestPayload = {
  payload: {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread,
  },
  type: 'net/send',
}


export const onNewRequest = (action: Stream<*>) => action
  .thru(e => API.NEW_REQUEST.stream(e))
  .combine((data, homeDc) => ({ ...data, homeDc }), homeDc)
  .combine((data, uid) => ({ ...data, uid }), uid)
  .skipRepeatsWith((old, fresh) => equals(old.payload, fresh.payload))
  .map(data => data)
  .delay(100)
  .tap(val => val.payload.netReq.invoke())
  .filter(() => false)


const netRequest = (action: Stream<*>) =>
  action
    .thru(e => NET.SEND.stream(e))
    .thru(faucetC)
    .map(({ payload }: NetRequestPayload) => payload)
    .chain((opts) =>
      zip((opts, data) => ({ ...opts, ...data }),
          of(opts),
          wait(encryptedBytes(opts))))
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
    .map(async({ options, mtBytes, message, thread, noResponseMsgs, url }) => ({
      message,
      thread,
      noResponseMsgs,
      result: await httpClient.post(url, mtBytes, options)
    }))
    .chain(val => wait(val))
    .map(NET.RECEIVE_RESPONSE)
    .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))).delay(15))


export default netRequest
