//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     AuthKey class
//
// This class represents the Authentication Key

require('requirish')._(module);
var utility = require('lib/utility');
var security = require('lib/security');
var tl = require('telegram-tl-node');

function AuthKey(id, value) {
    this.id = id;
    this.value = value;
}

AuthKey.prototype.toString = function () {
    return tl.utility.toPrintable.apply(this, Array.prototype.slice.call(arguments));
};

AuthKey.prototype.derivateAesKey = function (msgKey, fromServer) {
    var aKey = this.value;
    var x = fromServer ? 8 : 0;
    var sha1A = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x, x + 32)], 48));
    var sha1B = utility.createSHAHash(Buffer.concat([aKey.slice(x + 32, x + 48), msgKey, aKey.slice(x + 48, x + 64)], 48));
    var sha1C = utility.createSHAHash(Buffer.concat([aKey.slice(x + 64, x + 96), msgKey], 48));
    var sha1D = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x + 96, x + 128)], 48));
    return {
        key: Buffer.concat([sha1A.slice(0, 8), sha1B.slice(8, 20), sha1C.slice(4, 16)], 32),
        iv: Buffer.concat([sha1A.slice(8, 20), sha1B.slice(0, 8), sha1C.slice(16, 20), sha1D.slice(0, 8)], 32),
        toPrintable: tl.utility.toPrintable
    };
};

AuthKey.prototype.encrypt = function (password) {
   return AuthKey.encryptAuthKey(this, password);
};

// Encrypt authKey with the given password
AuthKey.encryptAuthKey = function (authKey, password) {
    var plainKey = Buffer.concat([authKey.id, authKey.value]);
    var passwordHash = utility.createSHAHash(new Buffer(password), 'sha512');
    var aesKey = passwordHash.slice(0, 32);
    var aesIv = passwordHash.slice(32, 64);
    return security.cipher.aesEncrypt(plainKey, aesKey, aesIv).slice(0);
};

// Decrypt authKey with the given password
AuthKey.decryptAuthKey = function (buffer, password) {
    var passwordHash = utility.createSHAHash(new Buffer(password), 'sha512');
    var aesKey = passwordHash.slice(0, 32);
    var aesIv = passwordHash.slice(32, 64);
    var decrypted = security.cipher.aesDecrypt(buffer, aesKey, aesIv);
    var id = decrypted.slice(0, 8);
    var value = decrypted.slice(8, 264);
    var hash = utility.createSHAHash(value);
    return (hash.slice(-8).toString('hex') == id.toString('hex')) ? new AuthKey(id, value) : null;
};

// Export the class
module.exports = exports = AuthKey;
