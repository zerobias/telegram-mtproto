//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     MTProto module
//
// This module provide the `MTProto classes & method` as defined by the Telegram specification. The MTProto
// is the standard protocol to communicate with the Telegram data-center.

// Export the sub-modules
exports.auth = require('./auth');
exports.message = require('./message');
exports.net = require('./net');
exports.security = require('./security');
exports.utility = require('./utility');
exports.time = require('./time');
exports.SequenceNumber = require('./sequence-number');

// Import dependencies
var tl = require('telegram-tl-node');
//var PlainMessage = require('./message').PlainMessage;

// MtProto TL schema as provided by Telegram
var mtTlSchema = require('./mt-tlschema.json');

// API TL schema as provided by Telegram, but only the Type functions needed at the protocol level
var mtApiTlSchema = require('./mt-api-tlschema.json');

// Declare the `type` module
var type = {_id: 'mtproto.type'};
// Build all the constructors
tl.TypeBuilder.buildTypes(mtTlSchema.constructors, null, type);
// Export the 'type' module
exports.type = type;

// Declare the `service` module
var service = {_id: 'mtproto.service'};
// Build all the methods
tl.TypeBuilder.buildTypes(mtTlSchema.methods, null, service, true);
tl.TypeBuilder.buildTypes(mtApiTlSchema.methods, null, service, true);
// Export the 'service' module
exports.service = service;
