//@flow

import { TypeWriter } from './type-buffer'
import { longToInts, stringToChars } from 'Bin'

// import Logger from 'mtproto-logger'
// const log = Logger`tl:writer`

import type { BinaryData } from './index.h'


export function writeInt(ctx: TypeWriter, i: number) {
  ctx.writeInt(i)
}

export function writeBool(ctx: TypeWriter, i: boolean) {
  if (i) {
    ctx.writeInt(0x997275b5)
  } else {
    ctx.writeInt(0xbc799737)
  }
}

export function writeLongP(
  ctx: TypeWriter,
  iHigh: number,
  iLow: number
) {
  ctx.writePair(iLow, iHigh)
}

export function writeLong(
  ctx: TypeWriter,
  sLong?: number[] | string | number
) {
  if (Array.isArray(sLong))
    return sLong.length === 2
      ? writeLongP(ctx, sLong[0], sLong[1])
      : writeIntBytes(ctx, sLong, 64)
  let str
  if (typeof sLong !== 'string')
    str = sLong
      ? sLong.toString()
      : '0'
  else str = sLong
  const [int1, int2] = longToInts(str)
  ctx.writePair(int2, int1)
}

export function writeDouble(ctx: TypeWriter, f: number) {
  const buffer = new ArrayBuffer(8)
  const intView = new Int32Array(buffer)
  const doubleView = new Float64Array(buffer)

  doubleView[0] = f

  const [int1, int2] = intView
  ctx.writePair(int2, int1)
}

export function writeBytes(
  ctx: TypeWriter,
  bytes?: number[] | ArrayBuffer | string
) {
  const { list, length } = binaryDataGuard(bytes)
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

export function writeIntBytes(
  ctx: TypeWriter,
  bytes: BinaryData  | ArrayBuffer | string,
  bits: number | false
) {
  const { list, length } = binaryDataGuard(bytes)

  if (bits) {
    if (bits % 32 || length * 8 != bits) {
      console.warn(bits)
      console.trace()
      throw new Error(`Invalid bits: ${  bits  }, ${length}`)
    }
  }
  ctx.checkLength(length)
  ctx.set(list, length)
}


function binaryDataGuard(bytes?: number[] | ArrayBuffer | Uint8Array | string) {
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
    const stub: number[] = []
    list = stub
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
