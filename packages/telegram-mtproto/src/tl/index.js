//@flow

import EventEmitter from 'eventemitter2'

import { uintToInt, intToUint, bytesToHex,
  gzipUncompress, bytesToArrayBuffer } from '../bin'

import { dTime } from 'mtproto-shared'
import { readLong, readInt, readBytes, readString, readDouble } from './reader'
import { writeInt, writeIntBytes, writeBytes, writeDouble,
  writeBool, writeLong } from './writer'

import Layout, { getFlags, isSimpleType, getTypeProps } from '../layout'
import { TypeBuffer, TypeWriter, getNakedType, getTypeConstruct } from './type-buffer'
import Config, { getConfig } from '../config-provider'
import type { MsgGetter } from './index.h'
import { NetMessage } from '../service/networker/net-message'
// import writer from '../util/file-log'

// const storeMethodLog = writer('storeMethod')
// const fetchObjectLog = writer('fetchObject')

import Logger from 'mtproto-logger'
const logr = Logger`tl,read`

const PACKED = 0x3072cfa1

type SerialConstruct = {
  mtproto?: boolean,
  startMaxLength?: number
}

type DConfig = {
  mtproto?: boolean,
  override?: *,
  getter?: MsgGetter
}

export class Serialization {
  writer: TypeWriter = new TypeWriter()
  uid: string
  mtproto: boolean
  apiLayer: Layout
  mtLayer: Layout

  constructor(
    {
      mtproto = false,
      startMaxLength = 2048 /* 2Kb */
    }: SerialConstruct,
    uid: string) {

    this.uid = uid

    this.writer.maxLength = startMaxLength

    this.writer.reset()
    this.mtproto = mtproto
  }
  getBytes: () => number[]
  getBytes: (typed: false) => number[]
  getBytes: (typed: true) => Uint8Array
  getBytes(typed?: boolean) {
    if (typed)
      return this.writer.getBytesTyped()
    else
      return this.writer.getBytesPlain()
  }

  storeMethod(methodName: string, params: { [key: string]: * }) {
    // const logId = storeMethodLog.input({
    //   methodName,
    //   params
    // })

    const layer = this.mtproto
      ? Config.layer.mtLayer(this.uid)
      : Config.layer.apiLayer(this.uid)
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
      if (typeof params[paramName] === 'undefined') {
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
        return writeIntBytes(this.writer, obj, 128)
      case 'int256':
        return writeIntBytes(this.writer, obj, 256)
      case 'int512':
        return writeIntBytes(this.writer, obj, 512)
      case 'string':
        return writeBytes(this.writer, obj)
      case 'bytes':
        return writeBytes(this.writer, obj)
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

    if (typeof obj !== 'object')
      throw new Error(`Invalid object for type ${  type}`)

    const schema = this.mtproto
      ? Config.schema.mtSchema(this.uid)
      : Config.schema.apiSchema(this.uid)

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
        const flagIndex = parseInt(fieldBit[1], 10)
        if (!(obj.fiags & 1 << flagIndex)) {
          continue
        }
        type = condType[1]
      }

      this.storeObject(obj[param.name], type, `${field}.${  predicate  }.${  param.name  }`)
    }
    if (typeof constructorData === 'boolean')
      return constructorData
    return constructorData.type
  }

}

const emitter = new EventEmitter({ wildcard: true })

export class Deserialization {
  typeBuffer: TypeBuffer
  override: *
  mtproto: boolean
  uid: string
  emitter: EventEmitter
  getter: ?MsgGetter

  constructor(
    buffer: Buffer | ArrayBuffer,
    {
      mtproto = false,
      override = {},
      getter
    }: DConfig,
    uid: string) {

    this.getter = getter
    this.uid = uid
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

  fetchInt(field: string = ''): number {
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
  fetchIntBytes(bits: number, field: string = ''): Uint8Array {
    if (bits % 32)
      throw new Error(`Invalid bits: ${bits}`)

    const len = bits / 8

    const bytes = this.typeBuffer.next(len)

    logr(`int bytes`)(bytesToHex(bytes), `${ field }:int${  bits}`)

    return bytes
  }

  fetchRawBytes(len: number | false, field: string = ''): Uint8Array {
    let ln: number
    if (typeof len === 'number')
      ln = len
    else if (typeof len === 'boolean' && len === false) {
      ln = this.readInt(`${ field }_length`)
      if (ln > this.typeBuffer.byteView.byteLength)
        throw new Error(`Invalid raw bytes length: ${ln}, buffer len: ${this.typeBuffer.byteView.byteLength}`)
    } else
      throw new TypeError(`[fetchRawBytes] len must be number or false, get ${typeof len}`)
    const bytes = this.typeBuffer.next(ln)
    logr(`raw bytes`)(bytesToHex(bytes), field)

    return bytes
  }

  fetchPacked(type: string, field: string = '') {
    const compressed = readBytes( this.typeBuffer, `${field}[packed_string]`)
    const uncompressed = gzipUncompress(compressed)
    const buffer = bytesToArrayBuffer(uncompressed)
    const newDeserializer = new Deserialization(
      buffer, {
        mtproto : this.mtproto,
        override: this.override
      },
      this.uid)

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

  fetchObject(type: string, field: string = '') {

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

    const { apiSchema, mtSchema } = Config.schema.get(this.uid)

    const schema = this.mtproto
      ? mtSchema
      : apiSchema
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
        const schemaFallback = apiSchema
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

    const isOverrided =
      predicate === 'rpc_result' ||
      predicate === 'message'

    if (this.mtproto && isOverrided) {
      switch (predicate) {
        case 'rpc_result': {
          this.rpc_result(result, `${field}[${predicate}]`)
          break
        }
        case 'message': {
          this.message(result, `${field}[${predicate}]`)
          break
        }
      }
    } else {
      for (const param of constructorData.params) {
        type = param.type
        // if (type === '#' && isNil(result.pFlags))
        //   result.pFlags = {}
        if (type.indexOf('?') !== -1) {
          const condType = type.split('?')
          const fieldBit = condType[0].split('.')
          const fieldName = fieldBit[0]
          const bit: any = fieldBit[1]
          if (!(result[fieldName] & 1 << bit))
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
    const { layer: { apiLayer } } = getConfig(this.uid)
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

  rpc_result(result: { [key: string]: * }, field: string) {
    result.req_msg_id = readLong(this.typeBuffer, `${ field }[req_msg_id]`)
    if (this.getter == null) return result
    const sentMessage: NetMessage = this.getter(result)
    const type = sentMessage && sentMessage.resultType || 'Object'

    if (result.req_msg_id && !sentMessage) {
      // console.warn(dTime(), 'Result for unknown message', result)
      return
    }
    result.result = this.fetchObject(type, `${ field }[result]`)
      // console.log(dTime(), 'override rpc_result', sentMessage, type, result)
  }

  message(result: { [key: string]: * }, field: string) {
    result.msg_id = readLong(this.typeBuffer, `${ field }[msg_id]`)
    result.seqno = readInt(this.typeBuffer, `${ field }[seqno]`)
    result.bytes = readInt(this.typeBuffer, `${ field }[bytes]`)

    const offset = this.getOffset()

    try {
      result.body = this.fetchObject('Object', `${ field }[body]`)
    } catch (e) {
      console.error(dTime(), 'parse error', e.message, e.stack)
      result.body = { _: 'parse_error', error: e }
    }
    if (this.typeBuffer.offset != offset + result.bytes) {
      // console.warn(dTime(), 'set offset', this.offset, offset, result.bytes)
      // console.log(dTime(), result)
      this.typeBuffer.offset = offset + result.bytes
    }
    // console.log(dTime(), 'override message', result)
  }

}



export { TypeWriter } from './type-buffer'

