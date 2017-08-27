//@flow

import { Stream, of, awaitPromises } from 'most'

import Logger from 'mtproto-logger'
const log = Logger`net-request`

import { statuses, statusGuard } from '../../status'
import { API, NET } from '../action'
import { NetMessage } from '../../service/networker/net-message'
import NetworkerThread from '../../service/networker'
import { apiMessage, encryptApiBytes, mtMessage } from '../../service/chain/encrypted-message'
import Config from 'ConfigProvider'
import { Serialization } from '../../tl'
import { httpClient } from '../../http'
import { homeStatus, moduleStatus } from '../signal'
import jsonError from '../../util/json-error'
import {
  queryAuthID,
  querySalt,
  queryAuthKey,
} from '../query'
import Status, { netStatusGuard, netStatuses } from '../../net-status'
import { convertToUint8Array } from '../../bin'

function makeApiBytes({ message, thread }: {
  message: NetMessage,
  thread: NetworkerThread }, dc
) {
  const salt = querySalt(dc)
  const authKey = queryAuthKey(dc)
  console.log('uid', thread.uid)
  const session = Config.session.get(thread.uid, dc)
  const isTotallyFuckedUp =
    !salt
    || salt.length === 0
    || !authKey
    || authKey.length === 0
  console.warn('salt, session', salt, session)
  if (isTotallyFuckedUp)
    //$off
    throw new TypeError(`No session! ${salt} ${authKey}`)
  return apiMessage({
    ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, thread.uid).writer,
    serverSalt: salt /*:: || [] */,
    sessionID : session,
    message
  })
}

function encryptedBytes(opts, dc): Promise<{
  encryptedBytes: ArrayBuffer,
  msgKey: Uint8Array,
}> {
  // console.warn((queryAuthKey(dc) || []).length, querySession(dc))
  return encryptApiBytes({
    bytes  : makeApiBytes(opts, dc),
    authKey: convertToUint8Array(queryAuthKey(dc) || [])
  })
}

export function onNewRequest(action$: Stream<any>){
  const action = action$
    .thru(e => API.REQUEST.NEW.stream(e))
    .map(e => e.payload)
  const getDc = action
    // .thru(e => API.REQUEST.NEW.stream(e))
    // .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
    // .thru(guestStatus)
    // .map(x => x.payload)
    .filter(data => data.method === 'help.getNearestDc')


  const noAuth = action
    // .thru(e => netStatusGuard(netStatuses.guest, homeStatus, e))
    .filter(data => !data.netReq.needAuth)
    .filter(data => data.method !== 'help.getNearestDc')
    .delay(100)
    // .thru(e => statusGuard(statuses.activated, moduleStatus, e))

  const casual = action
    .filter(data => data.netReq.needAuth)
    .thru(e => statusGuard(statuses.activated, moduleStatus, e))
    .thru(e => netStatusGuard(netStatuses.active, homeStatus, e))
    .delay(150)

  const merged = getDc.merge(noAuth, casual)

  // const withHome = merged
  //   .sample(
  //     (data, homeDc) => ({ ...data, homeDc }),
  //     merged,
  //     homeDc
  //   )
  return merged /* withHome
    .sample(
      (data, uid) => ({ ...data, uid }),
      withHome,
      uid
    ) */
    .thru(e => statusGuard(statuses.activated, moduleStatus, e))
    // .thru(e => netStatusGuard(netStatuses.guest, homeStatus, e))
    // .thru(guestStatus)
    // .thru(e => netStatusGuard(netStatuses.active, homeStatus, e))
    .map(API.TASK.NEW)
}

export const onNewTask = (action: Stream<any>) => action
  .thru(API.TASK.NEW.stream)
  .map(e => e.payload)
  // .chain(e => of(e).delay(200))
  // .delay(100)
  // .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
  // .thru(guestStatus)
  .tap(val => console.warn('onNewTask', val))
  .tap(val => {
    Array.isArray(val)
      ? val.map(v => v.netReq.invoke())
      : val.netReq.invoke()
  })
  .filter(() => false)

const netRequest = (action: Stream<any>) => action
  .thru(NET.SEND.stream)
  .map(e => e.payload)
  // .thru(guestStatus)
  // .thru(e => netStatusGuard(netStatuses.guest, homeStatus, e))
  .map(data => ({ ...data, dc: data.thread.dcID }))
  .map(data => ({ ...data, uid: data.thread.uid }))
  .map(data => ({ ...data, url: Config.dcMap(data.uid, data.dc) }))
  // .filter(({ message }) => equals)
  .map(async({ options, ...data }) => ({
    ...data,
    options: {
      responseType: 'arraybuffer',
      ...options,
    },
    data     : await encryptedBytes(data, data.dc),
    // net      : await queryNetworker(data.dc).promise(),
    authKeyID: queryAuthID(data.dc) || []
  }))
  .thru(awaitPromises)
  .tap(e => console.log('authKeyID', e.authKeyID))
  .map(({ data, ...opts }) => ({ ...data, ...opts }))
  // .map(({ net, ...data }) => ({ authKeyID: net.authSubKey.authKeyID, ...data }))
  .map(({ encryptedBytes, msgKey, authKeyID, uid, ...rest }) => {
    const request = new Serialization({
      startMaxLength: encryptedBytes.byteLength + 256
    }, uid).writer
    const mtBytes = mtMessage({
      ctx: request,
      authKeyID,
      msgKey,
      encryptedBytes
    })
    return { mtBytes, ...rest } })
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
