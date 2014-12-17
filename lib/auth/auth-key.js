//     telegram.link
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     AuthKey class
//
// This class represents the Authentication Key

function AuthKey(id, value, serverSalt) {
    this.id = id;
    this.value = value;
    this.serverSalt = serverSalt;
}

AuthKey.prototype.toString = function () {
    return '{ id:' + this.id.toString('hex') +
        ', value:' + this.value.toString('hex') +
        ', serverSalt:' + this.serverSalt.toString('hex') +
        ' }';
};

// Export the class
module.exports = exports = AuthKey;