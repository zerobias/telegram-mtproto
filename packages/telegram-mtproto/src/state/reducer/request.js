//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { API } from '../action'
import { type ApiNewRequest, type ApiMetaPL } from '../action'
import List from '../../util/immutable-list'
import { indexed } from '../../util/indexed-reducer'

type ApiRequestField = {
  method: string,
  params: { [key: string]: mixed },
  timestamp: Date,
}

const api = createReducer({
  //$FlowIssue
  [API.NEW_REQUEST]: (state: List<ApiRequestField, string>, payload: ApiNewRequest, meta: ApiMetaPL) =>
    state.set(meta.id, { ...payload, timestamp: new Date(payload.timestamp) }),
  //$FlowIssue
  [API.DONE_REQUEST]: (state: List<ApiRequestField, string>, payload: any, meta: ApiMetaPL) =>
    state.delete(meta.id)
}, List.empty())

const reducer = combineReducers({
  api
})

export default reducer
