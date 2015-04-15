//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     Sequence class
//
// This class represents the sequence number generator

// The constructor requires the fingerprint, the modulus and the exponent
function SequenceNumber() {
    this._value = 0;
}

SequenceNumber.prototype.generate = function (isContentRelated) {
    var newValue = this._value * 2;
    if (isContentRelated) {
        this._value++;
        newValue++;
    }
    return newValue;
};

// Export the class
module.exports = exports = SequenceNumber;
