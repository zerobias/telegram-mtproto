const test = require('tap').test
const { ApiManager } = require('../lib/index')

const phone = {
  num : '+9996620000',
  code: '22222'
}

const api = {
  invokeWithLayer: 0xda9b0d0d,
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : 49631,
  app_version    : '1.0.1',
  lang_code      : 'en'
}
const server = {
  dev     : true,
  webogram: true
}
const debug = true

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
}


const telegramMain = new ApiManager({ server, api, app: { debug } })

test(`Connection test`, async t => {
  t.plan(1)
  const run = async ()  => {
    let res, i = 0
    while (i<5) {
      try {
        res = await telegramMain.mtpInvokeApi('help.getNearestDc', {}, { dcID: 2, createNetworker: true })
        console.log('getNearestDc', res)
        const { phone_code_hash } = await telegramMain.mtpInvokeApi('auth.sendCode', {
              phone_number  : phone.num,
              current_number: false,
              api_id        : config.id,
              api_hash      : config.hash
        })
        console.log('phone_code_hash', phone_code_hash)
        res = await telegramMain.mtpInvokeApi('auth.signIn', {
          phone_number: phone.num,
          phone_code_hash,
          phone_code  : phone.code
        })
        console.log('signIn', res)
        console.log('\n Logined as user')
        console.dir(res.user, { colors: true })
        t.ok(res, 'result is ok')
        break
      } catch (err) {
        console.log('err', res)
      }
      i++
    }
  }
  await run()
})