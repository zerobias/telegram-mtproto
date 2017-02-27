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

  const setPrepared = () => { prepared = true }

  const prepareRsaKeys = () => prepared
    ? Promise.resolve()
    : Promise
      .map(publisKeysHex, mapPrepare)
      .then(setPrepared)

  const selectRsaKey = fingerprints => () => {
    let fingerprintHex, foundKey
    for (let i = 0; i < fingerprints.length; i++) {
      fingerprintHex = strDecToHex(fingerprints[i])
      foundKey = publicKeysParsed[fingerprintHex]
      if (foundKey)
        return { fingerprint: fingerprints[i], ...foundKey }
    }

    return false
  }

  const selectRsaKeyByFingerPrint = fingerprints =>
    prepareRsaKeys()
      .then(selectRsaKey(fingerprints))

  return {
    prepare: prepareRsaKeys,
    select : selectRsaKeyByFingerPrint
  }
}

export default KeyManager
