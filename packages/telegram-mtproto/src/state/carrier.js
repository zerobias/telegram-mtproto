//@flow


import { NetMessage } from '../service/networker/net-message'
/*::
export opaque type DCInt: number = number
*/

export type Carrier = {
  flags: ACFlags,
  networker: ACNetworker,
  auth: ACAuth,
  homeDC: DCInt,
  net: ACNet,
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
