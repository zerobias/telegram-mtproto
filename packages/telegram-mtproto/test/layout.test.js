const { test } = require('tap')
const { getFlags, Layout } = require('../lib/layout')
const apiSchema = require('../schema/api-57.json')

// const { has } = require('ramda')

// const methodRaw = {
//   'id'    : '-1137057461',
//   'method': 'messages.saveDraft',
//   'params': [{
//     'name': 'flags',
//     'type': '#'
//   }, {
//     'name': 'no_webpage',
//     'type': 'flags.1?true'
//   }, {
//     'name': 'reply_to_msg_id',
//     'type': 'flags.0?int'
//   }, {
//     'name': 'peer',
//     'type': 'InputPeer'
//   }, {
//     'name': 'message',
//     'type': 'string'
//   }, {
//     'name': 'entities',
//     'type': 'flags.3?Vector<MessageEntity>'
//   }],
//   'type': 'Bool'
// }


const methodModel = {
  id      : -1137057461,
  name    : 'messages.saveDraft',
  returns : 'Bool',
  hasFlags: true,
  params  : [
    {
      name     : 'flags',
      type     : '#',
      isVector : false,
      isFlag   : false,
      flagIndex: NaN
    }, {
      name     : 'no_webpage',
      type     : 'true',
      isVector : false,
      isFlag   : true,
      flagIndex: 1
    }, {
      name     : 'reply_to_msg_id',
      type     : 'int',
      isVector : false,
      isFlag   : true,
      flagIndex: 0
    }, {
      name     : 'peer',
      type     : 'InputPeer',
      isVector : false,
      isFlag   : false,
      flagIndex: NaN
    }, {
      name     : 'message',
      type     : 'string',
      isVector : false,
      isFlag   : false,
      flagIndex: NaN
    }, {
      name     : 'entities',
      type     : 'MessageEntity',
      isVector : true,
      isFlag   : true,
      flagIndex: 3
    },
  ]
}

/*const MessageEntity = {
  name    : 'MessageEntity',
  creators: [
    'messageEntityUnknown',
    'messageEntityMention',
    'messageEntityHashtag'
  ]
}

const entityCreator1 = {
  'id'       : '-1148011883',
  'predicate': 'messageEntityUnknown',
  'params'   : [
    {
      'name': 'offset',
      'type': 'int'
    }, {
      'name': 'length',
      'type': 'int'
    }
  ],
  'type': 'MessageEntity'
}
const entityCreator2 = {
  'id'       : '-100378723',
  'predicate': 'messageEntityMention',
  'params'   : [
    {
      'name': 'offset',
      'type': 'int'
    }, {
      'name': 'length',
      'type': 'int'
    }
  ],
  'type': 'MessageEntity'
}
const entityCreator3 = {
  'id'       : '1868782349',
  'predicate': 'messageEntityHashtag',
  'params'   : [
    {
      'name': 'offset',
      'type': 'int'
    }, {
      'name': 'length',
      'type': 'int'
    }
  ],
  'type': 'MessageEntity'
}


const entityCreatorModel = {
  id      : -1148011883,
  name    : 'messageEntityUnknown',
  type    : 'MessageEntity',
  hasFlags: false,
  params  : [
    {
      name     : 'offset',
      type     : 'int',
      isVector : false,
      isFlag   : false,
      flagIndex: NaN
    }, {
      name     : 'length',
      type     : 'int',
      isVector : false,
      isFlag   : false,
      flagIndex: NaN
    },
  ]
}*/

/*const method = Layout.method('auth.sendCode')
for (const param of method.params) {

}*/
test('flags counter', t => {
  const flagTests = [
    [{}, 0],
    [{
      no_webpage: true
    }, 2],
    [{
      no_webpage     : true,
      reply_to_msg_id: 1234556
    }, 3],
    [{
      entities       : [{}],
      reply_to_msg_id: 1234556
    }, 9],
  ]


  let getter
  t.notThrow(() => getter = getFlags(methodModel), 'getFlags')
  for (const [ obj, result ] of flagTests)
    t.equal(getter(obj), result, `flags test`)
  // let layout
  t.notThrow(() => /*layout =*/ new Layout(apiSchema), 'make new layout')
  // console.log(layout)
  t.end()
})