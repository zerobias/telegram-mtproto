//@flow

import Promise from 'bluebird'
// import UpdatesManager from '../updates'

import propEq from 'ramda/src/propEq'
import has from 'ramda/src/has'

import Logger from '../../util/log'
const debug = Logger`api-manager`

import Auth from '../authorizer'
import type { Args } from '../authorizer'

import blueDefer from '../../util/defer'
import dTime from '../../util/dtime'
import { chooseServer } from '../dc-configurator'

import KeyManager from '../rsa-keys-manger'
import { AuthKeyError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import type { TLSchema } from '../../tl/index.h'
import { switchErrors } from './error-cases'
import { delayedCall } from '../../util/smart-timeout'

import Request from './request'

import type { Bytes, LeftOptions, Cache, RequestOptions } from './index.h'
import type { PublicKey, ApiConfig, StrictConfig, Emit, On, ServerConfig } from '../main/index.h'

import type { AsyncStorage } from '../../plugins'

import { NetworkerThread } from '../networker'

const baseDcID = 2

const Ln = (length: number, obj?: *): boolean => {
  if (obj == null) return false
  //$FlowIssue
  const res = propEq('length', length, obj)
  return res
}



export class ApiManager {
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
  chooseServer: (dcID: number, upload?: boolean) => {}
  currentDc: number = 2
  online: boolean = false
  constructor(config: StrictConfig, { on, emit }: { on: On, emit: Emit }, uid: string) {
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
    this.chooseServer = chooseServer(this.cache.servers, server)
    this.on = on
    this.emit = emit
    this.keyManager = KeyManager(uid, publicKeys, this.cache.keysParsed)
    this.auth = Auth(uid, this.keyManager)

    //$FlowIssue
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    //$FlowIssue
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)

    // this.updatesManager = UpdatesManager(apiManager, this.TL)
    // apiManager.updates = this.updatesManager

    on('error.303', (newDc: number) => {
      this.authBegin = false
      this.currentDc = newDc
    })
  }
  networkSetter(dc: number, authKey: Bytes, serverSalt: Bytes) {
    const networker = new NetworkerThread({
      appConfig   : this.apiConfig,
      storage     : this.storage,
      emit        : this.emit,
      chooseServer: this.chooseServer
    }, dc, authKey, serverSalt, this.uid)
    this.cache.downloader[dc] = networker
    return networker
  }
  async mtpGetNetworker(dcID: number, options: LeftOptions = {}) {
    // const isUpload = options.fileUpload || options.fileDownload
    // const cache = isUpload
    //   ? this.cache.uploader
    //   : this.cache.downloader

    const cache = this.cache.downloader
    if (!dcID) throw new Error('get Networker without dcID')

    if (has(dcID, cache)) return cache[dcID]

    const akk = `dc${  dcID  }_auth_key`
    const ssk = `dc${  dcID  }_server_salt`

    const dcUrl = this.chooseServer(dcID, false)


    if (cache[dcID]) return cache[dcID]

    const authKeyHex: ?string = await this.storage.get(akk)
    let serverSaltHex: ?string = await this.storage.get(ssk)

    if (Ln(512, authKeyHex)) {
      if (!serverSaltHex || serverSaltHex.length !== 16)
        serverSaltHex = 'AAAAAAAAAAAAAAAA'
      const authKey = bytesFromHex(authKeyHex)
      const serverSalt = bytesFromHex(serverSaltHex)

      return this.networkSetter(dcID, authKey, serverSalt)
    }

    if (!options.createNetworker)
      throw new AuthKeyError()

    let auth
    try {
      auth = await this.auth(dcID, this.cache.auth, dcUrl)
    } catch (error) {
      return netError(error)
    }

    const { authKey, serverSalt } = auth

    await this.storage.set(akk, bytesToHex(authKey))
    await this.storage.set(ssk, bytesToHex(serverSalt))

    return this.networkSetter(dcID, authKey, serverSalt)
  }
  async doAuth() {
    this.authBegin = true
    try {
      const storedBaseDc = await this.storage.get('dc')
      const baseDc = storedBaseDc || baseDcID
      const opts = {
        dcID           : baseDc,
        createNetworker: true
      }
      const networker = await this.mtpGetNetworker(baseDc, opts)
      const nearestDc = await networker.wrapApiCall(
        'help.getNearestDc', {}, opts)
      const { nearest_dc, this_dc } = nearestDc
      if (storedBaseDc == null) {
        await this.storage.set('dc', this_dc)
        // if (nearest_dc !== this_dc) await this.mtpGetNetworker(nearest_dc, {
        //   dcID           : this_dc,
        //   createNetworker: true
        // })

      }
      debug(`nearest Dc`, ` this dc`)(nearestDc, this_dc)
      this.authPromise.resolve()
    } catch (err) {
      this.authPromise.reject(err)
    }
  }
  async initConnection() {
    if (!isAnyNetworker(this)) {
      if (!this.authBegin)
        this.doAuth()
      await this.authPromise.promise
    }
  }
  async mtpInvokeApi(method: string, params: Object, options: LeftOptions = {}) {
    const deferred = blueDefer()
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
      deferred.reject(err)

      if (!options.noErrorBox) {
        //TODO weird code. `error` changed after `.reject`?

        /*err.input = method

        err.stack =
          stack ||
          hasPath(['originalError', 'stack'], error) ||
          error.stack ||
          (new Error()).stack*/
        this.emit('error.invoke', error)
      }
    }
    try {
      await this.initConnection()

      const requestThunk = waitTime => delayedCall(req.performRequest, +waitTime * 1e3)

      const dcID = options.dcID
        ? options.dcID
        : await this.storage.get('dc')

      const networker = await this.mtpGetNetworker(dcID, options)

      const cfg: RequestOptions = {
        networker,
        dc          : dcID,
        storage     : this.storage,
        getNetworker: this.mtpGetNetworker,
        netOpts     : options
      }
      const req = new Request(cfg, method, params)


      req.performRequest()
        .then(
          deferred.resolve,
          error => {
            const deferResolve = deferred.resolve
            const apiSavedNet = () => networker
            const apiRecall = networker => {
              req.config.networker = networker
              return req.performRequest()
            }
            console.error(dTime(), 'Error', error.code, error.type, baseDcID, dcID)

            return switchErrors(error, options, dcID, baseDcID)(
              error, options, dcID, this.emit, rejectPromise, requestThunk,
              apiSavedNet, apiRecall, deferResolve, this.mtpInvokeApi,
              this.storage)
          })
        .catch(rejectPromise)
    } catch (e) {
      deferred.reject(e)
    }
    return deferred.promise
  }

  setUserAuth = async (dcID: number, userAuth: any) => {
    const fullUserAuth = { dcID, ...userAuth }
    await this.storage.set('dc', dcID)
    await this.storage.set('user_auth', fullUserAuth)
    this.emit('auth.dc', { dc: dcID, auth: userAuth })
  }
}

const isAnyNetworker = (ctx: ApiManager) => Object.keys(ctx.cache.downloader).length > 0

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Promise.reject(error)
}
