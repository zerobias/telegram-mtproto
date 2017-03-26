const { pluck } = require('ramda')
const { inputField } = require('./fixtures')

const telegram = require('./init')

const getChat = async () => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: 50,
  })
  const { chats } = dialogs
  const selectedChat = await selectChat(chats)

  return selectedChat
}

const chatHistory = async chat => {
  const max = 400
  const limit = 100
  let offset = 0
  let full = [],
      messages = []
  do {
    const history = await telegram('messages.getHistory', {
      peer: {
        _          : 'inputPeerChannel',
        channel_id : chat.id,
        access_hash: chat.access_hash
      },
      max_id: offset,
      offset: -full.length,
      limit
    })
    messages = history.messages.filter(filterLastDay)
    full = full.concat(messages)
    messages.length > 0 && (offset = messages[0].id)
    messages.length > 0 && console.log(offset, messages[0].id)
  } while (messages.length === limit && full.length < max)
  printMessages(full)
  return full
}

const filterLastDay = ({ date }) => new Date(date*1e3) > dayRange()

const dayRange = () => Date.now() - new Date(86400000*4)

const selectChat = async (chats) => {
  const chatNames = pluck('title', chats)
  console.log('Your chat list')
  chatNames.map((name, id) => console.log(`${id}  ${name}`))
  console.log('Select chat by index')
  const chatIndex = await inputField('index')
  return chats[+chatIndex]
}

const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ message, date, from_id }) => {
  const dt = new Date(date*1e3)
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  return `${hours}:${mins} [${from_id}] ${message}`
}

const printMessages = messages => {
  const filteredMsg = messages.filter(filterUsersMessages)
  const formatted = filteredMsg.map(formatMessage)
  formatted.forEach(e => console.log(e))
  return formatted
}


const searchUsers = async (username) => {
  const results = await telegram('contacts.search', {
    q    : username,
    limit: 100,
  })
  return results
}

module.exports = {
  getChat,
  chatHistory,
  searchUsers
}