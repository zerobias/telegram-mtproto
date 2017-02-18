import Promise from 'bluebird'

import { propOr, isNil } from 'ramda'

import blueDefer from '../../defer'
import Switch from '../../switch'
import { PureStorage } from '../../store'
import { tsNow } from '../time-manager'

export const cachedExportPromise = {}

const protect = ({ code = NaN, type = '' }, { rawError = null }, dcID, baseDcID) =>
  ({ code, type, dcID, base: baseDcID, rawError })

const matchProtect = matched =>
  (error, options, emit, rejectPromise, requestThunk, apiSavedNet, apiRecall,
  deferResolve) =>
    matched({ error, options, emit,
              reject   : rejectPromise, requestThunk,
              apiRecall, throwNext: () => rejectPromise(error),
              deferResolve })

const patterns = {
  noBaseAuth: ({ code, dcID, base })     => code === 401 && dcID === base,
  noDcAuth  : ({ code, dcID, base })     => code === 401 && dcID !== base,
  migrate   : ({ code })                 => code === 303,
  floodWait : ({ code, rawError })       => !rawError && code === 420,
  waitFail  : ({ code, type, rawError }) => !rawError && (code === 500 || type === 'MSG_WAIT_FAILED'),
  _         : ()                         => true
}




const noBaseAuth = ({ emit, throwNext }) => {
  PureStorage.remove('dc', 'user_auth')
  emit('error.401.base')
  throwNext()
}

const noDcAuth = ({ dcID, reject, apiSavedNet, apiRecall, deferResolve }) => {
  if (isNil(cachedExportPromise[dcID])) {
    const exportDeferred = blueDefer()
    const importAuth = ({ id, bytes }) =>
      self.mtpInvokeApi(
        'auth.importAuthorization',
        { id, bytes },
        { dcID, noErrorBox: true })

    self.mtpInvokeApi(
      'auth.exportAuthorization',
      { dc_id: dcID },
      { noErrorBox: true })

      .then(importAuth)
      .then(exportDeferred.resolve)
      .catch(exportDeferred.reject)

    cachedExportPromise[dcID] = exportDeferred.promise
  }



  cachedExportPromise[dcID]
    .then(apiSavedNet)
    .then(apiRecall)
    .then(deferResolve)
    .catch(reject)
}

const migrate = ({ error, dcID, options, reject, apiRecall, deferResolve }) => {
  const newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2]
  if (newDcID === dcID) return
  if (options.dcID)
    options.dcID = newDcID
  else
    PureStorage.set({ dc: /*baseDcID =*/ newDcID })

  self.mtpGetNetworker(newDcID, options)
    .then(apiRecall)
    .then(deferResolve)
    .catch(reject)
}

const floodWait = ({ error, options, throwNext, requestThunk }) => {
  const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10
  if (waitTime > (options.timeout || 60))
    return throwNext()
  requestThunk(waitTime)
}

const waitFail = ({ options, throwNext, requestThunk }) => {
  const now = tsNow()
  if (options.stopTime) {
    if (now >= options.stopTime)
      return throwNext()
  } else
    options.stopTime = now + propOr(10, 'timeout', options) * 1000
  options.waitTime = options.waitTime
    ? Math.min(60, options.waitTime * 1.5)
    : 1
  requestThunk(options.waitTime)
}

const def = ({ throwNext }) => throwNext()


export const switchErrors = Switch(patterns, protect)({
  noBaseAuth,
  noDcAuth,
  migrate,
  floodWait,
  waitFail,
  _: def
}, matchProtect)