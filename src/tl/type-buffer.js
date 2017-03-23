//@flow

import isNode from 'detect-node'

import Logger from '../util/log'
const log = Logger('tl', 'type-buffer')

import { immediate } from '../util/smart-timeout'
import { TypeBufferIntError } from '../error'

// import { bigint, uintToInt, intToUint, bytesToHex,
//   gzipUncompress, bytesToArrayBuffer, longToInts, lshift32 } from '../bin'

type TLParam = {
  name: string,
  type: string
}

export type TLConstruct = {
  id: string,
  type: string,
  predicate: string,
  params: TLParam[]
}

type TLMethod = {
  id: string,
  type: string,
  method: string,
  params: TLParam[]
}

export type TLSchema = {
  constructors: TLConstruct[],
  methods: TLMethod[],
  constructorsIndex?: number[]
}

type HasTypeBuffer = {
  typeBuffer: TypeBuffer
}

export const readInt = (ctx: HasTypeBuffer) => (field: string) => {
  const i = ctx.typeBuffer.nextInt()
  // log('int')(field, i.toString(16), i)
  return i
}

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
  offset: number = 0
  buffer: ArrayBuffer
  intView: Int32Array
  byteView: Uint8Array
  maxLength: number
  constructor(startMaxLength: number) {
    this.maxLength = startMaxLength
    this.reset()
  }
  reset() {
    this.buffer = new ArrayBuffer(this.maxLength)
    this.intView = new Int32Array(this.buffer)
    this.byteView = new Uint8Array(this.buffer)
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
  writeInt(i: number) {
    // immediate(writeIntLog, i, field)

    this.checkLength(4)
    this.intView[this.offset / 4] = i
    this.offset += 4
  }
  addPadding() {
    while (this.offset % 4)
      this.next(0)
  }
  writeArray(list?: ArrayBuffer | string | number[]) {
    let iter, length

    if (list === undefined)
      iter = []
    else if (typeof list === 'string')
      iter = stringToNums(list)
    // else if (list instanceof ArrayBuffer)
    //   iter = new Uint8Array(list)
    else iter = list

    if (list instanceof ArrayBuffer)
      length = list.byteLength
    else
      length = iter.length

    this.checkLength(length + 8)

    if (length <= 253)
      this.next(length)
    else {
      this.next(254)
      this.next(length & 0xFF)
      this.next((length & 0xFF00) >> 8)
      this.next((length & 0xFF0000) >> 16)
    }

    this.set(iter, length)

    this.addPadding()
  }
  set(list: number[] | Uint8Array, length: number) {
    this.byteView.set(list, this.offset)
    this.offset += length
  }
  writeBytes(bytes: number[] | ArrayBuffer, cond: (ln: number) => void) {
    let iter
    if (bytes instanceof ArrayBuffer)
      iter = new Uint8Array(bytes)
    else
      iter = bytes
    const length = iter.length
    cond(length)
    this.checkLength(length)

    this.set(iter, length)
  }
}

const stringToNums = (str: string) => [...str].map(e => e.charCodeAt(0))

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
