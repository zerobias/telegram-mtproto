import Promise from 'bluebird'
import { bytesToHex, sha1BytesSync,
  bytesFromHex, strDecToHex } from '../bin'



export const KeyManager = (Serialization, publisKeysHex, publicKeysParsed) => {
  let prepared = false

  const mapPrepare = ({ modulus, exponent }) => {
    const RSAPublicKey = new Serialization()
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

  const prepareRsaKeys = Promise.coroutine(function* () {
    if (prepared) return

    yield Promise.map(publisKeysHex, mapPrepare)

    prepared = true
  })

  const selectRsaKeyByFingerPrint = Promise.coroutine(function*  (fingerprints) {
    yield prepareRsaKeys()

    let fingerprintHex, foundKey
    for (let i = 0; i < fingerprints.length; i++) {
      fingerprintHex = strDecToHex(fingerprints[i])
      foundKey = publicKeysParsed[fingerprintHex]
      if (foundKey)
        return { fingerprint: fingerprints[i], ...foundKey }
    }

    return false
  })
  return {
    prepare: prepareRsaKeys,
    select : selectRsaKeyByFingerPrint
  }
}

export default KeyManager
