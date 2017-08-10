//@flow

import { combineEpics } from 'redux-most'
import { Stream, awaitPromises, of } from 'most'

import { MAIN } from 'Action'
import netRequest, { onNewRequest, onNewTask } from './net-request'
import { onTaskEnd, receiveResponse } from './task'
import { storageSet, invoke } from '../signal'

function sideStream<A, B, C>(merge: (x: A, y: B) => C, main: Stream<A>, sub: Stream<B>) {
  return main.sample(merge, main, sub)
}

const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.DC_DETECTED.stream)
    .map(val => val.payload)
    .thru(stream => sideStream(
      (dc, set) => ({ dc, set }),
      stream,
      storageSet
    ))
    .map(async({ dc, set }): Promise<void> => {
      await set('nearest_dc', dc)
      await set('dc', dc)
    })
    .thru(awaitPromises)
    .map(() => MAIN.ACTIVATED())

const reactivate = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.DC_CHANGED.stream)
    // .delay(66)
    .map(val => val.payload)
    .skipRepeats()
    .map(MAIN.DC_DETECTED)

const DEFAULT_DC = 2

const dcRecieved = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.MODULE_LOADED.stream)
    .thru(stream => sideStream(
      (_, invoke) => ({ invoke }),
      stream,
      invoke
    ))
    .map(x => x)
    .map(async({ invoke }): Promise<number> => {
      const opts = {
        dc             : DEFAULT_DC,
        createNetworker: true
      }
      const { nearest_dc }: {
        nearest_dc: number
      } = await invoke('help.getNearestDc', {}, opts)
      if (!isFinite(nearest_dc))
        return DEFAULT_DC
      return nearest_dc
    })
    .thru(awaitPromises)
    .skipRepeats()
    .recoverWith(() => of(DEFAULT_DC))
    .map(MAIN.DC_DETECTED)

const rootEpic = combineEpics([
  initialize,
  reactivate,
  dcRecieved,
  onNewRequest,
  netRequest,
  receiveResponse,
  onNewTask,
  onTaskEnd,
])

export default rootEpic
