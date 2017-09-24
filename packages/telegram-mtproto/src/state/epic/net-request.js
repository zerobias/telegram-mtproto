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
  isHomeDC,
} from '../query'
import { toUID, type UID } from 'Newtype'
import { makeAuthRequest } from '../../service/invoke'
import { getState, dispatch } from '../portal'
import { moveAuthProgression } from '../../task/single-handler'

function devLog(...data) {
  if (__DEV__)
    console.warn(...data)
}

const epicHandler = (actionCreator, future) => (action: Stream<any>) => action
  .thru(actionCreator.stream)
  .map(e => e.payload)
  .map(payload => future(payload).promise())
  .filter(() => false)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))

function makeApiBytes({ uid, dc, message, thread, ...rest }) {
  const keys = queryKeys(uid, dc).fold(() => false, x => x)
  if (__DEV__)
    console.error('keys', keys)
  const session = Config.session.get(uid, dc)
  if (typeof keys === 'boolean')
    throw new TypeError(`No session! ${String(keys)}`)
  const { auth, salt, authID } = keys
  devLog('salt, session', salt, session)
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
  300
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
  .tap(e => devLog(`before\n`, e))
  .filter(e => !!e)
  .filter(e => requestCache(e) || e.data.method === 'upload.getFile')
  .tap(e => devLog(`filtered\n`, e))
  // .map(e => e.payload)
  // .chain(e => of(e).delay(200))
  // .delay(100)
  // .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
  // .thru(guestStatus)
  .tap(val => devLog('onNewTask', val))
  .map(i => makeAuthRequest(i)
    .promise()
    .then(e => devLog(`result\n`, e)))
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

  return {
    mtBytes,
    url,
    message,
    dc,
    uid,
    thread,
    noResponseMsgs,
  }
}

export const encrypt = (action: Stream<any>) => action
  .thru(NET.ENCRYPT.stream)
  .map(e => e.payload)
  .map(data => ({ ...data, dc: data.thread.dcID }))
  .map(data => ({ ...data, uid: data.thread.uid }))
  .map(data => ({ ...data, url: Config.dcMap(data.uid, data.dc) }))
  .filter(({ dc, uid }) => !Config.halt.get(uid, dc))
  .filter(sendCache)
  // .filter(({ dc, uid }) => queryKeys(uid, dc).fold(() => false, () => true))
  // .filter(({ message }) => getState()
  //   .client[message.uid]
  //   .lastMessages
  //   .indexOf(message.msg_id) === -1)
  .map(data => futureEncrypt(data).promise())
  .filter(() => false)
  // .thru(awaitPromises)
  // .tap(data => console.warn('RECIEVE RESP', data))
  // .map(NET.RECEIVE_RESPONSE)
  // .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))

const sendEncrypted = ({ url, mtBytes, ...rest }) =>
  send(url, mtBytes)
    .map(result => ({ ...rest, result }))
    .map(res => dispatch(NET.RECEIVE_RESPONSE(res), res.uid))


const netRequest = epicHandler(
  NET.SEND,
  sendEncrypted
)

function withCurrentState(data) {
  return { state: getState(), payload: data.payload }
}

export const authTransfer = (action: Stream<any>) => action
  .thru(API.REQUEST.NEW.stream)
  .map(withCurrentState)
  .map(({ state, payload }) => ({ state, payload: payload.netReq }))
  .filter(({ payload }) => payload.needAuth && payload.dc.fold(
    () => false, dc => !isHomeDC(payload.uid, dc)
  ))
  //$off
  .map(({ payload }) => moveAuthProgression(payload.uid, payload.dc.value).promise())
  .filter(() => false)

const futureEncrypt = data => after(100, data)
  .chain(makeApiBytes)
  .map(encryption)
  .map(res => dispatch(NET.SEND(res), data.uid))

export default netRequest
