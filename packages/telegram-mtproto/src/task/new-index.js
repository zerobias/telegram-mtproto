//@flow

import {
  type RawInput,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type MessageDraft,
} from './index.h'
import { isApiObject } from './fixtures'
import parser from '../service/chain'
import processing from './processing'

async function normalize(input: RawInput) {
  const decrypted = await decryptor(input)
  const { response } = decrypted
  if (!isApiObject(response)) {
    throw new TypeError(`Invalid decrypted response`)
  }
  const ctx = { ...input, ...decrypted }
  const flattenRaw = flattenMessage(ctx, response)
  const result = processing(ctx, flattenRaw)
  return result
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

export default normalize
