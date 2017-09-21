//@flow

/* eslint-disable object-shorthand */

import { List, OrderedSet } from 'immutable'

import { combineReducers, type Reducer } from 'redux'
import { createReducer } from 'redux-act'
import {
  append,
  contains,
  without,
  map,
  takeLast,
  pipe,
  concat,
  tail,
  head,
  remove,
} from 'ramda'
// import { Pure, liftF } from '@safareli/free'
// import { of, Left, Right } from 'apropos'
// import { Maybe } from 'folktale/maybe'
import type {
  Progress,
  RequestResult,
} from '../index.h'
import {
  trimType,
  type ActionPair,
} from '../helpers'
import {
  type UID,
  toUID,
  type DCNumber,
} from 'Newtype'
import { MAIN, NET, API } from 'Action'
import keyStorage, { KeyStorage } from 'Util/key-storage'
import { KeyValue } from 'Monad'
import { sha1BytesSync } from 'Bin'
import { NetMessage } from '../../service/networker/net-message'
import requestWatch from './request'
import ApiRequest from '../../service/main/request'
import Config from 'ConfigProvider'

import {
  type PUnitList,
  type MessageUnit,
} from '../../task/index.h'


function trimAction(action: any): string {
  return trimType(action.type)
}

declare var req: ApiRequest
const pendingSet: OrderedSet<ApiRequest> = OrderedSet.of(/*:: req */)
const pending = createReducer({}, pendingSet)
const idle = createReducer({}, [])
const current = createReducer({}, [])
const done = createReducer({}, [])
const result = createReducer({
  //$off
  [API.TASK.DONE]: (
    state: KeyValue<string, RequestResult[]>,
    payload: MessageUnit[]
  ): KeyValue<string, RequestResult[]> => {
    const apiPL = onlyAPI(payload)
    const newState = apiPL.reduce(reduceResults, state)
    return newState
  }
}, KeyValue.empty())

const reducer: Reducer<Progress> = combineReducers({
  idle,
  current,
  done,
  result,
  pending,
})

function reduceResults(
  acc: KeyValue<string, RequestResult[]>,
  val: MessageUnit
) {
  const id = val.api.apiID
  const data = val.body
  const init: RequestResult[] = []
  const list = acc
    .maybeGetK(id)
    .fold(() => init, x => x.snd())
  const saved = append(data, list)
  const res = acc.push([[id, saved]])
  return res
}

const findReq = (id: string) => (req: ApiRequest) => req.requestID === id
const onlyAPI = (units: MessageUnit[]) => units
  .filter(p => p.flags.api && p.api.resolved)
const getReqIDs = (list: ApiRequest[]) => list.map(req => req.requestID)

const a = List.of([1])
a

function unitReduce({ idle, current, done, result, pending }: Progress, unit: MessageUnit) {
  const id = unit.api.apiID
  let newIdle = idle
  let newCurrent = current
  let newDone = done
  const find = findReq(id)
  const inIdle = newIdle.findIndex(find)
  const inCurrent = newCurrent.findIndex(find)
  if (inIdle > -1) {
    const req = newIdle[inIdle]
    newIdle = remove(inIdle, 1, newIdle)
    newDone = append(req, newDone)
  }
  if (inCurrent > -1) {
    const req = newCurrent[inCurrent]
    newCurrent = remove(inCurrent, 1, newCurrent)
    newDone = append(req, newDone)
  }
  return {
    idle   : newIdle,
    current: newCurrent,
    done   : newDone,
    result,
    pending,
  }
}

export default function watcher(
  currentState: Progress,
  action: any
): Progress {
  const state: Progress = reducer(currentState, action)
  const { idle, current, done, result, pending } = state
  switch (trimAction(action)) {
    case 'api/next': {
      if (idle.length === 0) return state
      if (current.length > 0) return state
      const newNext: ApiRequest = head(idle) /*:: || req */
      const newState = {
        idle   : tail(idle),
        current: append(newNext, current),
        done,
        result,
        pending: pending.add(newNext),
      }
      return newState
    }
    case 'api/task new': {
      const ids = getReqIDs(idle)
        .concat(
          getReqIDs(current),
        )
      const payload: ApiRequest[] = action.payload
      const update = payload.filter(req => !contains(req.requestID, ids))
      const newIdle = idle.concat(update)
      return {
        idle: newIdle,
        current,
        done,
        result,
        pending,
      }
    }
    case 'api/task done': {
      const payload: MessageUnit[] = action.payload
      const apiPL = onlyAPI(payload)
      const newState: Progress = apiPL.reduce(unitReduce, state)
      return newState
    }
    default: return state
  }
}
