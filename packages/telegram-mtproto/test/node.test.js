const { test } = require('tap')
const { MTProto } = require('../lib')
const { Storage } = require('mtproto-storage-fs')
const debug = require('debug')
debug.useColors = false

const { delayExit } = require('./fixtures')

// const phoneDC1 = {
//   num : '+9996610000',
//   code: '11111'
// }

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
  storage: new Storage('./test/storage.json')
}

const config = {
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
}


const telegram = MTProto({ server, api, app })


const getHistory = async (chat) => {
  const peer = {
    _               : `inputPeerC${chat._.slice(1)}`,
    [`${chat._}_id`]: chat.id,
    access_hash     : chat.access_hash
  }
  const history = await telegram('messages.getHistory', {
    peer,
    limit : 500,
    max_id: 0
  })

  return history
}

const isAlreadyAuth = async () => {
  const dc = await telegram.storage.get('dc')
  if (!dc) return false
  const authKey = await telegram.storage.get(`dc${dc}_auth_key`)
  const salt = await telegram.storage.get(`dc${dc}_server_salt`)
  return !!authKey && !!salt
  // dc${ this.dcID }_server_salt
}


const connectionTest = async t => {
  // await telegram.storage.clear() //Just for clean test
  t.plan(1)
  const isAuth = await isAlreadyAuth()
  let message
  if (!isAuth) {
    const { phone_code_hash } = await telegram('auth.sendCode', {
          phone_number  : phone.num,
          current_number: false,
          api_id        : config.id,
          api_hash      : config.hash
    })
    console.log('phone_code_hash', phone_code_hash)
    const res = await telegram('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code  : phone.code,
    })
    console.log('signIn', res)
    console.log('\n Logined as user')
    console.dir && console.dir(res.user, { colors: true })
    message = 'result is ok'
  } else {
    message = 'already authorized, skip'
  }
  t.ok(true, message)
  t.end()
}

const reuseStoredAuth = async (t) => {
  // const anotherTelegram = MTProto({ server, api, app })
  //NOTE No auth here
  t.plan(1)
  const dialogs = await telegram('messages.getDialogs', {
    limit: 100,
  })

  t.ok(dialogs, 'dialogs is ok')
  t.end()
  delayExit()
  // const chat1 = dialogs.chats[2]

  // const history = await getHistory(chat1)

  // const list = history.messages

  // t.ok(list, 'chat1')
}

// const tests = () =>
test(`Connection test`, connectionTest)
test(`Reuse stored auth`, reuseStoredAuth)
// delayExit()
  // await app.storage.save()
