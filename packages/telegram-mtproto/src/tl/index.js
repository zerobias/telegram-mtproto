//@flow

import EventEmitter from 'eventemitter2'
import { dTime } from 'mtproto-shared'

import {
  uintToInt,
  intToUint,
  gzipUncompress,
  bytesToArrayBuffer,
} from 'Bin'

import { readLong, readInt, readBytes, readString, readDouble } from './reader'
import { writeInt, writeIntBytes, writeBytes, writeDouble,
  writeBool, writeLong } from './writer'

import Layout, { getFlags, isSimpleType, getTypeProps } from '../layout'
import { TypeBuffer, TypeWriter, getNakedType, getTypeConstruct } from './type-buffer'
import Config, { getConfig } from 'ConfigProvider'
import type { MsgGetter } from './index.h'
import { NetMessage } from '../service/networker/net-message'

// import Logger from 'mtproto-logger'
// const log = Logger`tl,read`

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

function isArray(list: mixed): boolean %checks {
  return Array.isArray(list) || list instanceof Uint8Array
}

function assertArray<P: $Pred<1>>(
  paramName: string,
  methodName: string,
  list: mixed,
  cb: P
): $Refine<number[] | Uint8Array, P, 1> {
  if (cb(list)) return list
  const message = `Vector argument ${paramName} in ${methodName} required Array or Uint8Array,
got ${String(list)} ${typeof list}`
  throw new TypeError(message)
}

// function refine<P: $Pred<1>>(v: mixed, cb: P): $Refine<Identity<mixed>, P, 1> {
//   if (cb(v)) {
//     return v
//   }
//   throw new Error()
// }

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
  getBytesPlain() {
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

    writeInt(this.writer, intToUint(`${pred.id}`))
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
        const vector = assertArray(paramName, methodName, fieldObj, isArray)
        writeInt(this.writer, 0x1cb5c415)
        writeInt(this.writer, vector.length)
        for (let i = 0, elem; i < vector.length; i++) {
          elem = vector[i]
          this.storeObject(elem, param.typeClass, `${paramName}[${i}]`)
        }
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
  storeObject(obj: *, inputType: string, field: string) {
    switch (inputType) {
      case '#':
      case 'int':
        return writeInt(this.writer, obj)
      case 'long':
        return writeLong(this.writer, obj)
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
        return writeDouble(this.writer, obj)
      case 'Bool':
        return writeBool(this.writer, obj)
      case 'true':
        return
    }

    let type = inputType

    if (Array.isArray(obj) || obj instanceof Uint8Array) {
      if (type.substr(0, 6) == 'Vector')
        writeInt(this.writer, 0x1cb5c415)
      else if (type.substr(0, 6) != 'vector') {
        ERR.S.vectorType(type)
      }
      const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
      writeInt(this.writer, obj.length)
      for (let i = 0; i < obj.length; i++) {
        this.storeObject(obj[i], itemType, `${field  }[${  i  }]`)
      }
      return true
    } else if (type.substr(0, 6).toLowerCase() == 'vector') {
      ERR.S.vectorObject()
    }

    if (typeof obj !== 'object')
      ERR.S.objectForType(type)

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
      ERR.S.noPredicate(predicate)

    if (predicate == type)
      isBare = true

    if (!isBare)
      writeInt(this.writer, intToUint(constructorData.id))

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
  /*:: override: * */
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

  fetchInt(): number {
    return readInt(this.typeBuffer)
  }

  fetchBool(field: string = '') {
    const i = this.fetchInt()
    switch (i) {
      case 0x997275b5: return true
      case 0xbc799737: return false
      default: {
        this.typeBuffer.offset -= 4
        return this.fetchObject('Object', field)
      }
    }
  }
  fetchIntBytes(bitss: number): Uint8Array {
    let bits = bitss
    if (Array.isArray(bits)) {
      console.trace()
      bits = bitss[0]
    }
    if (bits % 32) {
      console.error(bits, typeof bits, Array.isArray(bits))
      throw new Error(`Invalid bits: ${bits}`)
    }
    const len = bits / 8

    const bytes = this.typeBuffer.next(len)
    return bytes
  }

  fetchRawBytes(len: number | false): Uint8Array {
    let ln: number
    if (typeof len === 'number')
      ln = len
    else if (typeof len === 'boolean' && len === false) {
      ln = this.fetchInt()
      if (ln > this.typeBuffer.byteView.byteLength)
        throw new Error(`Invalid raw bytes length: ${ln}, buffer len: ${this.typeBuffer.byteView.byteLength}`)
    } else
      throw new TypeError(`[fetchRawBytes] len must be number or false, get ${typeof len}`)
    const bytes = this.typeBuffer.next(ln)
    return bytes
  }

  fetchPacked(type: string, field: string = '') {
    const compressed = readBytes( this.typeBuffer)
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
      const constructor = this.fetchInt()
      const constructorCmp = uintToInt(constructor)

      if (constructorCmp === PACKED)
        return this.fetchPacked(type, field)
      if (constructorCmp !== 0x1cb5c415)
        throw new Error(`Invalid vector constructor ${constructor}`)
    }
    const len = this.fetchInt()
    const result = []
    if (len > 0) {
      const itemType = type.substr(7, type.length - 8) // for "Vector<itemType>"
      for (let i = 0; i < len; i++)
        result.push(this.fetchObject(itemType, `${field}[${i}]`))
    }

    return result
  }

  fetchObject(type: string, inputField: string = '') {

    switch (type) {
      case '#':
      case 'int':
        return this.fetchInt()
      case 'long':
        return readLong(this.typeBuffer)
      case 'int128':
        return this.fetchIntBytes(128)
      case 'int256':
        return this.fetchIntBytes(256)
      case 'int512':
        return this.fetchIntBytes(512)
      case 'string':
        return readString(this.typeBuffer)
      case 'bytes':
        return readBytes(this.typeBuffer)
      case 'double':
        return readDouble(this.typeBuffer)
      case 'Bool':
        return this.fetchBool(inputField)
      case 'true':
        return true
    }
    let fallback
    const field = inputField || type || 'Object'

    const typeProps = getTypeProps(type)

    if (typeProps.isVector)
      return this.fetchVector(type, field)

    const { apiSchema, mtSchema } = Config.schema.get(this.uid)

    const schema = this.mtproto
      ? mtSchema
      : apiSchema
    let predicate = false
    let constructorData

    if (typeProps.isBare)
      constructorData = getNakedType(type, schema)
    else {
      const constructor = this.fetchInt()
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
        ERR.D.constructorNotFound(constructor, this.fetchInt(), this.fetchInt())
      }
    }
    if (!constructorData) {
      throw new Error(`Constructor not found: ${type} ${field}`)
    }
    predicate = constructorData.predicate

    const result = { '_': predicate }

    const isOverrided =
      predicate === 'rpc_result'
      || predicate === 'message'

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
      let subtype: string
      for (const param of constructorData.params) {
        subtype = param.type
        // if (type === '#' && isNil(result.pFlags))
        //   result.pFlags = {}
        if (subtype.indexOf('?') !== -1) {
          const condType = subtype.split('?')
          const fieldBit = condType[0].split('.')
          const fieldName = fieldBit[0]
          const bit: any = fieldBit[1]
          if (!(result[fieldName] & 1 << bit))
            continue
          subtype = condType[1]
        }
        const paramName = param.name
        const value = this.fetchObject(subtype, `${field}[${predicate}][${paramName}]`)

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
    result.req_msg_id = readLong(this.typeBuffer)
    if (this.getter == null) return result
    const sentMessage: NetMessage = this.getter(result)
    const type = sentMessage && sentMessage.resultType || 'Object'

    if (result.req_msg_id && !sentMessage) return
    result.result = this.fetchObject(type, `${ field }[result]`)
  }

  message(result: { [key: string]: * }, field: string) {

    const msg_id = readLong(this.typeBuffer)
    const seqno = readInt(this.typeBuffer)
    const bytes = readLong(this.typeBuffer)
    const offset = this.getOffset()

    try {
      result.body = this.fetchObject('Object', `${ field }[body]`)
    } catch (e) {
      console.error(dTime(), 'parse error', e.message, e.stack)
      result.body = { _: 'parse_error', error: e }
    }
    if (this.typeBuffer.offset != offset + bytes) {
      // console.warn(dTime(), 'set offset', this.offset, offset, result.bytes)
      // console.log(dTime(), result)
      this.typeBuffer.offset = offset + bytes
    }
    result.seqno = seqno
    result.bytes = bytes
    result.msg_id = msg_id
    // console.log(dTime(), 'override message', result)
  }

}

const ERR = {
  S: {
    vectorType(type): empty {
      throw new Error(`Invalid vector type ${type}`)
    },
    vectorObject(): empty {
      throw new Error('Invalid vector object')
    },
    objectForType(type): empty {
      throw new Error(`Invalid object for type ${type}`)
    },
    noPredicate(predicate): empty {
      throw new Error(`No predicate ${predicate} found`)
    }
  },
  D: {
    constructorNotFound(constr, intA, intB): empty {
      throw new Error(`Constructor not found: ${constr} ${intA} ${intB}`)
    }
  }
}

export { TypeWriter } from './type-buffer'
