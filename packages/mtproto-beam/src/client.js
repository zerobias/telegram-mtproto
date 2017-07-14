//@flow

import MTProto from 'telegram-mtproto'
import Storage from 'mtproto-storage-fs'

import { STORAGE } from './args'

const api = {
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
