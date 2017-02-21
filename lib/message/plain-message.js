'use strict'
//     PlainMessage class
//
// This class provide a plain-text message for data transmission in some limited cases
// (ex. may be used to create an authorization key)

const utility = require('../utility')
const tl = require('../tl')

// To get an instance for `serialization`:
//
//     new PlainMessage({message: myMessageBuffer});
// Provide the payload as `Buffer`:
//
// To get an instance for `de-serialization`:
//
//     new PlainMessage({buffer: myBuffer});
// Provide a `buffer` containing the plain message from which extract the payload

function PlainMessage(options) {
  const opts = options ? options : {}
  this.constructor.s_.call(this, options)
  if (opts.message) {
    this.body = opts.message
    this.auth_key_id = 0
    this.msg_id = utility.createMessageId()
    this.bytes = opts.message.length
  }
}

// Extend the TL-schema
tl.TypeBuilder.inheritsTlSchema(PlainMessage, {
  'predicate': 'AbstractPlainMessage',
  'params'   : [{
    'name': 'auth_key_id',
    'type': 'long'
  }, {
    'name': 'msg_id',
    'type': 'long'
  }, {
    'name': 'bytes',
    'type': 'int'
  }, {
    'name': 'body',
    'type': 'Object'
  }],
  'type': 'AbstractPlainMessage'
})

module.exports = exports = PlainMessage
