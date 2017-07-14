//@flow

import { type PublicKey } from '../main/index.h'
import { type Cached } from '../api-manager/index.h'
import { Serialization } from '../../tl'

import { writeBytes } from '../../tl/writer'

import { bytesToHex, sha1BytesSync,
  bytesFromHex, strDecToHex } from '../../bin'


export function KeyManager(
  uid: string,
  publisKeysHex: PublicKey[],
  publicKeysParsed: Cached<PublicKey>
) {
  let prepared = false

  function mapPrepare({ modulus, exponent }: PublicKey) {
    const RSAPublicKey = new Serialization({}, uid)
    const rsaBox = RSAPublicKey.writer
    writeBytes(rsaBox, bytesFromHex(modulus)/*, 'n'*/)
    writeBytes(rsaBox, bytesFromHex(exponent)/*, 'e'*/)

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

  function prepareRsaKeys() {
    if (prepared) return
    publisKeysHex.forEach(mapPrepare)

    prepared = true
  }

  function selectRsaKeyByFingerPrint(fingerprints: string[]) {
    prepareRsaKeys()

    let fingerprintHex, foundKey
    for (const fingerprint of fingerprints) {
      fingerprintHex = strDecToHex(fingerprint)
      //$FlowIssue obj[number] === obj[stringNumber]
      foundKey = publicKeysParsed[fingerprintHex]
      if (foundKey)
        return { fingerprint, ...foundKey }
    }
    throw new Error('[Key manager] No public key found')
  }

  return {
    prepare: prepareRsaKeys,
    select : selectRsaKeyByFingerPrint
  }
}

export default KeyManager
