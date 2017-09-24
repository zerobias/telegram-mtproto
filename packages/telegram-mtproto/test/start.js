// const { test } = require('tap')
// jasmine.DEFAULT_TIMEOUT_INTERVAL = 40e3
const { MTProto } = require('../lib')
const { Storage } = require('mtproto-storage-fs')
// const debug = require('debug')
// debug.useColors = false

// const { delayExit } = require('./fixtures')

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
  webogram: true,
}

// const app = {
//   storage: new Storage('./test/storage.json')
// }

const config = {
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
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

// const resetStorage = async() => {
//   telegram.storage.data = {
//     nearest_dc: 2,
//     dc        : 2,
//   }
//   // await telegram.storage.save()
// }
//
// const isAlreadyAuth = async() => {
//   const dc = await telegram.storage.get('dc')
//   if (!dc) {
//     await resetStorage()
//     return false
//   }
//   const authKey = await telegram.storage.get(`dc${dc}_auth_key`)
//   const salt = await telegram.storage.get(`dc${dc}_server_salt`)
//   const result = !!authKey && !!salt
//   if (!result)
//     await resetStorage()
//   return result
//   // dc${ this.dcID }_server_salt
// }

const futureAuth =
  telegram.future('help.getNearestDc')
    .and(telegram.future('auth.sendCode', {
      phone_number  : phone.num,
      current_number: false,
      api_id        : config.id,
      api_hash      : config.hash
    }))
    .chain(({ phone_code_hash }) => telegram.future('auth.signIn', {
      phone_number: phone.num,
      phone_code_hash,
      phone_code  : phone.code,
    }))

const connectionTest = async() => {
  // await telegram.storage.clear() //Just for clean test
  // const isAuth = await isAlreadyAuth()

  // if (!false) {
  // const cfg = await telegram('help.getConfig')

  // consoleHR(`Download small files`)


  const location = {
    _        : 'inputFileLocation',
    dc_id    : 1,
    local_id : 1321,
    volume_id: '702109604',
    secret   : '7272927231373671580'
  }

  await futureAuth.promise()

  // infoCallMethod('upload.getFile')
  const file = await telegram('upload.getFile', {
    location,
    offset: 0,
    limit : 1024 * 1024
  })

  console.log(file)
  // const { phone_code_hash } = await telegram('auth.sendCode', {
  //   phone_number  : phone.num,
  //   current_number: false,
  //   api_id        : config.id,
  //   api_hash      : config.hash
  // })
  // console.log('phone_code_hash', phone_code_hash)
  // const res = await telegram('auth.signIn', {
  //   phone_number: phone.num,
  //   phone_code_hash,
  //   phone_code  : phone.code,
  // })
  // console.log('signIn', res)
  // console.log('\n Logined as user')
  // console.dir(res.user, { colors: true })
  // } else {
  //   message = 'already authorized, skip'
  // }
  // const dialogs = await telegram('messages.getDialogs', {
  //   limit: 100,
  // })
  // console.dir(cfg, { colors: true })

}
connectionTest()

module.exports = {
  telegram,
  connectionTest,
}
