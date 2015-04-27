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
var utility = require('lib/utility');
var tl = require('telegram-tl-node');
var logger = require('get-log')('message.PlainMessage');

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
    var opts = options ? options : {};
    this.constructor.s_.call(this, options);
    if (opts.message) {
        this.body = opts.message;
        this.auth_key_id = 0;
        this.msg_id = utility.createMessageId();
        this.bytes = opts.message.length;
    }
}

// Extend the TL-schema
tl.TypeBuilder.inheritsTlSchema(PlainMessage, {
    "predicate": "AbstractPlainMessage",
    "params": [{
        "name": "auth_key_id",
        "type": "long"
    }, {
        "name": "msg_id",
        "type": "long"
    }, {
        "name": "bytes",
        "type": "int"
    }, {
        "name": "body",
        "type": "Object"
    }],
    "type": "AbstractPlainMessage"
});

// Export the class
module.exports = exports = PlainMessage;
