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
var logger = require('get-log')('net.EncryptedRpcChannel');

// EncryptedRpcChannel extends RpcChannel
require('util').inherits(EncryptedRpcChannel, RpcChannel);

// The constructor require a [Http|Tcp]Connection, the connection must be already open.
function EncryptedRpcChannel(connection, authKey, sessionId, serverSalt) {
    this.constructor.super_.call(this, connection);
    this._authKey = authKey;
    this._sessionId = sessionId;
    this._serverSalt = serverSalt;
}

// Execute remotely the given method (Type function) using the channel, call back with the response
EncryptedRpcChannel.prototype.callMethod = function(method, sequenceNumber, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    var reqMsg = new message.EncryptedMessage({
        message: method.serialize(),
        authKey: this._authKey,
        sessionId: this._sessionId,
        serverSalt: this._serverSalt,
        sequenceNumber: sequenceNumber
    });
    this._call(reqMsg, method.typeName, callback);
};

EncryptedRpcChannel.prototype._deserializeResponse = function (response) {
    return new message.EncryptedMessage({buffer: response, authKey: this._authKey}).deserialize().body;
};

// Export the class
module.exports = exports = EncryptedRpcChannel;