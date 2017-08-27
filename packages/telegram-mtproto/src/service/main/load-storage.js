//@flow

import { trim, fromPairs } from 'ramda'

import dcStoreKeys from 'Util/dc-store-keys'
import { type AsyncStorage } from 'mtproto-shared'
import { dispatch } from '../../state'
import random from '../secure-random'
import { MAIN } from 'Action'
import { bytesFromHex } from '../../bin'
import Thread from '../networker'

import {
  type DCInt,
  type Carrier,
  type ACAuth,
  type ACFlags,
  type ACNetworker,
  toDCInt,
} from '../../state/carrier'

import {
  type DCNumber,
  toDCNumber
} from '../../state/index.h'

export default async function loadStorage(
  storage: AsyncStorage,
  dcMap: Map<DCNumber, string>,
  uid: string,
) {
  let iAuth: { [dc: number]: number[] } = {}
  let iSalt: { [dc: number]: number[] } = {}
  let iHome = 2
  let flags: ACFlags = {
    networker: false,
    auth     : false,
    homeDC   : false,
    net      : false,
  }
  let networker: ACNetworker = {
    ids: [],
  }
  let authList: ACAuth = {
    authKey: [],
    salt   : [],
    session: [],
  }
  for (const dc of dcMap.keys()) {
    // flags = { ...flags, networker: true }
    const dcInt: DCInt = toDCInt(dc)
    let inactive = true
    let fields: {
      authKey: number[],
      salt: number[],
      session: number[],
    } = {
      authKey: [],
      salt   : [],
      session: [],
    }
    const d = dcStoreKeys(dc)
    const saltRaw = await storage.get(d.saltKey)
    const salt = checkString(saltRaw)
    if (salt !== false) {
      iSalt = { ...iSalt, [dc | 0]: salt }

      inactive = false
      flags = {
        ...flags,
        networker: true,
        auth     : true,
      }
      fields = {
        ...fields,
        salt,
      }
      authList = {
        ...authList,
        salt: [ ...authList.salt, dcInt ]
      }
      // dispatch(AUTH.SET_SERVER_SALT(salt, dc))
    }
    const authRaw = await storage.get(d.authKey)
    const auth = checkString(authRaw)
    if (auth !== false) {
      iAuth = { ...iAuth, [dc | 0]: auth }

      const saltKey = salt === false
        ? bytesFromHex('AAAAAAAAAAAAAAAA')
        : salt

      iSalt = { ...iSalt, [dc | 0]: saltKey }

      inactive = false
      flags = {
        ...flags,
        networker: true,
        auth     : true,
      }
      new Thread(
        dc,
        auth,
        saltKey,
        uid
      )
      fields = {
        ...fields,
        salt   : saltKey,
        authKey: auth,
      }
      authList = {
        ...authList,
        salt   : [ ...new Set([ ...authList.salt, dcInt ]) ],
        authKey: [ ...authList.authKey, dcInt ]
      }
      // dispatch(AUTH.SET_AUTH_KEY(auth, dc))
    }
    if (!inactive)
      networker = {
        ...networker,
        ids : [ ...networker.ids, dcInt ],
        [dc | 0]: fields,
      }
  }
  const nearestRaw = await storage.get('nearest_dc')
  const nearest = checkNumber(nearestRaw)
  let act: Carrier = {
    flags,
    networker,
    auth: authList,
    /*:: homeDC: toDCInt(0), */
  }
  if (nearest !== false) {
    iHome = nearest
    flags = { ...flags, homeDC: true }
    const dcIntNearest: DCInt = toDCInt(nearest+0)
    act = {
      ...act,
      flags,
      homeDC: dcIntNearest
    }
    // dispatch(MAIN.DC_DETECTED(nearest))
  } //else
    // dispatch(MAIN.MODULE_LOADED())
    // dispatch(MAIN.DC_DETECTED(2))
  // dispatch(makeCarrierAction(act))
  const session = createSessions(getDcList(iAuth, iSalt, iHome))
  const finalAction = {
    auth: iAuth,
    salt: iSalt,
    home: iHome,
    session,
  }
  dispatch(MAIN.STORAGE_IMPORTED(finalAction), uid)
  console.log({ salt: iSalt, home: iHome, session })
}

function getDcList(auth, salt, home) {
  const dcList = []
    .concat(
      Object.keys(auth),
      Object.keys(salt),
      [home],
    )
    .filter(isFinite)
    .map(e => parseInt(e, 10))
  return [...new Set(dcList)]
}

//$off
const createSessions = (dcList: number[]): { [dc: number]: number[] } =>
  fromPairs(
    dcList
      .map(dc => [dc, random(new Array(8))])
  )

function checkString(source: mixed) {
  if (source == null || typeof source !== 'string') return false
  const trimmed = trim(source)
  if (trimmed.length === 0) return false
  return bytesFromHex(trimmed)
}


function checkNumber(source: mixed): DCNumber | false {
  if (source == null || typeof source !== 'number') return false
  if (!isFinite(source)) return false
  return /*:: toDCNumber(*/ source /*::)*/
}
