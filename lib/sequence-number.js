//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     Sequence class
//
// This class represents the sequence number generator

// The constructor requires the fingerprint, the modulus and the exponent

class SequenceNumber {
  constructor() {
    this.value = 0
  }
  generate(isContentRelated) {
    let newValue = this.value * 2
    if (isContentRelated) {
      this.value++
      newValue++
    }
    return newValue
  }
}

module.exports = exports = SequenceNumber
