//@flow

import { type RawInput } from './index.h'
import parser from '../service/chain'

async function normalize(input: RawInput) {
  const { thread } = input
  const decrypted = await parser({
    responseBuffer: input.result.data,
    uid           : thread.uid,
    authKeyID     : thread.authKeyID,
    authKeyUint8  : thread.authKeyUint8,
    thisSessionID : thread.sessionID,
    prevSessionID : thread.prevSessionID,
    getMsgById    : thread.getMsgById,
  })
  return decrypted.response
}

export default normalize
