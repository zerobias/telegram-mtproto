
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40e3
const { MTProto } = require('../lib')

const { config, api } = require('./mtproto-config')
const { inputField } = require('./fixtures')

const phone = process.env.PHONE || ''
const pass = process.env.PASS || ''

const server = {
  dev     : false,
  webogram: true
}


const telegram = MTProto({ server, api })


/*const getHistory = async (chat) => {
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
}*/


async function connectionTest() {
  expect.assertions(1)
  const { phone_code_hash } = await telegram('auth.sendCode', {
    phone_number  : phone,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  console.log('phone_code_hash', phone_code_hash)
  const code = await inputField('code')
  const res = await telegram('auth.signIn', {
    phone_number: phone,
    phone_code_hash,
    phone_code  : code,
  })
  console.log('signIn', res)
  console.log('\n Logined as user')
  const dialogs = await telegram('messages.getDialogs', {
    limit: 100,
  })

  await new Promise(rs => setTimeout(rs, 2e3))
  expect(dialogs).toBeTruthy()
  // test(`Reuse stored auth`, reuseStoredAuth)
}

test.skip('Test config validation', () => {
  expect(phone.length).toBeGreaterThan(0)
  expect(pass.length).toBeGreaterThan(0)
})

test.skip(`Connection test`, connectionTest)

