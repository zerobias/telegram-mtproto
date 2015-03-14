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
// - [Http|Tcp]Connection, the connection must be already open.
// - all the client data required for execute the first API call to Telegram (Optional):
// { apiVersion, appId, appVersion, deviceModel, systemVersion, langCode }

function EncryptedRpcChannel(connection, clientData) {
    this.constructor.super_.call(this, connection);
    this._initClientData = clientData;
}

// Execute remotely the given method (Type function) using the following context params:
// { authKey, serverSalt, sessionId, sequenceNumber }
EncryptedRpcChannel.prototype.callMethod = function(method, context, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    var methodBytes;
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
        authKey: context.authKey,
        serverSalt: context.serverSalt,
        sessionId: context.sessionId,
        sequenceNumber: context.sequenceNumber
    });
    context.methodName = method.typeName;
    this._call(reqMsg, context, callback);
};

EncryptedRpcChannel.prototype._deserializeResponse = function(response, context) {
    return new message.EncryptedMessage({buffer: response, authKey: context.authKey}).deserialize().body;
};

// Export the class
module.exports = exports = EncryptedRpcChannel;