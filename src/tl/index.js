//@flow

import EventEmitter from 'eventemitter2'
import is from 'ramda/src/is'
import has from 'ramda/src/has'

import { uintToInt, intToUint, bytesToHex,
  gzipUncompress, bytesToArrayBuffer } from '../bin'

import { readLong, readInt, readBytes, readString, readDouble } from './reader'
import { writeInt, writeIntBytes, writeBytes, writeDouble,
  writeBool, writeLong } from './writer'

import Layout, { getFlags, isSimpleType, getTypeProps } from '../layout'
import { TypeBuffer, TypeWriter, getNakedType, getTypeConstruct } from './type-buffer'
import type { TLSchema } from './index.h'

// import writer from '../util/file-log'

// const storeMethodLog = writer('storeMethod')
// const fetchObjectLog = writer('fetchObject')

import Logger from '../util/log'
const debug = Logger`tl`

const PACKED = 0x3072cfa1

type SerialConstruct = {
  mtproto: boolean,
  startMaxLength: number
}

let apiLayer: Layout
let mtLayer: Layout

export class Serialization {
  writer: TypeWriter = new TypeWriter()
  mtproto: boolean
  api: TLSchema
  mtApi: TLSchema
  apiLayer: Layout
  mtLayer: Layout
  constructor({ mtproto, startMaxLength }: SerialConstruct, api: TLSchema, mtApi: TLSchema) {
    this.api = api
    this.mtApi = mtApi

    this.writer.maxLength = startMaxLength

    this.writer.reset()
    this.mtproto = mtproto
  }

  getBytes(typed?: boolean) {
    if (typed)
      return this.writer.getBytesTyped()
    else
      return this.writer.getBytesPlain()
  }

  storeMethod(methodName: string, params) {
    // const logId = storeMethodLog.input({
    //   methodName,
    //   params
    // })
    const layer = this.mtproto
      ? mtLayer
      : apiLayer
    const pred = layer.funcs.get(methodName)
    if (!pred) throw new Error(`No method name ${methodName} found`)

    writeInt(this.writer,
             intToUint(`${pred.id}`),
             `${methodName}[id]`)
    if (pred.hasFlags) {
      const flags = getFlags(pred)(params)
      this.storeObject(flags, '#', `f ${methodName} #flags ${flags}`)
    }
    for (const param of pred.params) {
      const paramName = param.name
      const typeClass = param.typeClass
      let fieldObj
      if (!has(paramName, params)) {
        if (param.isFlag) continue
        else if (layer.typeDefaults.has(typeClass))
          fieldObj = layer.typeDefaults.get(typeClass)
        else if (isSimpleType(typeClass)) {
          switch (typeClass) {
            case 'int': fieldObj = 0; break
            // case 'long': fieldObj = 0; break
            case 'string': fieldObj = ' '; break
            // case 'double': fieldObj = 0; break
            case 'true': fieldObj = true; break
            // case 'bytes': fieldObj = [0]; break
          }
        }
        else throw new Error(`Method ${methodName} did not receive required argument ${paramName}`)
      } else {
        fieldObj = params[paramName]
      }
      if (param.isVector) {
        if (!Array.isArray(fieldObj))
          throw new TypeError(`Vector argument ${paramName} in ${methodName} required Array,`  +
          //$FlowIssue
          ` got ${fieldObj} ${typeof fieldObj}`)
        writeInt(this.writer, 0x1cb5c415, `${paramName}[id]`)
        writeInt(this.writer, fieldObj.length, `${paramName}[count]`)
        for (const [ i, elem ] of fieldObj.entries())
          this.storeObject(elem, param.typeClass, `${paramName}[${i}]`)
      } else
        this.storeObject(fieldObj, param.typeClass, `f ${methodName}(${paramName})`)
    }
    /*let condType
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
      if (!stored)
        stored = this.emptyOfType(type, schema)
      if (!stored)
        throw new Error(`Method ${methodName}.`+
          ` No value of field ${ param.name } recieved and no Empty of type ${ param.type }`)
      this.storeObject(stored, type, `f ${methodName}(${paramName})`)
    }*/


    // storeMethodLog.output(logId, {
    //   pred,
    //   writer: this.writer
    // })
    return pred.returns
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
  storeObject(obj: *, type: string, field: string) {
    switch (type) {
      case '#':
      case 'int':
        return writeInt(this.writer, obj, field)
      case 'long':
        return writeLong(this.writer, obj, field)
      case 'int128':
        return writeIntBytes(this.writer, obj, 128, field)
      case 'int256':
        return writeIntBytes(this.writer, obj, 256, field)
      case 'int512':
        return writeIntBytes(this.writer, obj, 512, field)
      case 'string':
        return writeBytes(this.writer, obj, `${field}:string`)
      case 'bytes':
        return writeBytes(this.writer, obj, field)
      case 'double':
        return writeDouble(this.writer, obj, field)
      case 'Bool':
        return writeBool(this.writer, obj, field)
      case 'true':
        return
    }

    if (Array.isArray(obj)) {
      if (type.substr(0, 6) == 'Vector')
        writeInt(this.writer, 0x1cb5c415, `${field}[id]`)
      else if (type.substr(0, 6) != 'vector') {
        throw new Error(`Invalid vector type ${  type}`)
      }
      const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
      writeInt(this.writer, obj.length, `${field}[count]`)
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
      throw new Error(`No predicate ${predicate} found`)

    if (predicate == type)
      isBare = true

    if (!isBare)
      writeInt(this.writer,
               intToUint(constructorData.id),
               `${field}.${predicate}[id]`)

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

const emitter = new EventEmitter({ wildcard: true })

export class Deserialization {
  typeBuffer: TypeBuffer
  override: Object
  mtproto: boolean
  api: TLSchema
  mtApi: TLSchema
  emitter: EventEmitter
  constructor(buffer: Buffer, { mtproto, override }: DConfig, api: TLSchema, mtApi: TLSchema) {
    this.api = api
    this.mtApi = mtApi
    this.override = override

    this.typeBuffer = new TypeBuffer(buffer)
    this.mtproto = mtproto
    this.emitter = emitter

    // const fetchObject = this.fetchObject.bind(this)

    // const mock = (type, field) => {
    //   const logId = fetchObjectLog.input({
    //     type,
    //     typeBuffer: this.typeBuffer,
    //     field
    //   })
    //   const result = fetchObject(type, field)
    //   fetchObjectLog.output(logId, {
    //     typeBuffer: this.typeBuffer,
    //     result
    //   })
    //   return result
    // }
    // this.fetchObject = mock
  }

  // log('int')(field, i.toString(16), i)
  readInt = (field: string) =>
    readInt(this.typeBuffer, field)

  fetchInt(field: string = '') {
    return this.readInt(`${ field }:int`)
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
  fetchIntBytes(bits: number, field: string = '') {
    if (bits % 32)
      throw new Error(`Invalid bits: ${bits}`)

    const len = bits / 8

    const bytes = this.typeBuffer.next(len)

    debug(`int bytes`)(bytesToHex(bytes), `${ field }:int${  bits}`)

    return bytes
  }

  fetchRawBytes(len: number | false, field: string = '') {
    if (len === false) {
      len = this.readInt(`${ field }_length`)
      if (len > this.typeBuffer.byteView.byteLength)
        throw new Error(`Invalid raw bytes length: ${  len  }, buffer len: ${this.typeBuffer.byteView.byteLength}`)
    }
    const bytes = this.typeBuffer.next(len)
    debug(`raw bytes`)(bytesToHex(bytes), field)

    return bytes
  }

  fetchPacked(type, field: string = '') {
    const compressed = readBytes( this.typeBuffer, `${field}[packed_string]`)
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

  fetchVector(type: string, field: string = '') {
    // const typeProps = getTypeProps(type)
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

  fetchObject(type, field: string = '') {

    switch (type) {
      case '#':
      case 'int':
        return this.fetchInt(field)
      case 'long':
        return readLong(this.typeBuffer, field)
      case 'int128':
        return this.fetchIntBytes(128, field)
      case 'int256':
        return this.fetchIntBytes(256, field)
      case 'int512':
        return this.fetchIntBytes(512, field)
      case 'string':
        return readString(this.typeBuffer, field)
      case 'bytes':
        return readBytes(this.typeBuffer, field)
      case 'double':
        return readDouble(this.typeBuffer, field)
      case 'Bool':
        return this.fetchBool(field)
      case 'true':
        return true
    }
    let fallback
    field = field || type || 'Object'

    // const layer = this.mtproto
    //   ? mtLayer
    //   : apiLayer
    const typeProps = getTypeProps(type)
    // layer.typesById

    if (typeProps.isVector)
      return this.fetchVector(type, field)

    const schema = selectSchema(this.mtproto, this.api, this.mtApi)
    let predicate = false
    let constructorData = false

    if (typeProps.isBare)
      constructorData = getNakedType(type, schema)
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
      for (const param of constructorData.params) {
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

    if (apiLayer.seqSet.has(predicate)) {
      this.emitter.emit('seq', result)
    }

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
  apiLayer: Layout,
  mtLayer: Layout,
  Serialization: SerializationFabric,
  Deserialization: DeserializationFabric
}

export const TL = (api: TLSchema, mtApi: TLSchema) => ({
  on           : emitter.on.bind(emitter),
  apiLayer     : !apiLayer ? apiLayer = new Layout(api) : apiLayer,
  mtLayer      : !mtLayer ? mtLayer = new Layout(mtApi) : mtLayer,
  Serialization: ({ mtproto = false, startMaxLength = 2048 /* 2Kb */ } = {}) =>
    new Serialization({ mtproto, startMaxLength }, api, mtApi),
  Deserialization: (buffer: Buffer, { mtproto = false, override = {} }: DConfig = {}) =>
    new Deserialization(buffer, { mtproto, override }, api, mtApi)
})


export { TypeWriter } from './type-buffer'
export default TL
