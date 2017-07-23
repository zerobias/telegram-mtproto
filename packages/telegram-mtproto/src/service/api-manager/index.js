//@flow

import Bluebird from 'bluebird'

import Logger from 'mtproto-logger'
const log = Logger`api-manager`

import Auth from '../authorizer'

import blueDefer from '../../util/defer'

import { MTError, DcUrlError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import { dTime } from 'mtproto-shared'

import { type Bytes, type LeftOptions, type Cache } from './index.h'
import { type PublicKey, type ApiConfig, type StrictConfig, type ServerConfig } from '../main/index.h'
import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from '../../plugins'

import Config from '../../config-provider'
import NetworkerThread from '../networker'
import ApiRequest from '../main/request'
import Observer from '../../util/observer'
import { subject } from '../../property'
import { type HoldSubject } from '../../property'
import { API } from '../../state/action'

import { dispatch } from '../../state/core'

const baseDcID = 2

const Ln = (length: number, obj?: *): boolean => {
  if (obj == null) return false
  const res = typeof obj.length === 'number' &&
    obj.length === length
  return res
}



export class ApiManager {
  invokeNetRequest: (netReq: ApiRequest) => Promise<mixed>
  cache: Cache = {
    uploader  : {},
    downloader: {},
    auth      : {},
    servers   : {},
    keysParsed: {}
  }
  uid: string
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  serverConfig: ServerConfig
  networkFabric: *
  auth: *
  on: On
  emit: Emit
  authPromise: * = blueDefer()
  authBegin = false
  currentDc: number = 2
  online: boolean = false
  constructor(config: StrictConfig, uid: string) {
    const {
      server,
      api,
      app: {
        storage,
        publicKeys
      }
    } = config
    this.uid = uid
    this.apiConfig = api
    this.publicKeys = publicKeys
    this.storage = storage
    this.serverConfig = server
    const emitter = Config.rootEmitter(this.uid)
    this.on = emitter.on
    this.emit = emitter.emit
    this.auth = Auth(uid, publicKeys, this.cache.keysParsed)

    //$FlowIssue
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    this.invokeNetRequest = this.invokeNetRequest.bind(this)
    //$FlowIssue
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)

    // this.updatesManager = UpdatesManager(apiManager, this.TL)
    // apiManager.updates = this.updatesManager
    emitter.on('error.303', (newDc: number) => {
      this.authBegin = false
      this.currentDc = newDc
    })
  }
  networkSetter(dc: number, authKey: Bytes, serverSalt: Bytes) {
    const networker = new NetworkerThread({
      appConfig: this.apiConfig,
      storage  : this.storage,
    }, dc, authKey, serverSalt, this.uid)
    this.cache.downloader[dc] = networker
    return networker
  }
  async mtpGetNetworker(dcID: number) {
    // const isUpload = options.fileUpload || options.fileDownload
    // const cache = isUpload
    //   ? this.cache.uploader
    //   : this.cache.downloader

    const cache = this.cache.downloader
    if (!dcID) throw new Error('get Networker without dcID')

    if (typeof cache[dcID] !== 'undefined') return cache[dcID]

    const akk = `dc${  dcID  }_auth_key`
    const ssk = `dc${  dcID  }_server_salt`

    const dcUrl = Config.dcMap(this.uid, dcID)
    if (typeof dcUrl !== 'string')
      throw new DcUrlError(dcID, dcUrl)

    if (cache[dcID]) return cache[dcID]

    const authKeyHex: string = await this.storage.get(akk)
    let serverSaltHex: string = await this.storage.get(ssk)

    // if (!authKeyHex || !serverSaltHex)
      // await this.doAuth()

    if (Ln(512, authKeyHex)) {
      if (!serverSaltHex || serverSaltHex.length !== 16)
        serverSaltHex = 'AAAAAAAAAAAAAAAA'
      const authKey = bytesFromHex(authKeyHex)
      const serverSalt = bytesFromHex(serverSaltHex)

      return this.networkSetter(dcID, authKey, serverSalt)
    }

    let auth
    try {
      auth = await this.auth(dcID, this.cache.auth, dcUrl)
    } catch (error) {
      return netError(error)
    }

    const { authKey, serverSalt } = auth

    await this.storage.set(akk, bytesToHex(authKey))
    await this.storage.set(ssk, bytesToHex(serverSalt))

    this.emit('base', 'WORK')

    return this.networkSetter(dcID, authKey, serverSalt)
  }
  async doAuth() {
    this.authBegin = true
    this.emit('base', 'CHECK')
    try {
      const storedBaseDc = await this.storage.get('dc')
      const baseDc = storedBaseDc || baseDcID
      const opts = {
        dc             : baseDc,
        createNetworker: true
      }
      const networker = await this.mtpGetNetworker(baseDc)
      const nearestDc = await networker.wrapApiCall(
        'help.getNearestDc', {}, opts)
      const { nearest_dc, this_dc } = nearestDc
      await this.storage.set('nearest_dc', nearest_dc)
      if (storedBaseDc == null) {
        await this.storage.set('dc', this_dc)
        // if (nearest_dc !== this_dc) await this.mtpGetNetworker(nearest_dc, {
        //   dcID           : this_dc,
        //   createNetworker: true
        // })

      }
      log(`nearest Dc`, ` this dc`)(nearestDc, this_dc)
      this.authPromise.resolve()
    } catch (err) {
      this.authPromise.reject(err)
    }
  }
  async initConnection() {
    this.emit('base', 'REQUEST')
    if (!isAnyNetworker(this)) {
      if (!this.authBegin)
        this.doAuth()
      await this.authPromise.promise
    }
  }
  async mtpInvokeApi(method: string, params: Object = {}, options: LeftOptions = {}) {

    /* const akk = `dc${this.currentDc}_auth_key`
    if (method === 'auth.sendCode' || method === 'auth.signIn') {
      const dcKey = await this.storage.get(akk)
      if (typeof dcKey === 'string' && dcKey.length > 0) alreadyAuthWarning(method)
    } */

    const netReq = new ApiRequest(
      { method, params },
      options,
      this.invokeNetRequest)
    // const toPromise = {
    //   Left : (val) => Bluebird.reject(val),
    //   Right: (val) => Bluebird.resolve(val),
    // }
    // const ok: any = {}
    // const request = subject(ok)
    // const obs = requestObserver(netReq, request)
    // obs.then(debug`obs`)
    netReq.options.requestID = netReq.requestID
    // this.emit('new-request', netReq)
    dispatch(API.NEW_REQUEST({
      netReq,
      method,
      params,
      timestamp: Date.now(),
    }, netReq.requestID))
    // netReq.defer.promise.then(
    //   val => request.next(val),
    //   err => request.error(err)
    // )
    return netReq.deferFinal.promise
  }

  async invokeNetRequest(netReq: ApiRequest) {
    let networker

    let dcID: number
    try {
      await this.initConnection()


      if (netReq.options.dc) {
        const reqDc = netReq.options.dc
        if (typeof reqDc === 'number')
          dcID = reqDc
        else if (reqDc === '@@home')
          dcID = await this.storage.get('dc')
        else throw new Error(`invokeNetRequest wrong request id ${reqDc}`)
      } else
        dcID = await this.storage.get('dc')

      networker = await this.mtpGetNetworker(dcID)
    } catch (e) {
      netReq.defer.reject(e)
      return netReq.defer.promise
    }



    // const requestThunk = (waitTime: number): Promise<any> => {
    //   debug('requestThunk', 'waitTime')(waitTime)
    //   return delayedCall(req.performRequest, +waitTime * 1e3)
    // }

    await networker.wrapApiCall(
      netReq.data.method,
      netReq.data.params,
      netReq.options,
      netReq.requestID)

    // try {
    //   const result = await networker.wrapApiCall(
    //     netReq.data.method,
    //     netReq.data.params,
    //     netReq.options,
    //     netReq.requestID)
    //   netReq.defer.resolve(result)
    //   return result
    // } catch (err) {
    //   if (isRawError(err)) {
    //     (err: RawErrorStruct)
    //     log`raw error`(err)
    //     console.trace('Wrong way!')
    //     dispatch(API.DONE_REQUEST(err, netReq.requestID))
    //     return netReq.defer.promise
    //   }
    //   const error: MTError = err
    //   console.error(dTime(), 'Error', error.code, error.type, baseDcID, dcID)
    //   console.trace('Unhandled performRequest')
    //   const noAuth = error.code === 401
    //   if (noAuth) {
    //     log('performRequest', 'no auth')(dcID)
    //     this.emit('no-auth', {
    //       dc    : dcID,
    //       apiReq: netReq,
    //       error
    //     })
    //   }
    //   // if (!error)
    //   //   err = { type: 'ERROR_EMPTY', input: '' }
    //   // else if (!is(Object, error))
    //   //   err = { message: error }
    //   // else err = error
    //   console.warn(`[rejectPromise] Unhandled error!`, err)

    //   if (!netReq.options.noErrorBox) {
    //     //TODO weird code. `error` changed after `.reject`?

    //     /*err.input = method

    //     err.stack =
    //       stack ||
    //       hasPath(['originalError', 'stack'], error) ||
    //       error.stack ||
    //       (new Error()).stack*/
    //     /*this.emit('error.invoke', error)*/
    //   }
    //   netReq.defer.reject(error)
    // }

    return netReq.defer.promise
  }
}

/* type RawErrorStruct = {
  _: 'rpc_error',
  error_code: number,
  error_message: string,
}

function isRawError(val: mixed): boolean %checks {
  return typeof val === 'object'
    && val != null
    && val._ === 'rpc_error'
    && typeof val.error_code === 'number'
    && typeof val.error_message === 'string'
}

function requestObserver(netReq: ApiRequest, request: HoldSubject<any>) {
  const obs = Observer({
    next(data) {
      log`obs, next`(data)
      return data
    },
    error(data) {
      log`obs, error`(data)
      return request.next(data)
    },
    async complete(data) {
      log`obs, complete`(data)
      // dispatch(API.DONE_REQUEST(data, netReq.requestID))
      return data
    }
  })(request)

  return obs
} */

const isAnyNetworker = (ctx: ApiManager) => Object.keys(ctx.cache.downloader).length > 0

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Bluebird.reject(error)
}

/* const alreadyAuthWarning = (method: string) => {
  const message = `
!! WARNING !!
You call ${method} method at the time when you are already authorized.
That will have result in unnecessary re-creation of the session`
  console.warn(message)
} */
