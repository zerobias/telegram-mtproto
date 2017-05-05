//@flow

import MTProto from 'telegram-mtproto'
import Storage from 'mtproto-storage-fs'

import { STORAGE } from './args'

const phone = {
  num : '+9996620000',
  code: '22222'
}

const api = {
  // invokeWithLayer: 0xda9b0d0d,
  layer         : 57,
  initConnection: 0x69796de9,
  api_id        : 49631,
  app_version   : '1.0.1',
  lang_code     : 'en'
}
const server = {
  dev     : true,
  webogram: true
}

const app = {
  storage: new Storage(STORAGE)
}

const client = MTProto({ api, app, server })

export default client
