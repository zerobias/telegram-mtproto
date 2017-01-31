'use strict'
/*jshint evil:true */

//     ConstructorBuilder class
//
// This class can build dynamically a `TypeObject` concrete sub-class
// parsing `TL-Schema` for both `MTProto` and `Telegram API`

// Import dependencies
const TypeObject = require('../type-object')
const util = require('util')
const utility = require('../utility')
const getLogger = require('../../logger')
const logger = getLogger('ConstructorBuilder')

// Compile a reg exp to resolve Type declaration in TL-Schema
const typeResolver = /^([\#!%\.\w\?]+)(<([%\.\w]+)>)?$/

// The constructor requires the following params:
//      `module`: the module name where add this new Type,
//      `tlSchema`: the TypeLanguage schema that describes the Type (class or function),
function ConstructorBuilder(module, tlSchema, notRegisterByName) {
  this.module = module
  if (!this.module) {
    logger.warn(' Target \'module\' parameter is mandatory!')
    console.trace()
    return
  }
  this.tlSchema = tlSchema
  if (!this.tlSchema) {
    logger.warn('\'tlSchema\' parameter is mandatory!')
    return
  }
  this._methods = []
  this._type = build.call(this)
  registerTypeById(this._type)
  if (!notRegisterByName)
    registerTypeByName(this._type)
}

// Return the built type
ConstructorBuilder.prototype.getType = function() {
  return this._type
}

// This function builds a new `TypeLanguage` class (a `TypeObject` sub-class)
// parsing the `TL-Schema constructor`
function build() {
  // Start creating the body of the new Type constructor, first calling super()
  const _ret = buildIdentity.call(this)
  const typeId = _ret.typeId
  const typeName = _ret.typeName
  let body =
    `${'\tvar opts = options ? options : {};\n' +
    '\tthis.constructor.util._extend(this, opts.props);\n' +
    '\tthis.constructor.super_.call(this, opts.buffer, opts.offset'}${
    typeId ? '' : ', true'
    });\n`
  // Init fields
  body += _ret.body
  buildFlags.call(this)
  body += buildSerialize.call(this)
  body += buildDeserialize.call(this)
  // Add to body all the read/write methods
  this._methods.forEach(method => body += method)
  logger.debug('Body for %s type constructor:', typeName)
  logger.debug(`\n${  body}`)
  return createConstructor(body, typeId, typeName)
}

function buildIdentity() {
  let typeId = this.tlSchema.id
  if (this.tlSchema.id) {
    const buffer = new Buffer(4)
    buffer.writeUInt32LE(this.tlSchema.id, 0, true)
    typeId = buffer.toString('hex')
  }
  const typeName = `${this.module  }.${  retrieveTypeName(this.tlSchema)}`
  const body =
    `\tthis._typeId = ${  typeId ? `'${  typeId  }'` : typeId  };\n` +
    `\tthis._typeName = "${  typeName  }";\n`
  return {
    typeId  : typeId,
    typeName: typeName,
    body    : body
  }
}

function retrieveTypeName(tlSchema) {
  if (tlSchema.method)
    return tlSchema.method

  const typeName = tlSchema.predicate
  const idx = typeName.lastIndexOf('.') + 1
  return typeName.substring(0, idx) +
    utility.capitalize(typeName.substring(idx))
}

function createConstructor(body, typeId, typeName) {
  const TypeConstructor = new Function('options', body)
  TypeConstructor.id = typeId
  TypeConstructor.typeName = typeName
  TypeConstructor.requireTypeByName = requireTypeByName
  TypeConstructor.requireTypeFromBuffer = requireTypeFromBuffer
  TypeConstructor.util = util
  TypeConstructor.logger = getLogger(typeName)
  util.inherits(TypeConstructor, TypeObject)
  return TypeConstructor
}

function buildFlags() {
  if (this.tlSchema.params)
    this.tlSchema.params.forEach(param => {
      const type = param.type.match(typeResolver)
      let typeName = type[1]

      const isFlagCheck = typeName.match(/^flags\.(\d+)\?([%\.\w<>]+)$/)
      let isFlag
      param.flag = {}
      param.flag.isFlag = isFlag = false
      param.flag.flagIndex = -1
      if (isFlagCheck && isFlagCheck[0]) {
        param.flag.isFlag = isFlag = true
        param.flag.flagIndex = parseInt(isFlagCheck[1], 10)
        param.flag.typeName = typeName = isFlagCheck[2]
      }
    })
}

function buildSerialize() {
  let body =
    '\tthis.serialize = function serialize (options) {\n' +
    '\t\tif (!this.constructor.super_.prototype.serialize.call(this, options)) {\n' +
    '\t\t\treturn this.retrieveBuffer();\n' +
    '\t\t}\n'
  // Parse the `TL-Schema params`
  if (this.tlSchema.params)
    this.tlSchema.params.forEach(param => {
      const type = param.type.match(typeResolver)
      let typeName = type[1]

      // Slice types with name starts with '!'
      if ('!' === typeName.charAt(0))
        typeName = typeName.slice(1)

      const isFlagCheck = typeName.match(/^flags\.(\d+)\?([%\.\w<>]+)$/)
      let isFlag = false
      if (isFlagCheck && isFlagCheck[0]) {
        isFlag = true
        typeName = isFlagCheck[2]
      }

      const isBareCheck = checkIfTypeIsBare(typeName)
      const isBare = isBareCheck.isBare
      typeName = isBareCheck.typeName

      if (typeName === '#') {
        typeName = 'int'
        body += '\t\tthis.flags = 0;\n'
        const flags = this.tlSchema.params.filter(v => v.flag.isFlag)
        flags.forEach(param => {
          if (param.flag.typeName === 'true') {
            body += `\t\tthis.flags = this.${  param.name  } ? (this.flags | ${  Math.pow(2.0, param.flag.flagIndex)  }) : (this.flags & ~${  Math.pow(2.0, param.flag.flagIndex)  });\n`
          } else {
            body += `\t\tthis.flags = this.${  param.name  } !== null ? (this.flags | ${  Math.pow(2.0, param.flag.flagIndex)  }) : (this.flags & ~${  Math.pow(2.0, param.flag.flagIndex)  });\n`
          }
        })
        body +=
          `\t\tthis.${  buildWriteProperty.call(this, 'flags', 'Int')  }();\n`
      }
      // Manage Object type
      else if (isCapitalized(typeName)) {
        body += buildWriteObjectProperty.call(this, param.name, typeName, isBare, isFlag)
      }
      // Manage primitive type
      else {
        const isSimple =
          (typeName === 'int' && param.name === 'bytes') ||
          typeName === 'true'
        if (!isSimple) {
          typeName = utility.capitalize(typeName)
          body += isFlag
            ? `\t\tif (this.${  param.name  }) {\n\t`
            : ''
          body +=
            `\t\tthis.${  buildWriteProperty.call(this, param.name, typeName, isFlag)  }();\n`
          body += isFlag
            ? '\t\t}\n'
            : ''
        }
      }
    })
  body +=
    '\t\treturn this.retrieveBuffer();\n' +
    '\t};\n'
  return body
}

function buildWriteObjectProperty(propertyName, typeName, isBare, isFlag) {
  let body = isFlag
    ? `\t\tif (this.${  propertyName  }) {\n\t`
    : ''
  body += `\t\tvar ${  propertyName  }Bytes = this.${  propertyName
    }${('X' === typeName) ? '' : `.serialize({isBare: ${  isBare  }})`  };\n`
  if ('Object' === typeName) {
    body += `\t\tthis.bytes = ${  propertyName  }Bytes.length;\n`
    body += `\t\tthis.${  buildWriteProperty.call(this, 'bytes', 'Int')  }();\n`
  }
  body += `\t\tthis._writeBytes(${  propertyName  }Bytes);\n`
  body += isFlag
    ? '\t\t}\n'
    : ''
  return body
}

function buildWriteProperty(propertyName, typeName, isFlag) {
  const functionName = `__write${  utility.capitalize(propertyName)}`
  let body =
    `\tthis.${  functionName  } = function ${  functionName  }() {\n`
  body +=
    `${'\t\tif(this.constructor.logger.isDebugEnabled()) {\n' +
    '\t\t\tthis.constructor.logger.debug(\'write \\\'%s\\\' = %s\', \''}${  propertyName  }', this.${  propertyName
    }${'Bytes' === typeName ? '.toString(\'hex\')' : ''  });\n` +
    `\t\t}\n`
  body +=
    `\t\tthis.write${  typeName  }(this.${  propertyName  });\n`
  body +=
    '\t};\n'
  this._methods.push(body)
  return functionName
}

function buildDeserialize() {
  let body =
    '\tthis.deserialize = function deserialize (options) {\n' +
    '\t\tif (!this.constructor.super_.prototype.deserialize.call(this, options)) {\n' +
    '\t\t\treturn false;\n' +
    '\t\t}\n'
  // Parse the `TL-Schema params`
  if (this.tlSchema.params)
    this.tlSchema.params.forEach(param => {
      const type = param.type.match(typeResolver)
      let typeName = type[1]
      const isFlagCheck = typeName.match(/^flags\.(\d+)\?([%\.\w<>]+)?$/)
      let isFlag = false
      let flagIndex = -1
      if (isFlagCheck && isFlagCheck[0]) {
        isFlag = true
        flagIndex = parseInt(isFlagCheck[1], 10)
        typeName = isFlagCheck[2]
      }
      const isBareCheck = checkIfTypeIsBare(typeName)
      const isBare = isBareCheck.isBare
      typeName = isBareCheck.typeName
      body += isFlag ? `\t\tif ((this.flags & (1 << ${  flagIndex  })) !== 0) {\n\t` : ''
      if (!type[3]) {
        // Slice types with name starts with '!'
        if (typeName === '#') {
          typeName = 'int'
        } else if ('!' === typeName.charAt(0)) {
          typeName = typeName.slice(1)
        }

        if (typeName === null) {
          body += ''
        }
        // Manage Object type
        else if (isCapitalized(typeName)) {
          body += buildReadObjectProperty.call(this, param.name, typeName, isBare)
        }
        // Manage primitive type
        else {
          typeName = utility.capitalize(typeName)
          body +=
            `\t\tthis.${  buildReadProperty.call(this, param.name, typeName)  }();\n`
        }
      }
      // Manage generic type
      else {
        const typeParam = type[3]
        body +=
          `\t\tvar ${  typeName  } = this.constructor.requireTypeByName('${  typeName  }');\n${
          buildDeserializeObjectProperty.call(this, param.name, typeName, typeParam, isBare)}`
      }
      body += isFlag
        ? '\t\t}\n'
        : ''
    })
  body +=
    '\t\treturn this;\n' +
    '\t};\n'
  return body
}

function checkIfTypeIsBare(typeName) {
  let isBare = false
  if (typeName.charAt(0) === '%') {
    isBare = true
    typeName = typeName.slice(1)
  } else if ('vector' === typeName) {
    isBare = true
    typeName = 'Vector'
  }
  return {
    isBare  : isBare,
    typeName: typeName
  }
}

function isCapitalized(typeName) {
  typeName = typeName.slice(typeName.lastIndexOf('.') + 1)
  return typeName.charAt(0) === typeName.charAt(0).toUpperCase()
}

function buildReadObjectProperty(propertyName, typeName, isBare) {
  let body = ''
  if ('X' === typeName) {
    body += `\t\tthis.${  propertyName  } = this._readBytes(this.bytes);\n`
  } else {
    const fullTypeName = `${this.module  }.${  typeName}`
    typeName = typeName.replace('.', '_')
    body += !isBare ?
    `${'\t\tvar bytes = this._buffer.slice(this.getReadOffset(), this.getReadOffset() + 4);\n' +
    '\t\tif(this.constructor.logger.isDebugEnabled()) {\n' +
    '\t\t\tthis.constructor.logger.debug(\'Retrieve type %s reading the bytes %s %s\', '}${  typeName  }, bytes.toString('hex'), '${  typeName  }');\n` +
    `\t\t}\n` +
    `\t\tvar ${  typeName  } = this.constructor.requireTypeFromBuffer(bytes);\n` :
    `${'\t\tif(this.constructor.logger.isDebugEnabled()) {\n' +
    '\t\t\tthis.constructor.logger.debug(\'Retrieve BARE type by name %s\', \''}${  fullTypeName  }');\n` +
    `\t\t}\n` +
    `\t\tvar ${  typeName  } = this.constructor.requireTypeByName('${  fullTypeName  }');\n`
    body += buildDeserializeObjectProperty.call(this, propertyName, typeName, null, isBare)
  }
  return body
}

function buildDeserializeObjectProperty(propertyName, typeName, typeParam, isBare) {
  return `\t\tif (${  typeName  }) {\n` +
    `\t\t\tvar obj = new ${  typeName  }({${
    typeParam ? `module: '${  this.module  }', type: '${  typeParam  }', ` : ''
    }buffer: this._buffer, offset: this.getReadOffset()}).` +
    `deserialize({isBare: ${  isBare  }});\n` +
    `\t\t\tif (obj) {\n` +
    `\t\t\t\tvar typeName = obj.getTypeName() ? obj.getTypeName().substring(obj.getTypeName().lastIndexOf('.') + 1) : '';\n` +
    `\t\t\t\tthis.${  propertyName  } = (typeName == 'BoolTrue') ? true : (typeName == 'BoolFalse') ? false : obj;\n` +
    `\t\t\t\tthis._readOffset += obj.getReadOffset();\n` +
    `\t\t\t}\n` +
    `\t\t} else {\n` +
    `\t\t\tthrow new TypeError('Unable to retrieve the Type constructor for the type ${  typeName  } and buffer:' + this._buffer.toString('hex'));\n` +
    `\t\t}\n`
}

function buildReadProperty(propertyName, typeName) {
  const functionName = `__read${  utility.capitalize(propertyName)}`
  let body =
    `\tthis.${  functionName  } = function ${  functionName  }() {\n`
  body +=
    `\t\tthis.${  propertyName  } = ${  'True' === typeName ? 'true' : `this.read${  typeName  }()`  };\n`
  body +=
    `${'\t\tif(this.constructor.logger.isDebugEnabled()) {\n' +
    '\t\t\tthis.constructor.logger.debug(\'read \\\'%s\\\' = %s, offset = %s\', \''}${  propertyName  }', this.${  propertyName
    }${'Bytes' === typeName ? '.toString(\'hex\')' : ''  }, this._readOffset);\n` +
    `\t\t}\n`
  body +=
    '\t};\n'
  this._methods.push(body)
  return functionName
}

const registryLogger = getLogger('ConstructorBuilder.registry')

// Types registered by id
const typeById = {}

// Register a Type constructor by id
function registerTypeById(type) {
  registryLogger.debug('Register Type \'%s\' by id [%s]', type.typeName, type.id)
  if (type.id)
    typeById[type.id] = type
  return type
}

// Retrieve a Type constructor reading the id from buffer
function requireTypeFromBuffer(buffer) {
  const typeId = buffer.slice(0, 4).toString('hex')
  const type = typeById[typeId]
  if (!type) {
    const msg = `Unable to retrieve a Type by Id [${  typeId  }]`
    registryLogger.error(msg)
    throw new Error(msg)
  }
  registryLogger.debug('Require Type \'%s\' by id [%s]', type.typeName, typeId)
  return type
}

// Types registered by name
const typeByName = {}

// Register a Type constructor by name
function registerTypeByName(type) {
  registryLogger.debug('Register Type \'%s\' by name [%s]', type.id, type.typeName)
  typeByName[type.typeName] = type
  return type
}

// Retrieve a Type constructor by name
function requireTypeByName(typeName) {
  const type = typeByName[typeName]
  if (!type) {
    const msg = `Unable to retrieve a Type by Name [${  typeName  }]`
    registryLogger.error(msg)
    throw new Error(msg)
  }
  registryLogger.debug('Require Type \'%s\' by name [%s]', type.id, typeName)
  return type
}

module.exports = exports = ConstructorBuilder
exports.registerTypeById = registerTypeById
exports.requireTypeFromBuffer = requireTypeFromBuffer
exports.registerTypeByName = registerTypeByName
exports.requireTypeByName = requireTypeByName