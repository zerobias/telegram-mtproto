//@flow

import {
  pqPrimeFactorization,
  bytesModPow,
  sha1HashSync,
  aesEncryptSync,
  aesDecryptSync,
  convertToByteArray
} from '../bin'


const tasks = {
  factorize({ bytes }: *) {
    const byteArray = convertToByteArray(bytes)
    return pqPrimeFactorization(byteArray)
  },
  modPow    : ({ x, y, m }: *) => bytesModPow(x, y, m),
  sha1Hash  : ({ bytes }: *) => sha1HashSync(bytes),
  aesEncrypt: ({ bytes, keyBytes, ivBytes }: *) =>
    aesEncryptSync(bytes, keyBytes, ivBytes),
  aesDecrypt: ({ encryptedBytes, keyBytes, ivBytes }: *) => aesDecryptSync(encryptedBytes, keyBytes, ivBytes)
}

export default tasks
