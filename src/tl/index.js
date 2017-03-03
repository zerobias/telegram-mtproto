import { is, type as rType } from 'ramda'
import { uintToInt, intToUint, bytesToHex,
  gzipUncompress, bytesToArrayBuffer, longToInts, lshift32 } from '../bin'

import Logger from '../util/log'

const debug = Logger`tl`

import { readInt, TypeBuffer, getNakedType,
  getPredicate, getString, getTypeConstruct } from './types'

const PACKED = 0x3072cfa1

export const TL = (api, mtApi) => {

  class Serialization {
    constructor({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) {
      this.maxLength = startMaxLength
      this.offset = 0 // in bytes

      this.createBuffer()
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
      const valType = rType(value)
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
      const [int1, int2] = longToInts(sLong)
      this.writeInt(int2, `${ field }:long[low]`)
      this.writeInt(int1, `${ field }:long[high]`)
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
      for (let i = 0; i < len; i++)
        this.byteView[this.offset++] = sUTF8.charCodeAt(i)

      // Padding
      while (this.offset % 4)
        this.byteView[this.offset++] = 0
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
        ? mtApi
        : api
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
        const paramName = param.name
        const stored = params[paramName]
        /*if (!stored)
          stored = this.emptyOfType(type, schema)
        if (!stored)
          throw new Error(`Method ${methodName}.`+
            ` No value of field ${ param.name } recieved and no Empty of type ${ param.type }`)*/
        this.storeObject(stored, type, `${methodName  }[${  paramName  }]`)
      }

      return methodData.type
    }
    emptyOfType(ofType, schema) {
      const resultConstruct = schema.constructors.find(
        ({ type, predicate }) =>
          type === ofType &&
          predicate.indexOf('Empty') !== -1)
      return resultConstruct
        ? { _: resultConstruct.predicate }
        : null
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
        ? mtApi
        : api
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

  class Deserialization {
    constructor(buffer, { mtproto = false, override = {} } = {}) {
      this.override = override

      this.typeBuffer = new TypeBuffer(buffer)
      this.mtproto = mtproto
    }

    readInt = readInt(this)

    fetchInt(field = '') {
      return this.readInt(`${ field }:int`)
    }

    fetchDouble(field = '') {
      const buffer = new ArrayBuffer(8)
      const intView = new Int32Array(buffer)
      const doubleView = new Float64Array(buffer)

      intView[0] = this.readInt(`${ field }:double[low]`)
      intView[1] = this.readInt(`${ field }:double[high]`)

      return doubleView[0]
    }

    fetchLong(field = '') {
      const iLow = this.readInt(`${ field }:long[low]`)
      const iHigh = this.readInt(`${ field }:long[high]`)

      const res = lshift32(iHigh, iLow)
      // const longDec = bigint(iHigh)
      //   .shiftLeft(32)
      //   .add(bigint(iLow))
      //   .toString()


      // debug`long, iLow, iHigh`(strDecToHex(iLow.toString()),
      //                          strDecToHex(iHigh.toString()))
      // debug`long, leemon`(res, strDecToHex(res.toString()))
      // debug`long, bigint`(longDec, strDecToHex(longDec.toString()))


      return res
    }

    fetchBool(field = '') {
      const i = this.readInt(`${ field }:bool`)
      switch (i) {
        case 0x997275b5: return true
        case 0xbc799737: return false
        default: {
          this.typeBuffer.offset -= 4
          return this.fetchObject('Object', field)
        }
      }
    }

    fetchString(field = '') {
      let len = this.typeBuffer.nextByte()

      if (len == 254) {
        len = this.typeBuffer.nextByte() |
            this.typeBuffer.nextByte() << 8 |
            this.typeBuffer.nextByte() << 16
      }

      const sUTF8 = getString(len, this.typeBuffer)

      let s
      try {
        s = decodeURIComponent(escape(sUTF8))
      } catch (e) {
        s = sUTF8
      }

      debug`string`(s, `${field}:string`)

      return s
    }

    fetchBytes(field = '') {
      let len = this.typeBuffer.nextByte()

      if (len == 254) {
        len = this.typeBuffer.nextByte() |
            this.typeBuffer.nextByte() << 8 |
            this.typeBuffer.nextByte() << 16
      }

      const bytes = this.typeBuffer.next(len)
      this.typeBuffer.addPadding()

      debug`bytes`(bytesToHex(bytes), `${ field }:bytes`)

      return bytes
    }

    fetchIntBytes(bits, field = '') {
      if (bits % 32)
        throw new Error(`Invalid bits: ${bits}`)

      const len = bits / 8

      const bytes = this.typeBuffer.next(len)

      debug`int bytes`(bytesToHex(bytes), `${ field }:int${  bits}`)

      return bytes
    }

    fetchRawBytes(len, field = '') {
      if (len === false) {
        len = this.readInt(`${ field }_length`)
        if (len > this.typeBuffer.byteView.byteLength)
          throw new Error(`Invalid raw bytes length: ${  len  }, buffer len: ${this.typeBuffer.byteView.byteLength}`)
      }
      const bytes = this.typeBuffer.next(len)
      debug`raw bytes`(bytesToHex(bytes), field)

      return bytes
    }

    fetchPacked(type, field) {
      const compressed = this.fetchBytes(`${field}[packed_string]`)
      const uncompressed = gzipUncompress(compressed)
      const buffer = bytesToArrayBuffer(uncompressed)
      const newDeserializer = new Deserialization(buffer)

      return newDeserializer.fetchObject(type, field)
    }

    fetchVector(type, field) {
      if (type.charAt(0) === 'V') {
        const constructor = this.readInt(`${field}[id]`)
        const constructorCmp = uintToInt(constructor)

        if (constructorCmp === PACKED)
          return this.fetchPacked(type, field)
        if (constructorCmp !== 0x1cb5c415)
          throw new Error(`Invalid vector constructor ${constructor}`)
      }
      const len = this.readInt(`${field}[count]`)
      const result = []
      if (len > 0) {
        const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
        for (let i = 0; i < len; i++)
          result.push(this.fetchObject(itemType, `${field}[${i}]`))
      }

      return result
    }

    fetchObject(type, field) {
      switch (type) {
        case '#':
        case 'int':
          return this.fetchInt(field)
        case 'long':
          return this.fetchLong(field)
        case 'int128':
          return this.fetchIntBytes(128, field)
        case 'int256':
          return this.fetchIntBytes(256, field)
        case 'int512':
          return this.fetchIntBytes(512, field)
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
      if (type.substr(0, 6).toLowerCase() === 'vector')
        return this.fetchVector(type, field)

      const schema = this.mtproto
        ? mtApi
        : api
      let predicate = false
      let constructorData = false

      if (type.charAt(0) === '%')
        constructorData = getNakedType(type, schema)
      else if (type.charAt(0) >= 97 && type.charAt(0) <= 122)
        constructorData = getPredicate(type, schema)
      else {
        const constructor = this.readInt(`${field}[id]`)
        const constructorCmp = uintToInt(constructor)

        if (constructorCmp === PACKED)
          return this.fetchPacked(type, field)

        let index = schema.constructorsIndex
        if (!index) {
          schema.constructorsIndex = index = {}
          for (let i = 0; i < schema.constructors.length; i++)
            index[schema.constructors[i].id] = i
        }
        const i = index[constructorCmp]
        if (i)
          constructorData = schema.constructors[i]

        fallback = false
        if (!constructorData && this.mtproto) {
          const schemaFallback = api
          const finded = getTypeConstruct(constructorCmp, schemaFallback)
          if (finded) {
            constructorData = finded
            delete this.mtproto
            fallback = true
          }
        }
        if (!constructorData) {
          throw new Error(`Constructor not found: ${constructor} ${this.fetchInt()} ${this.fetchInt()}`)
        }
      }

      predicate = constructorData.predicate

      const result = { '_': predicate }
      const overrideKey = (this.mtproto ? 'mt_' : '') + predicate

      if (this.override[overrideKey]) {
        this.override[overrideKey].apply(this, [result, `${field}[${predicate}]`])
      } else {
        const len = constructorData.params.length
        for (let i = 0; i < len; i++) {
          const param = constructorData.params[i]
          type = param.type
          // if (type === '#' && isNil(result.pFlags))
          //   result.pFlags = {}
          if (type.indexOf('?') !== -1) {
            const condType = type.split('?')
            const fieldBit = condType[0].split('.')
            if (!(result[fieldBit[0]] & 1 << fieldBit[1]))
              continue
            type = condType[1]
          }
          const paramName = param.name
          const value = this.fetchObject(type, `${field}[${predicate}][${paramName}]`)

          result[paramName] = value
        }
      }

      if (fallback)
        this.mtproto = true

      return result
    }

    getOffset() {
      return this.typeBuffer.offset
    }

    fetchEnd() {
      if (!this.typeBuffer.isEnd())
        throw new Error('Fetch end with non-empty buffer')
      return true
    }

  }

  return { Serialization, Deserialization }
}

export default TL