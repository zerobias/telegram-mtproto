//@flow

import { Stream, of, awaitPromises, periodic } from 'most'
import { complement, toPairs, contains } from 'ramda'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

// import snippet from 'Util/stream-snippet.draft'

import { API, NET } from '../action'
import normalize from '../../task/new-index'
import { type MessageUnit } from '../../task/index.h'
import { requestMap, homeStatus } from '../signal'
import jsonError from '../../util/json-error'
import parser from '../../service/chain'
import {
  queryNetworker,
  queryAuthID,
  queryAuthKey,
  queryAck,
} from '../query'
import NetworkerThread from '../../service/networker'
import List from '../../util/immutable-list'
import { type ApiNewRequest } from '../index.h'
import Status, { netStatusGuard, netStatuses } from '../../net-status'
import { bytesToHex, convertToUint8Array } from '../../bin'
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

const clockFast = periodic(300)
  .take(10)
  // .thru(guestStatus)
  .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
  // .sample(e => e, homeStatus)
  // .scan(x => x + 1, 0)
homeStatus.observe(e => console.log(`\n homeStatus \n`, e))

// clockFast.observe(e => console.log(`\n clockFast \n`, e))
// netStatusGuard(netStatuses.guest, homeStatus, clockFast)
//   .observe(e => console.log(`\n netStatus \n`, e))

export const onTaskEnd =
(action: Stream<any>) => action
  .thru(API.TASK.DONE.stream)
  // .thru(guestStatus)
  // .thru(e => netStatusGuard(netStatuses.halt, homeStatus, e))
  // .thru(e => netStatusGuard(netStatuses.guest, guards, e))
  .map(e => e.payload)
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
  .map(async(data) => {
    const { thread } = data
    const uid = thread.uid
    const { normalized, summary, statuses, ctx } = await normalize({ ...data, dc: thread.dcID })
    const { salt, auth } = summary
    const saltPairs = toPairs(salt)
    const authPairs = toPairs(auth)
    for (const [dc, value] of saltPairs) {
      if (!Array.isArray(value)) {
        await Config.storage.remove(uid, `dc${dc}_server_salt`)
      } else {
        await Config.storage.set(uid, `dc${dc}_server_salt`, bytesToHex(value))
      }
    }
    for (const [dc, value] of authPairs) {
      if (!Array.isArray(value)) {
        await Config.storage.remove(uid, `dc${dc}_auth_key`)
      } else {
        await Config.storage.set(uid, `dc${dc}_auth_key`, bytesToHex(value))
      }
    }

    for (const id of flatPairs(summary.processAck)) {
      processMessageAck(id, thread)
    }
    for (const id of flatPairs(summary.ack)) {
      ackMessage(id, thread)
    }
    for (const id of flatPairs(summary.reqResend)) {
      pushResend(id, thread)
    }
    performResend(thread)

    dispatch({
      type   : '[01] action carrier',
      payload: {
        normalized, summary, statuses
      }
    }, uid)
    return {
      ...data,
      ctx,
      normalized,
      summary,
      statuses,
    }
  })
  .thru(awaitPromises)
  .tap(({ normalized, summary, statuses }) => normalized.map(
    msg => console.log('normalized, summary', msg, `\n`, summary, `\n`, statuses)))
  .map(({ result, thread, ctx, noResponseMsgs, normalized }) => {
    const dc = thread.dcID
    // let parsingResult
    // try {
    //   parsingResult = await parser({
    //     responseBuffer: result.data,
    //     uid           : thread.uid,
    //     authKeyID     : queryAuthID(dc) || [],
    //     authKeyUint8  : convertToUint8Array(queryAuthKey(dc) || []),
    //     threadSessionID : querySession(dc) || [],
    //     prevSessionID : thread.prevSessionID,
    //     getMsgById    : thread.getMsgById,
    //   })
    // } catch (error) {
    //   console.log(error)
    //   parsingResult = false
    // }
    return {
      result: ctx,
      noResponseMsgs,
      thread,
      normalized,
    }
  })
  // .thru(awaitPromises)
  .map(async({ result, thread, noResponseMsgs, normalized }) => {
    // await thread.requestPerformer(message, noResponseMsgs, result)
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
      if (thread.state.hasSent(msgID)) {
        const msg = thread.state.getSent(msgID)
        sentDel.push(msg)
        thread.state.deleteSent(msg)
        msg.deferred.resolve()
      }
    // dispatch(NETWORKER_STATE.SENT.DEL(sentDel, thread.dcID))
    thread.checkConnectionPeriod = Math.max(1.1, Math.sqrt(thread.checkConnectionPeriod))
    thread.checkLongPoll()
    return normalized
  })
  .thru(awaitPromises)
  .map(API.TASK.DONE)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))
//)

function processMessageAck(msg: string, thread: NetworkerThread) {
  const sentMessage = thread.state.getSent(msg)
  if (sentMessage && !sentMessage.acked) {
    delete sentMessage.body
    sentMessage.acked = true
  }
}

function ackMessage(msg: string, thread: NetworkerThread) {
  const dc = thread.dcID
  const ackMsgIDs = queryAck(dc)
  if (contains(msg, ackMsgIDs)) return
  dispatch(NET.ACK_ADD({ dc, ack: [msg] }), thread.uid)
  thread.sheduleRequest(30000)
}

function pushResend(msg: string, thread: NetworkerThread) {
  tsNow
  const value = tsNow()
  const sentMessage = thread.state.getSent(msg)
  if (sentMessage instanceof NetContainer) {
    for (const msg of sentMessage.inner) {
      thread.state.setPending(msg, value)
    }
  } else {
    thread.state.setPending(msg, value)
  }
  thread.sheduleRequest(0)
}

function performResend(thread: NetworkerThread) {
  if (thread.state.hasResends()) {
    const resendMsgIDs = [...thread.state.getResends()]
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
