//@flow

import { Stream, of } from 'most'
import { of as ofF } from 'fluture'
import { toPairs, contains } from 'ramda'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

import { API, NET } from '../action'
import { normalize, decrypt } from '../../task'
import jsonError from 'Util/json-error'
import {
  queryAck,
} from '../query'
import NetworkerThread from '../../service/networker'
import { dispatch } from '../portal'
import { tsNow } from '../../service/time-manager'
import { NetContainer } from '../../service/networker/net-message'
import Config from 'ConfigProvider'

function flatPairs(data) {
  return []
    .concat(
      ...toPairs(data)
        .map(([n, list]) => list)
    )

}

const epicHandler = (actionCreator, future) => (action: Stream<any>) => action
  .thru(actionCreator.stream)
  .map(e => e.payload)
  .map(payload => future(payload)
    .chainRej(err => ofF(dispatch(NET.NETWORK_ERROR(jsonError(err)), payload.uid)))
    .promise())
  .filter(() => false)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))

export const receiveResponse = epicHandler(
  NET.RECEIVE_RESPONSE,
  payload => decrypt(payload)
    .map(normalize)
    .map((data) => {
      const {
        normalized,
        summary,
        dc,
        uid,
        // salt: saltKey,
        // auth: authKey,
        thread,
      } = data
      const {
        processAck,
        ack,
        reqResend,
      } = summary
      // const { salt, auth } = summary
      // const saltPairs = toPairs(salt)
      // const authPairs = toPairs(auth)
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

      for (const id of flatPairs(processAck)) {
        processMessageAck(uid, dc, id)
      }
      for (const id of flatPairs(ack)) {
        ackMessage(uid, dc, id, thread)
      }
      for (const id of flatPairs(reqResend)) {
        pushResend(uid, dc, id, thread)
      }
      performResend(uid, dc, thread)

      dispatch({
        type   : '[01] action carrier',
        payload: {
          normalized, summary
        }
      }, uid)
      if (__DEV__)
        normalized.forEach(
          msg => console.log(
            'normalized, summary',
            msg, `\n`,
            summary, `\n`))
      return {
        ...data,
        uid,
        dc,
        normalized,
      }
    })
    .map(({ uid, dc, thread, noResponseMsgs, normalized }) => {
      // await thread.requestPerformer(message, noResponseMsgs, result)
      const cache = Config.fastCache.get(uid, dc)
      // thread.toggleOffline(false)
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
)

function processMessageAck(uid, dc, msg: string) {
  const cache = Config.fastCache.get(uid, dc)
  const sentMessage = cache.getSent(msg)
  if (sentMessage && !sentMessage.acked) { //TODO Warning, mutable changes!
    delete sentMessage.body
    sentMessage.acked = true
  }
}

function ackMessage(uid, dc, msg: string, thread: NetworkerThread) {
  const ackMsgIDs = queryAck(uid, dc)
  if (contains(msg, ackMsgIDs)) return
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
  thread.sheduleRequest(100)
}

function performResend(uid, dc, thread: NetworkerThread) {
  const cache = Config.fastCache.get(uid, dc)
  if (cache.hasResends()) {
    const resendMsgIDs = [...cache.getResends()]
    const resendOpts = { noShedule: true, notContentRelated: true }
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
