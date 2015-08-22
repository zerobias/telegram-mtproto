//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     MessageParser class
//
// This class provide a parser for the messages from Telegram

// Import dependencies
require('requirish')._(module);
var logger = require('get-log')('message.MessageParser');

// The constructor
function MessageParser() {
}

// Extend `events.EventEmitter` class
require('util').inherits(MessageParser, require('events').EventEmitter);

MessageParser.prototype.parse = function (message, duration) {
    if(!message || !message.getTypeName) {
        logger.error('Message undefined or unknown', message);
        return;
    }
    switch (message.getTypeName()) {
        case 'mtproto.type.Msg_container':
            var msgs = message.messages.list;
            if (logger.isDebugEnabled()) {
                logger.debug('MessageContainer found with [%s] messages', msgs.length)
            }
            for (var i = 0; i < msgs.length; i++) {
                this.parse(msgs[i], duration);
            }
            break;
        case 'mtproto.type.Message':
            if (logger.isDebugEnabled()) {
                logger.debug('Message found with id [%s]', message.msg_id)
            }
            var body = message.body;
            body._messageId = message.msg_id;
            this.parse(body, duration);
            break;
        case 'mtproto.type.Msgs_ack':
            if (logger.isDebugEnabled()) {
                logger.debug('Msgs-Acknowledgement for %s ids', message.msg_ids.list)
            }
            this.emit(message.getTypeName(), message.msg_ids.list);
            break;
        default :
            if (logger.isDebugEnabled()) {
                logger.debug('%s found', message.getTypeName(), duration);
            }
            this.emit(message.getTypeName(), message, duration);
    }
};

// Export the class
module.exports = exports = MessageParser;
