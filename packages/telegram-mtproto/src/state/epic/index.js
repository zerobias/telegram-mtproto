//@flow

import { combineEpics } from 'redux-most'
import { Stream } from 'most'

import { MAIN } from '../action'
import netRequest from './net-request'
import receiveResponse from './receive-response'


const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.SWITCH_ON.stream)
    .delay(15)
    .map(() => MAIN.ACTIVATED())

const rootEpic = combineEpics([
  initialize,
  netRequest,
  receiveResponse,
])

export default rootEpic
