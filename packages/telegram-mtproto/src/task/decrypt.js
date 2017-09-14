//@flow

import { encaseP, of, reject } from 'fluture'

import {
  type RawInput,
} from './index.h'
import { isApiObject } from './fixtures'
import parser from '../service/chain'
import { queryKeys } from '../state/query'
import Config from 'ConfigProvider'

export function decrypt({ result: { data }, dc, uid, ...input }: RawInput) {
  return queryKeys(uid, dc)
    .fold(reject, of)
    .mapRej(ERR.noKeys)
    .map(keys => ({
      ...input,
      ...keys,
      data,
      dc,
      uid,
      session: Config.session.get(uid, dc),
    }))
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
  }).map(result => ({ ...result, thread, uid, dc, authID, auth, session, ...rest }))

function validateDecrypt(decrypted) {
  const { response } = decrypted
  if (!isApiObject(response)) {
    return reject(ERR.invalidResponse())
  }
  return of(decrypted)
}


class NoSessionKeys extends Error {  }
class InvalidResponse extends Error {  }
const ERR = {
  noKeys         : () => new NoSessionKeys('No session keys'),
  invalidResponse: () => new InvalidResponse('Invalid decrypted response'),
}
