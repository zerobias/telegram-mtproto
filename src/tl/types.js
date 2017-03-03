//@flow

import isNode from 'detect-node'
import Debug from 'debug'

const debug = Debug('telegram-mtproto:tl:types')

import { TypeBufferIntError } from '../error'

// import { bigint, uintToInt, intToUint, bytesToHex,
//   gzipUncompress, bytesToArrayBuffer, longToInts, lshift32 } from '../bin'


export const readInt = (ctx: any) => (field: string) => {
  const i = ctx.typeBuffer.nextInt()
  debug('[int]', field, i.toString(16), i)
  return i
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
    const data = new DataView( buf )
    ln = data.byteLength / 4
    res = new Uint32Array( ln )
    for (let i = 0; i < ln; i++)
      res[i] = data.getUint32( i*4, true )
  }
  return res
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