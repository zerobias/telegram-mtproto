
const { MTProto } = require('../lib')
const { Deserialization, Serialization } = require('../lib/tl/index')

const api57 = require('../schema/api-57.json')
const mtproto57 = require('../schema/mtproto-57.json')

// const { getDeserializeOpts } = require('../lib/service/networker/index')

const {
  channelMessages,
  channelMessagesBinary,
  msg_detailed_info,
  msg_detailed_infoBinary,
  req_pq,
  req_pqBinary,
  req_DH_params,
  req_DH_paramsBinary,
  // getNearestDcBinary,
  getHistory,
  getHistoryBinary
} = require('./tl-data')

// const override = getDeserializeOpts(() => {})

const mt = MTProto({ schema: api57, mtSchema: mtproto57 })

const createDeserializer = (arr, type) => {
  const uint = type.from(arr)
  return new Deserialization(uint.buffer, { mtproto: true }, mt.uid)
}

describe('Deserialization test', () => {
  test('msg_detailed_info', () => {
    const expected = msg_detailed_info,
          arr = msg_detailed_infoBinary,
          typeField = '',
          field = 'INPUT',
          offset = 0,
          type = Uint8Array
    let deserialization, result
    expect(() => {
      deserialization = createDeserializer(arr, type)
      deserialization.typeBuffer.offset = offset
    }).not.toThrow()
    expect(() => {
      result = deserialization.fetchObject('', 'INPUT')
    }).not.toThrow()
    expect(result).toEqual(expected)
  })

  test('messages.channelMessages', () => {
    const expected = channelMessages,
          arr = channelMessagesBinary,
          typeField = 'messages.Messages',
          field = 'INPUT[rpc_result][result]',
          offset = 0,
          type = Uint32Array
    let deserialization, result
    expect(() => {
      deserialization = createDeserializer(arr, type)
      deserialization.typeBuffer.offset = offset
    }).not.toThrow()
    expect(() => {
      result = deserialization.fetchObject('', 'INPUT')
    }).not.toThrow()
    expect(result).toEqual(expected)
  })
})

describe('tl test', () => {

  test('req_pq', () => {
    const methodName = 'req_pq',
          data = req_pq,
          serialParams = { mtproto: true },
          expected = req_pqBinary
    let serialization

    expect(() => {
      'create serialization'
      serialization = new Serialization(serialParams, mt.uid)
    }).not.toThrow()

    expect(() => {
      'store method'
      serialization.storeMethod(methodName, data)
    }).not.toThrow()

    const { offset, maxLength, intView } = serialization.writer
    expect(offset).toEqual(expected.offset)
    expect(maxLength).toEqual(expected.maxLength)
    expect(intView).toEqual(expected.intView)
  })

  test('req_DH_params', () => {
    const methodName = 'req_DH_params',
          data = req_DH_params,
          serialParams = { mtproto: true },
          expected = req_DH_paramsBinary
    let serialization

    expect(() => {
      'create serialization'
      serialization = new Serialization(serialParams, mt.uid)
    }).not.toThrow()

    expect(() => {
      'store method'
      serialization.storeMethod(methodName, data)
    }).not.toThrow()

    const { offset, maxLength, intView } = serialization.writer
    expect(offset).toEqual(expected.offset)
    expect(maxLength).toEqual(expected.maxLength)
    expect(intView).toEqual(expected.intView)
  })

  test('getHistory', () => {
    const methodName = 'messages.getHistory',
          data = getHistory,
          serialParams = {},
          expected = getHistoryBinary
    let serialization

    expect(() => {
      'create serialization'
      serialization = new Serialization(serialParams, mt.uid)
    }).not.toThrow()

    expect(() => {
      'store method'
      serialization.storeMethod(methodName, data)
    }).not.toThrow()

    const { offset, maxLength, intView } = serialization.writer
    expect(offset).toEqual(expected.offset)
    expect(maxLength).toEqual(expected.maxLength)
    expect(intView).toEqual(expected.intView)
  })

  /*test.skip('getNearestDc', () => {
    const methodName = 'help.getNearestDc',
          data = {},
          serialParams = { mtproto: false },
          expected = getNearestDcBinary
    let serialization

    expect(() => {
      'create serialization'
      serialization = new Serialization(serialParams, mt.uid)
    }).not.toThrow()

    expect(() => {
      'store method'
      serialization.storeMethod(methodName, data)
    }).not.toThrow()

    const { offset, maxLength, intView } = serialization.writer
    expect(offset).toEqual(expected.offset)
    expect(maxLength).toEqual(expected.maxLength)
    expect(intView).toEqual(expected.intView)
  })*/
})
