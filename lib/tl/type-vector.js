//     telegram-tl-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-tl-node

//     TypeVector class
//
// This class is the `TypeLanguage` List implementation, a sub-class of the `TypeObject` class

// Import dependencies
var util = require('util');
var utility = require('./utility');
var TypeObject = require('./type-object');
var tl = require('./builder/type-builder');

// TypeVector extends TypeObject
util.inherits(TypeVector, TypeObject);

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
function TypeVector(options) {
    var opts = util._extend({type: 'int'}, options);
    this.constructor.super_.call(this, opts.buffer, opts.offset);
    this._typeId = TypeVector.id;
    this._typeName = TypeVector.typeName;
    this.module = opts.module;
    manageType.call(this, opts.type);
    this.list = !opts.list ? [] : opts.list;
    this._byId = {};
    if (TypeVector.logger.isDebugEnabled()) {
        TypeVector.logger.debug('Vector init: module = %s , type = %s, list = %s', opts.module, opts.type, this.list);
    }
}

function manageType(type) {
    var isBare = type.charAt(0) === '%';
    type = isBare ? type.slice(1) : type;
    if (type.charAt(0) === type.charAt(0).toUpperCase()) {
        // Manage Object type
        this.type = type;
        this['write' + type] = function (obj) {
            this._writeBytes(obj.serialize({isBare: isBare}));
        };
        var BareType = isBare ? tl.requireTypeByName(this.module + '.' + type) : null;
        this['read' + type] = function () {
            var Type = BareType ? BareType : tl.requireTypeFromBuffer(this._buffer.slice(this.getReadOffset()));
            var obj = new Type({buffer: this._buffer, offset: this.getReadOffset()});
            var buffer = obj.deserialize({isBare: isBare});
            this._readOffset += obj.getReadOffset();
            if (TypeVector.logger.isDebugEnabled()) {
                TypeVector.logger.debug('read \'%s\' = %s , offset = %s', type, obj.toPrintable(), this.getReadOffset());
            }
            return buffer;
        };
    } else {
        // Manage primitive type
        this.type = type.charAt(0).toUpperCase() + type.slice(1);
    }
}

// De-serialize the list starting from the initialized buffer
TypeVector.prototype.deserialize = function (options) {
    if (!this.constructor.super_.prototype.deserialize.call(this, options)) {
        return false;
    }
    var listLength = this.readInt();
    if (TypeVector.logger.isDebugEnabled()) {
        TypeVector.logger.debug('read \'%s\' = %s , offset = %s', 'length', listLength, this.getReadOffset());
    }
    for (var i = 0; i < listLength; i++) {
        if (TypeVector.logger.isDebugEnabled()) {
            TypeVector.logger.debug('call read%s', this.type);
        }
        var value = this['read' + this.type]();
        this.list[i] = value;
        if(value.id) {
            this._byId['' + value.id] = value;
        }
    }
    return this;
};

// Serialize the list starting from the initialized buffer
TypeVector.prototype.serialize = function (options) {
    if (!this.constructor.super_.prototype.serialize.call(this, options)) {
        return this.retrieveBuffer();
    }
    var listLength = this.list.length;
    this.writeInt(listLength);
    if (TypeVector.logger.isDebugEnabled()) {
        TypeVector.logger.debug('write \'%s\' = %s', 'length', listLength);
    }
    for (var i = 0; i < listLength; i++) {
        this['write' + this.type](this.list[i]);
        if (TypeVector.logger.isDebugEnabled()) {
            TypeVector.logger.debug('write%s[%s] = %s', this.type, i, this.list[i]);
        }
    }
    return this.retrieveBuffer();
};

// Retrieve a copy of the internal list
TypeVector.prototype.getList = function () {
    return this.list.slice();
};

// Retrieve an element by id if any
TypeVector.prototype.getById = function (id) {
    return this._byId[id];
};

TypeVector.id = '15c4b51c';
TypeVector.typeName = 'Vector';
TypeVector.logger = require('get-log')(TypeVector.typeName);
tl.registerTypeById(TypeVector);
tl.registerTypeByName(TypeVector);

// Export the class
module.exports = exports = TypeVector;
