//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     PlainMessage class
//
// This class provide a plain-text message for data transmission in some limited cases
// (ex. may be used to create an authorization key)

// Import dependencies
require('requirish')._(module);
var util = require('util');
var utility = require('lib/utility');
var tl = require('telegram-tl-node');
var logger = require('get-log')('mtproto.PlainMessage');

// To get an instance for `serialization`:
//
//     new PlainMessage({message: myMessageBuffer});
// Provide the payload as `Buffer`:
//
// To get an instance for `de-serialization`:
//
//     new PlainMessage({buffer: myBuffer});
// Provide a `buffer` containing the plain message from which extract the payload
function PlainMessage (options) {
    var opts = options ? options : {};
    AbstractPlainMessage.call(this, options);
    if (opts.message) {
        this.body = Buffer.isBuffer(opts.message) ? opts.message : new Buffer(opts.message, 'hex');
        this.auth_key_id = 0;
        this.msg_id = utility.createMessageId();
        this.bytes = opts.message.length;
    }
}

var AbstractPlainMessage = new tl.TypeBuilder('message', {
    "predicate": "AbstractPlainMessage",
    "params": [
        {
            "name": "auth_key_id",
            "type": "long"
        },
        {
            "name": "msg_id",
            "type": "long"
        },
        {
            "name": "bytes",
            "type": "int"
        },
        {
            "name": "body",
            "type": "Object"
        }
    ],
    "type": "AbstractPlainMessage"
}).getType();

util.inherits(PlainMessage, AbstractPlainMessage);
PlainMessage.super_ = AbstractPlainMessage.super_;

PlainMessage.util = AbstractPlainMessage.util;
PlainMessage.requireTypeByName = AbstractPlainMessage.requireTypeByName;
PlainMessage.logger = AbstractPlainMessage.logger;


// Export the class
module.exports = exports = PlainMessage;