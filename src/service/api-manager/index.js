//@flow

import Promise from 'bluebird'
import UpdatesManager from '../updates'

import isNil from 'ramda/src/isNil'
import is from 'ramda/src/is'
import propEq from 'ramda/src/propEq'
import has from 'ramda/src/has'
import pathSatisfies from 'ramda/src/pathSatisfies'
import complement from 'ramda/src/complement'

import Logger from '../../util/log'
const debug = Logger`api-manager`

import Auth from '../authorizer'
import type { Args } from '../authorizer'

import blueDefer from '../../util/defer'
import { dTime } from '../time-manager'
import { chooseServer } from '../dc-configurator'

import KeyManager from '../rsa-keys-manger'
import { AuthKeyError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import type { TLFabric } from '../../tl'
import type { TLSchema } from '../../tl/index.h'
import { switchErrors } from './error-cases'
import { delayedCall } from '../../util/smart-timeout'

import Request from './request'

import type { Bytes, PublicKey, LeftOptions, AsyncStorage, Cache } from './index.h'

import type { ApiConfig, StrictConfig } from '../main/index.h'

import type { Networker } from '../networker'

import type { Emit, On } from '../main/index.h'

const hasPath = pathSatisfies( complement( isNil ) )

const baseDcID = 2

const Ln = (length, obj) => obj && propEq('length', length, obj)



export class ApiManager {
  cache: Cache = {
    uploader  : {},
    downloader: {},
    auth      : {},
    servers   : {},
    keysParsed: {}
  }
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  TL: TLFabric
  serverConfig: {}
  schema: TLSchema
  mtSchema: TLSchema
  keyManager: Args
  networkFabric: any
  updatesManager: any
  auth: any
  on: On
  emit: Emit
  chooseServer: (dcID: number, upload?: boolean) => {}
  constructor(config: StrictConfig, tls: TLFabric, netFabric: Function, { on, emit }: { on: On, emit: Emit }) {
    const {
      server,
      api,
      app: {
        storage,
        publicKeys
      },
      schema,
      mtSchema
    } = config
    this.apiConfig = api
    this.publicKeys = publicKeys
    this.storage = storage
    this.serverConfig = server
    this.schema = schema
    this.mtSchema = mtSchema
    this.chooseServer = chooseServer(this.cache.servers, server)
    this.on = on
    this.emit = emit
    this.TL = tls
    this.keyManager = KeyManager(this.TL.Serialization, publicKeys, this.cache.keysParsed)
    this.auth = Auth(this.TL, this.keyManager)
    this.networkFabric = netFabric(this.chooseServer)
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)
    const apiManager = this.mtpInvokeApi
    apiManager.setUserAuth = this.setUserAuth
    apiManager.on = this.on
    apiManager.emit = this.emit
    apiManager.storage = storage

    this.updatesManager = UpdatesManager(apiManager)
    apiManager.updates = this.updatesManager

    return apiManager
  }
  networkSetter = (dc: number, options: LeftOptions) =>
    (authKey: Bytes, serverSalt: Bytes): Networker => {
      const networker = this.networkFabric(dc, authKey, serverSalt, options)
      this.cache.downloader[dc] = networker
      return networker
    }
  mtpGetNetworker = async (dcID: number, options: LeftOptions = {}) => {
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

    const networkSetter = this.networkSetter(dcID, options)

    const authKeyHex = await this.storage.get(akk)
    let serverSaltHex = await this.storage.get(ssk)

    if (cache[dcID]) return cache[dcID]

    if (Ln(512, authKeyHex)) {
      if (!serverSaltHex || serverSaltHex.length !== 16)
        serverSaltHex = 'AAAAAAAAAAAAAAAA'
      const authKey = bytesFromHex(authKeyHex)
      const serverSalt = bytesFromHex(serverSaltHex)

      return networkSetter(authKey, serverSalt)
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

    return networkSetter(authKey, serverSalt)
  }
  async initConnection() {
    if (!isAnyNetworker(this)) {
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
      await this.storage.set('dc', nearest_dc)
      debug(`nearest Dc`)('%O', nearestDc)
      if (nearest_dc !== this_dc) await this.mtpGetNetworker(nearest_dc, { createNetworker: true })
    }
  }
  mtpInvokeApi = async (method: string, params: Object, options: LeftOptions = {}) => {
    const deferred = blueDefer()
    const rejectPromise = (error: any) => {
      let err
      if (!error)
        err = { type: 'ERROR_EMPTY', input: '' }
      else if (!is(Object, error))
        err = { message: error }
      else err = error
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

    await this.initConnection()

    const requestThunk = waitTime => delayedCall(req.performRequest, +waitTime * 1e3)

    const dcID = options.dcID
      ? options.dcID
      : await this.storage.get('dc')

    const networker = await this.mtpGetNetworker(dcID, options)

    const cfg = {
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

    return deferred.promise
  }

  setUserAuth = (dcID: number, userAuth: any) => {
    const fullUserAuth = { dcID, ...userAuth }
    this.storage.set({
      dc       : dcID,
      user_auth: fullUserAuth
    })
    this.emit('auth.dc', { dc: dcID, auth: userAuth })
  }
  async mtpClearStorage() {
    const saveKeys = []
    for (let dcID = 1; dcID <= 5; dcID++) {
      saveKeys.push(`dc${  dcID  }_auth_key`)
      saveKeys.push(`t_dc${  dcID  }_auth_key`)
    }
    this.storage.noPrefix() //TODO Remove noPrefix

    const values = await this.storage.get(...saveKeys)

    await this.storage.clear()

    const restoreObj = {}
    saveKeys.forEach((key, i) => {
      const value = values[i]
      if (value !== false && value !== undefined)
        restoreObj[key] = value
    })
    this.storage.noPrefix()

    return this.storage.set(restoreObj) //TODO definitely broken
  }
}

const isAnyNetworker = (ctx: ApiManager) => Object.keys(ctx.cache.downloader).length > 0

const netError = error => {
  console.log('Get networker error', error, error.stack)
  return Promise.reject(error)
}
