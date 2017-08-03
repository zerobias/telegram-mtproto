//@flow

import { createReducer } from 'redux-act'

import { MAIN } from 'Action'
import { statuses } from '../../status'

const reducer = createReducer({
  //$FlowIssue
  [MAIN.MODULE_LOADED]: () => statuses.loaded,
  //$FlowIssue
  [MAIN.DC_DETECTED]  : () => statuses.dcDetected,
  //$FlowIssue
  [MAIN.ACTIVATED]    : () => statuses.activated,
}, statuses.init)


export default reducer
