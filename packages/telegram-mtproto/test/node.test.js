//@flow

const { outputJsonSync, readJSONSync } = require('fs-extra')
const { join } = require('path')
const Bluebird = require('bluebird')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 180e3

/*::
import MTProto from 'telegram-mtproto'

const nn = `
*/
const { MTProto } = require('../lib')

/*::
`
*/
const { getStorageData, delay, consoleHR, infoCallMethod } = require('./fixtures')
const { config, api } = require('./mtproto-config')
const { default: Storage } = require('../lib/plugins/sync-fs')
// const debug = require('debug')
// debug.useColors = false

// const { delayExit } = require('./fixtures')

// const phoneDC1 = {
//   num : '+9996610000',
//   code: '11111'
// }
// const storageSnap = readJSONSync(join(__dirname, 'storage.json'))
const storageData = () => /* storageSnap */ getStorageData(2)

// outputJsonSync(join(__dirname, 'storage.json'), storageData(), { spaces: 2 })

const phone = {
  num      : '+9996620000',
  code     : '22222',
  wrongCode: '11111',
}

const server = {
  dev     : true,
  webogram: true
}


let telegram
const app = {
  storage: new Storage('./test/storage.json')
}

const { default: Config } = require('../lib/config-provider')

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
  consoleHR(`RESET STORAGE`)
  //$off
  telegram.storage.data = storageData()
  //$off
  await telegram.storage.save()
  await delay(4000)
  consoleHR(`RESET DONE`)
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
  if (!result) {
    await resetStorage()
  }
  return result
}

let sendCode, getDialogs

beforeEach(async() => {
  telegram = MTProto({ server, api, app })
  sendCode = telegram.future('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  getDialogs = telegram.future('messages.getDialogs', {
    limit: 100,
  })
  // await resetStorage()
})


afterEach(async() => {
  consoleHR(`TEST END`)
  await delay(4e3)
  consoleHR(`PAUSE END`)
})

test.only('Loading from storage', async() => {
  // expect.assertions(2)
  // await expect((async() => {
  infoCallMethod('auth.sendCode')
  let nearest = await telegram('help.getNearestDc')
  const res1 = await telegram('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  const { phone_code_hash } = res1
  await telegram('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code  : phone.code,
  })
  //
  infoCallMethod('messages.getDialogs')
  const dialogs1 = await getDialogs.promise()
  expect(dialogs1).toBeDefined()
  // //   return true
  // // })()).resolves.toBeDefined()
  //
  //
  //
  await delay(3000)
  //
  // // await expect((async() => {
  const nextStorage = new Storage(
    './test/storage1.json',
    //$off
    // telegram.storage.data
  )
  // // await nextStorage.save()
  // console.warn(nextStorage.data)
  const newInstance = MTProto({ server, api, app: {
    storage: nextStorage
  } })
  //
  // await delay(4e3)
  // // expect(newInstance.storage.data.dc1_auth_key).toBe(
  // //   telegram.storage.data.dc1_auth_key
  // // )
  nearest = await newInstance('help.getNearestDc')
  // console.log(Config.session.get(telegram.uid, 2))
  // infoCallMethod(Config.session.get(newInstance.uid, 2))
  // await delay(3000)
  // await nextStorage.save()
  nextBlock: {
    const res1 = await newInstance('auth.sendCode', {
      phone_number  : phone.num,
      current_number: false,
      api_id        : config.id,
      api_hash      : config.hash
    })
    const { phone_code_hash } = res1
    await newInstance('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code  : phone.code,
    })
  }
  const dialogs = await newInstance('messages.getDialogs', {
    limit: 100,
  })
  expect(dialogs).toBeDefined()
    // return true
  // })()).resolves.toBeDefined()
})

test(`Connection test`, async() => {

  expect.assertions(2)
  const isAuth = await isAlreadyAuth()
  let message
  if (!isAuth) {
    infoCallMethod('auth.sendCode')
    const res1 = await sendCode.promise()
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
  const dialogs = await getDialogs.promise()
  expect(dialogs).toBeTruthy()
})

test(`Rejection test`, async() => {
  expect.assertions(2)
  await expect((async() => {
    infoCallMethod('auth.sendCode')
    const { phone_code_hash } = await sendCode.promise()
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
  const { phone_code_hash } = await sendCode.promise()
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
    promises.push(getDialogs.promise())

  await expect(
    Bluebird
      //$off
      .all(promises)
      .timeout(TIMEOUT)
  ).resolves.toHaveLength(10)
})
