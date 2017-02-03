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
var message = require('../message');
var logger = require('get-log')('net.RpcChannel');


// The constructor require a [Http|Tcp]Connection, the connection must be already open.
function RpcChannel(connection) {
    if (!connection) {
        var msg = 'The connection is mandatory!';
        logger.error(msg);
        throw new TypeError(msg);
    }
    this._connection = connection;
    this._open = true;
    this._queue = [];
    var self = this;
    setInterval(function () {
        executor.call(self);
    }, 100);
}

function executor() {
    var queue = this._queue;
    if (queue.length > 0) {
        var task = queue.splice(0, 1)[0];
        try {
            this._executeCall(task.reqMsg, task.callback);
        } catch (err) {
            console.log(err.stack);
        }
    }
}

// Execute remotely the given method (Type function) using the channel, call back with the response
RpcChannel.prototype.callMethod = function (method, callback) {
    if (!this._open) {
        callback(new Error('Channel is closed'));
        return;
    }
    var reqMsg = new message.PlainMessage({message: method});
    this._call(reqMsg, callback);
};


// Add the call task to the queue.
RpcChannel.prototype._call = function (reqMsg, callback) {
    var task = {
        reqMsg: reqMsg,
        callback: callback
    };
    var queue = this._queue;
    queue.push(task);
};

// Execute the call (protected).
RpcChannel.prototype._executeCall = function (reqMsg, callback) {
    var conn = this._connection;
    var start = new Date().getTime();
    var self = this;
    conn.write(reqMsg.serialize(), function (ex) {
        if (ex) {
            logger.error('Unable to write: %s ', ex);
            if (callback) {
                callback(ex);
            }
            return;
        }
        conn.read(function (ex2, response) {
            if (ex2) {
                logger.error('Unable to read: %s ', ex2);
                if (callback) {
                    callback(ex2);
                }
                return;
            }
            try {
                if (logger.isDebugEnabled()) {
                    logger.debug('response(%s): %s ', response.length, response.toString('hex'));
                }
                var resObj = self._deserializeResponse(response);
                var duration = new Date().getTime() - start;
                if (logger.isDebugEnabled()) {
                    logger.debug('%s executed in %sms',
                        (reqMsg.body ? reqMsg.body.getTypeName() : ''), duration);
                }
                if (callback) {
                    callback(null, resObj, duration);
                }
            } catch (ex3) {
                logger.error('Unable to deserialize response %s from %s due to %s ',
                    response.toString('hex'), (reqMsg.body ? reqMsg.body.getTypeName() : ''), ex3.stack);
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
RpcChannel.prototype.isOpen = function () {
    return this._open;
};

// Close the channel
RpcChannel.prototype.close = function () {
    this._open = false;
};

// Export the class
module.exports = exports = RpcChannel;
