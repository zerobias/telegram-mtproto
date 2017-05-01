//@flow

import Webworker from './web-worker'
import CryptoBin from './crypto-bin'
import type { Common } from '../config-provider'
import type { FactorizeFunc, ModPowFunc } from './index.h'

const getCrypto = (common: Common) => {
  const cryptoWorker = CryptoBin()
  let useWorker = common.use.webworker
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
  common.use.webworker = useWorker

  return cryptoWorker
}

export default getCrypto
