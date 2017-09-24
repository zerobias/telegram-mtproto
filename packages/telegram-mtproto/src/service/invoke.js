//@flow

import { tap } from 'ramda'
import { Maybe } from 'apropos'
const { Just } = Maybe
import { tryP, of as ofF } from 'fluture'
import Logger from 'mtproto-logger'
const log = Logger`invoke`

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
    .map(tap(log`queryReqDc`))
    .chain(dc => withDC(netReq.uid, dc))
    .map(tap(log`withDC`))
    .map(networker => networker.wrapApiCall(netReq))
    .map(tap(log`wrapAPICall`))
    .chain(msg => tryP(() => msg.deferred.promise))
    .map(tap(log`msg.deferred`))
    .mapRej(tap(e => netReq.defer.reject(e)))
    .chain(() => tryP(() => netReq.defer.promise))
    .map(tap(log`netReq.defer`))

const queryReqDc = (netReq: ApiRequest) =>
  netReq.dc
    .fold(
      () => queryHomeDc(netReq.uid),
      x => Just(x)
    )

function ensureThread(uid, dc) {
  return Config.thread
    .get(uid, dc)
    .fold(() => createThread( dc, uid ), x => x)
}

// function withDC(uid, dc) {
//   // const home = queryHomeDc(uid)
//   //   .fold((): DCNumber => 2, x => x)
//   const runA = () => authRequest(uid, dc)
//   const doAuth = () => isHome
//     ? authRequest(uid, dc)
//     : invoke(uid, 'auth.exportAuthorization', { dc_id: dc | 0 })
//       .chain(({ id, bytes }) => {
//         console.warn(`\nexported!\n`)
//         return runA()
//           .map(() => ({ id, bytes }))
//       })
//       .chain(({ id, bytes }) => {
//         const netReq = new ApiRequest(
//           { method: 'auth.importAuthorization', params: { id, bytes: [...bytes] } },
//           { dcID: dc },
//           uid,
//           dc
//         )
//         const message = thread.wrapApiCall(netReq)
//         thread.performSheduledRequest()
//         return tryP(() => message.deferred.promise)
//       })
//   const thread = ensureThread(uid, dc)
//   const isHome = queryHomeDc(uid)
//     .fold(() => false, homed => homed === dc)
//   log`dc, isHome`(dc, isHome)
//   return MaybeT
//     .toFutureR(queryKeys(uid, dc))
//     .bimap(tap(log`qKeys error`), tap(log`qKeys result`))
//     .chainRej(doAuth)
//     .map(() => thread)
//     .bimap(tap(log`withDC,error`), tap(log`withDC,result`))
// }

function withDC(uid, dc) {
  const doAuth = () => authRequest(uid, dc)
  return MaybeT
    .toFutureR(queryKeys(uid, dc))
    .chainRej(doAuth)
    .map(() => ensureThread(uid, dc))
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
