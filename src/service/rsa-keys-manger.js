import Promise from 'bluebird'
import { bytesToHex, sha1BytesSync,
  bytesFromHex, strDecToHex } from '../bin'

import type { SerializationFabric } from '../tl'

export const KeyManager = (Serialization: SerializationFabric, publisKeysHex, publicKeysParsed) => {
  let prepared = false

  const mapPrepare = ({ modulus, exponent }) => {
    const RSAPublicKey = Serialization()
    RSAPublicKey.storeBytes(bytesFromHex(modulus), 'n')
    RSAPublicKey.storeBytes(bytesFromHex(exponent), 'e')

    const buffer = RSAPublicKey.getBuffer()

    const fingerprintBytes = sha1BytesSync(buffer).slice(-8)
    fingerprintBytes.reverse()

    publicKeysParsed[bytesToHex(fingerprintBytes)] = {
      modulus,
      exponent
    }
  }

  async function prepareRsaKeys() {
    if (prepared) return

    await Promise.map(publisKeysHex, mapPrepare)

    prepared = true
  }

  async function selectRsaKeyByFingerPrint(fingerprints) {
    await prepareRsaKeys()

    let fingerprintHex, foundKey
    for (let i = 0; i < fingerprints.length; i++) {
      fingerprintHex = strDecToHex(fingerprints[i])
      foundKey = publicKeysParsed[fingerprintHex]
      if (foundKey)
        return { fingerprint: fingerprints[i], ...foundKey }
    }
    return false
  }

  return {
    prepare: prepareRsaKeys,
    select : selectRsaKeyByFingerPrint
  }
}

export default KeyManager
