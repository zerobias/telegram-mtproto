const { outputJsonSync } = require('fs-extra')
const { join } = require('path')
jasmine.DEFAULT_TIMEOUT_INTERVAL = 40e3
const { MTProto } = require('../lib')
const { config, api } = require('./mtproto-config')
const { Storage } = require('mtproto-storage-fs')
// const debug = require('debug')
// debug.useColors = false

// const { delayExit } = require('./fixtures')

// const phoneDC1 = {
//   num : '+9996610000',
//   code: '11111'
// }

outputJsonSync(join(__dirname, 'storage.json'), {
  nearest_dc: 2,
  dc        : 2,
}, { spaces: 2 })

const phone = {
  num : '+9996620000',
  code: '22222'
}

const server = {
  dev     : true,
  webogram: true
}

const app = {
  storage: new Storage('./test/storage.json')
}


const telegram = MTProto({ server, api, app })


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

const resetStorage = async() => {
  telegram.storage.data = {
    nearest_dc: 2,
    dc        : 2,
  }
  await telegram.storage.save()
}

const isAlreadyAuth = async() => {
  const dc = await telegram.storage.get('dc')
  if (!dc) {
    await resetStorage()
    return false
  }
  const authKey = await telegram.storage.get(`dc${dc}_auth_key`)
  const salt = await telegram.storage.get(`dc${dc}_server_salt`)
  const result = !!authKey && !!salt
  if (!result)
    await resetStorage()
  return result
  // dc${ this.dcID }_server_salt
}


const connectionTest = async() => {
  // await telegram.storage.clear() //Just for clean test
  expect.assertions(2)
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
    // console.dir && console.dir(res.user, { colors: true })
    message = 'result is ok'
  } else {
    message = 'already authorized, skip'
  }
  expect(message).toBeTruthy()
  const dialogs = await telegram('messages.getDialogs', {
    limit: 100,
  })
  // console.dir && console.dir(dialogs, { colors: true })
  app.storage.data = {
    nearest_dc: 2,
    dc        : 2,
  }
  await app.storage.save()
  await new Promise(rs => setTimeout(rs, 2e3))
  expect(dialogs).toBeTruthy()
  // test(`Reuse stored auth`, reuseStoredAuth)
}

/*const reuseStoredAuth = async () => {
  // const anotherTelegram = MTProto({ server, api, app })
  //NOTE No auth here
  // expect.assertions(1)
  const dialogs = await telegram('messages.getDialogs', {
    limit: 100,
  })
  app.storage.data = {
    nearest_dc: 2,
    dc        : 2,
  }
  await app.storage.save()
  // expect(dialogs).toBeTruthy()
  // const chat1 = dialogs.chats[2]

  // const history = await getHistory(chat1)

  // const list = history.messages

  // t.ok(list, 'chat1')
}*/

// const tests = () =
test(`Connection test`, connectionTest)
// delayExit()
// await app.storage.save()
