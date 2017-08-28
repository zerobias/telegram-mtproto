//@flow

import { Stream, of, awaitPromises } from 'most'
import { encaseP } from 'fluture'

import Logger from 'mtproto-logger'
const log = Logger`net-request`

import { statuses, statusGuard } from '../../status'
import { API, NET } from '../action'
import { NetMessage } from '../../service/networker/net-message'
import NetworkerThread from '../../service/networker'
import { apiMessage, mtMessage, encryptApiBytes } from '../../service/chain/encrypted-message'
import Config from 'ConfigProvider'
import { Serialization } from '../../tl'
import { send } from '../../http'
import { homeStatus, moduleStatus } from '../signal'
import jsonError from '../../util/json-error'
import {
  queryAuthID,
  querySalt,
  queryAuthKey,
  queryKeys,
} from '../query'
import Status, { netStatusGuard, netStatuses } from '../../net-status'
import { MaybeT } from 'Util/monad-t'
import { toUID } from '../index.h'

function makeApiBytes({ uid, dc, message, thread, ...rest }) {
  const keys = queryKeys(uid, dc)
  const session = Config.session.get(uid, dc)
  if (!MaybeT.isJust(keys))
    throw new TypeError(`No session! ${String(keys)}`)
  const { auth, salt, authID } = MaybeT.unsafeGet(keys)
  console.warn('salt, session', salt, session)
  const bytes = apiMessage({
    ctx       : new Serialization({ startMaxLength: message.body.length + 64 }, uid).writer,
    serverSalt: salt,
    sessionID : session,
    message
  })
  return encryptApiBytes(bytes, auth)
    .map(data => ({
      ...rest,
      ...data,
      uid, dc, message, thread,
      auth, salt, session, authID
    }))
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
    // .delay(100)
    // .thru(e => statusGuard(statuses.activated, moduleStatus, e))

  const casual = action
    .filter(data => data.netReq.needAuth)
    .thru(e => statusGuard(statuses.activated, moduleStatus, e))
    // .thru(e => netStatusGuard(netStatuses.active, homeStatus, e))
    // .delay(150)

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

function encryption(ctx) {
  const {
    bytes,
    msgKey,
    authID,
    uid,
    url,
    dc,
    thread,
    message,
    noResponseMsgs,
    ...rest
  } = ctx
  const request = new Serialization({
    startMaxLength: bytes.byteLength + 256
  }, uid).writer
  const mtBytes = mtMessage({
    ctx: request,
    authKeyID: authID,
    msgKey,
    encryptedBytes: bytes
  })

  function propsToResult(result) {
    return {
      result,
      message,
      dc,
      uid,
      thread,
      noResponseMsgs,
    }
  }

  return send(url, mtBytes)
    .map(propsToResult)
}

const netRequest = (action: Stream<any>) => action
  .thru(NET.SEND.stream)
  .map(e => e.payload)
  .map(data => ({ ...data, dc: data.thread.dcID }))
  .map(data => ({ ...data, uid: /*:: toUID(*/ data.thread.uid /*:: )*/ }))
  .map(data => ({ ...data, url: Config.dcMap(data.uid, data.dc) }))
  .map(data => makeApiBytes(data).chain(encryption).promise())
  .thru(awaitPromises)
  .tap(data => console.warn('RECIEVE RESP', data))
  .map(NET.RECEIVE_RESPONSE)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))


export default netRequest
