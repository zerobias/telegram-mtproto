//@flow

import { combineEpics } from 'redux-most'
import { Stream } from 'most'

import { MAIN } from '../action'
import netRequest, { onNewRequest, onNewTask } from './net-request'
import { onTaskEnd, receiveResponse } from './task'


const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.SWITCH_ON.stream)
    .delay(15)
    .map(() => MAIN.ACTIVATED())

const rootEpic = combineEpics([
  initialize,
  onNewRequest,
  netRequest,
  receiveResponse,
  onNewTask,
  onTaskEnd,
])

export default rootEpic
