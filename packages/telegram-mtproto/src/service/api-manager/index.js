//@flow

import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'
import { Right, Left, Apropos, of } from 'apropos'
import { append, identity } from 'ramda'
import { Fluture, resolve } from 'fluture'
import { Maybe, Just, Nothing } from 'folktale/maybe'

import Auth from '../authorizer'

import { type Bytes, type LeftOptions } from './index.h'
import { type PublicKey, type ApiConfig, type StrictConfig, type ServerConfig } from '../main/index.h'

import NetworkerThread, { createThread } from '../networker'
import Logger from 'mtproto-logger'
const log = Logger`api-manager`
import Config from 'ConfigProvider'
import ApiRequest from '../main/request'
import { API } from 'Action'

import { dispatch } from 'State'
import { type DCNumber } from '../../state/index.h'
import {
  querySalt,
  queryAuthKey,
  queryHomeDc,
} from '../../state/query'
import { MaybeT, EitherT, FutureT } from 'Util/monad-t'

// const x = createThread(3, [], [], '')

export class ApiManager {
  // invokeNetRequest: (netReq: ApiRequest) => Promise<mixed>
  uid: string
  apiConfig: ApiConfig
  publicKeys: PublicKey[]
  storage: AsyncStorage
  serverConfig: ServerConfig
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
      (req: ApiRequest) => this.invokeNetRequest(req))

    netReq.options.requestID = netReq.requestID

    dispatch(API.REQUEST.NEW({
      netReq,
      method,
      params,
      timestamp: Date.now(),
    }, netReq.requestID), this.uid)
    return netReq.deferFinal.promise
  }

  async invokeNetRequest(netReq: ApiRequest) {
    try {
      const networker = await getThread(this.uid).promise()
      const netMessage = networker.wrapApiCall(
        netReq.data.method,
        netReq.data.params,
        netReq.options,
        netReq.requestID)
      await netMessage.deferred.promise
    } catch (e) {
      netReq.defer.reject(e)
    } finally {
      return netReq.defer.promise
    }
  }
}

const getThread = (uid) => MaybeT
  .toFuture(
    ERR.noDC,
    queryHomeDc(uid)
  )
  .chain(dc => MaybeT
    .toFutureR(queryKeys(uid)(dc))
    .chainRej(() => authRequest(uid, dc))
    .map(({ auth, dc, salt }) => MaybeT.fold(
      () => createThread( dc, auth, salt, uid ),
      Config
        .thread
        .get(uid, dc)
  )))

const queryKeys = (() => {
  const queryKeys = (uid, dc) => MaybeT.both(
    queryAuthKey(uid, dc),
    querySalt(uid, dc)
  )
  const toKeyPair = dc => ([auth, salt]) => ({ auth, salt, dc })
  return (uid) => (dc) => queryKeys(uid, dc).map(toKeyPair(dc))
})()

const authRequest = (uid: string, dc) => Auth(uid, dc)
  .bimap(
    error => {
      console.error('Auth error', error.message, error.stack)
      return error
    },
    ({ authKey, authKeyID, serverSalt, dc }) => ({
      auth: authKey,
      salt: serverSalt,
      // authKeyID,
      dc
    })
  )

declare class NoDCError extends Error {  }
declare class NoThreadError extends Error {  }
declare var typedError: <E, /*:: -*/F>(ErrorClass: Class<E>, x: F) => E

const ERR = {
  noDC: () => /*:: typedError(NoDCError,*/
    new Error('get Networker without dcID') /*::) */,
  isNothing() { throw new Error(`UnsafeMaybeValue recieve nothing`) }
}
