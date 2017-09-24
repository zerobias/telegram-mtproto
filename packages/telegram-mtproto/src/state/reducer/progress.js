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
  uniq,
  last,
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
  isHomeDC,
  getHomeStatus,
  queryHomeDc,
  getDCStatus,
  getClient,
} from '../query'
import {
  type PUnitList,
  type MessageUnit,
} from '../../task/index.h'


function trimAction(action: any): string {
  return trimType(action.type)
}

declare var req: ApiRequest
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

function unitReduce({ idle, current, done, result }: Progress, unit: MessageUnit) {
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
  }
}

function pushBackLostRequests(uid, ids) {
  const filter = req => ids.indexOf(req.requestID) === -1
  return getClient(uid)
    .map(client => ({
      importMap: client.authImported,
      requests : client.request.values,
      homeDC   : client.homeDc,
    }))
    .map(({ importMap, requests, homeDC }) => requests
      .filter(filter)
      .filter(req => !!importMap.get(req.dc.orElse(homeDC))))
    .orElse([])
}

export default function watcher(
  currentState: Progress,
  action: any
): Progress {
  const state: Progress = reducer(currentState, action)
  const { idle, current, done, result } = state
  switch (trimAction(action)) {
    case API.REQUEST.NEW.short: {
      const payload = typedPayload(API.REQUEST.NEW, action)
      return { ...state, idle: append(payload.netReq, state.idle) }
    }
    case API.NEXT.short: {
      // if (idle.length === 0) return state
      // if (current.length > 0) return state
      const payload = typedPayload(API.NEXT, action)
      if (!getHomeStatus(payload.uid)) return state
      const includedRequests = uniq(idle
        .map(req => req.requestID)
        .concat(
          current.map(req => req.requestID),
          result.pairs.reduce(
            (acc: string[], tuple) => tuple
              .map(last)
              .foldMap((val) => val != null && val._ !== 'rpc_error')
              ? [...acc, tuple.fst()]
              : acc
            , [])
        ))
      if (__DEV__)
        console.warn(includedRequests)
      const revertedRequests = uniq(pushBackLostRequests(payload.uid, includedRequests))
      if (__DEV__)
        console.warn(revertedRequests)
      const maybeDC = queryHomeDc(payload.uid)
      const checkStatus = dc => getDCStatus(payload.uid, dc)
      const canRequest = idle.filter(msg => !msg.needAuth || msg.dc
        .alt(maybeDC)
        .map(checkStatus)
        .fold(() => false, x => x))
      const newNext = head(canRequest)
      const newCurrent = newNext == null
        ? current
        : append(newNext, current)
      const newIdle = newNext == null
        ? idle
        : tail(idle)
      return {
        idle   : newIdle,
        current: newCurrent.concat(revertedRequests),
        done,
        result,
      }
    }
    case API.TASK.NEW.short: {
      const ids = getReqIDs(idle)
        .concat(
          getReqIDs(current),
        )
      const payload = typedPayload(API.TASK.NEW, action)
      const update = payload.filter(req => !contains(req.requestID, ids))
      const newIdle = idle.concat(update)
      return {
        idle: newIdle,
        current,
        done,
        result,
      }
    }
    case API.TASK.DONE.short: {
      const payload = typedPayload(API.TASK.DONE, action)
      const apiPL = onlyAPI(payload).filter(msg => !msg.flags.error || msg.error.handled)
      const newState: Progress = apiPL.reduce(unitReduce, state)
      return newState
    }
    case MAIN.AUTH.RESOLVE.short: {
      const payload = typedPayload(MAIN.AUTH.RESOLVE, action)
      if (isHomeDC(payload.uid, payload.dc)) {
        const firstIdle = head(idle)
        if (firstIdle == null) return state
        return {
          idle   : tail(idle),
          current: [...current, firstIdle],
          done,
          result,
        }

      } else return {
        idle   : current.concat(idle),
        current: [],
        done,
        result,
      }

    }
    default: return state
  }
}

function typedPayload<Name, Payload>(pair: ActionPair<Name, Payload, *>, action: any): Payload {
  return action.payload
}
