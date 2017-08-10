//@flow

import { Stream, of, awaitPromises } from 'most'
import { complement } from 'ramda'

import Logger from 'mtproto-logger'
const log = Logger`epic-task`

// import snippet from 'Util/stream-snippet.draft'

import { API, NET } from '../action'
import normalize from '../../task/new-index'
import { type MessageUnit } from '../../task/index.h'
import { onAction } from '../helpers'
import { requestMap } from '../signal'
import jsonError from '../../util/json-error'

const isHandled = (unit: MessageUnit) =>
  unit.flags.error
  && unit.error.handled
  // && unit.flags.api
  // && unit.api.resolved

const notHandled = complement(isHandled)

function sideStream<A, B, C>(merge: (x: A, y: B) => C, main: Stream<A>, sub: Stream<B>) {
  return main.sample(merge, main, sub)
}



export const onTaskEnd = /* snippet`onTaskEnd`(onAction(API.TASK.DONE),  */
(action: Stream<any>) => action
  .thru(onAction(API.TASK.DONE))
  .chain(({ normalized, ...data }) => {
    const withData = normalized => ({ normalized, ...data })
    const handledList = normalized
      .filter(isHandled)
      .map((val: MessageUnit): string => val.api.apiID)
    const handled = sideStream(
      (list, reqMap) => list
        .filter(val => reqMap.has(val))
        .map(val => reqMap.get(val)),
      of(handledList),
      requestMap.map(val => val.api)
    )
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
      .map(withData)
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

export const receiveResponse = /* snippet`receiveResponse`(onAction(NET.RECEIVE_RESPONSE), */
(action: Stream<any>) => action
  .thru(onAction(NET.RECEIVE_RESPONSE))
  .map(async(data) => ({
    ...data,
    normalized: await normalize(data)
  }))
  .thru(awaitPromises)
  .tap(({ normalized }) => normalized.map(msg => console.log('normalized', msg)))
  .map(async({ result, thread, message, noResponseMsgs, normalized }) => ({
    result: await thread.parseResponse(result.data),
    noResponseMsgs,
    thread,
    message,
    normalized,
  }))
  .thru(awaitPromises)
  .map(async({ result, thread, message, noResponseMsgs, normalized }) => {
    await thread.requestPerformer(message, noResponseMsgs, result)
    return {
      result,
      thread,
      message,
      normalized,
    }
  })
  .thru(awaitPromises)
  .map(API.TASK.DONE)
  .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))))
//)
