const { MTProto } = require('../lib')
const { Storage } = require('mtproto-storage-fs')

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631,
  app_version    : '1.0.1',
  lang_code      : 'en'
}

const server = { webogram: true, dev: false }

const app = {
  storage: new Storage('./test/storage')
}

const telegram = MTProto({ api, server, app })

module.exports = telegram