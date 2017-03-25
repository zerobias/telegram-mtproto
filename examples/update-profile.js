const telegram = require('./init')

const updateProfile = async (currentName) => {
  const result = await telegram('account.updateProfile', {
    first_name: currentName + 'test'
  })
  console.log('updateProfile', result)
  return result
}

module.exports = updateProfile