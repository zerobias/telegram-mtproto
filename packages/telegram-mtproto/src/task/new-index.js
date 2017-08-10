//@flow

import {
  type RawInput,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type MessageDraft,
  type IncomingType,
  type SystemMessage,
  type MessageUnit,
} from './index.h'
import { isApiObject } from './fixtures'
import parser from '../service/chain'
import processing from './processing'
import { dispatch } from '../state/core'
import { MAIN } from 'Action'

type PUnitList = Promise<MessageUnit[]>

async function normalize(input: RawInput): PUnitList {
  const decrypted = await decryptor(input)
  const { response } = decrypted
  if (!isApiObject(response)) {
    throw new TypeError(`Invalid decrypted response`)
  }
  const ctx = { ...input, ...decrypted }
  const flattenRaw = flattenMessage(ctx, response)
  const processed = processing(ctx, flattenRaw)
    .map(msg => singleHandler(ctx, msg))
  return processed
}

const decryptor = ({ thread, result: { data } }: RawInput) =>
  parser({
    responseBuffer: data,
    uid           : thread.uid,
    authKeyID     : thread.authKeyID,
    authKeyUint8  : thread.authKeyUint8,
    thisSessionID : thread.sessionID,
    prevSessionID : thread.prevSessionID,
    getMsgById    : thread.getMsgById,
  })

function flattenContainer(input, container: RawContainer): MessageDraft[] {
  const { messages } = container
  const ids = messages.map(({ msg_id }) => msg_id)

  const cont: MessageDraft = {
    type   : 'container',
    id     : input.messageID,
    seq    : input.seqNo,
    session: input.sessionID,
    dc     : input.message.dc,
    raw    : ids,
  }
  const normalizedMsgs: MessageDraft[] = messages.map(msg => ({
    type   : 'inner',
    id     : msg.msg_id,
    seq    : msg.seqno,
    session: input.sessionID,
    dc     : input.message.dc,
    raw    : msg,
  }))
  return [...normalizedMsgs, cont]
}

function flattenMessage(input, response: RawMessage): MessageDraft[] {
  const result = checkContainer(response)
  if (result.isContainer) return flattenContainer(input, result.data)
  else return [{
    type   : 'object',
    id     : input.messageID,
    seq    : input.seqNo,
    session: input.sessionID,
    dc     : input.message.dc,
    raw    : result.data
  }]
}

function checkContainer(response: RawMessage) {
  if (Array.isArray(response.messages)) {
    //$FlowIssue
    const container: RawContainer = response
    const result: {
      isContainer: true,
      data: RawContainer,
    } = {
      isContainer: true,
      data       : container,
    }
    return result
  } else {
    const data: RawObject = response
    const result: {
      isContainer: false,
      data: RawObject,
    } = {
      isContainer: false,
      data,
    }
    return result
  }
}


function handling(ctx: IncomingType, messages: MessageUnit[]) {
  return messages.map(msg => singleHandler(ctx, msg))
}

function singleHandler(ctx: IncomingType, message: MessageUnit): MessageUnit {
  const { flags } = message
  const { thread } = ctx
  if (flags.inner) {
    if (thread.lastServerMessages.indexOf(message.id) != -1) {
      // console.warn('[MT] Server same messageID: ', messageID)
      thread.ackMessage(message.id)
    } else {
      thread.lastServerMessages.push(message.id)
      if (thread.lastServerMessages.length > 100) {
        thread.lastServerMessages.shift()
      }
    }
  }
  if (!flags.api && !flags.container && flags.body) {
    //$FlowIssue
    const cast: typeof message & { body: SystemMessage } = message
    const { body } = cast
    switch (body._) {
      case 'msgs_ack': {
        body.msg_ids.forEach(thread.processMessageAck)
        break
      }
      case 'msg_detailed_info': {
        if (!thread.state.hasSent(body.msg_id)) {
          thread.ackMessage(body.answer_msg_id)
        }
        break
      }
      case 'msg_new_detailed_info': {
        const { answer_msg_id } = body
        thread.ackMessage(answer_msg_id)
        thread.reqResendMessage(answer_msg_id)
        break
      }
      case 'msgs_state_info': {
        const { answer_msg_id } = body
        thread.ackMessage(answer_msg_id)
        const lastResendReq = thread.lastResendReq
        if (!lastResendReq) break
        if (lastResendReq.req_msg_id != body.req_msg_id) break
        // const resendDel = []
        for (const badMsgID of lastResendReq.resend_msg_ids) {
          // resendDel.push(badMsgID)
          thread.state.deleteResent(badMsgID)
        }
        // dispatch(NETWORKER_STATE.RESEND.DEL(resendDel, this.dcID))
        break
      }
      case 'new_session_created': {
        thread.emit('new-session', {
          threadID   : thread.threadID,
          networkerDC: message.dc,
          messageID  : message.id,
          message    : body
        })
        break
      }
      case 'bad_server_salt':
      case 'bad_msg_notification': {
        break
      }

      // case 'bad_server_salt': {
      //   // log(`Bad server salt`)(message)
      //   const sentMessage = thread.state.getSent(body.bad_msg_id)
      //   if (!sentMessage || sentMessage.seq_no != body.bad_msg_seqno) {
      //     // log(`invalid message`)(message.bad_msg_id, message.bad_msg_seqno)
      //     throw new Error('[MT] Bad server salt for invalid message')
      //   }

      //   await this.applyServerSalt(body.new_server_salt)
      //   this.pushResend(body.bad_msg_id)
      //   this.ackMessage(messageID)
      //   break
      // }
      default: {
        thread.ackMessage(message.id)
        thread.emit('untyped-message', {
          threadID   : thread.threadID,
          networkerDC: message.dc,
          message    : body,
          messageID  : message.id,
          sessionID  : message.session,
          result     : message,
        })
      }
    }
  }
  if (flags.error)
    return handleError(ctx, message)
  return message
}

const migrateRegexp = /^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/

function handleError(ctx: IncomingType, data: MessageUnit) {
  const err: {
    code: number,
    message: string,
    handled: boolean,
  //$FlowIssue
  } = data.error
  const {
    code,
    message,
  } = err
  if (migrateRegexp.test(message)) {
    const matched = message.match(migrateRegexp)
    if (!matched || matched.length < 2)
      return data
    const [ , , newDcID] = matched
    if (!isFinite(newDcID))
      return data
    const newDc = parseInt(newDcID, 10)
    dispatch(MAIN.DC_CHANGED(newDc))
    return { ...data, error: { code, message, handled: true } }
  }
  return data
}

export default normalize
