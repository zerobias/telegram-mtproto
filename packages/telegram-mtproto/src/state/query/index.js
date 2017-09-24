//@flow

// import { fromNullable, Maybe } from 'folktale/maybe'
import { Map } from 'immutable'
import { Maybe } from 'apropos'

import { MaybeT } from 'Monad'

import { getState } from '../portal'
import {
  type Client,
  type Instance,
} from '../index.h'

import {
  type DCNumber,
  type UID,
  toCryptoKey,
  toDCNumber,
} from 'Newtype'
import { KeyStorage } from 'Util/key-storage'

const { fromNullable } = Maybe

const F = () => false
const idBool = (x: boolean) => x

const apiLink = (uid: UID) => getInstance(uid)
  .map(({ messageApiLink }) => messageApiLink)

export const resolveRequest = (
  uid: UID,
  outID: string
): Maybe<UID> =>
  apiLink(uid)
    .chain(link => fromNullable(link.get(outID)))

export const queryRequest = (uid: UID, outID: string) =>
  resolveRequest(uid, outID)
    .chain((reqID) => getClient(uid).chain(state => state.request.maybeGetK(reqID)))
    .map(pair => pair.snd())

export function getClient(uid: UID): Maybe<Client> {
  return fromNullable(getState())
    .chain(e => fromNullable(e.client))
    .chain(e => fromNullable(e[uid]))
  // const { client } = getState()
  // return fromNullable(client[uid])
}

export function getInstance(uid: UID): Maybe<Instance> {
  return fromNullable(getState())
    .chain(e => fromNullable(e.instance))
    .chain(e => fromNullable(e.get(uid)))
  // const { client } = getState()
  // return fromNullable(client[uid])
}

const keyQuery =
  (selector: KeySelector) =>
    (uid: UID, dc: DCNumber) =>
      getClient(uid)
        .map(selector)
        .chain(fromNullable)
        .chain(keyStorage => keyStorage.getMaybe(dc))

export const queryHomeDc =
  (uid: UID) =>
    getInstance(uid)
      .map(client => client.homeDc)
      .chain(fromNullable)

export function isHomeDC(uid: UID, dc: DCNumber) {
  return queryHomeDc(uid)
    .map(x => x === dc)
    .fold(F, idBool)
}

export const queryRequestIDs = (uid: UID, requestID: UID) =>
  apiLink(uid)
    .map(link => link.filter(reqID => reqID === requestID))
    .map(link => [...link.keys()])
    .fold((): string[] => [], x => x)

export const getHomeStatus = (uid: UID) =>
  getClient(uid)
    .map(client => client.homeStatus)
    .fold(F, idBool)

export const getDCStatus = (uid: UID, dc: DCNumber) =>
  getClient(uid)
    .map(client => client.status)
    .chain(status => status.maybeGetK(dc))
    .map(pair => pair.snd())
    .fold(F, idBool)

type KeySelector = (x: Client) => KeyStorage



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
