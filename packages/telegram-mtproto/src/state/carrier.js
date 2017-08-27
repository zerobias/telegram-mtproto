//@flow

import { of, Right, Left, type Apropos } from 'apropos'

import { type ModuleStatus, statuses } from '../status'

/*::
import { NetMessage } from '../service/networker/net-message'
export opaque type DCInt: number = number
*/

export type Carrier = {
  flags: ACFlags,
  networker: ACNetworker,
  auth: ACAuth,
  homeDC: DCInt,
  net: ACNet,
  // netStatus:
}

export type ActionCarrier = {
  type: '[00] action carrier',
  payload: Carrier,
}

export function toDCInt(int: number): DCInt {
  return int
}

export function makeCarrierAction(payload: Carrier): ActionCarrier {
  return {
    type: '[00] action carrier',
    payload,
  }
}

export type ACFlags = {
  networker: boolean,
  auth: boolean,
  homeDC: boolean,
  net: boolean,
  // netStatus: boolean,
}

export type ACNetworker = {
  ids: DCInt[],
  [dc: number]: {
    status: ModuleStatus,
    authKey: number[],
    salt: number[],
    session: number[],
  },
}

export type ACAuth = {
  authKey: DCInt[],
  salt: DCInt[],
  session: DCInt[],
}

export type ACNet = {
  flags: {
    sent: {
      add: boolean,
      delete: boolean,
    },
    // send: boolean,
    // response: boolean,
  },
  sent: {
    add: NetMessage[],
    delete: NetMessage[],
  }
}

const onFail = (): false => false

const queryAuthKey = (dc: DCInt, obj: ACNetworker) =>
  of(obj)
    .mapL(onFail)
    .logic({
      cond: obj => obj.ids.indexOf(dc) > -1,
      pass: obj => obj[dc].authKey,
      fail: onFail,
    })

const querySalt = (dc: DCInt, obj: ACNetworker) =>
  of(obj)
    .mapL(onFail)
    .logic({
      cond: obj => obj.ids.indexOf(dc) > -1,
      pass: obj => obj[dc].salt,
      fail: onFail,
    })

function handleCarrier(carrier: Carrier) {
  const e = of(carrier)
  const authE = e
    .mapL(onFail)
    .logic({
      cond: (carr) => carr.flags.auth,
      pass: (carr) => carr.auth,
      fail: onFail,
    })
  const homeDCE = e
    .mapL(onFail)
    .logic({
      cond: (carr) => carr.flags.homeDC,
      pass: (carr) => carr.homeDC,
      fail: (): false => false,
    })
  const netE = e
    .mapL(onFail)
    .logic({
      cond: (carr) => carr.flags.networker,
      pass: (carr) => carr.networker,
      fail: (): false => false,
    })
  const EitherCarrier = {
    auth     : authE,
    homeDC   : homeDCE,
    networker: netE,
  }
}

