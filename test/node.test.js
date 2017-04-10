const { test } = require('tap')
const { MTProto } = require('../lib')
const { FileStorage } = require('../lib/plugins/file-storage')

const { delayExit } = require('./fixtures')

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
  webogram: false
}

const app = {
  storage: new FileStorage('./test/storage.json')
}

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
}


const telegram = MTProto({ server, api, app })


const tests = async () => {
  try {
    await test(`Connection test`, { timeout: 30e3 }, connectionTest)
    await test(`Reuse stored auth`, { timeout: 30e3 }, reuseStoredAuth)
  } catch (err) {
    console.log(err)
  } finally {
    delayExit()
  }
}

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


const connectionTest = async t => {
  t.plan(1)
  let res, i = 0
  while (i<5) {
    try {
      await telegram.storage.clear() //Just for clean test

      const { phone_code_hash } = await telegram('auth.sendCode', {
            phone_number  : phone.num,
            current_number: false,
            api_id        : config.id,
            api_hash      : config.hash
      })
      console.log('phone_code_hash', phone_code_hash)
      res = await telegram('auth.signIn', {
        phone_number: phone.num,
        phone_code_hash,
        phone_code  : phone.code
      })
      console.log('signIn', res)
      console.log('\n Logined as user')
      console.dir && console.dir(res.user, { colors: true })
      t.ok(res, 'result is ok')
      break
    } catch (err) {
      console.log('err', err)
      delayExit()
    }
    i++
  }
}

const reuseStoredAuth = async (t) => {
  t.plan(2)

  const anotherTelegram = MTProto({ server, api, app })

  //NOTE No auth here

  const dialogs = await anotherTelegram('messages.getDialogs', {
    limit: 100,
  })

  t.ok(dialogs, 'dialogs is ok')

  const chat1 = dialogs.chats[2]

  const history = await getHistory(chat1)

  const list = history.messages

  t.ok(list, 'chat1')
}

tests()
