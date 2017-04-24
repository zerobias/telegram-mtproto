const telegram = require('./init')

const updateProfile = async () => {
  const result = await telegram('account.updateProfile', {
    first_name: `lambda${  Math.floor(Math.random() * 1e4)}`
    // first_name: `boom${  Math.floor(Math.randow() * 1e4)}`
  })
  console.log('updateProfile')
  console.dir(result, { colors: true })
  return result
}

module.exports = updateProfile