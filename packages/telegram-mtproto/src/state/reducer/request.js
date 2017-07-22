//@flow

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { API } from '../action'
import { type ApiNewRequest, type ApiMetaPL, type NetIncomingData } from '../action'
import { type TaskEndData } from '../epic/task'
import List from '../../util/immutable-list'
import { type ResultMatcher } from '../../util/either'

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
  [API.DONE_REQUEST]: (state: List<ApiRequestField, string>,
                       payload: NetIncomingData & TaskEndData,
                       meta: ApiMetaPL) => {
    const matcher: ResultMatcher<*, *, void, void> = {
      Right(data) {
        // console.log('data', data)
        const { value } = data
        const linked = value.ids.linked
        if (linked && state.has(linked))
          state
            .get(linked)
            .netReq
            .deferFinal
            .resolve(value.data)
      },
      Left(data) {
        // console.log('data l', data)
        const { value } = data
        const linked = value.ids.linked
        if (linked && state.has(linked))
          state
            .get(linked)
            .netReq
            .deferFinal
            .reject(value.data)
      },
    }
    if (Array.isArray(payload.messages))
      for (const message of payload.messages) {
        message.matchWith(matcher)
      }
    return state//.delete(meta.id)
  }
}, List.empty())

const reducer = combineReducers({
  api
})

export default reducer
