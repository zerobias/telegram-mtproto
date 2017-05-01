const { MTProto } = require('../lib')
const { ReactiveStorage } = require('../lib/plugins/file-storage')

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631,
  app_version    : '1.0.1',
  lang_code      : 'en'
}

const server = { webogram: true, dev: true }

const app = {
  storage: new ReactiveStorage('./test/storage')
}

const telegram = MTProto({ api, server, app })

module.exports = telegram