const login = require('./login')
const { getChat, chatHistory } = require('./chat-history')
const updateProfile = require('./update-profile')

const run = async () => {
  const first_name = await login()
  await updateProfile(first_name)
  const chat = await getChat()
  await chatHistory(chat)
}

run()