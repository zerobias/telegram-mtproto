import Promise from 'bluebird'

import { pathSatisfies, complement, isNil, unless, is, always,
  propEq, __, propOr } from 'ramda'

import { PureStorage } from '../store'
import blueDefer from '../defer'
import { dTime, tsNow } from './time-manager'

export const mtpSetUserAuth = onAuth =>
  function mtpSetUserAuth(dcID, userAuth) {
    const fullUserAuth = { dcID, ...userAuth }
    PureStorage.set({
      dc       : dcID,
      user_auth: fullUserAuth
    })
    onAuth(fullUserAuth, dcID)
  }

const hasPath = pathSatisfies( complement( isNil ) )
const defDc = unless( is(Number), always(2) )

const cachedExportPromise = {}
// const cachedUploadNetworkers = {}
// const cachedNetworkers = {}

// const baseDc = innerStore.subtree('dc', 'base')
// baseDc.set(false)

let baseDcID = 2

export const mtpInvokeApi = (onInvokeError, notifyFalse, mtpGetNetworker) =>
  function mtpInvokeApi(method, params, options = {}) {
    const deferred = blueDefer()
    const rejectPromise = error => {
      if (!error)
        error = { type: 'ERROR_EMPTY' }
      else if (!is(Object, error))
        error = { message: error }
      deferred.reject(error)

      if (!options.noErrorBox) { //TODO weird code. `error` changed after `.reject`?
        error.input = method
        error.stack =
          stack ||
          hasPath(['originalError', 'stack'], error) ||
          error.stack ||
          (new Error()).stack

        onInvokeError(error)
      }
    }
    let dcID,
        networkerPromise


    let cachedNetworker
    const stack = (new Error()).stack || 'empty stack'
    const performRequest = networker =>
      (cachedNetworker = networker)
        .wrapApiCall(method, params, options)
        .then(
          deferred.resolve,
          error => {
            console.error(dTime(), 'Error', error.code, error.type, baseDcID, dcID)
            const codeEq = propEq('code', __, error)
            const dcEq = val => val === dcID
            switch (true) {
              case codeEq(401) && dcEq(baseDcID): {
                PureStorage.remove('dc', 'user_auth')
                notifyFalse()
                rejectPromise(error)
                break
              }
              case codeEq(401) &&
                    baseDcID &&
                    !dcEq(baseDcID)
              : {
                if (cachedExportPromise[dcID] === undefined) {
                  const exportDeferred = blueDefer()
                  const importAuth = ({ id, bytes }) =>
                    mtpInvokeApi(
                      'auth.importAuthorization',
                      { id, bytes },
                      { dcID: dcID, noErrorBox: true })

                  mtpInvokeApi('auth.exportAuthorization', { dc_id: dcID }, { noErrorBox: true })
                    .then(importAuth)
                    .then(exportDeferred.resolve)
                    .catch(exportDeferred.reject)

                  cachedExportPromise[dcID] = exportDeferred.promise
                }

                const apiRecall = () => (cachedNetworker = networker)
                  .wrapApiCall(method, params, options)

                cachedExportPromise[dcID]
                  .then(apiRecall)
                  .then(deferred.resolve)
                  .catch(rejectPromise)

                break
              }
              case codeEq(303): {
                const newDcID = error.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)[2]
                if (dcEq(newDcID)) break
                if (options.dcID)
                  options.dcID = newDcID
                else
                  PureStorage.set({ dc: baseDcID = newDcID })

                const apiRecall = networker => networker.wrapApiCall(method, params, options)

                mtpGetNetworker(newDcID, options)
                  .then(apiRecall)
                  .then(deferred.resolve)
                  .catch(rejectPromise)
                break
              }
              case !options.rawError &&
                    codeEq(420)
              : {
                const waitTime = error.type.match(/^FLOOD_WAIT_(\d+)/)[1] || 10
                if (waitTime > (options.timeout || 60))
                  return rejectPromise(error)
                setTimeout(() =>
                  performRequest(cachedNetworker)
                , waitTime * 1000)
                break
              }
              case !options.rawError && (
                      codeEq(500) ||
                      error.type == 'MSG_WAIT_FAILED'
              ): {
                const now = tsNow()
                if (options.stopTime) {
                  if (now >= options.stopTime)
                    return rejectPromise(error)
                } else
                  options.stopTime = now + propOr(10, 'timeout', options) * 1000
                options.waitTime = options.waitTime
                  ? Math.min(60, options.waitTime * 1.5)
                  : 1
                setTimeout(() =>
                  performRequest(cachedNetworker)
                , options.waitTime * 1000)
                break
              }
              default: rejectPromise(error)
            }
          })
    const getDcNetworker = (baseDcID = 2) =>
      mtpGetNetworker(dcID = defDc(baseDcID), options)
    if (dcID = (options.dcID || baseDcID))
      Promise.resolve(mtpGetNetworker(dcID, options))
        .then(performRequest)
        .catch(rejectPromise)
    else
      PureStorage.get('dc')
        .then(getDcNetworker)
        .then(performRequest)
        .catch(rejectPromise)

    return deferred.promise
  }

export const mtpClearStorage = function() {
  const saveKeys = []
  for (let dcID = 1; dcID <= 5; dcID++) {
    saveKeys.push(`dc${  dcID  }_auth_key`)
    saveKeys.push(`t_dc${  dcID  }_auth_key`)
  }
  Storage.noPrefix()
  return Storage
    .get(saveKeys)
    .tap(Storage.clear)
    .then(values => {
      const restoreObj = {}
      saveKeys.forEach((key, i) => {
        const value = values[i]
        if (value !== false && value !== undefined)
          restoreObj[key] = value
      })
      Storage.noPrefix()
      return restoreObj
    })
    .then(Storage.set)
}

export class ApiManager {
  cache = {
    uploader  : {},
    downloader: {}
  }
  mtpGetNetworker = (dcID, options = {}) => {
    const cache = (options.fileUpload || options.fileDownload)
      ? this.cache.uploader
      : this.cache.downloader
    if (!dcID) throw new Exception('get Networker without dcID')

    if (cache[dcID] !== undefined) return cache[dcID]

    const akk = `dc${  dcID  }_auth_key`
    const ssk = `dc${  dcID  }_server_salt`

    return window.mtproto.PureStorage.get(akk, ssk).then(function(result) {
      if (cache[dcID] !== undefined) return cache[dcID]

      const authKeyHex = result[0]
      let serverSaltHex = result[1]
      // console.log('ass', dcID, authKeyHex, serverSaltHex)
      if (authKeyHex && authKeyHex.length === 512) {
        if (!serverSaltHex || serverSaltHex.length !== 16)
          serverSaltHex = 'AAAAAAAAAAAAAAAA'
        const authKey = bytesFromHex(authKeyHex)
        const serverSalt = bytesFromHex(serverSaltHex)

        return cache[dcID] = window.$rework.MtpNetworkerFactory.getNetworker(dcID, authKey, serverSalt, options)
      }

      if (!options.createNetworker)
        return Promise.reject({ type: 'AUTH_KEY_EMPTY', code: 401 })

      return window.$rework.MtpAuthorizer.auth(dcID).then(function({ authKey, serverSalt }) {
        const storeObj = {}
        storeObj[akk] = bytesToHex(authKey)
        storeObj[ssk] = bytesToHex(serverSalt)
        window.mtproto.PureStorage.set(storeObj)

        return cache[dcID] = window.$rework.MtpNetworkerFactory.getNetworker(dcID, authKey, serverSalt, options)
      }, function(error) {
        console.log('Get networker error', error, error.stack)
        return Promise.reject(error)
      })
    })
  }
}

export const api = new ApiManager