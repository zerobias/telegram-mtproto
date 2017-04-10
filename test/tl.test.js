const { test } = require('tap')
const { TL } = require('../lib/tl/index')
const { delayExit } = require('./fixtures')

const api57 = require('../schema/api-57.json')
const mtproto57 = require('../schema/mtproto-57.json')

const { getDeserializeOpts } = require('../lib/service/networker/index')

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

const override = getDeserializeOpts(() => {})

const creator = TL(api57, mtproto57)

const createDeserializer = (arr, type) => {
  const uint = type.from(arr)
  return creator.Deserialization(uint.buffer, { mtproto: true, override })
}

const deserializationTester = (expected, arr, typeField, field, offset = 0, type = Uint8Array) => t => {
  let deserialization
  t.notThrow(() => deserialization = createDeserializer(arr, type), 'create Deserializer')
  deserialization.typeBuffer.offset = offset
  let result
  t.notThrow(() => result = deserialization.fetchObject('', 'INPUT'), 'fetch Object')

  t.same(result, expected, 'compare results')

  t.end()
}

test('Deserialization test', { skip: false }, t => {
  t.test('msg_detailed_info', deserializationTester(
    msg_detailed_info,
    msg_detailed_infoBinary,
    '', 'INPUT'
  ))

  t.test('messages.channelMessages', deserializationTester(
    channelMessages,
    channelMessagesBinary,
    'messages.Messages',
    'INPUT[rpc_result][result]',
    0,
    Uint32Array
  ))
  t.end()
})

const serializationTester =
  (methodName, data, serialParams, expected) =>
    t => {
      let serialization
      t.notThrow(
        () => serialization = creator.Serialization(serialParams),
        'create serialization')
      t.notThrow(
        () => serialization.storeMethod(methodName, data),
        'store method')
      const { offset, maxLength, intView } = serialization.writer
      t.equal(offset, expected.offset, 'offset')
      t.equal(maxLength, expected.maxLength, 'maxLength')
      t.same(intView, expected.intView, 'intView')

      t.end()
    }

test('Serialization test', t => {
  t.test('req_pq', serializationTester(
    'req_pq',
    req_pq,
    { mtproto: true },
    req_pqBinary
  ))

  t.test('req_DH_params', serializationTester(
    'req_DH_params',
    req_DH_params,
    { mtproto: true },
    req_DH_paramsBinary
  ))

  // t.test('getNearestDc', serializationTester(
  //   'help.getNearestDc',
  //   {}, { mtproto: false },
  //   getNearestDcBinary
  // ))

  t.test('getHistory', serializationTester(
    'messages.getHistory',
    getHistory, {},
    getHistoryBinary
  ))

  t.end()
}).then(delayExit)
