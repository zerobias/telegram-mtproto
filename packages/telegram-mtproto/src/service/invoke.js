//@flow
import { tap } from 'ramda'
import { tryP, resolve, Future, of as ofF } from 'fluture'

import Auth from './authorizer'


import { createThread } from './networker'

import Config from 'ConfigProvider'
import ApiRequest from './main/request'

import { MaybeT } from 'Monad'
import {
  querySalt,
  queryAuthKey,
  queryHomeDc,
} from '../state/query'

import {  getState } from '../state/portal'

export const makeAuthRequest = (netReq: ApiRequest) =>
  MaybeT
    .toFuture(ERR.noDC, queryHomeDc(netReq.uid))
    .chain(dc => withDC(netReq.uid, dc))
    .map(networker => networker.wrapApiCall(netReq))
    .chain(msg => tryP(() => msg.deferred.promise))
    .mapRej(tap(e => netReq.defer.reject(e)))
    .chain(() => tryP(() => netReq.defer.promise))

function withDC(uid, dc) {
  const doAuth = () => authRequest(uid, dc)
  const newThread = (auth, salt) => () =>
    createThread( dc, auth, salt, uid )

  const getThread =
    Config
      .thread
      .get(uid, dc)

  const foldGetThread = ({ auth, salt }) =>
    MaybeT.fold(
      newThread(auth, salt),
      getThread
    )
  // const state = getState()
  // const client = state.client[uid]
  // const homeStatus = client.status
  //   .maybeGetK(dc)
  //   .fold(() => false, () => true)
  // if (homeStatus) {
  //   const salt = client.salt.get(dc)
  //   const auth = client.auth.get(dc)
  //   return ofF(foldGetThread({ auth, salt }))
  // }
  // const salt = state.client[uid].salt.get(dc)
  // const auth = state.client[uid].auth.get(dc)
  //
  // return Future((rj, rs) => { rs({ salt, auth }) } )
  //   .map(foldGetThread)
  return MaybeT
    .toFutureR(queryKeys(uid, dc))
    // .mapRej(x => {
    //   const xx = [uid, dc, queryKeys(uid, dc)]
    //
    //   // console.warn(, uid, dc)
    //   return x
    // })
    .chainRej(doAuth)
    .map(foldGetThread)
}

export const authRequest = (uid: string, dc) => Auth(uid, dc)
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

const queryKeys = (uid, dc) => MaybeT.both(
  queryAuthKey(uid, dc),
  querySalt(uid, dc)
).map(([auth, salt]) => ({ auth, salt, dc }))


declare class NoDCError extends Error {  }
declare class NoThreadError extends Error {  }
declare var typedError: <E, /*:: -*/F>(ErrorClass: Class<E>, x: F) => E

const ERR = {
  noDC: () => /*:: typedError(NoDCError,*/
    new Error('get Networker without dcID') /*::) */,
  isNothing() { throw new Error(`UnsafeMaybeValue recieve nothing`) }
}
