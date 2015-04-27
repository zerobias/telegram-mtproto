//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     EncryptedRpcChannel class
//
// This class provides an encrypted remote procedure call channel to `Telegram` through a TCP|HTTP connection.
// This channel is encrypted and therefore use the EncryptedMessage objects to wrap the communication.

// Import dependencies
require('requirish')._(module);
var RpcChannel = require('lib/net').RpcChannel;
var message = require('lib/message');
var mtproto = require('lib/mtproto');
var tl = require('telegram-tl-node');
var logger = require('get-log')('net.EncryptedRpcChannel');

// EncryptedRpcChannel extends RpcChannel
require('util').inherits(EncryptedRpcChannel, RpcChannel);

// The constructor require the following:
// - [Http|Tcp]Connection, the connection must be already open (Required).
// - context params (Required):
// { authKey, serverSalt, sessionId, sequenceNumber }
// - all the client data required for execute the first API call to Telegram (Optional):
// { apiVersion, appId, appVersion, deviceModel, systemVersion, langCode }

function EncryptedRpcChannel(connection, context, clientData) {
    this.constructor.super_.call(this, connection);
    this._initClientData = clientData;
    this._context = context;
    this._callbackMap = {};
    this._messageIdsToBeAck = [];
    // configure the message-parser
    this._parser = new message.MessageParser();
    this._parser.on('mtproto.type.New_session_created', this._onNewSessionCreated.bind(this));
    this._parser.on('mtproto.type.Rpc_result', this._onRpcResult.bind(this));
    this._parser.on('mtproto.type.Msgs_ack', this._onMsgsAck.bind(this));
    // the sent messages still waiting for a response (msg-ack or rpc-result)
    this.waiting4Response = {};

}

EncryptedRpcChannel.prototype._onRpcResult = function(rpcResult, duration) {
    var callback = this._callbackMap[rpcResult.req_msg_id];
    if(callback) {
        this._callbackMap[rpcResult.req_msg_id] = null;
        callback(null, rpcResult.result, duration);
    }
};

EncryptedRpcChannel.prototype._onNewSessionCreated = function(newSession) {
    this._context.serverSalt = newSession.server_salt;
    logger.info("New session has been created by Telegram: %s", newSession.toPrintable());
    // send the acknowledgment..
    this._messageIdsToBeAck.push(newSession.messageId);
    // ..now!
    this.sendMessageAck();
};

EncryptedRpcChannel.prototype._onMsgsAck = function(msgIds) {
    logger.info("The server sent a acknowledge for the followings [%s]", msgIds);
    for(var i = 0; i < msgIds.length; i++) {
        removeFromMap(msgIds[i], this.waiting4Response);
    }
};

function removeFromMap(item, map) {
    if(map && map[item]) {
        map[item] = null;
        delete map[item];
    }
}

// Send the message acknowledgement for each collected messageId
EncryptedRpcChannel.prototype.sendMessageAck = function(){
    if(this._messageIdsToBeAck.length > 0) {
        logger.info("The following message ids [%s] will be acknowledged to the server", this._messageIdsToBeAck);
        var msgAck = new mtproto.type.Msgs_ack({
            props: {
                msg_ids: new tl.TypeVector({type: 'long', list: this._messageIdsToBeAck})
            }
        });
        this._messageIdsToBeAck = [];
        this.callMethod(msgAck);
    }
};

// Execute remotely the given Type function
EncryptedRpcChannel.prototype.callMethod = function (method, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    if (this._initClientData) {
        method = new mtproto.service.invokeWithLayer.Type({
            props: {
                layer: this._initClientData.apiVersion || 23,
                query: new mtproto.service.initConnection.Type({
                    props: {
                        api_id: this._initClientData.appId,
                        device_model: this._initClientData.deviceModel || 'Unknown UserAgent',
                        system_version: this._initClientData.systemVersion || 'Unknown Platform',
                        app_version: this._initClientData.appVersion,
                        lang_code: this._initClientData.langCode || 'en',
                        query: method.serialize()
                    }
                }).serialize()
            }
        });
        this._initClientData = null;
    }
    var reqMsg = new message.EncryptedMessage({
        message: method,
        authKey: this._context.authKey,
        serverSalt: this._context.serverSalt,
        sessionId: this._context.sessionId,
        sequenceNumber: this._context.sequenceNumber
    });
    if(callback) {
        this._callbackMap[reqMsg.messageId] = callback;
        if (logger.isDebugEnabled()) {
            logger.debug('Register callback, %s: %s', reqMsg.messageId, callback);
        }
    }
    this.waiting4Response[reqMsg.messageId] = true;
    this._call(reqMsg);

};
EncryptedRpcChannel.prototype._call = function (reqMsg) {
    var self = this;
    var callback = this._callbackMap[reqMsg.messageId];
    try {
        this.constructor.super_.prototype._call.call(this, reqMsg, function (ex, result, duration) {
            logger.info('Call of \'%s\' took %sms', reqMsg.body.typeName, duration);
            self._parser.parse(result, duration);
        });
    } catch (err) {
        logger.error(err.stack);
        if(callback) {
            callback(err);
        }
    }
};
EncryptedRpcChannel.prototype._deserializeResponse = function (response) {
    return new message.EncryptedMessage({buffer: response, authKey: this._context.authKey}).deserialize().body;
};

// Export the class
module.exports = exports = EncryptedRpcChannel;