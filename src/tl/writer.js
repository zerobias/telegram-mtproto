//@flow

import { TypeWriter } from './type-buffer'
import { longToInts, stringToChars } from '../bin'

// import Logger from '../util/log'
// const log = Logger`tl:writer`

import type { BinaryData } from './index.h'


export function writeInt(ctx: TypeWriter, i: number, field: string = '') {
  ctx.writeInt(i, `${ field }:int`)
}

export function writeBool(ctx: TypeWriter, i: boolean, field: string = '') {
  if (i) {
    ctx.writeInt(0x997275b5, `${ field }:bool`)
  } else {
    ctx.writeInt(0xbc799737, `${ field }:bool`)
  }
}

export function writeLongP(ctx: TypeWriter,
                           iHigh: number,
                           iLow: number,
                           field: string) {
  ctx.writePair(iLow, iHigh,
                `${ field }:long[low]`,
                `${ field }:long[high]`)
}

export function writeLong(ctx: TypeWriter,
                          sLong?: number[] | string | number,
                          field: string = '') {
  if (Array.isArray(sLong))
    return sLong.length === 2
        ? writeLongP(ctx, sLong[0], sLong[1], field)
        : writeIntBytes(ctx, sLong, 64, field)
  let str
  if (typeof sLong !== 'string')
    str = sLong
        ? sLong.toString()
        : '0'
  else str = sLong
  const [int1, int2] = longToInts(str)
  ctx.writePair(int2, int1,
                `${ field }:long[low]`,
                `${ field }:long[high]`)
}

export function writeDouble(ctx: TypeWriter,
                            f: number,
                            field: string = '') {
  const buffer = new ArrayBuffer(8)
  const intView = new Int32Array(buffer)
  const doubleView = new Float64Array(buffer)

  doubleView[0] = f

  const [int1, int2] = intView
  ctx.writePair(int2, int1,
                `${ field }:double[low]`,
                `${ field }:double[high]`)
}

export function writeBytes(ctx: TypeWriter,
                           bytes?: number[] | ArrayBuffer | string,
                           /*field: string = ''*/) {
  const { list, length } = binaryDataGuard(bytes)
    // debug && console.log('>>>', bytesToHex(bytes), `${ field }:bytes`)

  ctx.checkLength(length + 8)
  if (length <= 253) {
    ctx.next(length)
  } else {
    ctx.next(254)
    ctx.next(length & 0xFF)
    ctx.next((length & 0xFF00) >> 8)
    ctx.next((length & 0xFF0000) >> 16)
  }

  ctx.set(list, length)
  ctx.addPadding()
}

export function writeIntBytes(ctx: TypeWriter,
                              bytes: BinaryData  | ArrayBuffer | string,
                              bits: number | false,
                              /*field: string = ''*/) {
  const { list, length } = binaryDataGuard(bytes)

  if (bits) {
    if (bits % 32 || length * 8 != bits) {
      throw new Error(`Invalid bits: ${  bits  }, ${length}`)
    }
  }
  // debug && console.log('>>>', bytesToHex(bytes), `${ field }:int${  bits}`)
  ctx.checkLength(length)
  ctx.set(list, length)
}


const binaryDataGuard = (bytes?: number[] | ArrayBuffer | Uint8Array | string) => {
  let list, length
  if (bytes instanceof ArrayBuffer) {
    list = new Uint8Array(bytes)
    length = bytes.byteLength
  } else if (typeof bytes === 'string') {
    list =
      stringToChars(
        unescape(
          encodeURIComponent(
            bytes)))
    length = list.length
  } else if (bytes === undefined) {
    list = []
    length = 0
  } else {
    list = bytes
    length = bytes.length
  }
  return {
    list,
    length
  }
}