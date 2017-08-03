//@flow

import { combineEpics } from 'redux-most'
import { Stream, awaitPromises, of } from 'most'

import { MAIN } from 'Action'
import netRequest, { onNewRequest, onNewTask } from './net-request'
import { onTaskEnd, receiveResponse } from './task'
import { storageSet, invoke } from '../signal'

const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.DC_DETECTED.stream)
    .delay(66)
    .map(() => MAIN.ACTIVATED())

const DEFAULT_DC = 2

const dcRecieved = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.MODULE_LOADED.stream)
    .delay(77)
    .combine((_, set) => ({ set }), storageSet)
    .combine(({ set }, invoke) => ({ invoke, set }), invoke)
    // Note that skipRepeatsWith actually *pass* only repeats there
    .skipRepeatsWith(
      (s1, s2) => s1.set !== s2.set || s1.invoke !== s2.invoke)
    .map(async({ invoke, set }): Promise<number> => {
      const opts = {
        dc             : DEFAULT_DC,
        createNetworker: true
      }
      const { nearest_dc } = await invoke('help.getNearestDc', {}, opts)
      await set('nearest_dc', nearest_dc)
      await set('dc', nearest_dc)
      return nearest_dc
    })
    .thru(awaitPromises)
    .recoverWith(() => of(DEFAULT_DC))
    .map(MAIN.DC_DETECTED)

const rootEpic = combineEpics([
  initialize,
  dcRecieved,
  onNewRequest,
  netRequest,
  receiveResponse,
  onNewTask,
  onTaskEnd,
])

export default rootEpic
