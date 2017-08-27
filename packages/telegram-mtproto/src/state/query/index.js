//@flow

import { of, makeError, type MakeError } from 'apropos'
import { contains } from 'ramda'
import { Just, Nothing, fromNullable, Maybe } from 'folktale/maybe'

import { getState } from '../portal'
import { type State, type Client, toCryptoKey, toDCNumber } from '../index.h'
import resolveQuery from './resolve-request'
import Status, { netStatuses } from 'NetStatus'
import { KeyStorage } from 'Util/key-storage'

const activate = fn => /*::<I>*/(data: any) => fn(getState())(data)


export const resolveRequest = activate(resolveQuery)

const noNetworker: MakeError<'no networker'> = makeError('no networker')

export const queryNetworker = (dc: number) =>
  of({ dc })
    .map(netFromDc)
    .logic(getNetworker)

function getClient(uid: string) {
  const { client } = getState()
  return fromNullable(client[uid])
}

type KeySelector = (x: Client) => KeyStorage

const keyQuery =
  (selector: KeySelector) =>
    (uid: string, dc: number) =>
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
export const queryAck = (dc: number) => getState().pendingAck[dc] || []
export const queryInvoke = () => getState().invoke
export const queryStatus = (dc: number) => Status.ensure(getState().netStatus[dc])

const netFromDc = ({ dc }) => ({ netList: getState().networker, dc })
const getNetworker = {
  cond: ({ netList, dc }) => netList.has(dc),
  pass: ({ netList, dc }) => netList.get(dc),
  fail: ({ dc }) => noNetworker(dc)
}
