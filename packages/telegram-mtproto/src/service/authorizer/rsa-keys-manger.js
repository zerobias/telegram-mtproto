//@flow

import { type PublicKey } from '../main/index.h'
import { Serialization } from '../../tl'

import { writeBytes } from '../../tl/writer'

import {
  bytesToHex,
  sha1BytesSync,
  bytesFromHex,
  strDecToHex,
} from 'Bin'
import Config from 'ConfigProvider'


export default function KeyManager(
  uid: string,
  publisKeysHex: PublicKey[],
  { get, set }: typeof Config.publicKeys
) {

  publisKeysHex.forEach(key => mapPrepare(uid, set, key))

  return (fingerprints: string[]) => selectRsaKeyByFingerPrint(uid, get, fingerprints)
}

function selectRsaKeyByFingerPrint(uid: string, get: typeof Config.publicKeys.get, fingerprints: string[]) {
  let fingerprintHex, foundKey
  for (const fingerprint of fingerprints) {
    fingerprintHex = strDecToHex(fingerprint)
    foundKey = get(uid, fingerprintHex)
    if (foundKey)
      return { fingerprint, ...foundKey }
  }
  throw new Error('[Key manager] No public key found')
}

function mapPrepare(uid: string, set: typeof Config.publicKeys.set, { modulus, exponent }: PublicKey) {
  const RSAPublicKey = new Serialization({}, uid)
  const rsaBox = RSAPublicKey.writer
  writeBytes(rsaBox, bytesFromHex(modulus))
  writeBytes(rsaBox, bytesFromHex(exponent))

  const buffer = rsaBox.getBuffer()

  const fingerprintBytes = sha1BytesSync(buffer).slice(-8)
  fingerprintBytes.reverse()
  const key = bytesToHex(fingerprintBytes)
  set(uid, key, {
    modulus,
    exponent
  })
}
