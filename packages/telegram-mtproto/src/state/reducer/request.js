//@flow

/* eslint-disable object-shorthand */

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { API } from 'Action'
import { type ApiMetaPL } from '../action'
import List from '../../util/immutable-list'
import { type ApiNewRequest, type OnRequestDone } from '../index.h'
import { RpcApiError } from '../../error'
import { type MessageUnit } from '../../task/index.h'

function requestDoneReducer(acc: List<ApiNewRequest, string>, msg: MessageUnit) {
  if (msg.flags.api && msg.api.resolved && acc.has(msg.api.apiID)) {
    const stored = acc
      .get(msg.api.apiID)
      .netReq
      .deferFinal
    if (msg.flags.error){
      if (msg.error.handled)
        return acc
      stored.reject(new RpcApiError(msg.error.code, msg.error.message))
    } else
      stored.resolve(msg.body)
    return acc.delete(msg.api.apiID)
  }
  return acc
}

const api = createReducer({
  //$FlowIssue
  [API.REQUEST.NEW]: (state: List<ApiNewRequest, string>, payload: ApiNewRequest, meta: ApiMetaPL) =>
    state.set(meta.id, { ...payload, timestamp: new Date(payload.timestamp) }),
  //$FlowIssue
  [API.REQUEST.DONE]: (state: List<ApiNewRequest, string>,
                       payload: OnRequestDone) =>
    payload.normalized
      .filter(data => data.flags.api)
      .reduce(requestDoneReducer, state)
}, List.empty())

const reducer = combineReducers({
  api
})

export default reducer
