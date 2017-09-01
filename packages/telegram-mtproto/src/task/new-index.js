//@flow

import { pipe, map } from 'ramda'
import { encaseP, of, reject } from 'fluture'

import {
  type PUnitList,

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
// import { dispatch } from 'State'
// import { MAIN } from 'Action'
import { queryKeys } from '../state/query'
import { MaybeT } from 'Monad'
import Config from 'ConfigProvider'

import mergePatch from './merge-patch'

import Logger from 'mtproto-logger'
const log = Logger`task-index`

/*::
declare var inp: RawInput
declare function wait<T>(data: Promise<T>): T
const decryptedData = wait(decrypt(inp).promise())

type NormalizeInput = typeof decryptedData
*/

export default function normalize(ctx: NormalizeInput) {
  const flattenRaw = flattenMessage(ctx)
  const processed = processing(ctx, flattenRaw)
  return { ...mergePatch(ctx, processed), ...ctx }
}



export function decrypt({ result: { data }, dc, uid, ...input }: RawInput) {
  const session = Config.session.get(uid, dc)
  const keys = MaybeT.toFuture(
    ERR.noKeys,
    queryKeys(uid, dc)
  )
  return keys
    .map(keys => ({ ...input, data, dc, uid, ...keys, session }))
    .chain(decryptor)
    .chain(validateDecrypt)
    .map(decrypted => ({ ...input, dc, uid, ...decrypted }))
}

const decryptor = ({ thread, data, uid, dc, authID, auth, session, ...rest }) =>
  encaseP(parser, {
    responseBuffer: data,
    uid,
    dc,
    authKeyID     : authID,
    authKey       : auth,
    thisSessionID : session,
    prevSessionID : thread.prevSessionID,
    getMsgById    : thread.getMsgById,
  })
  .map(result => ({ ...result, thread, uid, dc, authID, auth, session, ...rest }))

function validateDecrypt(decrypted) {
  const { response } = decrypted
  if (!isApiObject(response)) {
    return reject(ERR.invalidResponse())
  }
  return of(decrypted)//{ ...input, ...decrypted }
}

function flattenMessage(input): MessageDraft[] {
  const { messageID, seqNo, sessionID, message, response, net, thread: { uid } } = input
  const result = checkContainer(response)
  if (result.isContainer) return flattenContainer(input, result.data)
  else return [{
    type   : 'object',
    uid,
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
  const session = Config.session.get(input.thread.uid, input.dc)
  console.log(`input.sessionID`, input.sessionID)
  console.log(`real session`, session)
  const cont: MessageDraft = {
    type: 'container',
    id  : input.messageID,
    seq : input.seqNo,
    session,
    dc  : input.message.dc,
    raw : ids,
  }
  const normalizedMsgs: MessageDraft[] = messages.map(msg => ({
    type: 'inner',
    id  : msg.msg_id,
    seq : msg.seqno,
    session,
    dc  : input.message.dc,
    raw : msg,
  }))
  return [...normalizedMsgs, cont]
}

class NoSessionKeys extends Error {  }
class InvalidResponse extends Error {  }
const ERR = {
  noKeys: () => new NoSessionKeys('No session keys'),
  invalidResponse: () => new InvalidResponse('Invalid decrypted response'),
}
