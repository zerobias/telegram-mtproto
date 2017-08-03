//@flow

/* eslint-disable object-shorthand */

import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'

import { API } from 'Action'
import { type ApiNewRequest, type ApiMetaPL, type NetIncomingData } from '../action'
import { type TaskEndData } from '../epic/task'
import List from 'Util/immutable-list'
import { type ResultMatcher } from 'Util/either'


const api = createReducer({
  //$FlowIssue
  [API.REQUEST.NEW]: (state: List<ApiNewRequest, string>, payload: ApiNewRequest, meta: ApiMetaPL) =>
    state.set(meta.id, { ...payload, timestamp: new Date(payload.timestamp) }),
  //$FlowIssue
  [API.REQUEST.DONE]: (state: List<ApiNewRequest, string>,
                       payload: NetIncomingData & TaskEndData,
                       meta: ApiMetaPL) => {
    const msgs = payload.messages
    const innerAPI = payload.message.innerAPI
    let st = state
    if (Array.isArray(msgs) && Array.isArray(innerAPI)) {
      const onlyAPI = innerAPI.filter(x => x !== false)
      const onlyApiMsgs = msgs.filter(data => data.value.type === 'rpc_result'
      || data.value.type === 'rpc_error'
      || ['msgs_ack', 'msg_container', 'msg_detailed_info', 'new_session_created'].indexOf(data.value.type) === -1)
      for (let i = 0; i < onlyApiMsgs.length; i++) {
        const message = onlyApiMsgs[i]
        const apiID = onlyAPI[i]
        /*:: if (typeof apiID === 'string') { */
        const matcher: ResultMatcher<*, *, void, void> = {
          Right(data) {
            console.log('data r', data)
            console.log('apiID', apiID)
            const { value } = data
            // state.has(id)
            // value.ids.linked
            if (state.has(apiID))
              state
                .get(apiID)
                .netReq
                .deferFinal
                .resolve(value.data)
            st = st.delete(apiID)
          },
          Left(data) {
            console.log('data l', data)
            const { value } = data
            if (state.has(apiID))
              state
                .get(apiID)
                .netReq
                .deferFinal
                .reject(value.data)
            st = st.delete(apiID)
          },
        }
        message.matchWith(matcher)
        /*:: } */
      }
    }
    return st//.delete(meta.id)
  }
}, List.empty())

const reducer = combineReducers({
  api
})

function resolveId(state, ids): ApiNewRequest | false {
  return (
    idResolver(state, ids.real)
    || idResolver(state, ids.req)
    || idResolver(state, ids.real)
    || idResolver(state, ids.box)
  )
}

function idResolver(state, id) {
  return state.has(id) && state.get(id)
}

export default reducer
