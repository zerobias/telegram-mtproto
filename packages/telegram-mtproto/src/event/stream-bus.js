//@flow

import type { EventEmitterType } from 'eventemitter2'
import { Stream } from 'most'

import Config from 'ConfigProvider'
import { makeEventStream } from './make-event-stream'

import { MTProto } from '../service/main'
import ApiRequest from '../service/main/request'
import NetworkerThread from '../service/networker'
import { NetMessage } from '../service/networker/net-message'
import { MTError, RpcApiError } from '../error'

import Logger from 'mtproto-logger'
const log = Logger`stream-bus`


const createStreamBus = (ctx: MTProto) => {
  const emitter = Config.rootEmitter(ctx.uid)
  const bus = makeStreamMap(emitter)

  bus.responseRaw.observe(log('raw response'))

  bus.messageIn.observe(log('message in'))

  const apiOnly = bus.messageIn.filter(value => value.isAPI)
  const mtOnly = bus.messageIn.filter(value => !value.isAPI)

  apiOnly.observe((val) => {
    Config.fastCache.get(ctx.uid, val.dc).messages.set(val.msg_id, val)
  })
  mtOnly.observe((val) => {
    Config.fastCache.get(ctx.uid, val.dc).messages.set(val.msg_id, val)
  })

  /* bus.rpcResult.observe(async(data: OnRpcResult) => {
    log('rpc result')(data)
    data.sentMessage.deferred.resolve(data.result)
    ctx.state.messages.delete(data.sentMessage.msg_id)
    const requestID = data.sentMessage.requestID
    if (typeof requestID !== 'string') return
    const req = ctx.state.requests.get(requestID)
    if (req) {
      // data.sentMessage.deferred.reject('No such request!')
      req.defer.resolve(data.result)
      ctx.state.requests.delete(requestID)
    }
  }) */

  bus.rpcError.observe(log('rpc error'))

  const isAuthRestart = (error: MTError) =>
    error.code === 500
    && error.type === 'AUTH_RESTART'

  /* bus.rpcError.observe(async({ error, ...data }: OnRpcError) => {
    if (error instanceof RpcApiError === false)
      throw error
    if (isFileMigrateError(error)) {
      const newDc = getFileMigrateDc(error)
      if (typeof newDc !== 'number') throw error
      if (!ctx.state.messages.has(data.message.req_msg_id)) {
        data.sentMessage.deferred.reject(error)
        return log('on file migrate error')(data.message.req_msg_id, 'req_msg_id not found')
      }
      const msg = ctx.state.messages.get(data.message.req_msg_id)
      if (!msg || !msg.requestID || typeof msg.requestID !== 'string') {
        data.sentMessage.deferred.reject(error)
        return log('on file migrate error')('msg', msg)
      }
      const req = ctx.state.requests.get(msg.requestID)
      if (!req) {
        data.sentMessage.deferred.reject(error)
        return log('on file migrate error')('req', req)
      }
      req.options.dc = newDc
      log('file migrate', 'req')(req)
      log('on file migrate restart')('before end')
      await ctx.api.invokeNetRequest(req)
    } if (isMigrateError(error)) {
      const newDc = getMigrateDc(error)
      if (typeof newDc !== 'number') throw error
      await ctx.storage.set('dc', newDc)
      if (!ctx.state.messages.has(data.message.req_msg_id)) {
        data.sentMessage.deferred.reject(error)
        return log('on migrate error')(data.message.req_msg_id, 'req_msg_id not found')
      }
      const msg = ctx.state.messages.get(data.message.req_msg_id)
      if (!msg || !msg.requestID || typeof msg.requestID !== 'string') {
        data.sentMessage.deferred.reject(error)
        return log('on migrate error')('msg', msg)
      }
      const req = ctx.state.requests.get(msg.requestID)
      if (!req) {
        data.sentMessage.deferred.reject(error)
        return log('on migrate error')('req', req)
      }
      req.options.dc = newDc
      log('migrate', 'req')(req)
      log('on migrate restart')('before end')
      await ctx.api.invokeNetRequest(req)
    } else if (isAuthRestart(error)) {
      if (!ctx.state.messages.has(data.message.req_msg_id)) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'auth restart')(data.message.req_msg_id, 'req_msg_id not found')
      }
      const msg = ctx.state.messages.get(data.message.req_msg_id)
      if (!msg || !msg.requestID) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'auth restart')('no requestID msg', msg)
      }
      const req = ctx.state.requests.get(msg.requestID)
      if (!req) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'on auth restart')('no request info', msg)
      }
      const { authKey, saltKey } = dcStoreKeys(data.networkerDC)
      log('on auth restart')(authKey, saltKey)
      await ctx.storage.remove(authKey, saltKey)
      log('on auth restart')('before end')
      // await ctx.api.doAuth()
      await ctx.api.invokeNetRequest(req)
    } else if (error.code === 401) {

      log('rpc', 'auth key unreg')(data.sentMessage)
      const reqId = data.sentMessage.requestID
      if (!reqId) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'auth key unreg')('no requestID msg', data.sentMessage)
      }
      const dc = data.sentMessage.dc
      const req = ctx.state.requests.get(reqId)
      if (!req || !dc) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'on auth key unreg')('no request info', dc, reqId)
      }

      // const { authKey, saltKey } = dcStoreKeys(dc)
      // await ctx.storage.remove(authKey)
      const thread = ctx.state.threads.get(data.threadID)
      if (!thread) {
        data.sentMessage.deferred.reject(error)
        return log('error', 'on auth key unreg')('no thread', dc, data.threadID)
      }
      ctx.api.authBegin = false
      log('on auth key unreg')('before end')
      // const nearest = await ctx.storage.get('nearest_dc')

      await ctx.storage.set('dc', currentDc)
      // await new Promise(rs => setTimeout(rs, 1e3))
      req.options.dc = currentDc
      // await ctx.api.doAuth()
      await ctx.api.invokeNetRequest(req)
    } else {
      log('rpc', 'unhandled')(data)
      log('rpc', 'unhandled', 'error')(error)
      // data.sentMessage.deferred.reject(error)
    }
  }) */

  // bus.netMessage.observe((message) => {
  //   log('net message')(message)
  //   const req = ctx.state.messages.get(message.msg_id)
  //   log('req')(req)
  // })

  // bus.netMessage.observe(log('new request'))

  /* bus.newSession.observe(async({
    threadID,
    networkerDC,
    message,
    messageID
  }) => {
    const thread = ctx.state.threads.get(threadID)
    if (!thread) {
      log`new session, error, no thread`(threadID, messageID)
      return
    }
    // await thread.applyServerSalt(message.server_salt)
    // thread.ackMessage(messageID)
    // thread.processMessageAck(message.first_msg_id)

    log`new session, handled`(messageID, networkerDC)

    const repeatRequest =
      (req: ApiRequest) =>
        of(req)
          .map(ctx.api.invokeNetRequest)
          .awaitPromises()

    await from(ctx.state.requests.values())
      // .debounce(30)
      .map(repeatRequest)
      .mergeConcurrently(1)
      .observe(log`recurring requests`)
  }) */

  bus.untypedMessage.observe(log`untyped`)

  // bus.noAuth.observe(async({
  //   dc,
  //   apiReq,
  //   error
  //   }: NoAuth) => {
  //   // const mainDc  = await ctx.storage.get('dc')
  //   // if (dc === mainDc) {

  //   // } else {

  //   // }
  // })

  return bus
}


const an: any = {}

const responseRawCast    : RawEvent<Object> = an
const newNetworkerCast   : NetworkerThread = an
const rpcResultCast      : OnRpcResult = an
const rpcErrorCast       : OnRpcError = an
const untypedMessageCast : OnUntypedMessage = an
const newRequestCast     : ApiRequest = an
const messageInCast      : NetMessage = an
const newSessionCast     : OnNewSession = an
const noAuthCast         : NoAuth = an

function makeStreamMap(emitter: EventEmitterType): Bus {
  const getter = makeEventStream(emitter)

  const responseRaw     = getter('response-raw', responseRawCast)
  const newNetworker    = getter('new-networker', newNetworkerCast)
  const rpcError        = getter('rpc-error', rpcErrorCast)
  const rpcResult       = getter('rpc-result', rpcResultCast)
  const untypedMessage  = getter('untyped-message', untypedMessageCast)
  const newRequest      = getter('new-request', newRequestCast)
  const messageIn       = getter('message-in', messageInCast)
  const newSession      = getter('new-session', newSessionCast)
  const noAuth          = getter('no-auth', noAuthCast)

  const streamMap = {
    responseRaw,
    newNetworker,
    rpcError,
    untypedMessage,
    newRequest,
    messageIn,
    rpcResult,
    newSession,
    noAuth,
  }

  return streamMap
}

export type Bus = {
  responseRaw: Stream<RawEvent<Object>>,
  newNetworker: Stream<NetworkerThread>,
  rpcResult: Stream<OnRpcResult>,
  rpcError: Stream<OnRpcError>,
  untypedMessage: Stream<OnUntypedMessage>,
  newRequest: Stream<ApiRequest>,
  messageIn: Stream<NetMessage>,
  newSession: Stream<OnNewSession>,
  noAuth: Stream<NoAuth>,
}

type OnRpcResult = {
  threadID: string,
  networkerDC: number,
  message: { _: string, req_msg_id: string, [key: string]: any },
  sentMessage: NetMessage,
  result: Object
}

type OnRpcError = {
  threadID: string,
  networkerDC: number,
  error: RpcApiError,
  sentMessage: NetMessage,
  message: { _: string, req_msg_id: string, [key: string]: any }
}

type OnNewSession = {
  threadID: string,
  networkerDC: number,
  message: {
    _: string,
    req_msg_id: string,
    [key: string]: any
  },
  messageID: string
}

type OnUntypedMessage = {
  threadID: string,
  networkerDC: number,
  message: {
    _: string,
    req_msg_id: string,
    [key: string]: any
  },
  messageID: string,
  sessionID: Uint8Array,
  result: Object,
}

type RawEvent<T> = {
  data: T,
  status: number,
  statusText: string
}

type NoAuth = {
  dc: number,
  apiReq: ApiRequest,
  error: MTError,
}




export default createStreamBus
