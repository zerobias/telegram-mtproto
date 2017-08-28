//@flow

import { of, makeError, type MakeError } from 'apropos'
import { contains } from 'ramda'
import { Just, Nothing, fromNullable, Maybe } from 'folktale/maybe'

import { getState } from '../portal'
import {
  type State,
  type Client,
  toCryptoKey,
  toDCNumber,
  type DCNumber,
} from '../index.h'
import Status, { netStatuses } from 'NetStatus'
import { KeyStorage } from 'Util/key-storage'

const activate = fn => /*::<I>*/(data: any) => fn(getState())(data)


export const resolveRequest = (uid: string, dc: DCNumber, outID: string): Maybe<string> =>
  getClient(uid)
    .map(({ command }) => command)
    .chain(({ byMsg }) => fromNullable(byMsg[outID]))

const noNetworker: MakeError<'no networker'> = makeError('no networker')

// export const queryNetworker = (dc: number) =>
//   of({ dc })
//     .map(netFromDc)
//     .logic(getNetworker)

function getClient(uid: string) {
  const { client } = getState()
  return fromNullable(client[uid])
}

type KeySelector = (x: Client) => KeyStorage

const keyQuery =
  (selector: KeySelector) =>
    (uid: string, dc: DCNumber) =>
      getClient(uid)
        .map(selector)
        .chain(fromNullable)
        .chain(keyStorage => keyStorage.getMaybe(dc))
        /*:: .map(toCryptoKey) */

export const queryHomeDc =
  (uid: string) =>
    getClient(uid)
      .map(client => client.homeDc)
      .chain(fromNullable)
      /*:: .map(toDCNumber) */

export const queryAuthID = keyQuery(client => client.authID)
export const queryAuthKey = keyQuery(client => client.auth)
export const querySalt = keyQuery(client => client.salt)

export const queryKeys = (uid: string, dc: DCNumber) =>
  fromNullable(dc)
    .chain((
      dc
    ) => queryAuthKey(uid, dc).map(auth => ({ dc, auth })))
    .chain(({
      dc, auth
    }) => queryAuthID(uid, dc).map(authID => ({ dc, auth, authID })))
    .chain(({
      dc, auth, authID
    }) => querySalt(uid, dc).map(salt => ({ uid, dc, auth, authID, salt })))


export const queryAck = (uid: string, dc: DCNumber) =>
  getState().client[uid].pendingAck[dc] || ([]: string[])
export const queryInvoke = () => getState().invoke
export const queryStatus = (dc: DCNumber) => Status.ensure(getState().netStatus[dc])

// const netFromDc = ({ dc }) => ({ netList: getState().networker, dc })
const getNetworker = {
  cond: ({ netList, dc }) => netList.has(dc),
  pass: ({ netList, dc }) => netList.get(dc),
  fail: ({ dc }) => noNetworker(dc)
}
