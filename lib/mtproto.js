'use strict'
//     MTProto module
//
// This module provide the `MTProto classes & method` as defined by the Telegram specification. The MTProto
// is the standard protocol to communicate with the Telegram data-center.

const tl = require('./tl')

exports.auth = require('./auth')
exports.message = require('./message')
exports.net = require('./net')
exports.security = require('./security')
exports.utility = require('./utility')
exports.time = require('./time')
exports.SequenceNumber = require('./sequence-number')

exports.tl = tl
//var PlainMessage = require('./message').PlainMessage;

// MtProto TL schema as provided by Telegram
const mtTlSchema = require('./mt-tlschema.json')

// API TL schema as provided by Telegram, but only the Type functions needed at the protocol level
const mtApiTlSchema = require('./mt-api-tlschema.json')

// Declare the `type` module
const type = { _id: 'mtproto.type' }
// Build all the constructors
tl.TypeBuilder.buildTypes(mtTlSchema.constructors, null, type)
// Export the 'type' module
exports.type = type

// Declare the `service` module
const service = { _id: 'mtproto.service' }
// Build all the methods
tl.TypeBuilder.buildTypes(mtTlSchema.methods, null, service, true)
tl.TypeBuilder.buildTypes(mtApiTlSchema.methods, null, service, true)
// Export the 'service' module
exports.service = service
