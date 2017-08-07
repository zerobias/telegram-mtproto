
import { api } from '../mtproto-config'

beforeAll(() => {
  jest.mock('../../src/config-provider/provider')
  const { MTProto } = require('../../src')
  const client = MTProto({ server: {
    dev     : true,
    webogram: true
  }, api })
  client.emit('deactivate')
})

// import fullConfig, { rawData } from './example-normalize'


afterAll(() => {
  jest.unmock('../../src/config-provider/provider')
})



// import normalize from '../../lib/task/new-index'

// import target from './example-target'





// test('full test', async() => {
//   // console.log(client.cache)
//   await expect(normalize(rawData)).resolves.toEqual(target)
// })

test('binary parsing', async() => {
  const parser = require('../../src/service/chain').default
  const binaryParseData = require('./example-normalize').default
  await expect(parser(binaryParseData)).resolves.toMatchSnapshot()
})

