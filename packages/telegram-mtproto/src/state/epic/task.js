//@flow

import { Stream, of, awaitPromises } from 'most'
import { complement, toPairs, contains } from 'ramda'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

// import snippet from 'Util/stream-snippet.draft'

import { API, NET } from '../action'
import normalize, { decrypt } from '../../task/new-index'
import { type MessageUnit } from '../../task/index.h'
import { requestMap } from '../signal'
import jsonError from 'Util/json-error'
// import parser from '../../service/chain'
import {
  queryAck,
} from '../query'
import NetworkerThread from '../../service/networker'
import List from 'Util/immutable-list'
import { type ApiNewRequest } from '../index.h'
import { bytesToHex } from 'Bin'
import { dispatch } from '../portal'
import { tsNow } from '../../service/time-manager'
import { NetContainer } from '../../service/networker/net-message'
import Config from 'ConfigProvider'


const isHandled = (unit: MessageUnit) =>
  unit.flags.error
  && unit.error.handled
  // && unit.flags.api
  // && unit.api.resolved

const notHandled = complement(isHandled)


export const onTaskEnd =
(action: Stream<any>) => action
  .thru(API.TASK.DONE.stream)
  // .thru(guestStatus)
  // .thru(e => netStatusGuard(netStatuses.halt, homeSttus, e))
  // .thru(e => netStatusGuard(netStatuses.guest, guards, e))
  .map(e => e.payload)
  .filter((list) => list.length !== 0 && !Config.halt.get(list[0].uid, list[0].dc))
  .chain(normalized => {
    // const withData = normalized => ({ normalized, ...data })
    const handledList = normalized
      .filter(isHandled)
      .map((val: MessageUnit): string => val.api.apiID)
    const handledS = of(handledList)
    const fn = (list: string[], reqMap: List<ApiNewRequest, string>): ApiNewRequest[] => list
      .filter(val => reqMap.has(val))
      .map((val): ApiNewRequest => reqMap.get(val))
    const apiMap = requestMap.map(val => val.api)
    const handled =
      handledS.sample(fn, handledS, apiMap)
      // .delay(100)
        .map(API.TASK.NEW)
        // .map(withData)
        // const reqStream = sideStream((data, req) => {
        //   return data
        // }, handled, req$)
        // .thru(withReqMap)
        // .map(obj => obj)
        // .map(API.TASK.NEW)
    const other = of(normalized.filter(notHandled))
      // .map(withData)
      // .delay(100)
      .map(API.REQUEST.DONE)
    return other.merge(handled)
  })
  // .map(({ normalized }) => normalized)
  // .map(mapEitherUnits)
  /* .delay(500)
  .combine((val, map) => ({
    ...val,
    messages: (
      // console.log(val.result),
      // console.log('map', map),
      chooseType(map)(val.result))
  }), homeDc.chain(requestMap))
  .tap(({ thread, ...rest }) => console.log('val', rest))
  .map(val => ({
    ...val,
    messages: Array.isArray(val.messages)
      ? val.messages.map(detectErrors)
      : val.messages
  })) */
// )

function flatPairs(data) {
  return []
    .concat(
      ...toPairs(data)
        .map(([n, list]) => list)
    )

}

export const receiveResponse = (action: Stream<any>) => action
  .thru(NET.RECEIVE_RESPONSE.stream)
  .map(e => e.payload)
  // .thru(e => netStatusGuard(netStatuses.guest, guards, e))
  .map(data => decrypt(data).promise())
  .thru(awaitPromises)
  .map(normalize)
  .map(async(data) => {
    const {
      normalized,
      summary,
      statuses,
      dc,
      uid,
      salt: saltKey,
      auth: authKey,
      thread,
    } = data
    const { salt, auth } = summary
    const saltPairs = toPairs(salt)
    const authPairs = toPairs(auth)
    // for (const [dc, value] of saltPairs) {
    //   if (!Array.isArray(value)) {
    //     await Config.storage.remove(uid, `dc${dc}_server_salt`)
    //   } else {
    //     await Config.storage.set(uid, `dc${dc}_server_salt`, value)
    //   }
    // }
    // for (const [dc, value] of authPairs) {
    //   if (!Array.isArray(value)) {
    //     await Config.storage.remove(uid, `dc${dc}_auth_key`)
    //   } else {
    //     await Config.storage.set(uid, `dc${dc}_auth_key`, value)
    //   }
    // }

    for (const id of flatPairs(summary.processAck)) {
      processMessageAck(uid, dc, id)
    }
    for (const id of flatPairs(summary.ack)) {
      ackMessage(uid, dc, id, thread)
    }
    for (const id of flatPairs(summary.reqResend)) {
      pushResend(uid, dc, id, thread)
    }
    performResend(uid, dc, thread)

    dispatch({
      type   : '[01] action carrier',
      payload: {
        normalized, summary, statuses
      }
    }, uid)
    return {
      ...data,
      uid,
      dc,
      normalized,
      summary,
      statuses,
    }
  })
  .thru(awaitPromises)
  .tap(({ normalized, summary, statuses }) => normalized.map(
    msg => console.log('normalized, summary', msg, `\n`, summary, `\n`, statuses)))
  // .map(({ uid, dc, result, thread, ctx, noResponseMsgs, normalized }) => {
  //   // let parsingResult
  //   // try {
  //   //   parsingResult = await parser({
  //   //     responseBuffer: result.data,
  //   //     uid           : thread.uid,
  //   //     authKeyID     : queryAuthID(dc) || [],
  //   //     authKeyUint8  : convertToUint8Array(queryAuthKey(dc) || []),
  //   //     threadSessionID : querySession(dc) || [],
  //   //     prevSessionID : thread.prevSessionID,
  //   //     getMsgById    : thread.getMsgById,
  //   //   })
  //   // } catch (error) {
  //   //   console.log(error)
  //   //   parsingResult = false
  //   // }
  //   return {
  //     result: ctx,
  //     uid, dc,
  //     noResponseMsgs,
  //     thread,
  //     normalized,
  //   }
  // })
  // // .thru(awaitPromises)
  .map(({ uid, dc, thread, noResponseMsgs, normalized }) => {
    // await thread.requestPerformer(message, noResponseMsgs, result)
    const cache = Config.fastCache.get(uid, dc)
    thread.toggleOffline(false)
    // const response = await thread.parseResponse(result.data)
    // log(`Server response`, `dc${thread.dcID}`)(result)
    // log(`message`)(message)
    // if (typeof result === 'object')
    //   await thread.processMessage(
    //     result.response,
    //     result.messageID,
    //     result.sessionID)
    const sentDel = []
    for (const msgID of noResponseMsgs)
      if (cache.hasSent(msgID)) {
        const msg = cache.getSent(msgID)
        sentDel.push(msg)
        cache.deleteSent(msg)
        msg.deferred.resolve()
      }
    // dispatch(NETWORKER_STATE.SENT.DEL(sentDel, thread.dcID))
    thread.checkConnectionPeriod = Math.max(1.1, Math.sqrt(thread.checkConnectionPeriod))
    thread.checkLongPoll()
    const result = normalized.map(obj => ({ ...obj, uid }))
    dispatch(API.TASK.DONE(result), uid)
  })
  .filter(() => false)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))
//)

function processMessageAck(uid, dc, msg: string) {
  const cache = Config.fastCache.get(uid, dc)
  const sentMessage = cache.getSent(msg)
  if (sentMessage && !sentMessage.acked) { //TODO Warning, mutable changes!
    delete sentMessage.body
    sentMessage.acked = true
  }
}

function ackMessage(uid, dc, msg: string, thread: NetworkerThread) {
  const cache = Config.fastCache.get(uid, dc)
  const ackMsgIDs = queryAck(uid, dc)
  if (contains(msg, ackMsgIDs)) return
  cache
  dispatch(NET.ACK_ADD({ dc, ack: [msg] }), uid)
  thread.sheduleRequest(30000)
}

function pushResend(uid, dc, msg: string, thread: NetworkerThread) {
  const cache = Config.fastCache.get(uid, dc)
  const value = tsNow()
  const sentMessage = cache.getSent(msg)
  if (sentMessage instanceof NetContainer) {
    for (const msg of sentMessage.inner) {
      cache.setPending(msg, value)
    }
  } else {
    cache.setPending(msg, value)
  }
  thread.sheduleRequest(0)
}

function performResend(uid, dc, thread: NetworkerThread) {
  const cache = Config.fastCache.get(uid, dc)
  if (cache.hasResends()) {
    const resendMsgIDs = [...cache.getResends()]
    const resendOpts = { noShedule: true, notContentRelated: true }
    // console.log('resendReq messages', resendMsgIDs)
    const msg = thread.wrapMtpMessage({
      _      : 'msg_resend_req',
      msg_ids: resendMsgIDs
    }, resendOpts)
    thread.lastResendReq = {
      req_msg_id    : msg.msg_id,
      resend_msg_ids: resendMsgIDs,
    }
  }
}
