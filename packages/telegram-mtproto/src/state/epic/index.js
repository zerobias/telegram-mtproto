//@flow

import { combineEpics } from 'redux-most'
import { Stream, awaitPromises, of, from } from 'most'

import { MAIN, NET } from 'Action'
import netRequest, { onNewRequest, onNewTask } from './net-request'
import { onTaskEnd, receiveResponse } from './task'
import { storageSet, storageRemove, moduleStatus } from '../signal'
import Status, { netStatuses } from 'NetStatus'
import { statusGuard, statuses } from '../../status'
import { queryHomeDc, queryInvoke, queryStatus } from '../query'

const initialize = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.DC_DETECTED.stream)
    .map(val => val.payload)
    .thru(e => statusGuard(statuses.importStorage, moduleStatus, e))
    .thru(stream => stream
      .sample(
        (dc, set) => ({ dc, set }),
        stream,
        storageSet
      ))
    .map(async({ dc, set }): Promise<void> => {
      await set('nearest_dc', dc)
      await set('dc', dc)
    })
    .thru(awaitPromises)
    .delay(1000)
    .map(() => MAIN.ACTIVATED())

const afterStorageImport = (action: Stream<{ type: string, payload: any }>) => action
  .thru(MAIN.STORAGE_IMPORTED.stream)
  .map(e => e.payload)
  .map(({ home }) => home)
  .map(MAIN.DC_DETECTED)

const noAuth = (action: Stream<{ type: string, payload: any }>) => action
  .thru(MAIN.AUTH_UNREG.stream)
  .map(val => val.payload)
  .thru(stream => stream
    .sample(
      (dc, remove) => ({ dc, remove }),
      stream,
      storageRemove
    ))
  .map(({ dc, remove }) =>
    remove(`dc${dc}_auth_key`).then(() => dc))
  .thru(awaitPromises)
  .map(dc => dc === queryHomeDc()
    ? [
      MAIN.MODULE_LOADED(),
      NET.STATUS_SET([{
        dc,
        status: netStatuses.load,
      }]),
    ]
    : [MAIN.MODULE_LOADED()])
  .chain(from)

const reactivate = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.DC_CHANGED.stream)
    // .delay(66)
    .map(val => val.payload)
    .map(val => typeof val === 'number'
      ? val
      : val.newDC)
    // .skipRepeats()
    .map(MAIN.DC_DETECTED)

const DEFAULT_DC = 2

const dcRecieved = (action: Stream<{ type: string, payload: any }>) =>
  action
    .thru(MAIN.MODULE_LOADED.stream)
    .thru(e => statusGuard(statuses.importStorage, moduleStatus, e))
    .map(() => queryInvoke())
    .map(async(invoke): Promise<number> => {
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

const afterCarrier = (action: Stream<{ type: string, payload: any }>) =>
  action
    .filter(({ type }) => type === '[01] action carrier')
    .map(() => queryStatus(queryHomeDc()))
    .tap(e => console.warn(e))
    .filter(e => !Status.eq(e, netStatuses.active))
    .map(() => MAIN.MODULE_LOADED())

const rootEpic = combineEpics([
  initialize,
  noAuth,
  afterStorageImport,
  reactivate,
  dcRecieved,
  onNewRequest,
  netRequest,
  receiveResponse,
  afterCarrier,
  onNewTask,
  onTaskEnd,
])

export default rootEpic
