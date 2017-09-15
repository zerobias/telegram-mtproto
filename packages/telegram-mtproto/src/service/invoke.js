//@flow
import { tap } from 'ramda'
// import { Just } from 'folktale/maybe'
import { Maybe } from 'apropos'
const { Just } = Maybe
import { tryP, of as ofF } from 'fluture'

import Auth from './authorizer'
import { type LeftOptions } from './main/index.h'

import { type UID, type DCNumber } from 'Newtype'
import { API } from 'Action'
import { dispatch } from 'State'
import { createThread } from './networker'

import Config from 'ConfigProvider'
import ApiRequest from './main/request'

import { MaybeT } from 'Monad'
import {
  queryHomeDc,
  queryKeys,
} from '../state/query'

export const makeAuthRequest = (netReq: ApiRequest) =>
  MaybeT
    .toFuture(ERR.noDC, queryReqDc(netReq))
    .chain(dc => withDC(netReq.uid, dc))
    .map(networker => networker.wrapApiCall(netReq))
    .chain(msg => tryP(() => msg.deferred.promise))
    .mapRej(tap(e => netReq.defer.reject(e)))
    .chain(() => tryP(() => netReq.defer.promise))

const queryReqDc = (netReq: ApiRequest) =>
  netReq.dc
    .fold(
      () => queryHomeDc(netReq.uid),
      x => Just(x)
    )

function withDC(uid, dc) {
  const doAuth = () => authRequest(uid, dc)
  const newThread = () => createThread( dc, uid )
  const getThread = () =>
    Config
      .thread
      .get(uid, dc)
      .fold(newThread, x => x)

  return MaybeT
    .toFutureR(queryKeys(uid, dc))
    .chainRej(doAuth)
    .map(getThread)
}

export const authRequest = (uid: UID, dc: DCNumber) => Auth(uid, dc)
  .bimap(
    tap(e => console.error('Auth error', e.message, e.stack)),
    ({
      authKey, authKeyID, serverSalt, dc
    }) => ({
      auth: authKey,
      salt: serverSalt,
      // authKeyID,
      dc
    })
  )

export default function invoke(
  uid: UID,
  method: string,
  params: Object = {},
  options: LeftOptions = {}
) {
  return ofF()
    .map(() => {
      const netReq = new ApiRequest(
        { method, params },
        { ...options },
        uid,
        //$off
        options.dcID
      )
      dispatch(API.REQUEST.NEW({
        netReq,
        method,
        params,
        timestamp: Date.now(),
      }, netReq.requestID), uid)
      return netReq
    })
    .chain(netReq => tryP(() => netReq.deferFinal.promise))
}

declare class NoDCError extends Error {  }
declare class NoThreadError extends Error {  }
declare var typedError: <E, /*:: -*/F>(ErrorClass: Class<E>, x: F) => E

const ERR = {
  noDC: () => /*:: typedError(NoDCError,*/
    new Error('get Networker without dcID') /*::) */,
  isNothing() { throw new Error(`UnsafeMaybeValue recieve nothing`) }
}
