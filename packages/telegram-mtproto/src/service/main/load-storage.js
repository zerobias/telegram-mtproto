//@flow

import { trim, fromPairs } from 'ramda'

// import dcStoreKeys from 'Util/dc-store-keys'
import Config from 'ConfigProvider'

import { dispatch } from 'State'
import random from '../secure-random'
import { MAIN } from 'Action'
import { bytesFromHex } from 'Bin'
import Thread from '../networker'

import {
  type DCInt,
  type ACAuth,
  type ACFlags,
  type ACNetworker,
  toDCInt,
} from '../../state/carrier'

import {
  type DCNumber,
  type UID,
  toDCNumber
} from 'Newtype'

export default async function loadStorage(
  dcMap: Map<DCNumber, string>,
  uid: UID,
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

  const getter = Config.storageAdapter.get

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
    const salt = await getter
      .salt(uid, dc)
      .then(val => val.fold(() => false, x => x))
    // const salt = checkString(saltRaw)
    if (Array.isArray(salt)) {
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
    }
    const auth = await getter
      .authKey(uid, dc)
      .then(val => val.fold(() => false, x => x))
    if (Array.isArray(auth)) {
      iAuth = { ...iAuth, [dc | 0]: auth }

      const saltKey = Array.isArray(salt)
        ? salt
        : getDefaultSalt()

      iSalt = { ...iSalt, [dc | 0]: saltKey }

      inactive = false
      flags = {
        ...flags,
        networker: true,
        auth     : true,
      }
      new Thread(
        dc,
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
    }
    if (!inactive)
      networker = {
        ...networker,
        ids : [ ...networker.ids, dcInt ],
        [dc | 0]: fields,
      }
  }
  //$off
  const nearest = await getter
    .nearestDC(uid)
    .then(val => val
      /*:: .map(toDCNumber) */
      .fold(() => false, x => x))
  if (nearest !== false) {
    iHome = nearest
    flags = { ...flags, homeDC: true }
    // dispatch(MAIN.DC_DETECTED(nearest))
  } //else
  // dispatch(MAIN.MODULE_LOADED())
  // dispatch(MAIN.DC_DETECTED(2))
  const session = createSessions(getDcList(iAuth, iSalt, iHome))
  const finalAction = {
    auth: iAuth,
    salt: iSalt,
    home: iHome,
    uid,
    session,
  }
  dispatch(MAIN.STORAGE_IMPORTED(finalAction), uid)
  if (__DEV__)
    console.log({ salt: iSalt, home: iHome, session })
}

const getDefaultSalt = () => bytesFromHex('AAAAAAAAAAAAAAAA')

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
