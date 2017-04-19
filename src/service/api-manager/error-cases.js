import isNil from 'ramda/src/isNil'
import propOr from 'ramda/src/propOr'

import blueDefer from '../../util/defer'
import Switch from '../../util/switch'
import { tsNow } from '../time-manager'

const cachedExportPromise = {}

const protect = (
    { code = NaN, type = '' },
    { rawError = null },
    dcID,
    baseDcID
  ) => ({
    base: baseDcID,
    errR: rawError,
    code,
    type,
    dcID
  })

const patterns = {
  noBaseAuth: ({ code, dcID, base })  =>  code === 401 && dcID === base,
  noDcAuth  : ({ code, dcID, base })  =>  code === 401 && dcID !== base,
  waitFail  : ({ code, type, errR })  =>  !errR && (code === 500 || type === 'MSG_WAIT_FAILED'),
  _         : ()                      =>  true
}


const matchProtect =
  matched => (
      error,
      options,
      dcID,
      emit,
      rejectPromise,
      requestThunk,
      apiSavedNet,
      apiRecall,
      deferResolve,
      mtpInvokeApi,
      storage
    ) =>
      matched({
        invoke   : mtpInvokeApi,
        throwNext: () => rejectPromise(error),
        reject   : rejectPromise,
        options,
        dcID,
        emit,
        requestThunk,
        apiRecall,
        deferResolve,
        apiSavedNet,
        storage
      })


const noBaseAuth = ({ emit, throwNext, storage }) => {
  // storage.remove('dc', 'user_auth')
  emit('error.401.base')
  throwNext()
}

const noDcAuth = ({ dcID, reject, apiSavedNet, apiRecall, deferResolve, invoke }) => {
  const importAuth = ({ id, bytes }) => invoke(
    'auth.importAuthorization',
    { id, bytes },
    { dcID, noErrorBox: true })


  if (isNil(cachedExportPromise[dcID])) {
    const exportDeferred = blueDefer()

    invoke(
      'auth.exportAuthorization',
      { dc_id: dcID },
      { noErrorBox: true })

      .then(importAuth)
      .then(exportDeferred.resolve)
      .catch(exportDeferred.reject)

    cachedExportPromise[dcID] = exportDeferred.promise
  }



  cachedExportPromise[dcID] //TODO not returning promise
    .then(apiSavedNet)
    .then(apiRecall)
    .then(deferResolve)
    .catch(reject)
}
/*
const migrate = ({ error, dcID, options, reject,
    apiRecall, deferResolve, getNet, storage
  }) => {
  const newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2]
  if (newDcID === dcID) return
  if (options.dcID)
    options.dcID = newDcID
  else
    storage.set('dc', newDcID)

  getNet(newDcID, options)
    .then(apiRecall)
    .then(deferResolve)
    .catch(reject)
}*/

/*const floodWait = ({ error, options, throwNext, requestThunk }) => {
  const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10
  if (waitTime > (options.timeout || 60))
    return throwNext()
  requestThunk(waitTime)
}*/

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
  waitFail,
  _: def
}, matchProtect)