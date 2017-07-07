//@flow

import { combineEpics } from 'redux-most'
import { Stream } from 'most'

import { MAIN, NET } from '../action'
import { type Action } from '../action'
import netRequest from './net-request'

const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.SWITCH_ON.stream)
    .delay(15)
    .map(() => MAIN.ACTIVATED.action())

const rootEpic = combineEpics([
  initialize,
  netRequest,
])

export default rootEpic
