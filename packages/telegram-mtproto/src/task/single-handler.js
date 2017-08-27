//@flow

import { append, reject, isEmpty, chain, filter, pipe } from 'ramda'

import {
  type RawInput,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type MessageDraft,
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
import { dispatch } from '../state'
import describeProtocolError from './describe-protocol-error'
import { MAIN } from 'Action'
import { longToBytes, rshift32 } from '../bin'
import guard from '../util/match-spec'
import random from '../service/secure-random'
import {
  type ᐸMTᐳNewSessionCreated,
  type ᐸMTᐳBadSalt,
  type ᐸMTᐳBadNotification,
  type ᐸMTᐳRpcResult,
} from 'Mtp'
import Status, { netStatuses, type NetStatus } from '../net-status'

import Logger from 'mtproto-logger'
import { applyServerTime } from '../service/time-manager'
import { NetMessage } from '../service/networker/net-message'
import Config from '../config-provider'
const log = Logger`single-handler`

/*::
interface Writer<T> {
  set next(x: T): void,
  read(): T[],
}
*/
function writer<T>(): Writer<T> {
  let state: Array<T> = []

  const facade = {}
  //$off
  Object.defineProperties(facade, {
    next: {
      set(x: T) {
        state = append(x, state)
      }
    },
    read: {
      value: () => state
    }
  })
  return facade
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
  const patches: Writer<*> = writer()
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
  // listLog`ack list`(ackList)
  // listLog`auth keys`(withAuthKey)
  // listLog`sessions`(sessionList)
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
const homeChain = selector(e => e.home)
//$off
const authChain = selector(e => e.authKey)
//$off
const reqResendChain = selector(e => e.reqResend)
//$off
const resendChain = selector(e => e.resend)
//$off
const lastMessagesChain = selector(e => e.lastServerMessages)
//$off
const saltChain = selector(e => e.salt)
//$off
const sessionChain = selector(e => e.session)



function makeSummary(collected): ᐸPatchᐳSummary {
  const processAck: ᐸPatchᐳProcessAck[] = processAckChain(collected)
  const ack: ᐸPatchᐳAck[] = ackChain(collected)
  const home: ᐸPatchᐳHome[] = homeChain(collected)
  const auth: ᐸPatchᐳAuthKey[] = authChain(collected)
  const reqResend: ᐸPatchᐳReqResend[] = reqResendChain(collected)
  const resend: ᐸPatchᐳResend[] = resendChain(collected)
  const lastMessages: ᐸPatchᐳLastMesages[] = lastMessagesChain(collected)
  const salt: ᐸPatchᐳSalt[] = saltChain(collected)
  const session: ᐸPatchᐳSession[] = sessionChain(collected)

  const result = {
    processAck,
    ack,
    home,
    auth,
    reqResend,
    resend,
    lastMessages,
    salt,
    session,
  }

  return result
}

function handleUnrelated(ctx: IncomingType, message: MessageUnit) {
  const { thread } = ctx
  //$off
  const cast: typeof message & { body: SystemMessage } = message
  const { body } = cast
  const { dc, id } = cast

  switch (body._) {
    case 'msgs_ack': {
      body.msg_ids.forEach(thread.processMessageAck)
      const msg_ids: string[] = body.msg_ids
      return {
        flags: {
          net       : true,
          processAck: true,
        },
        net: [{
          dc,
          processAck: msg_ids,
        }],
        processAck: msg_ids.map(msg => ({ dc, id: msg }))
      }
    }
    case 'msg_detailed_info': {
      if (!thread.state.hasSent(body.msg_id)) {
        // thread.ackMessage(body.answer_msg_id)
        const id: string = body.answer_msg_id
        return {
          flags: {
            net: true,
            ack: true,
          },
          net: [{
            dc,
            ack: [id],
          }],
          ack: [{ dc, id }]
        }
      }
      return emptyPatch()
    }
    case 'msg_new_detailed_info': {
      const { answer_msg_id: id } = body
      // thread.ackMessage(id)
      // thread.reqResendMessage(id)
      return {
        flags: {
          net      : true,
          ack      : true,
          reqResend: true,
        },
        net: [{
          dc,
          ack      : [id],
          reqResend: [id],
        }],
        ack      : [{ dc, id }],
        reqResend: [{ dc, id }],
      }
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
        thread.state.deleteResent(badMsgID)
      }
      const aId: string = answer_msg_id
      return {
        flags: {
          net: true,
          ack: true,
        },
        net: [{
          dc,
          ack: [aId],
        }],
        ack: [{ dc, id: aId }]
      }
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
      // thread.ackMessage(message.id)
      thread.emit('untyped-message', {
        threadID   : thread.threadID,
        networkerDC: message.dc,
        message    : body,
        messageID  : message.id,
        sessionID  : Config.session.get(ctx.thread.uid, message.dc),
        result     : message,
      })
      return {
        flags: {
          net: true,
          ack: true,
        },
        net: [{
          dc,
          ack: [id],
        }],
        ack: [{ dc, id }]
      }
    }
  }
}

function handleInner(ctx: IncomingType, message: MessageUnit) {
  const { thread } = ctx
  const { id, dc } = message
  if (thread.lastServerMessages.indexOf(id) != -1) {
    // console.warn('[MT] Server same messageID: ', messageID)
    // thread.ackMessage(id)
    return {
      flags: {
        net: true,
        ack: true,
      },
      net: [{
        dc,
        ack: [id],
      }],
      ack: [{ dc, id }]
    }
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
  if (migrateRegexp.test(message)) {
    return handleMigrateError(message, data, code)
  } else {
    switch (message) {
      case 'AUTH_KEY_UNREGISTERED': return handleAuthUnreg(message, data, code)
      case 'AUTH_RESTART': return handleAuthRestart(message, data, code)
    }

  }
  return { info: data, patch: emptyPatch() }
}

function handleMigrateError(message, data, code) {
  const matched = message.match(migrateRegexp)
  if (!matched || matched.length < 2)
    return { info: data, patch: emptyPatch() }
  const [ , , newDcID] = matched
  if (!isFinite(newDcID))
    return { info: data, patch: emptyPatch() }
  const newDc = parseInt(newDcID, 10)
  // dispatch(MAIN.DC_CHANGED(newDc))
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

function handleAuthUnreg(message, data, code) {
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

const emptyPatch = () => ({
  flags: {
    /*:: net: true, */
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
  log`Bad msg notification`(message)
  const {
    bad_msg_id: badMsg,
    bad_msg_seqno: seq,
    error_code: code,
  } = body
  const sentMessage = ctx.thread.state.getSent(badMsg)
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
  const { dc, id } = message

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
        ck: [{ dc, id }],
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
  const sentMessage = ctx.thread.state.getSent(badMsg)
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
  const { dc, id } = message
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
  const { thread } = ctx
  const { dc, id } = message
  const body: ᐸMTᐳRpcResult = message.body
  thread.ackMessage(id)

  const sentMessageID = body.req_msg_id
  const sentMessage = thread.state.getSent(sentMessageID)

  thread.processMessageAck(sentMessageID)
  if (!sentMessage) {
    console.warn('No sent message!', sentMessageID, message)
    return emptyPatch()
  }
  // dispatch(NETWORKER_STATE.SENT.DEL([sentMessage], thread.dcID))
  thread.state.deleteSent(sentMessage)
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
    console.warn('No result!', sentMessageID, message)
  }
  if (sentMessage.isAPI)
    thread.connectionInited = true
  return emptyPatch()
}
