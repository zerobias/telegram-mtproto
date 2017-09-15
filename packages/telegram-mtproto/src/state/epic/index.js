//@flow

import { combineEpics } from 'redux-most'
import { Stream } from 'most'
import { contains } from 'ramda'
import { type UID, type DCNumber } from 'Newtype'
import { MAIN, API } from 'Action'
import netRequest, { onNewTask } from './net-request'
import { receiveResponse } from './task'
import { authRequest } from '../../service/invoke'
import {
  getClient,
  getHomeStatus,
  queryKeys,
} from '../query'
import type {
  Client
} from '../index.h'
import { dispatch } from '../portal'
import { KeyValue } from 'Monad'
import { trimType } from '../helpers'
// import Config from 'ConfigProvider'

const filterActions = (list: string[]) => action => contains(
  trimType(action.type),
  list
)

const Blackhole = {
  //$off
  action(state: {
    ...Client,
    status: KeyValue<DCNumber, boolean>
  }, action: {
    uid: UID,
    type: string,
    payload: mixed
  }) {
    const { homeDc, status } = state
    const statusObj = status.toJSON()
    const type = trimType(action.type)
    if (__DEV__)
      console.log(type, state)
    switch (type) {
      case 'api/request new': {
        if (__DEV__)
          //$off
          console.warn(statusObj[homeDc])
        dispatch(API.TASK.NEW([action.payload.netReq]), action.uid)
        break
      }
      case 'main/auth resolve': {
        dispatch(API.TASK.NEW(state.request.values), action.uid)
        break
      }
      case 'main/dc detected': {
        const uid: string = action.payload.uid
        const dc: number = action.payload.dc
        const homeStatus = getHomeStatus(uid)
        const keys = queryKeys(uid, dc)
          .map(({ dc, uid, auth, authID, salt }) => ({
            dc, uid,
            authKey   : auth,
            authKeyID : authID,
            serverSalt: salt,
          }))
          .fold(() => false, x => x)
        if (homeStatus && keys) {
          dispatch(MAIN.AUTH.RESOLVE(keys), uid)
        } else {
          authRequest(uid, dc).promise()
        }
      }
    }
  }
}

const onEvent = (action: Stream<any>) => action
  .filter(e => !!e.uid)
  .map(e => getClient(e.uid).map(state => Blackhole.action(state, e)))
  .filter(() => false)

const onMessageTrigger = (action: Stream<any>) => action
  .filter(e => !!e.uid)
  .filter(filterActions([
    'api/request new',
    'main/auth resolve',
    'api/task new',
    'api/task done'
  ]))
  .map(({ uid }: { uid: string }) => uid)
  .filter(getHomeStatus)
  .map(uid => dispatch(API.NEXT({ uid }), uid))
  .filter(() => false)

const afterStorageImport = (action: Stream<{ type: string, payload: any }>) => action
  .thru(MAIN.STORAGE_IMPORTED.stream)
  .map(e => e.payload)
  .map(({ home, uid }) => ({ dc: home, uid }))
  .map(MAIN.DC_DETECTED)

const rootEpic = combineEpics([
  afterStorageImport,
  onMessageTrigger,
  netRequest,
  receiveResponse,
  onEvent,
  onNewTask,
])

export default rootEpic
