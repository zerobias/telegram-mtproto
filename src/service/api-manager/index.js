//@flow

import Promise from 'bluebird'
import EventEmitter from 'eventemitter2'

import { pathSatisfies, complement, isNil, is,
  propEq, has } from 'ramda'

import Logger from '../../util/log'
const debug = Logger`api-manager`

import NetworkerFabric from '../networker'
import Auth, { type Args } from '../authorizer'
import { PureStorage } from '../../store'
import blueDefer from '../../util/defer'
import { dTime } from '../time-manager'
import { chooseServer } from '../dc-configurator'
import TL from '../../tl'
import KeyManager from '../rsa-keys-manger'
import { MTError, AuthKeyError } from '../../error'

import { bytesFromHex, bytesToHex } from '../../bin'

import { type TLs } from '../authorizer/send-plain-req'
import { type TLSchema } from '../../tl/types'
import { switchErrors } from './error-cases'
import { delayedCall } from '../../util/smart-timeout'
import configValidator from './config-validation'
import Request from './request'

import type { Bytes, PublicKey, ApiConfig, ConfigType,
  LeftOptions, AsyncStorage, NetworkerType, Cache } from './index.h'

const api57 = require('../../../schema/api-57.json')
const mtproto57 = require('../../../schema/mtproto-57.json')

const hasPath = pathSatisfies( complement( isNil ) )

const baseDcID = 2

const Ln = (length, obj) => obj && propEq('length', length, obj)

/**
*  Server public key, obtained from here: https://core.telegram.org/api/obtaining_api_id
*
* -----BEGIN RSA PUBLIC KEY-----
* MIIBCgKCAQEAwVACPi9w23mF3tBkdZz+zwrzKOaaQdr01vAbU4E1pvkfj4sqDsm6
* lyDONS789sVoD/xCS9Y0hkkC3gtL1tSfTlgCMOOul9lcixlEKzwKENj1Yz/s7daS
* an9tqw3bfUV/nqgbhGX81v/+7RFAEd+RwFnK7a+XYl9sluzHRyVVaTTveB2GazTw
* Efzk2DWgkBluml8OREmvfraX3bkHZJTKX4EQSjBbbdJ2ZXIsRrYOXfaA+xayEGB+
* 8hdlLmAjbCVfaigxX0CDqWeR1yFL9kwd9P0NsZRPsmoqVwMbMu7mStFai6aIhc3n
* Slv8kg9qv1m6XHVQY3PnEw+QQtqSIXklHwIDAQAB
* -----END RSA PUBLIC KEY-----
*/

const publisKeysHex = [{ //TODO Move this to ApiManager config
  //eslint-disable-next-line
  modulus : 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6fffeed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
  exponent: '010001'
}]



export class ApiManager {
  emitter = new EventEmitter({
    wildcard: true
  })
  on = this.emitter.on.bind(this.emitter)
  emit = this.emitter.emit.bind(this.emitter)
  cache: Cache = {
    uploader  : {},
    downloader: {},
    auth      : {},
    servers   : {},
    keysParsed: {}
  }
  static apiConfig: ApiConfig = {
    invokeWithLayer: 0xda9b0d0d,
    layer          : 57,
    initConnection : 0x69796de9,
    api_id         : 49631,
    device_model   : 'Unknown UserAgent',
    system_version : 'Unknown Platform',
    app_version    : '1.0.1',
    lang_code      : 'en'
  }
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  TL: TLs
  serverConfig: {}
  schema: TLSchema
  mtSchema: TLSchema
  keyManager: Args
  networkFabric: any
  auth: any
  chooseServer: (dcID: number, upload?: boolean) => {}
  constructor({
      server = {},
      api = {},
      app: {
        storage = PureStorage,
        publicKeys = publisKeysHex
      } = {},
      schema = api57,
      mtSchema = mtproto57,
    }: ConfigType = {}) {
    this.apiConfig = { ...ApiManager.apiConfig, ...api }
    const fullCfg = {
      server,
      api: this.apiConfig,
      app: { storage, publicKeys },
      schema,
      mtSchema
    }
    configValidator(fullCfg)
    this.publicKeys = publicKeys
    this.storage = storage
    this.serverConfig = server
    this.schema = schema
    this.mtSchema = mtSchema
    this.chooseServer = chooseServer(this.cache.servers, server)

    this.TL = TL(schema, mtSchema)
    this.keyManager = KeyManager(this.TL.Serialization, publicKeys, this.cache.keysParsed)
    this.auth = Auth(this.TL, this.keyManager)
    this.networkFabric = NetworkerFabric(this.apiConfig, this.chooseServer, this.TL,
                                         storage, this.emit)
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    this.mtpGetNetworker = this.mtpGetNetworker.bind(this)
    const apiManager = this.mtpInvokeApi
    apiManager.setUserAuth = this.setUserAuth
    apiManager.on = this.on
    apiManager.storage = storage
    return apiManager
  }
  networkSetter = (dc: number, options: LeftOptions) =>
    (authKey: Bytes, serverSalt: Bytes): NetworkerType => {
      const networker = new this.networkFabric(dc, authKey, serverSalt, options)
      this.cache.downloader[dc] = networker
      return networker
    }
  mtpGetNetworker = async (dcID: number, options: LeftOptions = {}): Promise<NetworkerType> => {
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
      const { nearest_dc } = nearestDc
      await this.storage.set('dc', nearest_dc)
      //$FlowIssue
      debug`nearest Dc`('%O', nearestDc)
    }
  }
  mtpInvokeApi = async (method: string, params: Object, options: LeftOptions = {}) => {
    // const self = this
    const defError = new Error()
    const stack = defError.stack || 'empty stack'
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
        //$FlowIssue
        err.input = method
        //$FlowIssue
        err.stack =
          stack ||
          hasPath(['originalError', 'stack'], error) ||
          error.stack ||
          (new Error()).stack
        this.emit('error.invoke', error)
      }
    }
    let cachedNetworker

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

    cachedNetworker = networker

    req.performRequest()
      .then(
        deferred.resolve,
        error => {
          const deferResolve = deferred.resolve
          const apiSavedNet = () => cachedNetworker = networker
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
      if (value)
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