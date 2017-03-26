const { MTProto } = require('../lib')

const phone = {
  num : '+9996620001',
  code: '22222'
}

const api = {
  layer         : 57,
  initConnection: 0x69796de9,
  api_id        : 49631
}

const server = {
  dev: true //We will connect to the test server.
}           //Any empty configurations fields can just not be specified

const client = MTProto({ server, api })

async function connect(){
  const { phone_code_hash } = await client('auth.sendCode', {
    phone_number  : phone.num,
    current_number: false,
    api_id        : 49631,
    api_hash      : 'fb050b8f6771e15bfda5df2409931569'
  })
  const { user } = await client('auth.signIn', {
    phone_number: phone.num,
    phone_code_hash,
    phone_code  : phone.code
  })

  console.log('signed as ', user)
}

connect()