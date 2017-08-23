//@flow

import Logger from 'mtproto-logger'
const log = Logger`api-manager`

import Auth from '../authorizer'

import { type Bytes, type LeftOptions, type Cache } from './index.h'
import { type PublicKey, type ApiConfig, type StrictConfig, type ServerConfig } from '../main/index.h'
import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from '../../plugins'

import Config from '../../config-provider'
import NetworkerThread from '../networker'
import ApiRequest from '../main/request'
import { API } from 'Action'

import { dispatch } from '../../state'
import { homeDc } from '../../state/signal'
import {
  querySalt,
  queryAuthID,
  queryAuthKey,
  queryHomeDc,
} from '../../state/query'

export class ApiManager {
  invokeNetRequest: (netReq: ApiRequest) => Promise<mixed>
  cache: Cache = {}
  uid: string
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  serverConfig: ServerConfig
  networkFabric: *
  on: On
  emit: Emit
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

    Config.publicKeys.init(uid, publicKeys)
  }
  networkSetter(dc: number, authKey: Bytes, serverSalt: Bytes): NetworkerThread {
    const networker = new NetworkerThread({
      appConfig: this.apiConfig,
      storage  : this.storage,
    }, dc, authKey, serverSalt, this.uid)
    this.cache[dc] = networker
    return networker
  }
  async mtpGetNetworker(dc: number) {

    const cache = this.cache
    if (!dc) throw new Error('get Networker without dcID')

    if (cache[dc]) return cache[dc]

    const qAuthKey = queryAuthKey(dc)
    const qSalt = querySalt(dc)
    if (Array.isArray(qAuthKey) && Array.isArray(qSalt)) {
      return this.networkSetter(dc, qAuthKey, qSalt)
    }
    console.trace()
    // const authKeyHex: string = await this.storage.get(akk)
    // let serverSaltHex: string = await this.storage.get(ssk)

    // const haveAuthKey =
    //   authKeyHex != null
    //   && typeof authKeyHex.length === 'number'
    //   && authKeyHex.length === 512
    // if (haveAuthKey) {
    //   if (!serverSaltHex || serverSaltHex.length !== 16)
    //     serverSaltHex = 'AAAAAAAAAAAAAAAA'
    //   const authKey = bytesFromHex(authKeyHex)
    //   const serverSalt = bytesFromHex(serverSaltHex)

    //   return this.networkSetter(dc, authKey, serverSalt)
    // }

    let auth
    try {
      auth = await Auth(this.uid, dc).promise()
    } catch (error) {
      console.log('Get networker error', error.message, error.stack)
      throw error
    }

    const { authKey, serverSalt } = auth

    return this.networkSetter(dc, authKey, serverSalt)
  }

  mtpInvokeApi(method: string, params: Object = {}, options: LeftOptions = {}): Promise<any> {
    const netReq = new ApiRequest(
      { method, params },
      options,
      (req: ApiRequest) => this.invokeNetRequest(req))

    netReq.options.requestID = netReq.requestID

    dispatch(API.REQUEST.NEW({
      netReq,
      method,
      params,
      timestamp: Date.now(),
    }, netReq.requestID))
    return netReq.deferFinal.promise
  }

  async invokeNetRequest(netReq: ApiRequest) {
    let networker
    try {
      const dcID = queryHomeDc()

      const cached = this.cache[dcID]
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

    return netReq.defer.promise
  }
}

