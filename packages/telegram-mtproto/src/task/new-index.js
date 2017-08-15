//@flow

import { mergeWith, concat, append, groupBy, pipe, map, last, filter, fromPairs } from 'ramda'

import {
  type RawInput,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type MessageDraft,
  type IncomingType,
  type SystemMessage,
  type MessageUnit,

  type ᐸPatchᐳSummaryReduced,
} from './index.h'
import { isApiObject } from './fixtures'
import parser from '../service/chain'
import processing from './processing'
import { dispatch } from '../state'
import { MAIN } from 'Action'
import { queryNetworker } from '../state/query'

import mergePatch from './merge-patch'

import Logger from 'mtproto-logger'
const log = Logger`task-index`

type PUnitList = Promise<{
  normalized: MessageUnit[],
  summary: ᐸPatchᐳSummaryReduced,
}>

// type PUnitList = Promise<MessageUnit[]>

export default async function normalize(input: RawInput): PUnitList {
  const ctx = await decrypt(input)
  const flattenRaw = flattenMessage(ctx)
  const processed = processing(ctx, flattenRaw)
  return mergePatch(ctx, processed)
}



async function decrypt(input: RawInput) {
  const net = await queryNetworker(input.dc).promise()
  const decrypted = await decryptor(input, net)
  const { response } = decrypted
  if (!isApiObject(response)) {
    throw new TypeError(`Invalid decrypted response`)
  }
  return { net, ...input, ...decrypted }
}

const decryptor = ({ thread, result: { data } }: RawInput, net) =>
  parser({
    responseBuffer: data,
    uid           : thread.uid,
    authKeyID     : net.authSubKey.authKeyID,
    authKeyUint8  : net.authSubKey.authKeyUint8,
    thisSessionID : thread.sessionID,
    prevSessionID : thread.prevSessionID,
    getMsgById    : thread.getMsgById,
  })

function flattenMessage(input): MessageDraft[] {
  const { messageID, seqNo, sessionID, message, response } = input
  const result = checkContainer(response)
  if (result.isContainer) return flattenContainer(input, result.data)
  else return [{
    type   : 'object',
    id     : messageID,
    seq    : seqNo,
    session: sessionID,
    dc     : message.dc,
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
