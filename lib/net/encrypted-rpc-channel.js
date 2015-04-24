//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     EncryptedRpcChannel class
//
// This class provides an encrypted remote procedure call channel to `Telegram` through the given TCP|HTTP connection.
// This channel in  encrypted and therefore use EncryptedMessage objects to wrap the communication.

// Import dependencies
require('requirish')._(module);
var RpcChannel = require('lib/net').RpcChannel;
var message = require('lib/message');
var mtproto = require('lib/mtproto');
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
    this._parser = new message.MessageParser();
}

// Execute remotely the given method (Type function)
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

    this._callbackMap[reqMsg.messageId] = callback;
    if (logger.isDebugEnabled()) {
        logger.debug('Register callback, %s: %s', reqMsg.messageId, callback);
    }
    var self = this;
    try {
        this._call(reqMsg, function (ex, result, duration) {
            self._parser.parse(result);
            callback(ex, result, duration);
        });
    } catch (err) {
        logger.error(err.stack);
        callback(err);
    }
};

EncryptedRpcChannel.prototype._deserializeResponse = function (response) {
    return new message.EncryptedMessage({buffer: response, authKey: this._context.authKey}).deserialize().body;
};

// Export the class
module.exports = exports = EncryptedRpcChannel;