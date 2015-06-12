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
// - connection (required): the [Http|Tcp]Connection .
// - context (required):
// { authKey, serverSalt, sessionId, sequenceNumber, apiVersion }
// - app (required), the application data required for execute the first API call to Telegram:
// { id, version, langCode, deviceModel, systemVersion }

function EncryptedRpcChannel(connection, context, app) {
    this.constructor.super_.call(this, connection);
    this._app = {
        api_id: app.id,
        app_version: app.version,
        device_model: app.deviceModel || 'Unknown Device',
        system_version: app.systemVersion || 'Unknown System',
        lang_code: app.langCode || 'en'
    };
    this._initialized = false;
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

EncryptedRpcChannel.prototype._onRpcResult = function (rpcResult, duration) {
    var callback = this._callbackMap[rpcResult.req_msg_id];
    if (callback) {
        this._callbackMap[rpcResult.req_msg_id] = null;
        // add the acknowledgment..
        this._messageIdsToBeAck.push(rpcResult._messageId);
        this.sendMessagesAck();
        // callback when the ack has been sent
        setTimeout( function() {
            callback(null, rpcResult.result, duration);
        }, 100);
    }
};

EncryptedRpcChannel.prototype._onNewSessionCreated = function (newSession) {
    this._context.serverSalt = newSession.server_salt;
    logger.info("New session has been created by Telegram: %s", newSession.toPrintable());
    // send the acknowledgment..
    this._messageIdsToBeAck.push(newSession._messageId);
    // ..now!
    this.sendMessagesAck();
};

EncryptedRpcChannel.prototype._onMsgsAck = function (msgIds) {
    logger.info("The server sent a acknowledge for the followings [%s]", msgIds);
    for (var i = 0; i < msgIds.length; i++) {
        removeFromMap(msgIds[i], this.waiting4Response);
    }
};

function removeFromMap(item, map) {
    if (map && map[item]) {
        map[item] = null;
        delete map[item];
    }
}

// Send the message acknowledgement for each collected messageId
EncryptedRpcChannel.prototype.sendMessagesAck = function () {
    var msgsAck = createMessagesAck.call(this);
    if (msgsAck) {
        logger.info("Send the ack to the server: %s", msgsAck.toPrintable());
        this.callMethod(msgsAck);
    }
};

function createMessagesAck() {
    if (this._messageIdsToBeAck.length > 0) {
        var msgsAck = new mtproto.type.Msgs_ack({
            props: {
                msg_ids: new tl.TypeVector({type: 'long', list: this._messageIdsToBeAck})
            }
        });
        this._messageIdsToBeAck = [];
        return msgsAck;
    }
}

// Execute remotely the given Type function
EncryptedRpcChannel.prototype.callMethod = function (method, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    var msg;
    if (!this._initialized) {
        var initData = require('util')._extend({query: method.serialize()}, this._app);
        method = new mtproto.service.invokeWithLayer.Type({
            props: {
                layer: this._context.apiVersion || 23,
                query: new mtproto.service.initConnection.Type({
                    props: initData
                }).serialize()
            }
        });
        this._initialized = true;
        msg = method;
    } else {
        msg = method;
    }

    var reqMsg = new message.EncryptedMessage({
        message: msg,
        authKey: this._context.authKey,
        serverSalt: this._context.serverSalt,
        sessionId: this._context.sessionId,
        sequenceNumber: this._context.sequenceNumber
    });
    if (callback) {
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
            if (ex) {
                logger.error(ex.stack);
                if (callback) {
                    callback(ex);
                    return;
                }
            }
            logger.info('Call of \'%s\' took %sms', reqMsg.body.typeName, duration);
            self._parser.parse(result, duration);
        });
    } catch (err) {
        logger.error(err.stack);
        if (callback) {
            callback(err);
        }
    }
};
EncryptedRpcChannel.prototype._deserializeResponse = function (response) {
    var resObj = new message.EncryptedMessage({buffer: response, authKey: this._context.authKey}).deserialize();
    var result = resObj.body;
    result._messageId = resObj.messageId;
    return result;
};

// Export the class
module.exports = exports = EncryptedRpcChannel;