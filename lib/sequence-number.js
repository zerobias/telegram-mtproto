'use strict'
/**
 * Represents the sequence number generator
 *
 * @class SequenceNumber
 */
class SequenceNumber {
  /**
   * Requires the fingerprint, the modulus and the exponent
   *
   *
   * @memberOf SequenceNumber
   */
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
