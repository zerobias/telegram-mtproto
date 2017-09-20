//@flow

const { outputJson } = require('fs-extra')
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

// outputJsonSync(join(__dirname, 'storage.json'), storageData(), { spaces: 2 })

const phone = {
  num      : '+9996620000',
  code     : '22222',
  wrongCode: '11111',
  wrongNum : '+9996610000',
}

const server = {
  dev     : true,
  webogram: true
}


let telegram

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

// const resetStorage = async() => {
//   consoleHR(`RESET STORAGE`)
//   //$ off
//   telegram.storage.data = storageData()
//   //$ off
//   // await telegram.storage.save()
//   await delay(4000)
//   consoleHR(`RESET DONE`)
// }

// const isAlreadyAuth = async() => {
//   const dc = await telegram.storage.get('nearest_dc')
//   if (!dc) {
//     await resetStorage()
//     return false
//   }
//   const authKey = await telegram.storage.get(`dc${dc}_auth_key`)
//   const salt = await telegram.storage.get(`dc${dc}_server_salt`)
//   const result = !!authKey && !!salt
//   if (!result) {
//     await resetStorage()
//   }
//   return result
// }

let sendCode, getDialogs, getNearest

beforeEach(() => {
  telegram = MTProto({ server, api })
  sendCode = telegram.future('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  getDialogs = telegram.future('messages.getDialogs', {
    limit: 100,
  })
  getNearest = telegram.future('help.getNearestDc')
  // await resetStorage()
})


afterEach(() => {
  consoleHR(`TEST END`)
})

test(`Connection test`, async() => {
  consoleHR(`Connection test`)

  expect.assertions(2)
  infoCallMethod('getNearest')
  await getNearest.promise()

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
  expect(res).toBeTruthy()
  infoCallMethod('messages.getDialogs')
  const dialogs = await getDialogs.promise()
  expect(dialogs).toBeTruthy()
})

test('Loading from storage', async() => {
  consoleHR(`Loading from storage`)

  const storagePath = './test/storage.json'

  await outputJson(storagePath, {})
  const app = {
    storage: new Storage(storagePath)
  }
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
  getNearest = telegram.future('help.getNearestDc')


  infoCallMethod('auth.sendCode')
  await getNearest.promise()
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

  infoCallMethod('messages.getDialogs')
  const dialogs1 = await getDialogs.promise()
  expect(dialogs1).toBeDefined()

  consoleHR(`Next instance`)
  await delay(3000)

  const nextApp = {
    storage: new Storage(storagePath)
  }

  const newInstance = MTProto({ server, api, app: nextApp })

  infoCallMethod('getNearestDc')
  await newInstance('help.getNearestDc')
  infoCallMethod('messages.getDialogs')
  const dialogs = await newInstance('messages.getDialogs', {
    limit: 100,
  })
  expect(dialogs).toBeDefined()
})

test('DC migrate', async() => {
  consoleHR(`DC migrate`)

  infoCallMethod('getNearest')
  await getNearest.promise()
  infoCallMethod('auth.sendCode')
  const res1 = await telegram('auth.sendCode', {
    phone_number  : phone.wrongNum,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  })
  expect(res1).toHaveProperty('phone_code_hash')
  infoCallMethod('auth.signIn')
  const res = await telegram('auth.signIn', {
    phone_number   : phone.wrongNum,
    phone_code_hash: res1.phone_code_hash,
    phone_code     : phone.wrongCode,
  })
  expect(res).toBeTruthy()
  const dialogs = await getDialogs.promise()
  expect(dialogs).toBeTruthy()
})

test(`Rejection test`, async() => {
  consoleHR('Rejection test')

  infoCallMethod('getNearest')
  await getNearest.promise()
  infoCallMethod('auth.sendCode')
  const { phone_code_hash } = await sendCode.promise()
  infoCallMethod('auth.signIn')
  const expectedError = new Error('PHONE_CODE_INVALID')
  //$off
  expectedError.code = 400
  await expect(
    telegram('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code  : phone.wrongCode,
    })
  ).rejects.toMatchObject(expectedError)
})


test(`Parallel requests safety`, async() => {
  consoleHR(`Parallel requests safety`)
  const TIMES = 10
  const TIMEOUT = 40e3

  expect.assertions(1)
  infoCallMethod('getNearest')
  await getNearest.promise()
  infoCallMethod('auth.sendCode')
  const { phone_code_hash } = await sendCode.promise()
  infoCallMethod('auth.signIn')
  await telegram('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code  : phone.code,
  })

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

test.only(`Download small files`, async() => {
  consoleHR(`Download small files`)

  const location = { 
    _        : 'inputFileLocation',
    dc_id    : 1,
    local_id : 1321,
    volume_id: '702109604',
    secret   : '7272927231373671580'
  }

  infoCallMethod('getNearest')
  await getNearest.promise()
  infoCallMethod('auth.sendCode')
  const { phone_code_hash } = await sendCode.promise()
  infoCallMethod('auth.signIn')
  await telegram('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code  : phone.code,
  })
  infoCallMethod('upload.getFile')
  const file = await telegram('upload.getFile', {
    location,
    offset: 0,
    limit : 1024 * 1024
  })

  console.log(file)
})