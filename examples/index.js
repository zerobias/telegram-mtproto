const login = require('./login')
const { getChat, chatHistory } = require('./chat-history')

const run = async () => {
  await login()
  const chat = await getChat()
  await chatHistory(chat)
}

run()