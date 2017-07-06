
const MTProto = require('../lib')

test('plugins existance', () => {
  expect(typeof MTProto.plugins.makePasswordHash).toBe('function')
  expect(typeof MTProto.plugins.MemoryStorage).toBe('function')
})
