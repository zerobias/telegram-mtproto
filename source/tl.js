import { is, isNil, type } from 'ramda'
import { bigint, bigStringInt, uintToInt, intToUint, bytesToHex,
  gzipUncompress, bytesToArrayBuffer } from './bin'

export class TLSerialization {
  constructor({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) {
    this.maxLength = startMaxLength
    this.offset = 0 // in bytes

    this.createBuffer()

    // this.debug = options.debug !== undefined ? options.debug : Config.Modes.debug
    this.mtproto = mtproto
  }

  createBuffer() {
    this.buffer = new ArrayBuffer(this.maxLength)
    this.intView = new Int32Array(this.buffer)
    this.byteView = new Uint8Array(this.buffer)
  }

  getArray() {
    const resultBuffer = new ArrayBuffer(this.offset)
    const resultArray = new Int32Array(resultBuffer)

    resultArray.set(this.intView.subarray(0, this.offset / 4))

    return resultArray
  }

  getBuffer() {
    return this.getArray().buffer
  }

  getBytes(typed) {
    if (typed) {
      const resultBuffer = new ArrayBuffer(this.offset)
      const resultArray = new Uint8Array(resultBuffer)

      resultArray.set(this.byteView.subarray(0, this.offset))

      return resultArray
    }

    const bytes = []
    for (let i = 0; i < this.offset; i++) {
      bytes.push(this.byteView[i])
    }
    return bytes
  }

  checkLength(needBytes) {
    if (this.offset + needBytes < this.maxLength) {
      return
    }

    console.trace('Increase buffer', this.offset, needBytes, this.maxLength)
    this.maxLength = Math.ceil(Math.max(this.maxLength * 2, this.offset + needBytes + 16) / 4) * 4
    const previousBuffer = this.buffer
    const previousArray = new Int32Array(previousBuffer)

    this.createBuffer()

    new Int32Array(this.buffer).set(previousArray)
  }

  writeInt(i, field) {
    this.debug && console.log('>>>', i.toString(16), i, field)

    this.checkLength(4)
    this.intView[this.offset / 4] = i
    this.offset += 4
  }

  storeIntString = (value, field) => {
    const valType = type(value)
    switch (true) {
      case is(String, value): return this.storeString(value, field)
      case is(Number, value): return this.storeInt(value, field)
      default: throw new Error(`tl storeIntString field ${field} value type ${valType}`)
    }
  }

  storeInt = (i, field = '') => {
    this.writeInt(i, `${ field }:int`)
  }

  storeBool(i, field = '') {
    if (i) {
      this.writeInt(0x997275b5, `${ field }:bool`)
    } else {
      this.writeInt(0xbc799737, `${ field }:bool`)
    }
  }

  storeLongP(iHigh, iLow, field) {
    this.writeInt(iLow, `${ field }:long[low]`)
    this.writeInt(iHigh, `${ field }:long[high]`)
  }

  storeLong(sLong, field = '') {
    if (is(Array, sLong))
      return sLong.length === 2
        ? this.storeLongP(sLong[0], sLong[1], field)
        : this.storeIntBytes(sLong, 64, field)

    if (typeof sLong !== 'string')
      sLong = sLong
        ? sLong.toString()
        : '0'
    const divRem = bigStringInt(sLong).divideAndRemainder(bigint(0x100000000))

    this.writeInt(intToUint(divRem[1].intValue()), `${ field }:long[low]`)
    this.writeInt(intToUint(divRem[0].intValue()), `${ field }:long[high]`)
  }

  storeDouble(f, field = '') {
    const buffer = new ArrayBuffer(8)
    const intView = new Int32Array(buffer)
    const doubleView = new Float64Array(buffer)

    doubleView[0] = f

    this.writeInt(intView[0], `${ field }:double[low]`)
    this.writeInt(intView[1], `${ field }:double[high]`)
  }

  storeString(s, field = '') {
    this.debug && console.log('>>>', s, `${ field }:string`)

    if (s === undefined) {
      s = ''
    }
    const sUTF8 = unescape(encodeURIComponent(s))

    this.checkLength(sUTF8.length + 8)

    const len = sUTF8.length
    if (len <= 253) {
      this.byteView[this.offset++] = len
    } else {
      this.byteView[this.offset++] = 254
      this.byteView[this.offset++] = len & 0xFF
      this.byteView[this.offset++] = (len & 0xFF00) >> 8
      this.byteView[this.offset++] = (len & 0xFF0000) >> 16
    }
    for (let i = 0; i < len; i++) {
      this.byteView[this.offset++] = sUTF8.charCodeAt(i)
    }

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0
    }
  }

  storeBytes(bytes, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes)
    }
    else if (bytes === undefined) {
      bytes = []
    }
    this.debug && console.log('>>>', bytesToHex(bytes), `${ field }:bytes`)

    const len = bytes.byteLength || bytes.length
    this.checkLength(len + 8)
    if (len <= 253) {
      this.byteView[this.offset++] = len
    } else {
      this.byteView[this.offset++] = 254
      this.byteView[this.offset++] = len & 0xFF
      this.byteView[this.offset++] = (len & 0xFF00) >> 8
      this.byteView[this.offset++] = (len & 0xFF0000) >> 16
    }

    this.byteView.set(bytes, this.offset)
    this.offset += len

    // Padding
    while (this.offset % 4) {
      this.byteView[this.offset++] = 0
    }
  }

  storeIntBytes(bytes, bits, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes)
    }
    const len = bytes.length
    if (bits % 32 || len * 8 != bits) {
      throw new Error(`Invalid bits: ${  bits  }, ${  bytes.length}`)
    }

    this.debug && console.log('>>>', bytesToHex(bytes), `${ field }:int${  bits}`)
    this.checkLength(len)

    this.byteView.set(bytes, this.offset)
    this.offset += len
  }

  storeRawBytes(bytes, field = '') {
    if (bytes instanceof ArrayBuffer) {
      bytes = new Uint8Array(bytes)
    }
    const len = bytes.length

    this.debug && console.log('>>>', bytesToHex(bytes), field)
    this.checkLength(len)

    this.byteView.set(bytes, this.offset)
    this.offset += len
  }

  storeMethod(methodName, params) {
    const schema = this.mtproto
      ? Config.Schema.MTProto
      : Config.Schema.API
    let methodData = false

    for (let i = 0; i < schema.methods.length; i++) {
      if (schema.methods[i].method == methodName) {
        methodData = schema.methods[i]
        break
      }
    }
    if (!methodData) {
      throw new Error(`No method ${  methodName  } found`)
    }

    this.storeInt(intToUint(methodData.id), `${methodName  }[id]`)

    let param, type
    let condType
    let fieldBit
    const len = methodData.params.length
    for (let i = 0; i < len; i++) {
      param = methodData.params[i]
      type = param.type
      if (type.indexOf('?') !== -1) {
        condType = type.split('?')
        fieldBit = condType[0].split('.')
        if (!(params[fieldBit[0]] & 1 << fieldBit[1])) {
          continue
        }
        type = condType[1]
      }

      this.storeObject(params[param.name], type, `${methodName  }[${  param.name  }]`)
    }

    return methodData.type
  }

  storeObject(obj, type, field) {
    switch (type) {
      case '#':
      case 'int':
        return this.storeInt(obj, field)
      case 'long':
        return this.storeLong(obj, field)
      case 'int128':
        return this.storeIntBytes(obj, 128, field)
      case 'int256':
        return this.storeIntBytes(obj, 256, field)
      case 'int512':
        return this.storeIntBytes(obj, 512, field)
      case 'string':
        return this.storeString(obj, field)
      case 'bytes':
        return this.storeBytes(obj, field)
      case 'double':
        return this.storeDouble(obj, field)
      case 'Bool':
        return this.storeBool(obj, field)
      case 'true':
        return
    }

    if (is(Array, obj)) {
      if (type.substr(0, 6) == 'Vector') {
        this.writeInt(0x1cb5c415, `${field  }[id]`)
      }
      else if (type.substr(0, 6) != 'vector') {
        throw new Error(`Invalid vector type ${  type}`)
      }
      const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
      this.writeInt(obj.length, `${field  }[count]`)
      for (let i = 0; i < obj.length; i++) {
        this.storeObject(obj[i], itemType, `${field  }[${  i  }]`)
      }
      return true
    }
    else if (type.substr(0, 6).toLowerCase() == 'vector') {
      throw new Error('Invalid vector object')
    }

    if (!is(Object, obj))
      throw new Error(`Invalid object for type ${  type}`)

    const schema = this.mtproto
      ? Config.Schema.MTProto
      : Config.Schema.API
    const predicate = obj['_']
    let isBare = false
    let constructorData = false

    if (isBare = type.charAt(0) == '%')
      type = type.substr(1)

    for (let i = 0; i < schema.constructors.length; i++) {
      if (schema.constructors[i].predicate == predicate) {
        constructorData = schema.constructors[i]
        break
      }
    }
    if (!constructorData)
      throw new Error(`No predicate ${  predicate  } found`)

    if (predicate == type)
      isBare = true

    if (!isBare)
      this.writeInt(intToUint(constructorData.id), `${field  }[${  predicate  }][id]`)

    let param
    let condType
    let fieldBit
    const len = constructorData.params.length
    for (let i = 0; i < len; i++) {
      param = constructorData.params[i]
      type = param.type
      if (type.indexOf('?') !== -1) {
        condType = type.split('?')
        fieldBit = condType[0].split('.')
        if (!(obj[fieldBit[0]] & 1 << fieldBit[1])) {
          continue
        }
        type = condType[1]
      }

      this.storeObject(obj[param.name], type, `${field  }[${  predicate  }][${  param.name  }]`)
    }

    return constructorData.type
  }

}

export class TLDeserialization {
  constructor(buffer, { mtproto = false, override = {} } = {}) {
    this.offset = 0 // in bytes
    this.override = override

    this.buffer = buffer
    this.intView = new Uint32Array(this.buffer)
    this.byteView = new Uint8Array(this.buffer)

      // this.debug = options.debug !== undefined ? options.debug : Config.Modes.debug
    this.mtproto = mtproto
    return this
  }

  readInt(field) {
    if (this.offset >= this.intView.length * 4) {
      throw new Error(`Nothing to fetch: ${  field}`)
    }

    const i = this.intView[this.offset / 4]

    this.debug && console.log('<<<', i.toString(16), i, field)

    this.offset += 4

    return i
  }

  fetchInt(field = '') {
    return this.readInt(`${ field }:int`)
  }

  fetchDouble(field = '') {
    const buffer = new ArrayBuffer(8)
    const intView = new Int32Array(buffer)
    const doubleView = new Float64Array(buffer)

    intView[0] = this.readInt(`${ field }:double[low]`),
      intView[1] = this.readInt(`${ field }:double[high]`)

    return doubleView[0]
  }

  fetchLong(field = '') {
    const iLow = this.readInt(`${ field }:long[low]`)
    const iHigh = this.readInt(`${ field }:long[high]`)

    const longDec = bigint(iHigh)
      .shiftLeft(32)
      .add(bigint(iLow))
      .toString()

    return longDec
  }

  fetchBool(field = '') {
    const i = this.readInt(`${ field }:bool`)
    if (i == 0x997275b5) {
      return true
    } else if (i == 0xbc799737) {
      return false
    }

    this.offset -= 4
    return this.fetchObject('Object', field)
  }

  fetchString(field = '') {
    let len = this.byteView[this.offset++]

    if (len == 254) {
      len = this.byteView[this.offset++] |
          this.byteView[this.offset++] << 8 |
          this.byteView[this.offset++] << 16
    }

    let sUTF8 = ''
    for (let i = 0; i < len; i++) {
      sUTF8 += String.fromCharCode(this.byteView[this.offset++])
    }

      // Padding
    while (this.offset % 4) {
      this.offset++
    }
    let s
    try {
      s = decodeURIComponent(escape(sUTF8))
    } catch (e) {
      s = sUTF8
    }

    this.debug && console.log('<<<', s, `${ field }:string`)

    return s
  }

  fetchBytes(field = '') {
    let len = this.byteView[this.offset++]

    if (len == 254) {
      len = this.byteView[this.offset++] |
          this.byteView[this.offset++] << 8 |
          this.byteView[this.offset++] << 16
    }

    const bytes = this.byteView.subarray(this.offset, this.offset + len)
    this.offset += len

    // Padding
    while (this.offset % 4)
      this.offset++

    this.debug && console.log('<<<', bytesToHex(bytes), `${ field }:bytes`)

    return bytes
  }

  fetchIntBytes(bits, typed, field = '') {
    if (bits % 32)
      throw new Error(`Invalid bits: ${  bits}`)

    const len = bits / 8
    if (typed) {
      const result = this.byteView.subarray(this.offset, this.offset + len)
      this.offset += len
      return result
    }

    const bytes = []
    for (let i = 0; i < len; i++) {
      bytes.push(this.byteView[this.offset++])
    }

    this.debug && console.log('<<<', bytesToHex(bytes), `${ field }:int${  bits}`)

    return bytes
  }

  fetchRawBytes(len, typed, field = '') {
    if (len === false) {
      len = this.readInt(`${ field }_length`)
      if (len > this.byteView.byteLength)
        throw new Error(`Invalid raw bytes length: ${  len  }, buffer len: ${  this.byteView.byteLength}`)
    }
    let bytes
    if (typed) {
      bytes = new Uint8Array(len)
      bytes.set(this.byteView.subarray(this.offset, this.offset + len))
      this.offset += len
      return bytes
    }

    bytes = []
    for (let i = 0; i < len; i++)
      bytes.push(this.byteView[this.offset++])

    this.debug && console.log('<<<', bytesToHex(bytes), field)

    return bytes
  }

  fetchObject(type, field) {
    switch (type) {
      case '#':
      case 'int':
        return this.fetchInt(field)
      case 'long':
        return this.fetchLong(field)
      case 'int128':
        return this.fetchIntBytes(128, false, field)
      case 'int256':
        return this.fetchIntBytes(256, false, field)
      case 'int512':
        return this.fetchIntBytes(512, false, field)
      case 'string':
        return this.fetchString(field)
      case 'bytes':
        return this.fetchBytes(field)
      case 'double':
        return this.fetchDouble(field)
      case 'Bool':
        return this.fetchBool(field)
      case 'true':
        return true
    }
    let fallback
    field = field || type || 'Object'

    if (type.substr(0, 6) == 'Vector' || type.substr(0, 6) == 'vector') {
      if (type.charAt(0) == 'V') {
        const constructor = this.readInt(`${field  }[id]`)
        const constructorCmp = uintToInt(constructor)

        if (constructorCmp == 0x3072cfa1) { // Gzip packed
          const compressed = this.fetchBytes(`${field  }[packed_string]`)
          const uncompressed = gzipUncompress(compressed)
          const buffer = bytesToArrayBuffer(uncompressed)
          const newDeserializer = new TLDeserialization(buffer)

          return newDeserializer.fetchObject(type, field)
        }
        if (constructorCmp != 0x1cb5c415) {
          throw new Error(`Invalid vector constructor ${  constructor}`)
        }
      }
      const len = this.readInt(`${field  }[count]`)
      const result = []
      if (len > 0) {
        const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
        for (let i = 0; i < len; i++)
          result.push(this.fetchObject(itemType, `${field  }[${  i  }]`))
      }

      return result
    }

    const schema = this.mtproto
      ? Config.Schema.MTProto
      : Config.Schema.API
    let predicate = false
    let constructorData = false

    if (type.charAt(0) == '%') {
      const checkType = type.substr(1)
      for (let i = 0; i < schema.constructors.length; i++) {
        if (schema.constructors[i].type == checkType) {
          constructorData = schema.constructors[i]
          break
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found for type: ${  type}`)
      }
    }
    else if (type.charAt(0) >= 97 && type.charAt(0) <= 122) {
      for (let i = 0; i < schema.constructors.length; i++) {
        if (schema.constructors[i].predicate == type) {
          constructorData = schema.constructors[i]
          break
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found for predicate: ${  type}`)
      }
    } else {
      const constructor = this.readInt(`${field  }[id]`)
      const constructorCmp = uintToInt(constructor)

      if (constructorCmp == 0x3072cfa1) { // Gzip packed
        const compressed = this.fetchBytes(`${field  }[packed_string]`)
        const uncompressed = gzipUncompress(compressed)
        const buffer = bytesToArrayBuffer(uncompressed)
        const newDeserializer = new TLDeserialization(buffer)

        return newDeserializer.fetchObject(type, field)
      }

      let index = schema.constructorsIndex
      if (!index) {
        schema.constructorsIndex = index = {}
        for (let i = 0; i < schema.constructors.length; i++) {
          index[schema.constructors[i].id] = i
        }
      }
      let i = index[constructorCmp]
      if (i) {
        constructorData = schema.constructors[i]
      }

      fallback = false
      if (!constructorData && this.mtproto) {
        const schemaFallback = Config.Schema.API
        for (i = 0; i < schemaFallback.constructors.length; i++) {
          if (schemaFallback.constructors[i].id == constructorCmp) {
            constructorData = schemaFallback.constructors[i]

            delete this.mtproto
            fallback = true
            break
          }
        }
      }
      if (!constructorData) {
        throw new Error(`Constructor not found: ${  constructor  } ${  this.fetchInt()  } ${  this.fetchInt()}`)
      }
    }

    predicate = constructorData.predicate

    const result = { '_': predicate }
    const overrideKey = (this.mtproto ? 'mt_' : '') + predicate

    if (this.override[overrideKey]) {
      this.override[overrideKey].apply(this, [result, `${field  }[${  predicate  }]`])
    } else {
      let param, isCond
      let condType, fieldBit
      let value
      const len = constructorData.params.length
      for (let i = 0; i < len; i++) {
        param = constructorData.params[i]
        type = param.type
        if (type === '#' && isNil(result.pFlags))
          result.pFlags = {}

        isCond = type.indexOf('?') !== -1
        if (isCond) {
          condType = type.split('?')
          fieldBit = condType[0].split('.')
          if (!(result[fieldBit[0]] & 1 << fieldBit[1]))
            continue
          type = condType[1]
        }

        value = this.fetchObject(type, `${field  }[${  predicate  }][${  param.name  }]`)

        if (isCond && type === 'true')
          result.pFlags[param.name] = value
        else
          result[param.name] = value
      }
    }

    if (fallback)
      this.mtproto = true

    return result
  }

  getOffset() {
    return this.offset
  }

  fetchEnd() {
    if (this.offset !== this.byteView.length)
      throw new Error('Fetch end with non-empty buffer')
    return true
  }

}