const login = require('./login')
const { getChat, chatHistory/*, searchUsers*/ } = require('./chat-history')
const updateProfile = require('./update-profile')

const run = async () => {
  const first_name = await login()
  // const res = await searchUsers()
  await updateProfile(first_name)
  const chat = await getChat()
  // await chatHistory(chat)
}

run()