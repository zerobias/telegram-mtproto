const telegram = require('./init')

const updateProfile = async (currentName) => {
  const result = await telegram('account.updateProfile', {
    first_name: `boom${  Math.floor(Math.randow() * 1e4)}`
  })
  console.log('updateProfile', result)
  return result
}

module.exports = updateProfile