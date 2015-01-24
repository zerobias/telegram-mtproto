//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export the classes
exports.AuthKey = require('./auth-key');
exports.RequestPQ = require('./request-pq');
exports.RequestDHParams = require('./request-dh-params');
exports.SetClientDHParams = require('./set-client-dh-params');
exports.createAuthKey = createAuthKey;
exports.encryptAuthKey = encryptAuthKey;
exports.decryptAuthKey = decryptAuthKey;

// Import dependencies
require('requirish')._(module);
var flow = require('get-flow');
var utility = require('lib/utility');
var security = require('lib/security');
var AuthKey = exports.AuthKey;

// Create the authorization key
function createAuthKey(callback, connection) {

    flow.retryUntilIsDone(callback, null,
        function (callback) {
            flow.runSeries([
                require('./request-pq'),
                require('./request-dh-params'),
                require('./set-client-dh-params')
            ], callback, connection);
        });
}

// Encrypt authKey with the given password
function encryptAuthKey(authKey, password) {
    var plainKey = Buffer.concat([authKey.id, authKey.value]);
    var passwordHash = utility.createSHAHash(new Buffer(password), 'sha512');
    var aesKey = passwordHash.slice(0, 32);
    var aesIv = passwordHash.slice(32, 64);
    return security.cipher.aesEncrypt(plainKey, aesKey, aesIv).slice(0);
}

// Decrypt authKey with the given password
function decryptAuthKey(buffer, password) {
    var passwordHash = utility.createSHAHash(new Buffer(password), 'sha512');
    var aesKey = passwordHash.slice(0, 32);
    var aesIv = passwordHash.slice(32, 64);
    var decrypted = security.cipher.aesDecrypt(buffer, aesKey, aesIv);
    return new AuthKey(decrypted.slice(0, 8), decrypted.slice(8, 264));
}