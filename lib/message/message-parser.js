//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     MessageParser class
//
// This class provide a parser for the messages from Telegram

// Import dependencies
require('requirish')._(module);
var logger = require('get-log')('mtproto.MessageParser');

// The constructor
function MessageParser() {}

// Extend `events.EventEmitter` class
require('util').inherits(MessageParser, require('events').EventEmitter);

MessageParser.prototype.parse = function(message) {
    switch (message.typeName) {
        case 'mtproto.type.Msg_container':
            var msgs = message.messages.list;
            if(logger.isDebugEnabled()) {
                logger.debug('MessageContainer found with [%s] messages', msgs.length)
            }
            for(var i = 0; i < msgs.length; i++) {
                this.parse(msgs[i]);
            }
            break;
        case 'mtproto.type.Message':
            if(logger.isDebugEnabled()) {
                logger.debug('Message found with id [%s]', message.msg_id)
            }
            this.parse(message.body);
            break;
        case 'mtproto.type.Msgs_ack':
            if(logger.isDebugEnabled()) {
                logger.debug('Msgs-Acknowledgement request for %s ids', message.msg_ids.list)
            }
            this.emit(message.typeName, message.msg_ids.list);
            break;
        case 'mtproto.type.Rpc_result':
            if(logger.isDebugEnabled()) {
                logger.debug('Rpc-Result for request %s', message.req_msg_id)
            }
            this.emit(message.typeName, message);
            break;
        default :
            if(logger.isDebugEnabled()) {
                logger.debug('%s found', message.typeName);
            }
            this.emit(message.typeName, message);
    }
};


// Export the class
module.exports = exports = MessageParser;
