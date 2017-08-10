//@flow

import Bluebird from 'bluebird'

import Logger from 'mtproto-logger'
const log = Logger`api-manager`

import Auth from '../authorizer'

import blueDefer from 'Util/defer'

import { DcUrlError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import { type Bytes, type LeftOptions, type Cache } from './index.h'
import { type PublicKey, type ApiConfig, type StrictConfig, type ServerConfig } from '../main/index.h'
import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from '../../plugins'

import Config from '../../config-provider'
import NetworkerThread from '../networker'
import ApiRequest from '../main/request'
import { API } from 'Action'

import { dispatch } from '../../state/core'
import { homeDc } from '../../state/signal'

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

    //$FlowIssue
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    this.invokeNetRequest = this.invokeNetRequest.bind(this)
    //$FlowIssue
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)
    //$FlowIssue
    this.networkSetter = this.networkSetter.bind(this)

    this.auth = Auth(uid, publicKeys, this.cache.keysParsed)

    homeDc.observe(newHome => {
      if (isFinite(newHome))
        this.currentDc = newHome
    })
    emitter.on('error.303', (newDc: number) => {
      this.authBegin = false
      this.currentDc = newDc
    })
  }
  networkSetter(dc: number, authKey: Bytes, serverSalt: Bytes): NetworkerThread {
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
    console.warn(`deprecated method doAuth`)
    console.trace('doAuth')
    this.authBegin = true
    this.emit('base', 'CHECK')
    try {
      const baseDc = this.currentDc
      const opts = {
        dc             : baseDc,
        createNetworker: true
      }
      const networker = await this.mtpGetNetworker(baseDc)
      const nearestDc = await networker.wrapApiCall(
        'help.getNearestDc', {}, opts)
      const { nearest_dc, this_dc } = nearestDc
      await this.storage.set('nearest_dc', nearest_dc)
      // if (storedBaseDc == null) {
      await this.storage.set('dc', nearest_dc)
      // if (nearest_dc !== this_dc) await this.mtpGetNetworker(nearest_dc, {
      //   dcID           : this_dc,
      //   createNetworker: true
      // })

      // }
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
      (req: ApiRequest) => this.invokeNetRequest(req))
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
    dispatch(API.REQUEST.NEW({
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
    try {
      // await this.initConnection()
      const dcID = this.currentDc

      const cached = this.cache.downloader[dcID]
      networker = cached == null
        ? await this.mtpGetNetworker(dcID)
        : cached
    } catch (e) {
      netReq.defer.reject(e)
      return netReq.defer.promise
    }

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
    //     dispatch(API.REQUEST.DONE(err, netReq.requestID))
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

/* async function getDc(netReq: ApiRequest, storage: AsyncStorage): Promise<number> {
  if (netReq.options.dc) {
    const reqDc = netReq.options.dc
    if (typeof reqDc === 'number')
      return reqDc
    else if (reqDc === '@@home')
      return await storage.get('dc')
    else throw new Error(`invokeNetRequest wrong request id ${reqDc}`)
  } else
    return await storage.get('dc')
} */

const isAnyNetworker = (ctx: ApiManager) => Object.keys(ctx.cache.downloader).length > 0

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Bluebird.reject(error)
}

