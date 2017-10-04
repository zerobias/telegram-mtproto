//@flow

import {
  append,
  reject,
  isEmpty,
  chain,
  filter,
  pipe,
  lensPath,
  over,
  defaultTo,
} from 'ramda'
import { cache } from 'fluture'
// import { Just } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { Just, Nothing } = Maybe

import {
  type IncomingType,
  type SystemMessage,
  type MessageUnit,


  type ᐸPatchᐳProcessAck,
  type ᐸPatchᐳAck,
  type ᐸPatchᐳHome,
  type ᐸPatchᐳAuthKey,
  type ᐸPatchᐳReqResend,
  type ᐸPatchᐳResend,
  type ᐸPatchᐳLastMesages,
  type ᐸPatchᐳSalt,
  type ᐸPatchᐳSession,

  type ᐸPatchᐳSummary,
} from './index.h'
import { dispatch } from 'State'
import describeProtocolError from './describe-protocol-error'
import { MAIN, NETWORKER_STATE } from 'Action'
import { longToBytes, rshift32 } from 'Bin'
import guard from 'Util/match-spec'
import warning from 'Util/warning'
import random from '../service/secure-random'
import { toDCNumber } from 'Newtype'
import {
  type ᐸMTᐳNewSessionCreated,
  type ᐸMTᐳBadSalt,
  type ᐸMTᐳBadNotification,
  type ᐸMTᐳRpcResult,
} from 'Mtp'
import { queryRequest, queryAck } from '../state/query'
import Logger from 'mtproto-logger'
import { applyServerTime } from '../service/time-manager'
import invoke from '../service/invoke'
import { NetMessage } from '../service/networker/net-message'
import Config from 'ConfigProvider'
const log = Logger`single-handler`

//eslint-disable-next-line
const appendRO = (() => {
  /*:: declare function appendReadOnly<T>(
    value: T,
    list: $ReadOnlyArray<T>
  ): $ReadOnlyArray<T> */
  return (append /*:: , appendReadOnly */)
})()

/*::
interface Writer<+T> {
  set next(x: T): void,
  read(): $ReadOnlyArray<T>,
}
*/
class WriterFacade<T> implements Writer<T> {
  state: $ReadOnlyArray<T> = []
  set next(x: T) {
    this.state = appendRO(x, this.state)
  }
  read(): $ReadOnlyArray<T> {
    return this.state
  }
}

type Selector = <A, B>(
  check: (((x: Flags) => ?true) & ((x: A) => B[]))
) => (x: A) => B[]

const getFlags = (e): Flags => e.flags

const selector: Selector = (select) => pipe(
  filter(pipe(getFlags, select, e => !!e)),
  chain(select)
)

const noEmpty = reject(isEmpty)

export default function singleHandler(
  ctx: IncomingType,
  message: MessageUnit
): {
  message: MessageUnit,
  summary: ᐸPatchᐳSummary,
} {
  const { flags } = message
  /*::
  const inners = handleInner(ctx, message)
  const unrels = handleUnrelated(ctx, message)
  */
  type Saved = ᐸPatchᐳSummary
  const patches: Writer<ᐸPatchᐳSummary> = new WriterFacade
  let result = message
  if (flags.inner) {
    patches.next = handleInner(ctx, message)
  }
  if (isUnrelatedBody(flags)) {
    const unrel = handleUnrelated(ctx, message)
    if (unrel !== void 0)
      patches.next = unrel
  }
  if (flags.error) {
    const { info, patch } = handleError(ctx, message)
    patches.next = patch

    result = info
  }

  const collected = patches.read()
  // .map(({ flags, ...e }) => ({
  //   flags: {
  //     ...emptyPatch().flags,
  //     ...flags,
  //   },
  //   ...e
  // }))

  // collected.forEach(e => log`patches`(e))
  const summary = makeSummary(collected)
  //$off
  log`summary`(noEmpty(summary))
  return {
    message: result,
    summary,
  }
}

const isUnrelatedBody = guard({
  api      : false,
  container: false,
  body     : true,
})

type Flags = {
  +net?: true,
  +processAck?: true,
  +ack?: true,
  +home?: true,
  +authKey?: true,
  +reqResend?: true,
  +resend?: true, // as pushResend
  +lastServerMessages?: true,
  +salt?: true,
  +session?: true,
}

//$off
const processAckChain = selector(e => e.processAck)
//$off
const ackChain = selector(e => e.ack)
//$off
// const homeChain = selector(e => e.home)
// //$off
// const authChain = selector(e => e.authKey)
//$off
const reqResendChain = selector(e => e.reqResend)
// //$off
// const resendChain = selector(e => e.resend)
// //$off
// const lastMessagesChain = selector(e => e.lastServerMessages)
// //$off
// const saltChain = selector(e => e.salt)
// //$off
// const sessionChain = selector(e => e.session)



function makeSummary(collected): ᐸPatchᐳSummary {
  const processAck: ᐸPatchᐳProcessAck[] = processAckChain(collected)
  const ack: ᐸPatchᐳAck[] = ackChain(collected)
  // const home: ᐸPatchᐳHome[] = homeChain(collected)
  // const auth: ᐸPatchᐳAuthKey[] = authChain(collected)
  const reqResend: ᐸPatchᐳReqResend[] = reqResendChain(collected)
  // const resend: ᐸPatchᐳResend[] = resendChain(collected)
  // const lastMessages: ᐸPatchᐳLastMesages[] = lastMessagesChain(collected)
  // const salt: ᐸPatchᐳSalt[] = saltChain(collected)
  // const session: ᐸPatchᐳSession[] = sessionChain(collected)

  const result = {
    processAck,
    ack,
    // home,
    // auth,
    reqResend,
    // resend,
    // lastMessages,
    // salt,
    // session,
  }

  return result
}
const patchState = (() => {
  const defArray = defaultTo([])
  // const lensProcessAck = lensPath(['processAck'])
  // const lensAck = lensPath(['ack'])
  // const lensReqResend = lensPath(['reqResend'])
  // const lensFlags = lensPath(['flags'])
  class PatchState {
    value: ᐸPatchᐳSummary
    constructor(value: ᐸPatchᐳSummary) {
      this.value = value
    }
    ack(data) {
      return new PatchState({
        // flags: { ...flags, ack: true },
        ...this.value,
        ack  : [...defArray(this.value.ack), ...data]
      })
    }
    processAck(data) {
      return new PatchState({
        // flags     : { ...flags, processAck: true },
        ...this.value,
        processAck: [...defArray(this.value.processAck), ...data]
      })
    }
    reqResend(data) {
      return new PatchState({
        // flags    : { ...flags, reqResend: true },
        ...this.value,
        reqResend: [...defArray(this.value.reqResend), ...data]
      })
    }
  }
  return () => new PatchState(emptyPatch())
})()


function handleUnrelated(ctx: IncomingType, message: MessageUnit) {
  const { thread, uid, dc } = ctx
  //$off
  const cast: typeof message & { body: SystemMessage } = message
  const { body } = cast
  const { id } = cast

  switch (body._) {
    case 'msgs_ack': {
      // body.msg_ids.forEach(thread.processMessageAck)
      const msg_ids: string[] = body.msg_ids

      return patchState()
        .processAck(msg_ids.map(msg => ({ dc, id: msg })))
        .value
    }
    case 'msg_detailed_info': {
      if (!Config.fastCache.get(uid, dc).hasSent(body.msg_id)) {

        const id: string = body.answer_msg_id
        thread.ackMessage(id)
        return patchState()
          .ack([{ dc, id }])
          .value
      }
      return emptyPatch()
    }
    case 'msg_new_detailed_info': {
      const { answer_msg_id: id } = body
      let state = patchState()
      if (queryAck(uid, dc).indexOf(id) === -1)
        state = state.reqResend([{ dc, id }])
      return state
        // .ack([{ dc, id }])
        .value
    }
    case 'msgs_state_info': {
      const { answer_msg_id } = body
      // thread.ackMessage(answer_msg_id)
      const lastResendReq = thread.lastResendReq
      if (!lastResendReq) break
      if (lastResendReq.req_msg_id != body.req_msg_id) break
      // const resendDel = []
      for (const badMsgID of lastResendReq.resend_msg_ids) {
        // resendDel.push(badMsgID)
        Config.fastCache.get(uid, dc).deleteResent(badMsgID)
      }
      const aId: string = answer_msg_id
      return patchState()
        .ack([{ dc, id: aId }])
        .reqResend([{ dc, id }])
        .value
      // dispatch(NETWORKER_STATE.RESEND.DEL(resendDel, this.dcID))
    }
    case 'rpc_result': {
      return handleRpcResult(ctx, message)
    }
    case 'new_session_created': {
      // thread.emit('new-session', {
      //   threadID   : thread.threadID,
      //   networkerDC: message.dc,
      //   messageID  : message.id,
      //   message    : body
      // })
      return handleNewSession(ctx, message)
    }
    case 'bad_server_salt': {
      return handleBadSalt(ctx, message)
    }
    case 'bad_msg_notification': {
      return handleBadNotify(ctx, message)
    }
    default: {
      const { id } = message
      thread.ackMessage(message.id)
      thread.emit('untyped-message', {
        threadID   : thread.threadID,
        networkerDC: message.dc,
        message    : body,
        messageID  : message.id,
        sessionID  : Config.session.get(ctx.thread.uid, message.dc),
        result     : message,
      })
      return patchState()
        .ack([{ dc, id }])
        .value
    }
  }
}

function handleInner(ctx: IncomingType, message: MessageUnit) {
  const { thread } = ctx
  const { id, dc } = message
  if (thread.lastServerMessages.indexOf(id) != -1) {
    // console.warn('[MT] Server same messageID: ', messageID)
    // thread.ackMessage(id)
    return patchState()
      .ack([{ dc, id }])
      .value
  } else {
    thread.lastServerMessages.push(id)
    if (thread.lastServerMessages.length > 100) {
      thread.lastServerMessages.shift()
    }
    return {
      flags: {
        net               : true,
        lastServerMessages: true,
      },
      net: [{
        dc,
        lastServerMessages: [id],
      }],
      lastServerMessages: [{ dc, id }]
    }
  }
}

const migrateRegexp = /^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/
const fileMigrateRegexp = /^(FILE_MIGRATE_)(\d+)/
const floodWaitRegexp = /^(FLOOD_WAIT_)(\d+)/

function handleError(ctx: IncomingType, data: MessageUnit) {
  const err: {
    code: number,
    message: string,
    handled: boolean,
  //$off
  } = data.error
  const {
    code,
    message,
  } = err
  if (floodWaitRegexp.test(message)) {
    return handleFloodWait(message, data, code, ctx)
  } else if (fileMigrateRegexp.test(message)) {
    return handleFileMigrate(message, data, code, ctx)
  } else if (migrateRegexp.test(message)) {
    return handleMigrateError(message, data, code, ctx)
  } else {
    switch (message) {
      case 'AUTH_KEY_UNREGISTERED': return handleAuthUnreg(ctx, message, data, code)
      case 'AUTH_RESTART': return handleAuthRestart(message, data, code, )
    }

  }
  return { info: data, patch: emptyPatch() }
}

function numberFromError(message, regexp): Maybe<number> {
  const matched = message.match(regexp)
  if (!matched || matched.length < 2) return Nothing()
  const [ , , numStr] = matched
  if (!isFinite(numStr)) return Nothing()
  const num = parseInt(numStr, 10)
  return Just(num)
}

const patchNothing = data => () => ({
  info : data,
  patch: emptyPatch(),
})

const formatSeconds = seconds =>
  new Intl.DateTimeFormat(undefined, {
    hour    : 'numeric',
    minute  : 'numeric',
    second  : 'numeric',
    timeZone: 'UTC'
  }).format(new Date(seconds * 1000))

const floodWarning = pipe(
  formatSeconds,
  warning({
    isIssue: false,
    message: ['Flood wait! Too many requests, you should wait', 'before new requests']
  })
)

function handleFloodWait(message, data, code, ctx) {
  return numberFromError(message, floodWaitRegexp)
    .fold(
      patchNothing(data),
      waitTime => {
        floodWarning(waitTime)
        const info = {
          ...data,
          error: {
            code,
            message,
            handled: true
          }
        }
        return { info, patch: emptyPatch() }
      })
}

function handleFileMigrate(message, data, code, ctx) {
  const { uid, dc } = ctx
  return numberFromError(message, fileMigrateRegexp)
  /*:: .map(toDCNumber) */
    .pred(dc => data.flags.methodResult)
    .chain(newDc => queryRequest(uid, dc, data.methodResult.outID).map(req => ({
      req,
      newDc,
    })))
    .fold(
      patchNothing(data),
      ({ req, newDc }) => {
        req.dc = Just(newDc)
        const futureAuth = Config.authRequest.get(uid, newDc)
        if (!futureAuth) {
          const authReq = cache(invoke(uid, 'auth.exportAuthorization', { dc_id: newDc })
            .map(resp => {
              if (__DEV__)
                console.log(resp)
              return resp
            })
            .map((resp: mixed) => {
              if (typeof resp === 'object' && resp != null) {
                if (typeof resp.id === 'number') {
                  const { id } = resp
                  if (resp.bytes != null) {
                    const { bytes } = resp
                    return {
                      id,
                      bytes: [...bytes]
                    }
                  }
                }
              }
              if (__DEV__)
                console.error('incorrect', resp)
              return resp
            })
            .chain(resp => invoke(uid, 'auth.importAuthorization', resp, { dcID: newDc })))
          Config.authRequest.set(uid, newDc, authReq)
          authReq.promise()
        }
        const info = {
          ...data,
          error: {
            code,
            message,
            handled: true
          }
        }
        return { info, patch: emptyPatch() }
      })
}

function handleMigrateError(message, data, code, ctx) {
  const { uid, dc } = ctx
  return numberFromError(message, migrateRegexp)
  /*:: .map(toDCNumber) */
    .fold(
      patchNothing(data),
      newDc => {
        dispatch(MAIN.RECOVERY_MODE({
          halt    : dc,
          recovery: newDc,
          uid,
        }), uid)
        Config.fastCache.init(uid, dc)
        Config.seq.set(uid, dc, 0)
        Config.halt.set(uid, dc, true)
        Config.halt.set(uid, newDc, false)
        //$off
        Config.session.set(uid, ctx.dc, null)
        Promise.all([
          Config.storageAdapter.set.dc(uid, newDc),
          Config.storageAdapter.set.nearestDC(uid,  newDc)
        ]).then(() => {
          dispatch(MAIN.DC_DETECTED({
            dc: newDc,
            uid,
          }), uid)
        })
        const patch = {
          flags: {
            net : true,
            home: true,
          },
          net: [{
            dc  : data.dc,
            home: false,
          }, {
            dc  : newDc,
            home: true,
          }],
          home: [newDc],
        }
        const info = {
          ...data,
          error: {
            code,
            message,
            handled: true
          }
        }
        return { info, patch }
      })
}

function handleAuthRestart(message, data, code) {
  const { dc } = data
  // dispatch(MAIN.AUTH_UNREG(dc))
  const patch = {
    flags: {
      net    : true,
      authKey: true,
    },
    net: [{
      dc,
      authKey: [],
    }],
    authKey: [{
      dc,
      authKey: false,
    }]
  }
  const info = {
    ...data,
    error: {
      code,
      message,
      handled: true
    }
  }
  return { info, patch }
}

function handleAuthUnreg(ctx: IncomingType, message, data, code) {
  const { dc, uid } = ctx
  dispatch(MAIN.AUTH_UNREG(dc), uid)
  const patch = {
    flags: {
      net    : true,
      authKey: true,
    },
    net: [{
      dc,
      authKey: [],
    }],
    authKey: [{
      dc,
      authKey: false,
    }]
  }
  const info = {
    ...data,
    error: {
      code,
      message,
      handled: true
    }
  }
  return { info, patch }
}

//$off
const emptyPatch = (): ᐸPatchᐳSummary => ({
  flags: {
    /*::
    net: true,
    */
  }
})

function handleNewSession(ctx: IncomingType, message: MessageUnit) {
  const body: ᐸMTᐳNewSessionCreated = message.body
  const { first_msg_id, server_salt } = body
  const salt = longToBytes(server_salt)
  const { dc, id } = message
  // const session = new Array(8)
  // random(session)
  // Config.seq.set(ctx.thread.uid, dc, 0)
  return {
    flags: {
      net       : true,
      // session   : true,
      salt      : true,
      ack       : true,
      processAck: true,
    },
    net: [{
      dc,
      salt,
      // session,
      seq  : 0,
      first: first_msg_id, // Refers to outcoming api message
    }],
    // session: [{
    //   dc,
    //   session,
    //   seq  : 0,
    //   first: first_msg_id,
    // }],
    salt: [{
      dc,
      salt
    }],
    ack       : [{ dc, id }],
    processAck: [{ dc, id: first_msg_id }],
  }
}

function handleBadNotify(ctx: IncomingType, message: MessageUnit) {
  const body: ᐸMTᐳBadNotification = message.body
  const { dc, uid } = ctx
  log`Bad msg notification`(message)
  const {
    bad_msg_id: badMsg,
    bad_msg_seqno: seq,
    error_code: code,
  } = body
  const sentMessage = Config.fastCache.get(uid, dc).getSent(badMsg)
  const error = describeProtocolError(code || 0)
  errorPrint: {
    log`protocol error, code`(error.code)
    log`protocol error, message`(error.message)
    log`protocol error, description`(error.description)
  }
  if (!sentMessage || sentMessage.seq_no != seq) {
    log`Bad msg notification, seq`(badMsg, seq)
    // throw error
  }
  const { id } = message

  let flags = { /*:: ack: true */ }

  let data = {}

  if (code === 16 || code === 17) {
    if (applyServerTime(
      ctx.thread.uid,
      rshift32(id)
    )) {

      const session = new Array(8)
      random(session)
      flags = { ...flags, session: true }
      data = {
        ...data,
        session: [{
          dc,
          session,
          seq  : 0,
          first: badMsg,
        }],
      }
      const badMessage = ctx.thread.updateSentMessage(badMsg)
      if (badMessage instanceof NetMessage) {
        flags = { ...flags, resend: true }
        data = {
          ...data,
          resend: [{ dc, id: badMsg }]
        }
      }
      flags = { ...flags, ack: true }
      data = {
        ...data,
        ack: [{ dc, id }],
      }
    }
  }
  return {
    ...data,
    flags,
  }
}

function handleBadSalt(ctx: IncomingType, message: MessageUnit) {
  const body: ᐸMTᐳBadSalt = message.body
  log`Bad server salt`(message)
  const {
    bad_msg_id: badMsg,
    bad_msg_seqno: seq,
    error_code: code,
    new_server_salt: newSalt,
  } = body
  const { dc, uid } = ctx
  const sentMessage = Config.fastCache.get(uid, dc).getSent(badMsg)
  const error = describeProtocolError(code || 0)
  errorPrint: {
    log`protocol error, code`(error.code)
    log`protocol error, message`(error.message)
    log`protocol error, description`(error.description)
  }
  if (!sentMessage || sentMessage.seq_no != seq) {
    log`invalid message, seq`(badMsg, seq)
    // throw error
  }
  const salt = longToBytes(newSalt)
  const { id } = message
  const session = new Array(8)
  random(session)

  ctx.thread.pushResend(badMsg)
  return {
    flags: {
      net    : true,
      session: true,
      salt   : true,
      ack    : true,
      resend : true,
    },
    net: [{
      dc,
      salt,
      session,
      seq  : 0,
      first: badMsg,
    }],
    session: [{
      dc,
      session,
      seq  : 0,
      first: badMsg,
    }],
    salt: [{
      dc,
      salt
    }],
    ack   : [{ dc, id }],
    resend: [{ dc, id: badMsg }]
  }
}

function handleRpcResult(ctx: IncomingType, message: MessageUnit) {
  const { thread, dc, uid } = ctx
  const { id } = message
  const body: ᐸMTᐳRpcResult = message.body
  thread.ackMessage(id)

  const sentMessageID = body.req_msg_id
  const sentMessage = Config.fastCache.get(uid, dc).getSent(sentMessageID)

  // thread.processMessageAck(sentMessageID)
  if (!sentMessage) {
    if (__DEV__)
      console.warn('No sent message!', sentMessageID, message)
    return emptyPatch()
  }
  dispatch(NETWORKER_STATE.SENT.DEL([sentMessage], dc), uid)
  Config.fastCache.get(uid, dc).deleteSent(sentMessage)
  if (body.result) {
    if (body.result._ == 'rpc_error') {
      thread.emit('rpc-error', {
        threadID   : thread.threadID,
        networkerDC: dc,
        error      : body.result,
        sentMessage,
        message
      })

    } else {
      thread.emit('rpc-result', {
        threadID   : thread.threadID,
        networkerDC: dc,
        message,
        sentMessage,
        result     : body.result
      })
    }
  } else {
    if (__DEV__)
      console.warn('No result!', sentMessageID, message)
  }
  if (sentMessage.isAPI)
    thread.connectionInited = true
  return emptyPatch()
}
