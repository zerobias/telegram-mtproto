import Promise from 'bluebird'
import EventEmitter from 'eventemitter2'

import { pathSatisfies, complement, isNil, unless, is, always, propEq, reject } from 'ramda'

import { getNetworker } from '../networker'
import { auth } from '../authorizer'
import { PureStorage } from '../../store'
import blueDefer from '../../defer'
import { dTime } from '../time-manager'

import { bytesFromHex, bytesToHex } from '../../bin'

import { switchErrors } from './error-cases'

// export const mtpSetUserAuth = onAuth =>
//   function mtpSetUserAuth(dcID, userAuth) {
//     const fullUserAuth = { dcID, ...userAuth }
//     PureStorage.set({
//       dc       : dcID,
//       user_auth: fullUserAuth
//     })
//     onAuth(fullUserAuth, dcID)
//   }

const hasPath = pathSatisfies( complement( isNil ) )
const defDc = unless( is(Number), always(2) )
const withoutNil = reject( isNil )

const baseDcID = 2

export const mtpClearStorage = function() {
  const saveKeys = []
  for (let dcID = 1; dcID <= 5; dcID++) {
    saveKeys.push(`dc${  dcID  }_auth_key`)
    saveKeys.push(`t_dc${  dcID  }_auth_key`)
  }
  PureStorage.noPrefix()
  return PureStorage
    .get(saveKeys)
    .tap(PureStorage.clear)
    .then(values => {
      const restoreObj = {}
      saveKeys.forEach((key, i) => {
        const value = values[i]
        if (value !== false && value !== undefined)
          restoreObj[key] = value
      })
      PureStorage.noPrefix()
      return restoreObj
    })
    .then(PureStorage.set)
}

const Ln = propEq('length')

export class ApiManager {
  emitter = new EventEmitter({
    wildcard: true
  })
  on = this.emitter.on
  emit = this.emitter.emit
  cache = {
    uploader  : {},
    downloader: {}
  }
  static appSettings = {
    invokeWithLayer: 0xda9b0d0d,
    layer          : NaN,
    initConnection : 0x69796de9,
    api_id         : '',
    device_model   : 'Unknown UserAgent',
    system_version : 'Unknown Platform',
    app_version    : '',
    lang_code      : 'en'
  }
  constructor(appSettings = {}) {
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    this.setUserAuth = this.setUserAuth.bind(this)

    this.appSettings = { ...ApiManager.appSettings, ...withoutNil(appSettings) }
    this.networkFabric = getNetworker(this.appSettings, this.emit)
  }
  mtpGetNetworker = (dcID, options = {}) => {
    const cache = options.fileUpload || options.fileDownload
      ? this.cache.uploader
      : this.cache.downloader
    if (!dcID) throw new Error('get Networker without dcID')

    if (!isNil(cache[dcID])) return cache[dcID]

    const akk = `dc${  dcID  }_auth_key`
    const ssk = `dc${  dcID  }_server_salt`

    const networkGetter = result => {
      if (cache[dcID]) return cache[dcID]

      const authKeyHex = result[0]
      let serverSaltHex = result[1]
      // console.log('ass', dcID, authKeyHex, serverSaltHex)
      if (Ln(512, authKeyHex)) {
        if (!serverSaltHex || serverSaltHex.length !== 16)
          serverSaltHex = 'AAAAAAAAAAAAAAAA'
        const authKey = bytesFromHex(authKeyHex)
        const serverSalt = bytesFromHex(serverSaltHex)

        return cache[dcID] = this.networkFabric(dcID, authKey, serverSalt, options)
      }

      if (!options.createNetworker)
        return Promise.reject({ type: 'AUTH_KEY_EMPTY', code: 401 })

      const onDcAuth = ({ authKey, serverSalt }) => {
        const storeObj = {
          [akk]: bytesToHex(authKey),
          [ssk]: bytesToHex(serverSalt)
        }
        PureStorage.set(storeObj)

        return cache[dcID] = this.networkFabric(dcID, authKey, serverSalt, options)
      }

      return auth(dcID)
        .then(onDcAuth, netError)
    }

    return PureStorage
      .get(akk, ssk)
      .then(networkGetter)
  }
  mtpInvokeApi(method, params, options = {}) {
    // const self = this
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
        this.emit('error.invoke', error)
      }
    }
    let dcID,
        cachedNetworker

    const cachedNetThunk = () => performRequest(cachedNetworker)
    const requestThunk = waitTime => setTimeout(cachedNetThunk, waitTime * 1e3)

    const stack = (new Error()).stack || 'empty stack'
    const performRequest = networker =>
      (cachedNetworker = networker)
        .wrapApiCall(method, params, options)
        .then(
          deferred.resolve,
          error => {
            const deferResolve = deferred.resolve
            const apiSavedNet = () => cachedNetworker = networker
            const apiRecall = networker => networker.wrapApiCall(method, params, options)
            console.error(dTime(), 'Error', error.code, error.type, baseDcID, dcID)

            return switchErrors(error, options, this.emit, rejectPromise, requestThunk,
                                apiSavedNet, apiRecall, deferResolve, this.mtpInvokeApi,
                                this.mtpGetNetworker)

          })
    const getDcNetworker = (baseDcID = 2) =>
      this.mtpGetNetworker(dcID = defDc(baseDcID), options)

    dcID = options.dcID || baseDcID
    if (dcID)
      Promise.resolve(this.mtpGetNetworker(dcID, options))
        .then(performRequest)
        .catch(rejectPromise)
    else
      PureStorage.get('dc')
        .then(getDcNetworker)
        .then(performRequest)
        .catch(rejectPromise)

    return deferred.promise
  }
  setUserAuth(dcID, userAuth) {
    const fullUserAuth = { dcID, ...userAuth }
    PureStorage.set({
      dc       : dcID,
      user_auth: fullUserAuth
    })
    this.emit('auth.dc', { dc: dcID, auth: userAuth })
  }
}

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Promise.reject(error)
}

export const api = new ApiManager

export const mtpInvokeApi = api.mtpInvokeApi