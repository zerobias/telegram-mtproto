const telegram = require('./init')

// const { inputField } = require('./fixtures')

const crypto = require('crypto')

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id  : 49631,
  hash: 'fb050b8f6771e15bfda5df2409931569'
}

const login = async () => {
  try {
    // const phone = await inputField('phone')
    // console.log(phone)
    const phone = '+9996620000'
    const { phone_code_hash } = await telegram('auth.sendCode', {
            phone_number  : phone,
            current_number: false,
            api_id        : config.id,
            api_hash      : config.hash
    })
    // const code = await inputField('code')
    const code = '22222'
    let res
    try {
      res = await telegram('auth.signIn', {
        phone_number: phone,
        phone_code_hash,
        phone_code  : code
      })
    } catch (error) {
      if (error.type !== 'SESSION_PASSWORD_NEEDED') throw error

      const password = 'sekrit'
      const { current_salt } = await telegram('account.getPassword', {})
      const password_hash = crypto.createHash('sha256')
        .update(current_salt + password + current_salt)
        .digest()
      res = await telegram('auth.checkPassword', {
        password_hash
      })
    }
    const { user } = res
    const {
      first_name = '',
      username = ''
    } = user
    console.log('signIn', first_name, username, user.phone)
    return first_name
  } catch (error) {
    console.error(error)
  }
}

module.exports = login
