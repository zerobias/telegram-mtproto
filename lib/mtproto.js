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

// Import dependencies
var TypeBuilder = require('telegram-tl-node').TypeBuilder;
//var PlainMessage = require('./message').PlainMessage;

// MtProto TL schema as provided by Telegram
var mtTlSchema = require('./mt-tlschema.json');

// API TL schema as provided by Telegram, but only the Type functions needed at the protocol level
var mtApiTlSchema = require('./mt-api-tlschema.json');

// Declare the `type` module
var type = {_id: 'mtproto.type'};
// List the `mtproto` constructors
var constructors = ['ResPQ', 'P_Q_inner_data', 'Server_DH_Params', 'Server_DH_inner_data', 'Client_DH_Inner_Data',
    'Set_client_DH_params_answer', 'Message'];
// Build the `type` list
TypeBuilder.buildTypes(mtTlSchema.constructors, constructors, type);
// Export the 'type' module
exports.type = type;

// Declare the `service` module
var service = {_id: 'mtproto.service'};
// List the `mtproto' methods
var methods = ['req_pq', 'req_DH_params', 'set_client_DH_params', 'initConnection', 'invokeWithLayer'];
// Build registered methods
//TypeBuilder.buildTypes(api.methods, methods, service, PlainMessage);
TypeBuilder.buildTypes(mtTlSchema.methods, methods, service, true);
TypeBuilder.buildTypes(mtApiTlSchema.methods, methods, service, true);
// Export the 'service' module
exports.service = service;
