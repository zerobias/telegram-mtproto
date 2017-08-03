//@flow

import { type ActionPair } from '../helpers'
import { doubleCreator } from '../helpers'

type NetworkerMeta = number

const networkerMeta = (_: any, dc: number) => ({ _: 'networker', id: dc })

type Auth = {
  SET_AUTH_KEY: ActionPair<'auth/auth_key set', number[], NetworkerMeta>,
  SET_SERVER_SALT: ActionPair<'auth/server_salt set', number[], NetworkerMeta>,
  SET_SESSION_ID: ActionPair<'auth/session_id set', number[], NetworkerMeta>,
}

export const AUTH: Auth = {
  SET_AUTH_KEY   : doubleCreator('auth/auth_key set', networkerMeta),
  SET_SERVER_SALT: doubleCreator('auth/server_salt set', networkerMeta),
  SET_SESSION_ID : doubleCreator('auth/session_id set', networkerMeta),
}
