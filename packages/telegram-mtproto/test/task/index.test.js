
// import raw from './example-raw'
// import { parserOpts } from './example-binary'
// jest.mock('../../lib/config-provider')
// jest.mock('../../src/config-provider')
// require('../../src/config-provider')

import { api } from '../mtproto-config'

beforeAll(() => {
  jest.mock('../../lib/config-provider/provider')
  const { MTProto } = require('../../lib')
  MTProto({ server: {
    dev     : true,
    webogram: true
  }, api })
})

// import parser from '../../lib/service/chain'

// import fullConfig, { rawData } from './example-normalize'


afterAll(() => {
  jest.unmock('../../lib/config-provider/provider')
})



// import normalize from '../../lib/task/new-index'

// import target from './example-target'





// test('full test', async() => {
//   // console.log(client.cache)
//   await expect(normalize(rawData)).resolves.toEqual(target)
// })

test('binary parsing', async() => {
  // await expect(parser(parserOpts)).resolves.toMatchSnapshot()
  const parser = require('../../lib/service/chain').default
  const fullConfig = require('./example-normalize').default
  console.log('a')
  await expect(parser(fullConfig)).resolves.toMatchSnapshot()
})

