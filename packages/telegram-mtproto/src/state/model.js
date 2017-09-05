//@flow

import { types } from 'mobx-state-tree'


const ClientModel = types.model('Client', {
  uid       : types.string,
  homeDc    : types.number,
  dcDetected: types.boolean,
  homeStatus: types.boolean,
})

const ApiMethod = types.model('ApiMethod', {
  method: types.string,
  //$off
  params: types.frozen
})

export const ApiRequestModel = types.model('ApiRequest', {
  data     : ApiMethod,
  requestID: types.string,
  uid      : types.string,
})
