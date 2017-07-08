const telegram = require('./init')
const { inputField } = require('./fixtures')

const makePasswordHash = require('../lib/plugins/math-help').makePasswordHash

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
}

telegram.bus
  .rpcError
  .filter(message => message.error.type === 'SESSION_PASSWORD_NEEDED')
  .observe(async(message) => {
    // const password = await inputField('password')

    const { current_salt } = await telegram('account.getPassword', {})
    const password_hash = makePasswordHash(current_salt, password)

    const { user } = await telegram('auth.checkPassword', {
      password_hash
    })
    const {
      first_name = '',
      username = ''
    } = user
    console.log('signIn', first_name, username, user.phone)
  })

const phone = process.env.PHONE
const password = process.env.PASS

const login = async() => {
  try {
    // const phone = await inputField('phone')
    // console.log(phone)
    const { phone_code_hash } = await telegram('auth.sendCode', {
      phone_number  : phone,
      current_number: false,
      api_id        : config.id,
      api_hash      : config.hash
    })
    const code = await inputField('code')
    try {
      const res = await telegram('auth.signIn', {
        phone_number: phone,
        phone_code_hash,
        phone_code  : code
      })
      console.log(res)
    } catch (error) {
      console.error(error)
      throw error
    }
  } catch (error) {
    console.error(error)
  }
}

login()

module.exports = login
