//@flow

import { Stream, of, awaitPromises } from 'most'
import choose from 'mezza'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

import { NET, API } from '../action'
import { whenActive } from '../signal'
import jsonError from '../../util/json-error'
import { FutureFold } from '../../util/folding'

export const onTaskEnd = (action: Stream<any>) => action
  .thru(e => API.CALL_RESULT.stream(e))
  .thru(whenActive)
  .map(({ payload }) => payload)
  .map(async val => ({
    ...val,
    monad: await checkResponse(val.result).promise()
  }))
  .thru(awaitPromises)
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



type RawErrorStruct = {
  _: 'rpc_error',
  error_code: number,
  error_message: string,
}

function isRawError(val: mixed): boolean %checks {
  return typeof val === 'object'
    && val != null
    && val._ === 'rpc_error'
    && typeof val.error_code === 'number'
    && typeof val.error_message === 'string'
}

function isContainsError(val: mixed): boolean %checks {
  return typeof val === 'object'
    && val != null
    && val._ === 'rpc_result'
    && isRawError(val.result)
}

class MsgId {
  real: string
  box: string
  req: string
  constructor(real: string, box: string, req: string) {
    this.real = real
    this.box = box
    this.req = req
  }
  static container(box: string) {
    return new MsgId(box, box, box)
  }
  static single(real: string, req: string) {
    return new MsgId(real, real, req)
  }
  static of(real: string, box: string, req: string) {
    return new MsgId(real, box, req)
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

type UniMessage = {
  ids: MsgId,
  type: 'rpc_result' | 'msg_container' | 'message',
  meta: {[key: string]: mixed},
  data: Object,
}

const chooseType = choose({
  Single   : (val: TaskResult<SingleMessage | ContainerMessage>) => val.response._ === 'rpc_result',
  Container: (val: TaskResult<SingleMessage | ContainerMessage>) => val.response._ === 'msg_container',
  // Error    : val => val._ === 'rpc_error'
}, {
  Single(val: TaskResult<SingleMessage>): UniMessage[] {
    return [{
      ids : MsgId.single(val.messageID, val.response.req_msg_id),
      type: 'rpc_result',
      meta: {},
      data: val.response.result,
    }]
  },
  Container(val: TaskResult<ContainerMessage>): UniMessage[] {
    const container = {
      ids : MsgId.container(val.messageID),
      type: 'msg_container',
      meta: {},
      data: val.response.messages.map(msg => msg.msg_id),
    }
    const result: UniMessage[] = [container]
    for (const message of val.response.messages) {
      const isSingleMessage = message.body._ === 'rpc_result'
      const ids = isSingleMessage
        ? MsgId.of(message.msg_id, val.messageID, message.body.req_msg_id)
        : MsgId.of(message.msg_id, val.messageID, message.msg_id)
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
  // Error    : 'Error',
  _        : () => 'Other',
})

const checkResponse = (res: Object) => FutureFold((rj, rs) => {
  if (isContainsError(res.response)) {
    const err: RawErrorStruct = res.response
    rj(err)
  } else {
    rs({ ...res, parsed: chooseType(res) })
  }
})
