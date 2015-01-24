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

// Export the class
module.exports = exports = AuthKey;