//@flow

import { Stream, of, awaitPromises } from 'most'
import { Either } from 'funfix'
import { Future } from 'fluture'
import Logger from 'mtproto-logger'
const log = Logger`epic-task`
import { NET, API } from '../action'
import { whenActive } from '../signal'
import jsonError from '../../util/json-error'


export const onTaskEnd = (action: Stream<any>) => action
  .thru(e => API.CALL_RESULT.stream(e))
  .thru(whenActive)
  .map(({ payload }) => payload)
  .map(async val => ({
    ...val,
    monad: await checkResponse(val.result.response).promise()
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

const checkResponse = (res: Object) => Future((rj, rs) => {
  if (isContainsError(res)) {
    const err: RawErrorStruct = res
    rj(err)
  } else {
    rs(res)
  }
}).fold(Either.left, Either.right)
