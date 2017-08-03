const { outputJsonSync, readJSONSync } = require('fs-extra')
const { join } = require('path')
const Bluebird = require('bluebird')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3
const { MTProto } = require('../lib')
const { getStorageData } = require('./fixtures')
const { config, api } = require('./mtproto-config')
const { Storage } = require('mtproto-storage-fs')
// const debug = require('debug')
// debug.useColors = false

// const { delayExit } = require('./fixtures')

// const phoneDC1 = {
//   num : '+9996610000',
//   code: '11111'
// }
// const storageSnap = readJSONSync(join(__dirname, 'storage.json'))
const storageData = () => /* storageSnap */ getStorageData(2)

outputJsonSync(join(__dirname, 'storage.json'), storageData(), { spaces: 2 })

const phone = {
  num      : '+9996620000',
  code     : '22222',
  wrongCode: '11111',
}

const server = {
  dev     : true,
  webogram: true
}

const app = {
  storage: new Storage('./test/storage.json')
}


let telegram


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
  telegram.storage.data = storageData()
  await telegram.storage.save()
}

const isAlreadyAuth = async() => {
  const dc = await telegram.storage.get('nearest_dc')
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
}


beforeEach(() => {
  telegram = MTProto({ server, api, app })
})


afterEach(async() => {
  app.storage.data = storageData()
  await app.storage.save()
  await new Promise(rs => setTimeout(rs, 1e3))
})

test.only(`Connection test`, async() => {
  expect.assertions(2)
  const isAuth = await isAlreadyAuth()
  let message
  if (!isAuth) {
    infoCallMethod('auth.sendCode')
    const res1 = await telegram('auth.sendCode', {
      phone_number  : phone.num,
      current_number: false,
      api_id        : config.id,
      api_hash      : config.hash
    })
    const { phone_code_hash } = res1
    console.log('res1', res1)
    console.log('phone_code_hash', phone_code_hash)
    infoCallMethod('auth.signIn')
    const res = await telegram('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code  : phone.code,
    })
    console.log('signIn', res)
    message = 'result is ok'
  } else {
    message = 'already authorized, skip'
  }
  expect(message).toBeTruthy()
  infoCallMethod('messages.getDialogs')
  const dialogs = await telegram('messages.getDialogs', {
    limit: 100,
  })
  expect(dialogs).toBeTruthy()
})

test(`Rejection test`, async() => {
  expect.assertions(2)
  await expect((async() => {
    infoCallMethod('auth.sendCode')
    const { phone_code_hash } = await telegram('auth.sendCode', {
      phone_number  : phone.num,
      current_number: false,
      api_id        : config.id,
      api_hash      : config.hash
    })
    infoCallMethod('auth.signIn')
    await expect(
      telegram('auth.signIn', {
        phone_number: phone.num,
        phone_code_hash,
        phone_code  : phone.wrongCode,
      })
    ).rejects.toMatchObject({
      code   : 400,
      message: 'PHONE_CODE_INVALID',
    })
  })()).resolves.toBeUndefined()
})


test(`Parallel requests safety`, async() => {
  const TIMES = 10
  const TIMEOUT = 30e3

  expect.assertions(2)
  infoCallMethod('auth.sendCode')
  const { phone_code_hash } = await telegram('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  infoCallMethod('auth.signIn')
  const res = await telegram('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code  : phone.code,
  })
  expect(res).toBeDefined()
  infoCallMethod(`messages.getDialogs (x${TIMES})`)
  const promises = []
  for (let i = 0; i < TIMES; i++)
    promises.push(telegram('messages.getDialogs', {
      limit: 100,
    }))

  await expect(
    Bluebird
      .all(promises)
      .timeout(TIMEOUT)
  ).resolves.toHaveLength(10)
})


function infoMessage(str) {
  const value = `
--- INFO ---

  ${str}

--- --- ---
`
  console.log(value)
}

function infoCallMethod(str) {
  infoMessage(`Call method ${str}`)
}
