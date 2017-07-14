//@flow

import { Stream, of } from 'most'

import Logger from 'mtproto-logger'
const log = Logger`receive-response`

import { NET } from '../action'
import { active } from '../signal'
import { faucet } from '../../pull-stream'
import jsonError from '../../util/json-error'

function wait<Value>(val: Promise<Value>): Stream<Value> {
  return of(val).awaitPromises()
}

const faucetC =
  (source: Stream<*>) =>
    faucet(source, active).stream

const receiveResponse = (action: Stream<*>) =>
  action
    .thru(e => NET.RECEIVE_RESPONSE.stream(e))
    .thru(faucetC)
    .map(val => val.payload)
    .map(async({ result, thread, message, noResponseMsgs }) => ({
      result: await thread.parseResponse(result.data),
      noResponseMsgs,
      thread,
      message
    }))
    .chain(val => wait(val))
    .map(async({ result, thread, message, noResponseMsgs }) => {
      await thread.requestPerformer(message, noResponseMsgs, result)
      return {
        result,
        thread,
        message
      }
    })
    .chain(val => wait(val))
    .map(NET.INCOMING_DATA)
    .recoverWith(err => of(NET.NETWORK_ERROR(jsonError(err))).delay(15))

export default receiveResponse
