//@flow

import { Stream, of, awaitPromises } from 'most'
import choose from 'mezza'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

import processTask from '../../task'
import { RpcApiError } from '../../error'
import { API, NET } from '../action'
import { onAction } from '../helpers'
import { networker } from '../signal'
import jsonError from '../../util/json-error'
import { Left, Right, Either } from '../../util/either'
import {
  type MTP,
  type MTPᐸRpcResultᐳ,
  type MTPᐸContainerᐳ,
  type MTPᐸAckᐳ,
} from '../../mtp.h'
import { type NetIncomingData } from '../action'
export type TaskEndData = {
  messages: Either<UniMessageR, UniMessageL>[] | {
    type: 'Other',
    val: TaskResult<UniMessage>,
  }
}

const requestMap = (id: number) => networker
  .map(net => net.get(id))
  .map(net => net && net.requestMap)
  .startWith({})
  .filter(val => val != null)
  .skipRepeats()

export const onTaskEnd = (action: Stream<any>) => action
  .thru(onAction(API.TASK.DONE))
  .delay(500)
  .combine((val, map) => ({
    ...val,
    messages: (
      // console.log(val.result),
      // console.log('map', map),
      chooseType(map)(val.result))
  }), requestMap(2))
  .tap(({ thread, ...rest }) => console.log('val', rest))
  .tap(processTask)
  .map(val => ({
    ...val,
    messages: Array.isArray(val.messages)
      ? val.messages.map(detectErrors)
      : val.messages
  }))
  .map(data => API.REQUEST.DONE(data, data.result.messageID))

export const receiveResponse = (action: Stream<any>) => action
  .thru(onAction(NET.RECEIVE_RESPONSE))
  .map(async({ result, thread, message, noResponseMsgs }) => ({
    result: await thread.parseResponse(result.data),
    noResponseMsgs,
    thread,
    message
  }))
  .thru(awaitPromises)
  .map(async({ result, thread, message, noResponseMsgs }) => {
    await thread.requestPerformer(message, noResponseMsgs, result)
    return {
      result,
      thread,
      message
    }
  })
  .thru(awaitPromises)
  .map(API.TASK.DONE)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))

class MsgId {
  real: string
  box: string
  req: string
  linked: string | void
  constructor(real: string, box: string, req: string, map: { [req: string]: string }) {
    this.real = real
    this.box = box
    this.req = req
    this.linked = map[req]
  }
  static container(box: string, map: { [req: string]: string }) {
    return new MsgId(box, box, box, map)
  }
  static single(real: string, req: string, map: { [req: string]: string }) {
    return new MsgId(real, real, req, map)
  }
  static of(real: string, box: string, req: string, map: { [req: string]: string }) {
    return new MsgId(real, box, req, map)
  }
}

type TaskResult<Response> = {
  messageID: string,
  seqNo: number,
  response: Response,
  sessionID: Uint8Array,
}

type UniMessageL = {
  ids: MsgId,
  type: 'rpc_error',
  meta: {[key: string]: mixed},
  data: RpcApiError,
}

type UniMessageR = {
  ids: MsgId,
  type: 'rpc_result' | 'msg_container' | 'message',
  meta: {[key: string]: mixed},
  data: Object | string[],
}

type UniMessage = {
  ids: MsgId,
  //$FlowIssue
  type: 'rpc_result' | 'msg_container' | 'message' | 'rpc_error' | 'msgs_ack',
  meta: {[key: string]: mixed},
  data: Object | string[] | RpcApiError,
}

/*::
declare var __result: NetIncomingData
type NetResult = typeof __result.result
*/

type ChooseType =
  (map: { [req: string]: string }) =>
    <T: MTP>(val: TaskResult<T>) =>
      UniMessage[]

const chooseType: ChooseType = (map) => choose({
  Single(val: TaskResult<MTP>): boolean {
    return isObject(val)
    && isObject(val.response)
    && val.response._ === 'rpc_result'
  },
  Container(val: TaskResult<MTP>): boolean {
    return isObject(val)
    && isObject(val.response)
    && val.response._ === 'msg_container'
  },
  Ack(val: TaskResult<MTP>): boolean {
    return isObject(val)
    && isObject(val.response)
    && val.response._ === 'msgs_ack'
  },
//$FlowIssue
}, {
  Single(val: TaskResult<MTPᐸRpcResultᐳ>): UniMessage[] {
    let type = val.response._
    let data = val.response
    if (isObject(val.response.result)) {
      type = val.response.result._
      data = val.response.result
    }
    return [{
      ids : MsgId.single(val.messageID, val.response.req_msg_id, map),
      type,
      meta: {},
      data,
    }]
  },
  Container(val: TaskResult<MTPᐸContainerᐳ>): UniMessage[] {
    const container = {
      ids : MsgId.container(val.messageID, map),
      type: 'msg_container',
      meta: {},
      data: val.response.messages.map(msg => msg.msg_id),
    }
    const result: UniMessage[] = [container]
    for (const message of val.response.messages) {
      const { body } = message
      let ids, data
      if (body._ === 'rpc_result') {
        /*::
        declare var __body: MTPᐸRpcResultᐳ
        const body = __body
        */
        ids = MsgId.of(
          message.msg_id,
          val.messageID, body.req_msg_id,
          map
        )
        data = body.result || body
      } else {
        ids = MsgId.of(
          message.msg_id,
          val.messageID,
          message.msg_id,
          map
        )
        data = body
      }
      result.push({
        ids,
        type: message.body._,
        meta: {},
        data
      })
    }
    return result
  },
  Ack(val: TaskResult<MTPᐸAckᐳ>): UniMessage[] {
    return [{
      ids: MsgId.single(
        val.messageID,
        val.messageID,
        map
      ),
      type: val.response._,
      meta: {},
      data: val.response
    }]
  },
  _: (val) => ({ type: 'Other', val }),
})

function detectErrors(message: UniMessage): Either<UniMessageR, UniMessageL> {
  let type = message.type
  if (message.data && message.data._)
    type = message.data._
  if (type === 'rpc_error') {
    //$FlowIssue
    const data = RpcApiError.of(message.data)
    //$FlowIssue
    return Left({ ...message, data, type })
  } else {
    //$FlowIssue
    const cast: UniMessageR = message
    return Right(cast)
  }
}

function isObject(obj: mixed): boolean %checks {
  return (
    typeof obj === 'object'
    && obj != null
  )
}
