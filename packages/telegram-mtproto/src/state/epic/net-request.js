//@flow

import { Stream, of, awaitPromises } from 'most'
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
import { homeDc, uid, whenActive } from '../signal'
import jsonError from '../../util/json-error'
// import ApiRequest from '../../service/main/request'

function makeApiBytes({ message, thread }: {
  message: NetMessage,
  thread: NetworkerThread }
) {
  return apiMessage({
    ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, thread.uid).writer,
    serverSalt: thread.serverSalt,
    sessionID : thread.sessionID,
    message
  })
}

function encryptedBytes(opts: *): Promise<{|
  encryptedBytes: ArrayBuffer,
  msgKey: Uint8Array,
|}> {
  return encryptApiBytes({
    bytes  : makeApiBytes(opts),
    authKey: opts.thread.authKeyUint8
  })
}

type NetRequestPayload = {
  payload: {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread,
  },
  type: 'net/send',
}
// process.on('unhandledRejection', val => {
//   console.log(val)
//   console.trace('on')
// })

export const onNewRequest = (action: Stream<any>) => action
  .thru(API.NEW_REQUEST.stream)
  .thru(whenActive)
  .combine((data, homeDc) => ({ ...data, homeDc }), homeDc)
  .combine((data, uid) => ({ ...data, uid }), uid)
  .skipRepeatsWith((old, fresh) => equals(old.payload, fresh.payload))
  .map(API.CALL_TASK)

export const onNewTask = (action: Stream<any>) => action
  .thru(API.CALL_TASK.stream)
  .thru(whenActive)
  .map(({ payload }) => payload)
  // .delay(50)
  .tap(val => val.payload.netReq.invoke())
  .filter(() => false)

const netRequest = (action: Stream<any>) => action
  .thru(NET.SEND.stream)
  .thru(whenActive)
  .map(({ payload }: NetRequestPayload) => payload)
  .map(async({ options, ...data }) => ({
    ...data,
    options: {
      responseType: 'arraybuffer',
      ...options,
    },
    data: await encryptedBytes(data)
  }))
  .thru(awaitPromises)
  .map(({ data, ...opts }) => ({ ...data, ...opts }))
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
  .thru(awaitPromises)
  .map(NET.RECEIVE_RESPONSE)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))).delay(15))


export default netRequest
