
import { api } from '../mtproto-config'
import { freezeTime } from './fixtures'

let client

beforeAll(() => {
  jest.mock('../../src/config-provider/provider')
  const { MTProto } = require('../../src')
  client = MTProto({
    server: {
      dev     : true,
      webogram: true
    },
    api
  })
  client.emit('deactivate')
})


afterAll(() => {
  jest.unmock('../../src/config-provider/provider')
})

test('binary parsing', async() => {
  const parser = require('../../src/service/chain').default
  const binaryParseData = require('./example-normalize').default
  await expect(parser(binaryParseData)).resolves.toMatchSnapshot()
})


test('normalize', async() => {
  const normalize = require('../../src/task').default
  const { rawData, authKey, serverSalt, sessionID, getMsgById } = require('./example-normalize')
  const { default: result, TIMESTAMP } = require('./example-target')
  const unfreezeTime = freezeTime(TIMESTAMP)

  const thread = client.api.networkSetter(2, authKey, serverSalt) //TODO networkSetter was removed!
  thread.sessionID = sessionID
  thread.getMsgById = getMsgById
  const data = { ...rawData, thread }
  await expect(normalize(data)).resolves.toEqual(result)
  unfreezeTime()
})
