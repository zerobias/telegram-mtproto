//@flow

import { Right } from 'apropos'

import {
  type RawInput,
  type RawContainer,
  type RawObject,
  type MessageDraft,
} from './index.h'
import { toCryptoKey } from 'Newtype'
import processing from './processing'
import Config from 'ConfigProvider'

import mergePatch from './merge-patch'

import Logger from 'mtproto-logger'
const log = Logger`task-index`

/*::
import { decrypt } from './decrypt'
declare var inp: RawInput
declare function wait<T>(data: Promise<T>): T
const decryptedData = wait(decrypt(inp).promise())

type NormalizeInput = typeof decryptedData
*/

export function normalize(ctx: NormalizeInput) {
  const flattenRaw = flattenMessage(ctx)
  const processed = processing(ctx, flattenRaw)
  return { ...mergePatch(ctx, processed), ...ctx }
}

function flattenMessage(input): MessageDraft[] {
  const {
    messageID,
    seqNo,
    sessionID,
    response,
    uid,
    dc,
  } = input
  return Right(response)
    .logic(checkContainer)
    .fold(
      data => [{
        type   : 'object',
        uid,
        id     : messageID,
        seq    : seqNo,
        session: /*:: toCryptoKey( */ [...sessionID] /*:: ) */,
        dc,
        raw    : data
      }],
      data => flattenContainer(input, data)
    )
}

const checkContainer = {
  cond: response => response.messages != null && Array.isArray(response.messages),
  pass: (response): RawContainer => (response: any),
  fail: (response): RawObject => (response: any),
}

function flattenContainer(input, { messages }: RawContainer): MessageDraft[] {
  const {
    dc, uid, sessionID, messageID, seqNo,
  } = input
  const ids = messages.map(({ msg_id }) => msg_id)
  const session = Config.session.get(uid, dc)
  if (__DEV__)
    console.log(`input.sessionID`, sessionID)
  if (__DEV__)
    console.log(`real session`, session)
  const cont: MessageDraft = {
    type: 'container',
    id  : messageID,
    seq : seqNo,
    session,
    dc,
    raw : ids,
  }
  const normalizedMsgs: MessageDraft[] = messages.map(msg => ({
    type: 'inner',
    id  : msg.msg_id,
    seq : msg.seqno,
    session,
    dc,
    raw : msg,
  }))
  return [...normalizedMsgs, cont]
}
