//@flow

import Webworker from './web-worker'
import CryptoBin from './crypto-bin'
import cryptoCommon from './common-provider'
import type { FactorizeFunc, ModPowFunc } from './index.h'

export default function getCrypto() {
  const cryptoWorker = CryptoBin()
  let useWorker = cryptoCommon.use.webworker
  if (useWorker) {
    try {
      const webWorker = Webworker.of()
      const factorize: FactorizeFunc =
        (args) => webWorker.run('factorize', args)

      const modPow: ModPowFunc =
        (args) => webWorker.run('mod-pow', args)

      cryptoWorker.factorize = factorize
      cryptoWorker.modPow = modPow
    } catch (err) {
      useWorker = false
    }
  }
  cryptoCommon.use.webworker = useWorker

  return {
    ...cryptoCommon,
    Crypto: cryptoWorker,
  }
}
