const login = require('./login')
const { getChat, chatHistory/*, searchUsers*/ } = require('./chat-history')
const updateProfile = require('./update-profile')
const client = require('./init')

const run = async () => {
  const first_name = await login()
  // const res = await searchUsers()
  await updateProfile()
  const chat = await getChat()
  await chatHistory(chat)
  await client.storage.save()
  console.log('done')
}

run()