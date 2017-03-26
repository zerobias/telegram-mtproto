//@flow

import isNode from 'detect-node'

import Logger from '../util/log'
const log = Logger('tl', 'type-buffer')

import { immediate } from '../util/smart-timeout'
import { TypeBufferIntError } from '../error'

// import { bigint, uintToInt, intToUint, bytesToHex,
//   gzipUncompress, bytesToArrayBuffer, longToInts, lshift32 } from '../bin'

import type { BinaryData, TLConstruct, TLSchema } from './index.h'

function findType(val: TLConstruct) {
  return val.type == this
}

function findPred(val: TLConstruct) {
  return val.predicate == this
}

function findId(val: TLConstruct) {
  return val.id == this
}

export const getNakedType = (type: string, schema: TLSchema) => {
  const checkType = type.substr(1)
  const result = schema.constructors.find(findType, checkType)
  if (!result)
    throw new Error(`Constructor not found for type: ${type}`)
  return result
}

export const getPredicate = (type: string, schema: TLSchema) => {
  const result = schema.constructors.find(findPred, type)
  if (!result)
    throw new Error(`Constructor not found for predicate: ${type}`)
  return result
}

export const getTypeConstruct =
  (construct: number, schema: TLSchema) =>
    schema.constructors.find(findId, construct)

const getChar = (e: number) => String.fromCharCode(e)

export const getString = (length: number, buffer: TypeBuffer) => {
  const bytes = buffer.next(length)

  const result = [...bytes].map(getChar).join('')
  buffer.addPadding()
  return result
}

const countNewLength = (maxLength: number, need: number, offset: number) => {
  const e1 = maxLength * 2
  const e2 = offset + need + 16
  const max = Math.max(e1, e2) / 4
  const rounded = Math.ceil(max) * 4
  return rounded
}

const writeIntLogger = log('writeInt')

const writeIntLog = (i: number, field: string) => {
  const hex = i && i.toString(16) || 'UNDEF'
  writeIntLogger(hex, i, field)
}

export class TypeWriter {
  offset: number = 0 // in bytes
  buffer: ArrayBuffer
  intView: Int32Array
  byteView: Uint8Array
  maxLength: number
  constructor(/*startMaxLength: number*/) {
    // this.maxLength = startMaxLength
    // this.reset()
  }
  reset() {
    this.buffer = new ArrayBuffer(this.maxLength)
    this.intView = new Int32Array(this.buffer)
    this.byteView = new Uint8Array(this.buffer)
  }
  set(list: BinaryData, length: number) {
    this.byteView.set(list, this.offset)
    this.offset += length
  }
  next(data: number) {
    this.byteView[this.offset] = data
    this.offset++
  }
  checkLength(needBytes: number) {
    if (this.offset + needBytes < this.maxLength) {
      return
    }
    log('Increase buffer')(this.offset, needBytes, this.maxLength)
    this.maxLength = countNewLength(
      this.maxLength,
      needBytes,
      this.offset
    )
    const previousBuffer = this.buffer
    const previousArray = new Int32Array(previousBuffer)

    this.reset()

    new Int32Array(this.buffer).set(previousArray)
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
  getBytesTyped() {
    const resultBuffer = new ArrayBuffer(this.offset)
    const resultArray = new Uint8Array(resultBuffer)

    resultArray.set(this.byteView.subarray(0, this.offset))

    return resultArray
  }
  getBytesPlain() {
    const bytes = []
    for (let i = 0; i < this.offset; i++) {
      bytes.push(this.byteView[i])
    }
    return bytes
  }
  writeInt(i: number, field: string) {
    immediate(writeIntLog, i, field)

    this.checkLength(4)
    this.intView[this.offset / 4] = i
    this.offset += 4
  }
  writePair(n1: number, n2: number, field1: string, field2: string) {
    this.writeInt(n1, field1)
    this.writeInt(n2, field2)
  }
  addPadding() {
    while (this.offset % 4)
      this.next(0)
  }
}

export class TypeBuffer {
  offset: number = 0
  buffer: Buffer
  intView: Uint32Array
  byteView: Uint8Array
  constructor(buffer: Buffer) {
    this.buffer = buffer
    this.intView = toUint32(buffer)
    this.byteView = new Uint8Array(buffer)
  }

  nextByte() {
    return this.byteView[this.offset++]
  }
  nextInt() {
    if (this.offset >= this.intView.length * 4)
      throw new TypeBufferIntError(this)
    const int = this.intView[this.offset / 4]
    this.offset += 4
    return int
  }
  readPair(field1: string, field2: string) {
    const int1 = this.nextInt(field1)
    const int2 = this.nextInt(field2)
    return [ int1, int2 ]
  }
  next(length: number) {
    const result = this.byteView.subarray(this.offset, this.offset + length)
    this.offset += length
    return result
  }
  isEnd() {
    return this.offset === this.byteView.length
  }
  addPadding() {
    const offset = this.offset % 4
    if (offset > 0)
      this.offset += 4 - offset
  }
}

const toUint32 = (buf: Buffer) => {
  let ln, res
  if (!isNode) //TODO browser behavior not equals, why?
    return new Uint32Array( buf )
  if (buf.readUInt32LE) {
    ln = buf.byteLength / 4
    res = new Uint32Array( ln )
    for (let i = 0; i < ln; i++)
      res[i] = buf.readUInt32LE( i*4 )
  } else {
    //$FlowIssue
    const data = new DataView( buf )
    ln = data.byteLength / 4
    res = new Uint32Array( ln )
    for (let i = 0; i < ln; i++)
      res[i] = data.getUint32( i*4, true )
  }
  return res
}
