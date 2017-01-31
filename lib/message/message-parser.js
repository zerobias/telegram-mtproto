'use strict'
const logger = require('../logger')('message.MessageParser')
const EventEmitter = require('events').EventEmitter

/**
 * Provide a parser for the messages from Telegram
 *
 * @class MessageParser
 * @extends {EventEmitter}
 */
class MessageParser extends EventEmitter {
  parse(message, duration) {
    if (!message || !message.getTypeName) {
      logger.error('Message undefined or unknown', message)
      return
    }
    switch (message.getTypeName()) {
      case 'mtproto.type.Msg_container':{
        const msgs = message.messages.list
        logger.debug('MessageContainer found with [%s] messages', msgs.length)
        msgs.forEach(msg => this.parse(msg, duration))
        break
      }
      case 'mtproto.type.Message':{
        logger.debug('Message found with id [%s]', message.msg_id)
        const body = message.body
        body._messageId = message.msg_id
        this.parse(body, duration)
        break
      }
      case 'mtproto.type.Msgs_ack':{
        logger.debug('Msgs-Acknowledgement for %s ids', message.msg_ids.list)
        this.emit(message.getTypeName(), message.msg_ids.list)
        break
      }
      default :
        logger.debug('%s found', message.getTypeName(), duration)
        this.emit(message.getTypeName(), message, duration)
    }
  }
}


module.exports = exports = MessageParser
