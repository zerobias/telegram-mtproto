//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     RpcChannel class
//
// This class provides a remote procedure call channel to `Telegram` through the given TCP|HTTP connection.
// This channel in not encrypted and therefore use PlainMessage objects to wrap the communication.
// According with the MTProto specification, only few methods can use unencrypted message, see:
// https://core.telegram.org/mtproto/description#unencrypted-messages

// Import dependencies
require('requirish')._(module);
var message = require('lib/message');
var TypeBuilder = require('telegram-tl-node').TypeBuilder;
var logger = require('get-log')('net.RpcChannel');

// The constructor require a [Http|Tcp]Connection, the connection must be already open.
function RpcChannel(connection) {
    if (!connection || !connection.isConnected()) {
        var msg = 'The connection is mandatory and it must be already open!';
        logger.error(msg);
        throw new TypeError(msg);
    }
    this._connection = connection;
    this._open = true;
}

// Execute remotely the given method (Type function) using the channel, call back with the response
RpcChannel.prototype.callMethod = function(method, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    var reqMsg = new message.PlainMessage({message: method.serialize()});
    this._call(reqMsg, method.typeName, callback);
};

// Execute the call (protected).
RpcChannel.prototype._call = function(reqMsg, methodName, callback) {
    var conn = this._connection;
    var start = new Date().getTime();
    var self = this;
    conn.write(reqMsg.serialize(), function(ex) {
        if (ex) {
            logger.error('Unable to write: %s ', ex);
            if (callback) {
                callback(ex);
            }
            return;
        }
        conn.read(function(ex2, response) {
            if (ex2) {
                logger.error('Unable to read: %s ', ex2);
                if (callback) {
                    callback(ex2);
                }
                return;
            }
            try {
                var resMsg = self._deserializeResponse(response);
                var Type = TypeBuilder.requireTypeFromBuffer(resMsg);
                var resObj = new Type({buffer: resMsg});
                resObj.deserialize();
                var duration = new Date().getTime() - start;
                if (logger.isDebugEnabled()) {
                    logger.debug('%s executed in %sms', methodName, duration);
                }
                if (callback) {
                    callback(null, resObj, duration);
                }
            } catch (ex3) {
                logger.error('Unable to deserialize response from %s due to %s ', methodName, ex3);
                if (callback) {
                    callback(ex3);
                }
            }
        });
    });
};

RpcChannel.prototype._deserializeResponse = function (response) {
    return new message.PlainMessage({buffer: response}).deserialize().body;
};

// Check if the channel is open.
RpcChannel.prototype.isOpen = function() {
    return this._open;
};

// Close the channel
RpcChannel.prototype.close = function() {
    this._open = false;
};

// Export the class
module.exports = exports = RpcChannel;