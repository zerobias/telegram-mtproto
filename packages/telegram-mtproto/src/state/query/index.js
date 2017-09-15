//@flow

// import { fromNullable, Maybe } from 'folktale/maybe'

import { Maybe } from 'apropos'

import { MaybeT } from 'Monad'

import { getState } from '../portal'
import {
  type Client,
} from '../index.h'

import {
  type DCNumber,
  type UID,
  toCryptoKey,
  toDCNumber,
} from 'Newtype'
import { KeyStorage } from 'Util/key-storage'

const { fromNullable } = Maybe

export const resolveRequest = (
  uid: string,
  dc: DCNumber,
  outID: string
): Maybe<string> =>
  getClient(uid)
    .map(({ command }) => command)
    .chain(command => command.maybeGetK(outID))
    .map(pair => pair.snd())

export const queryRequest = (uid: string, dc: DCNumber, outID: string) =>
  resolveRequest(uid, dc, outID)
    .chain((reqID: $off) => getClient(uid).chain(state => state.request.maybeGetK(reqID)))
    .map(pair => pair.snd())

export function getClient(uid: string): Maybe<Client> {
  return fromNullable(getState)
    .chain(e => fromNullable(e()))
    .chain(e => fromNullable(e.client))
    .chain(e => fromNullable(e[uid]))
  // const { client } = getState()
  // return fromNullable(client[uid])
}

export const getHomeStatus = (uid: string) =>
  getClient(uid)
    .map(client => client.homeStatus)
    .fold(() => false, x => x)

type KeySelector = (x: Client) => KeyStorage

const keyQuery =
  (selector: KeySelector) =>
    (uid: UID, dc: DCNumber) =>
      getClient(uid)
        .map(selector)
        .chain(fromNullable)
        .chain(keyStorage => keyStorage.getMaybe(dc))
        /*:: .map(toCryptoKey) */

export const queryHomeDc =
  (uid: UID) =>
    getClient(uid)
      .map(client => client.homeDc)
      .chain(fromNullable)
      /*:: .map(toDCNumber) */

export const queryAuthID = keyQuery(client => client.authID)
export const queryAuthKey = keyQuery(client => client.auth)
export const querySalt = keyQuery(client => client.salt)

export const queryKeys = (uid: UID, dc: DCNumber) =>
  fromNullable(dc)
    .chain((dcʹ) =>  MaybeT
      .traverse3(
        queryAuthKey(uid, dcʹ),
        queryAuthID(uid, dcʹ),
        querySalt(uid, dcʹ)
      )
      .map(([auth, authID, salt]) => ({
        uid,
        dc: dcʹ,
        auth,
        authID,
        salt,
      })))


export const queryAck = (uid: UID, dc: DCNumber) =>
  getClient(uid)
    .map(client => client.pendingAck[dc])
    .chain(fromNullable)
    .fold(() => [], x => x)
