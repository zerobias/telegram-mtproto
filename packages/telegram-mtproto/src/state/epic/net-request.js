//@flow

import { Stream, of, awaitPromises } from 'most'

import Logger from 'mtproto-logger'
const log = Logger`net-request`

import { statuses } from '../../status'
import { API, NET } from '../action'
import { onAction, onActionAndStatus } from '../helpers'
import { NetMessage } from '../../service/networker/net-message'
import { apiMessage, encryptApiBytes, mtMessage } from '../../service/chain/encrypted-message'
import Config from '../../config-provider'
import NetworkerThread from '../../service/networker'
import { Serialization } from '../../tl/index'
import { httpClient } from '../../http'
import { homeDc, uid } from '../signal'
import jsonError from 'Util/json-error'

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

function sideStream<A, B, C>(merge: (x: A, y: B) => C, main: Stream<A>, sub: Stream<B>) {
  return main.sample(merge, main, sub)
}

process.on('unhandledRejection', val => {
  console.log(val)
  console.trace('on')
})

export function onNewRequest(action: Stream<any>){
  const getDc = action
    .thru(onActionAndStatus(API.REQUEST.NEW, statuses.loaded))
    .filter(data => data.method === 'help.getNearestDc')


  const noAuth = action
    .thru(onActionAndStatus(API.REQUEST.NEW, statuses.dcDetected))
    .filter(data => !data.netReq.needAuth)
    .filter(data => data.method !== 'help.getNearestDc')

  const casual = action
    .thru(onActionAndStatus(API.REQUEST.NEW, statuses.activated))
    .filter(data => data.netReq.needAuth)

  const merged = getDc.merge(noAuth, casual)

  const homeCombine = (data, homeDc) => ({ ...data, homeDc })
  const uidCombine = (data, uid) => ({ ...data, uid })
  const withHome = sideStream(
    homeCombine,
    merged,
    homeDc
  )
  return sideStream(
    uidCombine,
    withHome,
    uid
  ).map(API.TASK.NEW)
}

export const onNewTask = (action: Stream<any>) => action
  .thru(onAction(API.TASK.NEW))
  // .delay(100)
  .tap(val => console.warn('onNewTask', val))
  .tap(val => {
    Array.isArray(val)
      ? val.map(v => v.netReq.invoke())
      : val.netReq.invoke()
  })
  .filter(() => false)

const netRequest = (action: Stream<any>) => action
  .thru(onAction(NET.SEND))
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
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))


export default netRequest
