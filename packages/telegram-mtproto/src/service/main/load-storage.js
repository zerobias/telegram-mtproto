//@flow

import { trim } from 'ramda'

import dcStoreKeys from 'Util/dc-store-keys'
import { type AsyncStorage } from '../../plugins/index.h'
import { dispatch } from '../../state/core'
import { AUTH, MAIN } from 'Action'
import { bytesFromHex } from '../../bin'

export default async function loadStorage(
  storage: AsyncStorage,
  dcMap: Map<number, string>,
  networkSetter: (dc: number, authKey: number[], serverSalt: number[]) => any
) {
  for (const dc of dcMap.keys()) {
    const d = dcStoreKeys(dc)
    const saltRaw = await storage.get(d.saltKey)
    const salt = checkString(saltRaw)
    if (salt !== false)
      dispatch(AUTH.SET_SERVER_SALT(salt, dc))
    const authRaw = await storage.get(d.authKey)
    const auth = checkString(authRaw)
    if (auth !== false) {
      const saltKey = salt === false
        ? bytesFromHex('AAAAAAAAAAAAAAAA')
        : salt
      networkSetter(dc, auth, saltKey)
      dispatch(AUTH.SET_AUTH_KEY(auth, dc))
    }
  }
  const nearestRaw = await storage.get('nearest_dc')
  const nearest = checkNumber(nearestRaw)

  if (nearest !== false)
    dispatch(MAIN.DC_DETECTED(nearest))
  else
    dispatch(MAIN.MODULE_LOADED())
}

function checkString(source: mixed) {
  if (source == null || typeof source !== 'string') return false
  const trimmed = trim(source)
  if (trimmed.length === 0) return false
  return bytesFromHex(trimmed)
}

function checkNumber(source: mixed) {
  if (source == null || typeof source !== 'number') return false
  if (!isFinite(source)) return false
  return source
}
