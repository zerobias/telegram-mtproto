const test = require('tap').test
const mt = require('../lib/mtproto')
const tl = require('@goodmind/telegram-tl-node')
const { Telegram } = require('telegram-js')

const phone = {
  num : '+9996620000',
  code: '22222'
}

const server = {
  host: '149.154.167.40',
  port: '443'
}

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id           : 49631,
  hash         : 'fb050b8f6771e15bfda5df2409931569',
  version      : '1.0.1',
  langCode     : 'en',
  deviceModel  : '',
  systemVersion: '',
}

const publicKeys = [{
  fingerprint: '0xc3b42b026ce86b21',
  modulus    : 'c150023e2f70db7985ded064759cfecf0af328e69a41daf4d6f01b538135a6'+
  'f91f8f8b2a0ec9ba9720ce352efcf6c5680ffc424bd634864902de0b4bd6d49f4e580230e'+
  '3ae97d95c8b19442b3c0a10d8f5633fecedd6926a7f6dab0ddb7d457f9ea81b8465fcd6ff'+
  'feed114011df91c059caedaf97625f6c96ecc74725556934ef781d866b34f011fce4d835a'+
  '090196e9a5f0e4449af7eb697ddb9076494ca5f81104a305b6dd27665722c46b60e5df680'+
  'fb16b210607ef217652e60236c255f6a28315f4083a96791d7214bf64c1df4fd0db1944fb'+
  '26a2a57031b32eee64ad15a8ba68885cde74a5bfc920f6abf59ba5c75506373e7130f9042da922179251f',
  exponent: '010001'
}]

const fileSchema = require('./api-schema-57.json')

const telegramFactory = () => {
  const telegram = new Telegram(mt, tl)
  const addKey = key => telegram.addPublicKey(key)
  publicKeys.forEach(addKey)
  telegram.useSchema(fileSchema)
  return telegram
}

const connect = () => new Promise((rs, rj) => {
  const telegram = telegramFactory()
  const onConnect = () => client
    .setup(config)
    .then(client => rs({ telegram, client }), rj)

  const connection = new mt.net.HttpConnection(server)
  const client = telegram.createClient()
  client.setConnection(connection)
  connection.connect(onConnect)
})

class ApiError extends Error {
  constructor(resp) {
    const message = `[API ERROR][${resp.error_code}]`
    super(message)
    this.response = resp
  }
}

const auth = ({ telegram, client }) => {
  const send = (method, ...args) => new Promise((rs, rj) => {
    const onResp = resp => resp.error_code
      ? rj(new ApiError(resp))
      : rs(resp)
    return client.callApi(method, ...args).then(onResp, rj)
  })
  return send('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : config.id,
    api_hash      : config.hash
  }).then(
  ({ phone_code_hash }) => send('auth.signIn', {
    phone_number   : phone.num,
    phone_code_hash: phone_code_hash,
    phone_code     : phone.code
  }))
}


test(`Connection test`, t => {
  t.plan(1)
  return connect()
    .then(auth)
    .then(({ user: { access_hash, phone } }) => {
      console.log(`access_hash ${access_hash}\nphone ${phone}`)
      t.ok(access_hash, 'result is ok')
      process.exit(0)
    })
})