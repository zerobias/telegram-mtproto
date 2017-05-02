//@flow

import Config from '../config-provider'
import { makeEventStream } from './make-event-stream'

import type { MTProto } from '../service/main'
import Request from '../service/main/request'
import NetworkerThread from '../service/networker'
import type { EventEmitterType } from 'eventemitter2'
import { NetMessage } from '../service/networker/net-message'
import { MTError } from '../error'

import Logger from 'mtproto-logger'
const log = Logger`stream-bus`



const createStreamBus = (ctx: MTProto) => {
  const emitter = Config.rootEmitter(ctx.uid)
  const bus = makeStreamMap(emitter)

  // pushMessage.onValue(log('push message'))

  bus.responseRaw.onValue(log('raw response'))
  bus.responseRaw.onError(log('raw error'))

  bus.incomingMessage.onValue(log('incoming message'))

  const state = ctx.state

  bus.incomingMessage.observe({
    value(val) {
      const networker = state.threads.get(val.threadID)
      if (networker == null) return
      log('observer', 'type')(val.message._, networker.dcID)
    }
  })

  bus.newNetworker.observe((networker) => {
    log('new networker')(networker)
    state.threads.set(networker.threadID, networker)
  })



  bus.migrateError.observe(async ({
    threadID,
    networkerDC,
    newDc,
    error,
    sentMessage,
    message
  }: OnMigrate) => {
    log('migrate')(message)
    await ctx.storage.set('dc', newDc)
    // const thread = ctx.state.threads.get(threadID)
    // if (thread == null) return
    if (typeof sentMessage.requestID !== 'string') return
    const req = ctx.state.requests.get(sentMessage.requestID)
    if (req == null) return
    req.options.dc = newDc
    log('migrate', 'req')(req)
    log('on migrate restart')('before end')
    await ctx.api.invokeNetRequest(req)
    // thread.generateSeqNo(notContentRelated?)
    // message.clone
  })

  bus.messageIn.onValue(log('message in'))

  const apiOnly = bus.messageIn.filter(value => value.isAPI)
  const mtOnly = bus.messageIn.filter(value => !value.isAPI)

  apiOnly.observe({
    value(val) {
      ctx.state.messages.set(val.msg_id, val)

    }
  })

  bus.rpcResult.observe(async (data) => {
    log('rpc result')(data)
    ctx.state.messages.delete(data.sentMessage.msg_id)
    ctx.state.requests.delete(data.sentMessage.requestID)
    data.sentMessage.deferred.resolve(data.result)
  })

  bus.rpcError.onValue(log('rpc error'))

  const isAuthRestart = (error: MTError) =>
    error.code === 500 &&
    error.type === 'AUTH_RESTART'

  bus.rpcError.observe(async (data: OnRpcError) => {
    if (isAuthRestart(data.error)) {
      if (!ctx.state.messages.has(data.message.req_msg_id)) {
        data.sentMessage.deferred.reject(data.error)
        return log('on auth restart')(data.message.req_msg_id, 'req_msg_id not found')
      }
      const msg = ctx.state.messages.get(data.message.req_msg_id)
      if (!msg || !msg.requestID) {
        data.sentMessage.deferred.reject(data.error)
        return log('on auth restart')('msg', msg)
      }
      const req = ctx.state.requests.get(msg.requestID)
      if (!req) {
        data.sentMessage.deferred.reject(data.error)
        return log('on auth restart')('req', req)
      }

      log('on auth restart')(`dc${data.networkerDC}_auth_key`, `dc${data.networkerDC}_server_salt`)
      await ctx.storage.remove(`dc${data.networkerDC}_auth_key`, `dc${data.networkerDC}_server_salt`)
      log('on auth restart')('before end')
      await ctx.api.invokeNetRequest(req)
    } else {
      log('rpc', 'unhandled')(data)
      data.sentMessage.deferred.reject(data.error)
    }
  })

  bus.netMessage.onValue((message) => {
    log('net message')(message)
    const req = ctx.state.requests.get(message.options.requestID)
    log('req')(req)
  })

  bus.netMessage.onValue(log('new request'))

  bus.newRequest.observe(async (netReq) => {
    if (state.requests.has(netReq.requestID)) return log('request', 'repeat')(netReq)
    ctx.state.requests.set(netReq.requestID, netReq)
    let dc = netReq.options.dc
    if (!dc || dc === '@@home') {
      const fromStore = await ctx.storage.get('dc')
      dc = fromStore
        ? +fromStore
        : ctx.defaultDC
    }
    netReq.options.dc = dc

    log('request', 'new')(netReq)
  })

  return bus
}


const an: any = {}

const pushMessageCast    : PushMessageEvent = an
const responseRawCast    : RawEvent<Object> = an
const incomingMessageCast: IncomingMessageEvent = an
const newNetworkerCast   : NetworkerThread = an
const migrateErrorCast   : OnMigrate = an
const rpcErrorCast       : OnRpcError = an
const rpcResultCast      : OnRpcResult = an

const netMessageCast     : MtpCall = an
const newRequestCast     : Request = an
const messageInCast      : NetMessage = an

function makeStreamMap(emitter: EventEmitterType) {
  const getter = makeEventStream(emitter)


  const pushMessage     = getter('push-message', pushMessageCast)
  const responseRaw     = getter('response-raw', responseRawCast)
  const incomingMessage = getter('incoming-message', incomingMessageCast)
  const newNetworker    = getter('new-networker', newNetworkerCast)
  const migrateError    = getter('migrate-error', migrateErrorCast)
  const rpcError        = getter('rpc-error', rpcErrorCast)
  const rpcResult        = getter('rpc-result', rpcResultCast)
  const netMessage      = getter('net-message', netMessageCast)
  const newRequest      = getter('new-request', newRequestCast)
  const messageIn       = getter('message-in', messageInCast)

  const streamMap = {
    pushMessage,
    responseRaw,
    incomingMessage,
    newNetworker,
    migrateError,
    rpcError,
    netMessage,
    newRequest,
    messageIn,
    rpcResult
  }

  return streamMap
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
  error: MTError,
  sentMessage: NetMessage,
  message: { _: string, req_msg_id: string, [key: string]: any }
}

type OnMigrate = OnRpcError & {
  newDc: number,
}

type ApiCall = {
  type: 'api-call',
  msg_id: string,
  method: string,
  params: Object,
  options: {
    messageID?: string,
    dcID?: number
  }
}

type MtpCall = {
  type: 'mtp-call',
  msg_id: string,
  method: string,
  params: Object,
  options: Object
}

type PushMessageEvent = {
  threadID: string,
  message: NetMessage
}

type IncomingMessageEvent = {
  threadID: string,
  message: Object,
  messageID: string,
  sessionID: Uint8Array
}

type RawEvent<T> = {
  data: T,
  status: number,
  statusText: string
}




export default createStreamBus
