//@flow

import { Stream, of, awaitPromises } from 'most'
import choose from 'mezza'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

import { RpcApiError } from '../../error'
import { NET, API } from '../action'
import { whenActive, networker } from '../signal'
import jsonError from '../../util/json-error'
import { Left, Right, Either } from '../../util/either'

export type TaskEndData = {
  messages: Either<UniMessageR, UniMessageL>[]
}

const requestMap = (id: number) => networker
  .map(net => net.get(id))
  .map(net => net && net.requestMap)
  .startWith({})
  .filter(val => val != null)
  .skipRepeats()

export const onTaskEnd = (action: Stream<any>) => action
  .thru(e => API.CALL_RESULT.stream(e))
  .thru(whenActive)
  .map(val => val.payload)
  .combine((val, map) => ({
    ...val,
    messages: (
      // console.log(val.result),
      // console.log('map', map),
      chooseType(map)(val.result))
  }), requestMap(2))
  // .tap(val => console.log('val.messages', val.messages))
  .map(val => ({
    ...val,
    messages: Array.isArray(val.messages)
      ? val.messages.map(detectErrors)
      : val.messages
  }))
  .map(API.DONE_REQUEST)

export const receiveResponse = (action: Stream<any>) => action
  .thru(e => NET.RECEIVE_RESPONSE.stream(e))
  .thru(whenActive)
  .map(val => val.payload)
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
  .map(API.CALL_RESULT)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))).delay(15))

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
}

type SingleMessage = {
  _: 'rpc_result',
  req_msg_id: string,
  result: Object,
}

type ContainerMessage = {
  _: 'msg_container',
  messages: InnerMessage[]
}

type InnerMessage = {
  _: 'message',
  msg_id: string,
  seqno: number,
  body: SingleMessage | Object,
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
  type: 'rpc_result' | 'msg_container' | 'message' | 'rpc_error',
  meta: {[key: string]: mixed},
  data: Object | string[] | RpcApiError,
}

type TaskResultRaw = TaskResult<SingleMessage | ContainerMessage>

type ChooseType =
  (map: { [req: string]: string }) =>
    (val: TaskResultRaw) =>
      UniMessage[]

const chooseType: ChooseType = (map) => choose({
  Single: (val: ?TaskResultRaw) =>
    isObject(val)
    && isObject(val.response)
    && val.response._ === 'rpc_result',
  Container: (val: ?TaskResultRaw) =>
    isObject(val)
    && isObject(val.response)
    && val.response._ === 'msg_container',
}, {
  Single(val: TaskResult<SingleMessage>): UniMessage[] {
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
  Container(val: TaskResult<ContainerMessage>): UniMessage[] {
    const container = {
      ids : MsgId.container(val.messageID, map),
      type: 'msg_container',
      meta: {},
      data: val.response.messages.map(msg => msg.msg_id),
    }
    const result: UniMessage[] = [container]
    for (const message of val.response.messages) {
      const isSingleMessage = message.body._ === 'rpc_result'
      const ids = isSingleMessage
        ? MsgId.of(message.msg_id, val.messageID, message.body.req_msg_id, map)
        : MsgId.of(message.msg_id, val.messageID, message.msg_id, map)
      const data = isSingleMessage
        ? message.body.result
        : message.body
      result.push({
        ids,
        type: message.body._,
        meta: {},
        data
      })
    }
    return result
  },
  _: (val) => ({ type: 'Other', val }),
})

function detectErrors(message: UniMessage): Either<UniMessageR, UniMessageL> {
  const type = message.type
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
