//@flow

import Promise from 'bluebird'
// import UpdatesManager from '../updates'

import Logger from 'mtproto-logger'
const debug = Logger`api-manager`

import Auth from '../authorizer'
import type { Args } from '../authorizer'

import blueDefer from '../../util/defer'

import KeyManager from '../rsa-keys-manger'
import { MTError, DcUrlError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import { switchErrors } from './error-cases'
import { delayedCall, dTime } from 'mtproto-shared'

import Request from './request'

import type { Bytes, LeftOptions, Cache, RequestOptions } from './index.h'
import type { PublicKey, ApiConfig, StrictConfig, ServerConfig } from '../main/index.h'
import type { Emit, On } from 'eventemitter2'
import type { AsyncStorage } from '../../plugins'

import Config from '../../config-provider'
import NetworkerThread from '../networker'
import ApiRequest from '../main/request'
import Property from '../../property'

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
  keyManager: Args
  networkFabric: *
  updatesManager: any
  auth: *
  on: On
  emit: Emit
  authPromise: * = blueDefer()
  authBegin = false
  currentDc: number = 2
  online: boolean = false
  onlineProp: *
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
    this.keyManager = KeyManager(uid, publicKeys, this.cache.keysParsed)
    this.auth = Auth(uid, this.keyManager)

    //$FlowIssue
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    //$FlowIssue
    this.invokeNetRequest = this.invokeNetRequest.bind(this)
    //$FlowIssue
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)

    const onlineProp = Property([this.uid, 'state', 'online'].join('.'), false, emitter.root)
    this.onlineProp = onlineProp
    onlineProp.get.observe(debug`online prop`)
    onlineProp.get.drain()
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
    this.emit('base', 'AUTH')
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
      debug(`nearest Dc`, ` this dc`)(nearestDc, this_dc)
      this.onlineProp.set(true)
      this.authPromise.resolve()
    } catch (err) {
      this.authPromise.reject(err)
    }
  }
  async initConnection() {
    this.emit('base', 'AUTH')
    if (!isAnyNetworker(this)) {
      if (!this.authBegin)
        this.doAuth()
      await this.authPromise.promise
    }
  }
  mtpInvokeApi(method: string, params: Object, options: LeftOptions = {}) {
    const netReq = new ApiRequest({ method, params }, options)

    netReq.options.requestID = netReq.requestID
    this.emit('new-request', netReq)

    return netReq.defer.promise
    // this.invokeNetRequest(netReq)
  }

  async invokeNetRequest(netReq: ApiRequest) {

    const rejectPromise = (error: any) => {
      let err
      if (error instanceof Error)
        err = error
      else {
        err = new Error()
        //$FlowIssue
        err.data = error
      }
      // if (!error)
      //   err = { type: 'ERROR_EMPTY', input: '' }
      // else if (!is(Object, error))
      //   err = { message: error }
      // else err = error
      console.warn(`[rejectPromise] Unhandled error!`, err)

      if (!netReq.options.noErrorBox) {
        //TODO weird code. `error` changed after `.reject`?

        /*err.input = method

        err.stack =
          stack ||
          hasPath(['originalError', 'stack'], error) ||
          error.stack ||
          (new Error()).stack*/
        this.emit('error.invoke', error)
      }
      netReq.defer.reject(err)
    }
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

    const cfg: RequestOptions = {
      networker,
      dc          : dcID,
      storage     : this.storage,
      getNetworker: this.mtpGetNetworker,
      netOpts     : netReq.options
    }
    const req = new Request(cfg, netReq.data.method, netReq.data.params)
    const requestThunk = (waitTime: number): Promise<any> => {
      debug('requestThunk', 'waitTime')(waitTime)
      return delayedCall(req.performRequest, +waitTime * 1e3)
    }
    const apiRecall = (networker: NetworkerThread) => {
      req.config.networker = networker
      return req.performRequest()
    }
    req.performRequest()
      .then(
        netReq.defer.resolve,
        (error: MTError) => {
          const deferResolve = netReq.defer.resolve
          const apiSavedNet = () => networker

          console.error(dTime(), 'Error', error.code, error.type, baseDcID, dcID)

          const noAuth = error.code === 401
          if (noAuth) {
            debug('performRequest', 'no auth')(dcID)
            this.emit('no-auth', {
              dc    : dcID,
              req,
              apiReq: netReq,
              error
            })
          }
          const waitFailRegExp = /MSG_WAIT_FAILED_(\d+)/

        //   return switchErrors(
        //     error,
        //     netReq.options,
        //     dcID,
        //     baseDcID
        //   )(
        //     error,
        //     netReq.options,
        //     dcID,
        //     this.emit,
        //     rejectPromise,
        //     requestThunk,
        //     apiSavedNet,
        //     apiRecall,
        //     deferResolve,
        //     this.mtpInvokeApi,
        //     this.storage)
        })
      .catch(rejectPromise)

    return netReq.defer.promise
  }

  // setUserAuth = async (dcID: number, userAuth: any) => {
  //   const fullUserAuth = { dcID, ...userAuth }
  //   await this.storage.set('dc', dcID)
  //   await this.storage.set('user_auth', fullUserAuth)
  //   this.emit('auth.dc', { dc: dcID, auth: userAuth })
  // }
}

const isAnyNetworker = (ctx: ApiManager) => Object.keys(ctx.cache.downloader).length > 0

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Promise.reject(error)
}
