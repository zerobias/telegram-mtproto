//@flow

import Bluebird from 'bluebird'

import type { PublicKey } from './main/index.h'
import type { Cached } from './api-manager/index.h'
import type { SerializationFabric } from '../tl/index'
import { Serialization } from '../tl'

import { writeBytes } from '../tl/writer'

import { bytesToHex, sha1BytesSync,
  bytesFromHex, strDecToHex } from '../bin'


export const KeyManager = (serialization: SerializationFabric,
  publisKeysHex: PublicKey[],
  publicKeysParsed: Cached<PublicKey>) => {
  let prepared = false

  const mapPrepare = ({ modulus, exponent }: PublicKey) => {
    const RSAPublicKey: Serialization = serialization()
    const rsaBox = RSAPublicKey.writer
    writeBytes(rsaBox, bytesFromHex(modulus), 'n')
    writeBytes(rsaBox, bytesFromHex(exponent), 'e')

    const buffer = rsaBox.getBuffer()

    const fingerprintBytes = sha1BytesSync(buffer).slice(-8)
    fingerprintBytes.reverse()
    const key = bytesToHex(fingerprintBytes)
    //$FlowIssue obj[number] === obj[stringNumber]
    publicKeysParsed[key] = {
      modulus,
      exponent
    }
  }

  async function prepareRsaKeys() {
    if (prepared) return

    await Bluebird.map(publisKeysHex, mapPrepare)

    prepared = true
  }

  async function selectRsaKeyByFingerPrint(fingerprints: string[]) {
    await prepareRsaKeys()

    let fingerprintHex, foundKey
    for (const fingerprint of fingerprints) {
      fingerprintHex = strDecToHex(fingerprint)
      //$FlowIssue obj[number] === obj[stringNumber]
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
