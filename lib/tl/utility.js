'use strict'
require('colors')
const BigInteger = require('jsbn')
const util = require('util')

// Return a printable state of the object
function toPrintable(exclude, noColor) {
  let str = `{ ${   this._typeName ? `T:${  this._typeName.bold}` : ''}`
  if (typeof exclude !== 'object') {
    noColor = exclude
    exclude = {}
  }
  for (const prop in this) {
    if ('_' !== prop.charAt(0) && exclude[prop] !== true) {
      const pair = value2String(prop, this[prop], exclude[prop], noColor)
      if (pair.value !== undefined) {
        str = str.slice(-1) === ' ' ? str : `${str  }, `
        str += `${noColor ? pair.prop : pair.prop.bold.cyan  }: ${  pair.value}`
      }
    }
  }
  str += ' }'
  return str
}
function value2String(prop, value, exclude, noColor) {
  switch (typeof value) {
    case 'boolean':
      break
    case 'number':
      break
    case 'function':
      value = undefined
      break
    case 'string':
      value = `"${  value  }"`
      break
    default :
      if (util.isArray(value)) {
        const array = value
        value = ''
        for (let i = 0; i < array.length; i++) {
          value = value.length === 0 ? '[' : `${value  }, `
          value += value2String(null, array[i], null, noColor).value
        }
        value += ']'
      } else if (value instanceof Buffer) {
        if (prop) {
          prop += `[${  value.length  }]`
        }
        value = `0x${  value.toString('hex')}`
      } else if (typeof value === 'object' && typeof value.toPrintable === 'function') {
        value = value.toPrintable(exclude || {}, noColor)
      }
  }
  return { prop: prop, value: value }
}

// Convert a string value to buffer
function stringValue2Buffer(stringValue, byteLength) {
  if ((stringValue).slice(0, 2) === '0x') {
    const input = stringValue.slice(2)
    const length = input.length
    const buffers = []
    let j = 0
    for (let i = length; i > 0 && j < byteLength; i -= 2) {
      buffers.push(new Buffer(input.slice(i - 2, i), 'hex'))
      j++
    }
    let buffer = Buffer.concat(buffers)
    const paddingLength = byteLength - buffer.length
    if (paddingLength > 0) {
      const padding = new Buffer(paddingLength)
      padding.fill(0)
      buffer = Buffer.concat([buffer, padding])
    }
    return buffer
  }
  else {
    return bigInt2Buffer(new BigInteger(stringValue), byteLength)
  }
}
function bigInt2Buffer(bigInt, byteLength) {
  const byteArray = bigInt.toByteArray()
  const bArrayLength = byteArray.length
  const buffer = new Buffer(byteLength)
  buffer.fill(0)
  const length = Math.min(bArrayLength, byteLength)
  for (let i = 0; i < length; i++) {
    const value = byteArray[bArrayLength - 1 - i]
    buffer[i] = value
  }
  return buffer
}

// Convert a buffer value to string
function buffer2StringValue(buffer) {
  const length = buffer.length
  let output = '0x'
  for (let i = length; i > 0; i--) {
    output += buffer.slice(i - 1, i).toString('hex')
  }
  return output
}

function capitalize(str) {
  return (str.charAt(0).toUpperCase() + str.slice(1))
}

module.exports = {
  stringValue2Buffer,
  buffer2StringValue,
  toPrintable,
  capitalize
}