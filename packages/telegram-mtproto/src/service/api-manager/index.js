//@flow

import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'

import { type Bytes, type LeftOptions } from './index.h'
import {
  type PublicKey,
  type ApiConfig,
  type StrictConfig,
  type ServerConfig,
} from '../main/index.h'

import { type UID } from 'Newtype'
import Config from 'ConfigProvider'
import ApiRequest from '../main/request'
import { API } from 'Action'

import { dispatch } from 'State'

import { makeAuthRequest } from '../invoke'

import Logger from 'mtproto-logger'
const log = Logger`api-manager`


export class ApiManager {
  uid: UID
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  serverConfig: ServerConfig
  on: On
  emit: Emit
  online: boolean = false
  constructor(config: StrictConfig, uid: UID) {
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

    Config.publicKeys.init(uid, publicKeys)
    //$FlowIssue
    this.mtpInvokeApi = this.mtpInvokeApi.bind(this)
    //$off
    this.invokeNetRequest = this.invokeNetRequest.bind(this)
  }
  mtpGetNetworker() {
    // const uid = this.uid
    // return MaybeT
    //   .toFuture(
    //     ERR.noDC,
    //     queryHomeDc(uid)
    //   )
    //   .chain(dc => getThread(uid, dc))

    // return FutureT.futureEither(checkedDC)

    /*
    const cache = this.cache
    if (cache[dc]) return cache[dc]

    const qAuthKey = queryAuthKey(dc)
    const qSalt = querySalt(dc)
    if (Array.isArray(qAuthKey) && Array.isArray(qSalt)) {
      return new Thread(
        dc, authKey, serverSalt, uid
      )
    } */


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

    /* const auth = await authRequest(uid, dc).promise()

    const { authKey, serverSalt } = auth

    return new Thread(
      dc, authKey, serverSalt, uid
    ) */
  }

  mtpInvokeApi(method: string, params: Object = {}, options: LeftOptions = {}): Promise<any> {
    const netReq = new ApiRequest(
      { method, params },
      options,
      this.uid)

    dispatch(API.REQUEST.NEW({
      netReq,
      method,
      params,
      timestamp: Date.now(),
    }, netReq.requestID), this.uid)
    return netReq.deferFinal.promise
  }

  invokeNetRequest(netReq: ApiRequest) {
    return makeAuthRequest(netReq).promise()
    // try {
    //   const resultDeffered = await makeAuthRequest(this.uid, netReq).promise()
    //   console.warn('resultDeffered', resultDeffered)
    // } finally {
    //   return netReq.defer.promise
    // }
  }
}

declare class NoDCError extends Error {  }
declare class NoThreadError extends Error {  }
declare var typedError: <E, /*:: -*/F>(ErrorClass: Class<E>, x: F) => E
