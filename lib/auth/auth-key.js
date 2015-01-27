//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     AuthKey class
//
// This class represents the Authentication Key

require('requirish')._(module);
var utility = require('lib/utility');

function AuthKey(id, value) {
    this.id = id;
    this.value = value;
}

AuthKey.prototype.toString = function() {
    return '{ id:' + this.id.toString('hex') +
        ', value:' + this.value.toString('hex') +
        ' }';
};

AuthKey.prototype.derivateAesKey = function(msgKey, fromServer) {
    var aKey = this.value;
    var x = fromServer ? 8 : 0;
    var sha1A = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x, x + 32)], 48));
    var sha1B = utility.createSHAHash(Buffer.concat([aKey.slice(x + 32, x + 48), msgKey, aKey.slice(x + 48, x + 64)], 48));
    var sha1C = utility.createSHAHash(Buffer.concat([aKey.slice(x + 64, x + 96), msgKey], 48));
    var sha1D = utility.createSHAHash(Buffer.concat([msgKey, aKey.slice(x + 96, x + 128)], 48));

    return {
        key: Buffer.concat([sha1A.slice(0, 8), sha1B.slice(8, 20), sha1C.slice(4, 16)], 32),
        iv: Buffer.concat([sha1A.slice(8, 20), sha1B.slice(0, 8), sha1C.slice(16, 20), sha1D.slice(0, 8)], 32)
    }
};
// Export the class
module.exports = exports = AuthKey;