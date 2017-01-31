'use strict'
//     TypeVector class
//
// This class is the `TypeLanguage` List implementation, a sub-class of the `TypeObject` class

const util = require('util')
const TypeObject = require('./type-object')
const tl = require('./builder/type-builder')

class TypeVector extends TypeObject {
  constructor(options) {
    const opts = util._extend({ type: 'int' }, options)
    super(opts.buffer, opts.offset)
    this._typeId = TypeVector.id
    this._typeName = TypeVector.typeName
    this.module = opts.module
    this.manageType(opts.type)
    this.list = !opts.list ? [] : opts.list
    this._byId = {}
    TypeVector.logger.debug('Vector init: module = %s , type = %s, list = %s', opts.module, opts.type, this.list)
  }
  manageType(type) {
    const isBare = type.charAt(0) === '%'
    type = isBare ? type.slice(1) : type
    if (type.charAt(0) === type.charAt(0).toUpperCase()) {
            // Manage Object type
      this.type = type
      this[`write${  type}`] = function(obj) {
        this._writeBytes(obj.serialize({ isBare: isBare }))
      }
      const BareType = isBare ? tl.requireTypeByName(`${this.module  }.${  type}`) : null
      this[`read${  type}`] = function() {
        const Type = BareType ? BareType : tl.requireTypeFromBuffer(this._buffer.slice(this.getReadOffset()))
        const obj = new Type({ buffer: this._buffer, offset: this.getReadOffset() })
        const buffer = obj.deserialize({ isBare: isBare })
        this._readOffset += obj.getReadOffset()
        TypeVector.logger.debug('read \'%s\' = %s , offset = %s', type, obj.toPrintable(), this.getReadOffset())
        return buffer
      }
    } else
      // Manage primitive type
      this.type = type.charAt(0).toUpperCase() + type.slice(1)
  }
  // De-serialize the list starting from the initialized buffer
  deserialize(options) {
    if (!super.deserialize.call(this, options)) {
      return false
    }
    const listLength = this.readInt()
    TypeVector.logger.debug('read \'%s\' = %s , offset = %s', 'length', listLength, this.getReadOffset())
    for (let i = 0; i < listLength; i++) {
      TypeVector.logger.debug('call read%s', this.type)
      const value = this[`read${  this.type}`]()
      this.list[i] = value
      if (value.id)
        this._byId[`${  value.id}`] = value
    }
    return this
  }

  // Serialize the list starting from the initialized buffer
  serialize(options) {
    if (!super.serialize.call(this, options)) {
      return this.retrieveBuffer()
    }
    const listLength = this.list.length
    this.writeInt(listLength)
    TypeVector.logger.debug('write \'%s\' = %s', 'length', listLength)
    this.list.forEach((item, i) => {
      this[`write${  this.type}`](item)
      TypeVector.logger.debug('write%s[%s] = %s', this.type, i, item)
    })
    return this.retrieveBuffer()
  }

  // Retrieve a copy of the internal list
  getList() {
    return this.list.slice()
  }

  // Retrieve an element by id if any
  getById(id) {
    return this._byId[id]
  }
}

// To get an instance for `serialization`:
//
//      new TypeVector({type: 'long', list: [1,2,3]});
// Provide the `list` property to fill the vector and the type of the content, `int` is the default:
//
// To get an instance for `de-serialization`:
//
//      new TypeVector({type: 'int128', buffer: myBuffer, offset: currentPosition});
// Provide a `buffer` and eventually an `offset` where start
//
// The `constructor`:


TypeVector.id = '15c4b51c'
TypeVector.typeName = 'Vector'
TypeVector.logger = require('../logger')(TypeVector.typeName)
tl.registerTypeById(TypeVector)
tl.registerTypeByName(TypeVector)

// Export the class
module.exports = exports = TypeVector
