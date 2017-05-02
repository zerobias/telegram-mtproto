//@flow

import { immediateWrap } from 'mtproto-shared'
import tasks from './tasks'

import type { CryptoWorker } from './index.h'

const CryptoBin = (): CryptoWorker => ({
  factorize : immediateWrap(tasks.factorize),
  modPow    : immediateWrap(tasks.modPow),
  sha1Hash  : immediateWrap(tasks.sha1Hash),
  aesEncrypt: immediateWrap(tasks.aesEncrypt),
  aesDecrypt: immediateWrap(tasks.aesDecrypt),
})

export default CryptoBin
