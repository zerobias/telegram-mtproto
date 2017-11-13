//@flow

import Promise from 'bluebird'

import type { PublicKey } from './main/index.h'
import type { Cached } from './api-manager/index.h'
import type { SerializationFabric } from '../tl'

import { WriteMediator } from '../tl'

import { bytesToHex, sha1BytesSync,
  bytesFromHex, strDecToHex } from '../bin'


export const KeyManager = (Serialization: SerializationFabric,
  publicKeysHex: PublicKey[],
  publicKeysParsed: Cached<PublicKey>) => {
  let prepared = false

  const mapPrepare = ({ modulus, exponent }: PublicKey) => {
    const RSAPublicKey = Serialization()
    const rsaBox = RSAPublicKey.writer
    WriteMediator.bytes(rsaBox, bytesFromHex(modulus), 'n')
    WriteMediator.bytes(rsaBox, bytesFromHex(exponent), 'e')

    const buffer = rsaBox.getBuffer()

    const fingerprintBytes = sha1BytesSync(buffer).slice(-8)
    fingerprintBytes.reverse()

    publicKeysParsed[bytesToHex(fingerprintBytes)] = {
      modulus,
      exponent
    }
  }

  async function prepareRsaKeys() {
    if (prepared) return

    await Promise.map(publicKeysHex, mapPrepare)

    prepared = true
  }

  async function selectRsaKeyByFingerPrint(fingerprints: string[]) {
    await prepareRsaKeys()

    let fingerprintHex, foundKey
    for (const fingerprint of fingerprints) {
      fingerprintHex = strDecToHex(fingerprint)
      foundKey = publicKeysParsed[fingerprintHex]
      if (foundKey)
        return { fingerprint, ...foundKey }
    }
    return false
  }

  return {
    prepare: prepareRsaKeys,
    select : selectRsaKeyByFingerPrint
  }
}

export default KeyManager
