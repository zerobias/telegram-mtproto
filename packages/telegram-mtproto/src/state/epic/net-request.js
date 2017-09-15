//@flow

import { Stream, of, awaitPromises } from 'most'
import { encaseP, after, of as ofF } from 'fluture'

import Logger from 'mtproto-logger'
const log = Logger`net-request`

import { API, NET } from 'Action'
import { NetMessage } from '../../service/networker/net-message'
import NetworkerThread from '../../service/networker'
import ApiRequest from '../../service/main/request'
import { apiMessage, mtMessage, encryptApiBytes } from '../../service/chain/encrypted-message'
import Config from 'ConfigProvider'
import { Serialization } from '../../tl'
import { send } from '../../http'
import jsonError from 'Util/json-error'
import TTLCache from 'Util/request-cache'
import {
  queryKeys,
} from '../query'
import { MaybeT } from 'Monad'
import { toUID, type UID } from 'Newtype'
import { makeAuthRequest } from '../../service/invoke'
import { getState, dispatch } from '../portal'

function makeApiBytes({ uid, dc, message, thread, ...rest }) {
  const keys = queryKeys(uid, dc)
  if (__DEV__)
    console.error('keys', keys)
  const session = Config.session.get(uid, dc)
  if (!MaybeT.isJust(keys))
    throw new TypeError(`No session! ${String(keys)}`)
  const { auth, salt, authID } = MaybeT.unsafeGet(keys)
  if (__DEV__)
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

const requestCache = TTLCache(
  ({ requestID }: ApiRequest) => requestID,
  80
)

const sendCache = TTLCache(
  data => data.message.msg_id,
  80
)

export const onNewTask = (action: Stream<any>) => action
  .thru(API.NEXT.stream)
  .map(e => e.payload)
  .map(({ uid }) => getState().client[uid])
  .map(e => e.progress.current[0])
  .filter(e => !!e)
  .filter(requestCache)
  // .map(e => e.payload)
  // .chain(e => of(e).delay(200))
  // .delay(100)
  // .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
  // .thru(guestStatus)
  .tap(val => {
    if (__DEV__)
      console.warn('onNewTask', val)
  })
  .map(i => makeAuthRequest(i).promise())

  // .tap(val => {
  //   Array.isArray(val)
  //     ? val.map(v => v.netReq.invoke())
  //     : val.netReq.invoke()
  // })
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
  .map(data => ({ ...data, uid: data.thread.uid }))
  .map(data => ({ ...data, url: Config.dcMap(data.uid, data.dc) }))
  .filter(({ dc, uid }) => !Config.halt.get(uid, dc))
  .filter(sendCache)
  .filter(({ dc, uid }) => queryKeys(uid, dc).fold(() => false, () => true))
  // .filter(({ message }) => getState()
  //   .client[message.uid]
  //   .lastMessages
  //   .indexOf(message.msg_id) === -1)
  .map(data => requestItself(data).promise())
  .filter(() => false)
  // .thru(awaitPromises)
  // .tap(data => console.warn('RECIEVE RESP', data))
  // .map(NET.RECEIVE_RESPONSE)
  // .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))

const requestItself = data => after(100, data)
  .chain(makeApiBytes)
  .chain(encryption)
  .map(res => dispatch(NET.RECEIVE_RESPONSE(res), data.uid))
  .chainRej(err => ofF(dispatch(NET.NETWORK_ERROR(jsonError(err)), data.uid)))

export default netRequest
