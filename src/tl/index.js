//@flow

import is from 'ramda/src/is'

import { uintToInt, intToUint, bytesToHex,
  gzipUncompress, bytesToArrayBuffer, longToInts, lshift32, stringToChars } from '../bin'

import Logger from '../util/log'

const debug = Logger`tl`

import { readInt, TypeBuffer, TypeWriter, getNakedType,
  getPredicate, getString, getTypeConstruct } from './type-buffer'
import type { BinaryData, TLSchema } from './index.h'

const PACKED = 0x3072cfa1

type SerialConstruct = {
  mtproto: boolean,
  startMaxLength: number
}

const normalizeBytes = (bytes?: number[] | ArrayBuffer | string) => {
  let list, length
  if (bytes instanceof ArrayBuffer) {
    list = new Uint8Array(bytes)
    length = bytes.byteLength
  } else if (bytes === undefined) {
    list = []
    length = 0
  } else if (typeof bytes === 'string') {
    list =
      stringToChars(
        unescape(
          encodeURIComponent(
            bytes)))
    length = list.length
  } else {
    list = bytes
    length = bytes.length
  }
  return {
    list,
    length
  }
}

const binaryDataGuard = (bytes: BinaryData | ArrayBuffer) => {
  let list
  if (bytes instanceof ArrayBuffer)
    list = new Uint8Array(bytes)
  else
    list = bytes
  return list
}

export class Serialization {
  writer: TypeWriter = new TypeWriter()
  mtproto: boolean
  api: TLSchema
  mtApi: TLSchema
  constructor({ mtproto, startMaxLength }: SerialConstruct, api: TLSchema, mtApi: TLSchema) {
    this.api = api
    this.mtApi = mtApi

    this.maxLength = startMaxLength

    this.writer.reset()
    this.mtproto = mtproto
  }

  get maxLength(): number {
    return this.writer.maxLength
  }
  set maxLength(maxLength: number) {
    this.writer.maxLength = maxLength
  }

  get offset(): number {
    return this.writer.offset
  }
  set offset(offset: number) {
    this.writer.offset = offset
  }

  get buffer(): ArrayBuffer {
    return this.writer.buffer
  }

  get intView(): Int32Array {
    return this.writer.intView
  }

  get byteView(): Uint8Array {
    return this.writer.byteView
  }

  getArray() {
    return this.writer.getArray()
  }

  getBuffer() {
    return this.writer.getArray().buffer
  }

  getBytes(typed: boolean) {
    if (typed)
      return this.writer.getBytesTyped()
    else
      return this.writer.getBytesPlain()
  }

  checkLength(needBytes: number) {
    this.writer.checkLength(needBytes)
  }

  writeInt(i: number, field: string) {
    this.writer.writeInt(i, field)
  }

  storeIntString = (value: number | string, field: string) => {
    switch (typeof value) {
      case 'string': return this.storeBytes(value, `${field}:string`)
      case 'number': return this.storeInt(value, field)
      default: throw new Error(`tl storeIntString field ${field} value type ${typeof value}`)
    }
  }

  storeInt = (i: number, field: string = '') => {
    this.writeInt(i, `${ field }:int`)
  }

  storeBool(i: boolean, field: string = '') {
    if (i) {
      this.writeInt(0x997275b5, `${ field }:bool`)
    } else {
      this.writeInt(0xbc799737, `${ field }:bool`)
    }
  }

  storeLongP(iHigh, iLow, field: string) {
    this.writeInt(iLow, `${ field }:long[low]`)
    this.writeInt(iHigh, `${ field }:long[high]`)
  }

  storeLong(sLong, field: string = '') {
    if (Array.isArray(sLong))
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

  storeDouble(f, field: string = '') {
    const buffer = new ArrayBuffer(8)
    const intView = new Int32Array(buffer)
    const doubleView = new Float64Array(buffer)

    doubleView[0] = f

    this.writeInt(intView[0], `${ field }:double[low]`)
    this.writeInt(intView[1], `${ field }:double[high]`)
  }

  storeBytes(bytes?: number[] | ArrayBuffer | string, field: string = '') {
    const { list, length } = normalizeBytes(bytes)
    // this.debug && console.log('>>>', bytesToHex(bytes), `${ field }:bytes`)

    this.checkLength(length + 8)
    if (length <= 253) {
      this.writer.next(length)
    } else {
      this.writer.next(254)
      this.writer.next(length & 0xFF)
      this.writer.next((length & 0xFF00) >> 8)
      this.writer.next((length & 0xFF0000) >> 16)
    }

    this.writer.set(list, length)
    this.writer.addPadding()
  }

  storeIntBytes(bytes: BinaryData  | ArrayBuffer, bits: number, field: string = '') {
    const data = binaryDataGuard(bytes)
    const len = data.length
    if (bits % 32 || len * 8 != bits) {
      throw new Error(`Invalid bits: ${  bits  }, ${len}`)
    }

    // this.debug && console.log('>>>', bytesToHex(bytes), `${ field }:int${  bits}`)
    this.checkLength(len)

    this.writer.set(data, len)
  }

  storeRawBytes(bytes: BinaryData | ArrayBuffer, field: string = '') {
    const data = binaryDataGuard(bytes)
    const len = data.length

    // this.debug && console.log('>>>', bytesToHex(bytes), field)
    this.checkLength(len)

    this.writer.set(data, len)
  }

  storeMethod(methodName: string, params) {
    const schema = selectSchema(this.mtproto, this.api, this.mtApi)
    let methodData = false

    for (const method of schema.methods) {
      if (method.method == methodName) {
        methodData = method
        break
      }
    }
    if (!methodData) {
      throw new Error(`No method ${  methodName  } found`)
    }

    this.storeInt(intToUint(methodData.id), `${methodName  }[id]`)

    let condType
    let fieldBit
    for (const param of methodData.params) {
      let type = param.type
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
      this.storeObject(stored, type, `f ${methodName}(${paramName})`)
    }

    return methodData.type
  }
  /*emptyOfType(ofType, schema: TLSchema) {
    const resultConstruct = schema.constructors.find(
      ({ type, predicate }: TLConstruct) =>
        type === ofType &&
        predicate.indexOf('Empty') !== -1)
    return resultConstruct
      ? { _: resultConstruct.predicate }
      : null
  }*/
  storeObject(obj, type: string, field: string) {
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
        return this.storeBytes(obj, `${field}:string`)
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
      if (type.substr(0, 6) == 'Vector')
        this.writeInt(0x1cb5c415, `${field}[id]`)
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

    const schema = selectSchema(this.mtproto, this.api, this.mtApi)
    const predicate = obj['_']
    let isBare = false
    let constructorData = false
    isBare = type.charAt(0) == '%'
    if (isBare)
      type = type.substr(1)

    for (const tlConst of schema.constructors) {
      if (tlConst.predicate == predicate) {
        constructorData = tlConst
        break
      }
    }
    if (!constructorData)
      throw new Error(`No predicate ${  predicate  } found`)

    if (predicate == type)
      isBare = true

    if (!isBare)
      this.writeInt(intToUint(constructorData.id), `${field  }.${  predicate  }[id]`)

    let condType
    let fieldBit
    for (const param of constructorData.params) {
      type = param.type
      if (type.indexOf('?') !== -1) {
        condType = type.split('?')
        fieldBit = condType[0].split('.')
        if (!(obj[fieldBit[0]] & 1 << fieldBit[1])) {
          continue
        }
        type = condType[1]
      }

      this.storeObject(obj[param.name], type, `${field}.${  predicate  }.${  param.name  }`)
    }

    return constructorData.type
  }

}

export class Deserialization {
  typeBuffer: TypeBuffer
  override: Object
  mtproto: boolean
  api: TLSchema
  mtApi: TLSchema
  constructor(buffer: Buffer, { mtproto, override }: DConfig, api: TLSchema, mtApi: TLSchema) {
    this.api = api
    this.mtApi = mtApi
    this.override = override

    this.typeBuffer = new TypeBuffer(buffer)
    this.mtproto = mtproto
  }

  readInt = readInt(this)

  fetchInt(field: string = '') {
    return this.readInt(`${ field }:int`)
  }

  fetchDouble(field: string = '') {
    const buffer = new ArrayBuffer(8)
    const intView = new Int32Array(buffer)
    const doubleView = new Float64Array(buffer)

    intView[0] = this.readInt(`${ field }:double[low]`)
    intView[1] = this.readInt(`${ field }:double[high]`)

    return doubleView[0]
  }

  fetchLong(field: string = '') {
    const iLow = this.readInt(`${ field }:long[low]`)
    const iHigh = this.readInt(`${ field }:long[high]`)

    const res = lshift32(iHigh, iLow)
    return res
  }

  fetchBool(field: string = '') {
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

  fetchString(field: string = '') {
    let len = this.typeBuffer.nextByte()

    if (len == 254) {
      len = this.typeBuffer.nextByte() |
          this.typeBuffer.nextByte() << 8 |
          this.typeBuffer.nextByte() << 16
    }

    const sUTF8 = getString(len, this.typeBuffer)

    let s
    try {
      s = decodeURIComponent(encodeURIComponent(sUTF8))
    } catch (e) {
      s = sUTF8
    }

    debug(`string`)(s, `${field}:string`)

    return s
  }

  fetchBytes(field: string = '') {
    let len = this.typeBuffer.nextByte()

    if (len == 254) {
      len = this.typeBuffer.nextByte() |
          this.typeBuffer.nextByte() << 8 |
          this.typeBuffer.nextByte() << 16
    }

    const bytes = this.typeBuffer.next(len)
    this.typeBuffer.addPadding()

    debug(`bytes`)(bytesToHex(bytes), `${ field }:bytes`)

    return bytes
  }

  fetchIntBytes(bits, field: string = '') {
    if (bits % 32)
      throw new Error(`Invalid bits: ${bits}`)

    const len = bits / 8

    const bytes = this.typeBuffer.next(len)

    debug(`int bytes`)(bytesToHex(bytes), `${ field }:int${  bits}`)

    return bytes
  }

  fetchRawBytes(len, field: string = '') {
    if (len === false) {
      len = this.readInt(`${ field }_length`)
      if (len > this.typeBuffer.byteView.byteLength)
        throw new Error(`Invalid raw bytes length: ${  len  }, buffer len: ${this.typeBuffer.byteView.byteLength}`)
    }
    const bytes = this.typeBuffer.next(len)
    debug(`raw bytes`)(bytesToHex(bytes), field)

    return bytes
  }

  fetchPacked(type, field) {
    const compressed = this.fetchBytes(`${field}[packed_string]`)
    const uncompressed = gzipUncompress(compressed)
    const buffer = bytesToArrayBuffer(uncompressed)
    const newDeserializer = new Deserialization(
      buffer, {
        mtproto : this.mtproto,
        override: this.override
      },
      this.api, this.mtApi)

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

    const schema = selectSchema(this.mtproto, this.api, this.mtApi)
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
        const schemaFallback = this.api
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

const selectSchema = (mtproto: boolean, api: TLSchema, mtApi: TLSchema) => mtproto
  ? mtApi
  : api

type DConfig = {
  mtproto: boolean,
  override: Object
}

export type DeserializationFabric = (
  buffer: Buffer,
  config?: {
    mtproto?: boolean,
    override?: Object
  }) => Deserialization

export type SerializationFabric = (
  config?: {
    mtproto?: boolean,
    startMaxLength?: number
  }) => Serialization

export type TLFabric = {
  Serialization: SerializationFabric,
  Deserialization: DeserializationFabric
}

export const TL = (api: TLSchema, mtApi: TLSchema) => ({
  Serialization: ({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) =>
    new Serialization({ mtproto, startMaxLength }, api, mtApi),
  Deserialization: (buffer: Buffer, { mtproto = false, override = {} }: DConfig = {}) =>
    new Deserialization(buffer, { mtproto, override }, api, mtApi)
})

export default TL