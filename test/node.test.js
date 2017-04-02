const { test } = require('tap')
const { MTProto } = require('../lib')
const FileStorage = require('../lib/plugins/file-storage').SimpleFileStorage

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
  await test(`Connection test`, { timeout: 30e3 }, connectionTest)
  await test(`Reuse stored auth`, { timeout: 30e3 }, reuseStoredAuth)
  delayExit()
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
    }
    i++
  }
}

const reuseStoredAuth = async (t) => {
  t.plan(1)

  const anotherTelegram = MTProto({ server, api, app })

  //NOTE No auth here

  const dialogs = await anotherTelegram('messages.getDialogs', {
    limit: 1,
  })

  t.ok(dialogs, 'dialogs is ok')
}

const delayExit = () => setTimeout(() => process.exit(0), 2e3)

tests()
