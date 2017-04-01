//@flow

import { TypeBuffer } from './type-buffer'
import { lshift32, bytesToHex } from '../bin'

import Logger from '../util/log'
const log = Logger`tl:reader`



export function readInt(ctx: TypeBuffer, field: string) {
  const result = ctx.nextInt()
  log('int')(field, result)
  return result
}

export function readLong(ctx: TypeBuffer, field: string ) {
  const iLow: number = readInt(ctx, `${ field }:long[low]`)
  const iHigh: number = readInt(ctx, `${ field }:long[high]`)

  const res = lshift32(iHigh, iLow)
  return res
}

export function readDouble(ctx: TypeBuffer, field: string) {
  const buffer = new ArrayBuffer(8)
  const intView = new Int32Array(buffer)
  const doubleView = new Float64Array(buffer)

  intView[0] = readInt(ctx, `${ field }:double[low]`)
  intView[1] = readInt(ctx, `${ field }:double[high]`)

  return doubleView[0]
}

export function readString(ctx: TypeBuffer, field: string) {
  const bytes = readBytes(ctx, `${field}:string`)
  const sUTF8 = [...bytes]
    .map(getChar)
    .join('')

  let s
  try {
    s = decodeURIComponent(escape(sUTF8))
  } catch (e) {
    s = sUTF8
  }

  log(`string`)(s, `${field}:string`)

  return s
}

export function readBytes(ctx: TypeBuffer, field: string) {
  let len = ctx.nextByte()

  if (len == 254) {
    len = ctx.nextByte() |
        ctx.nextByte() << 8 |
        ctx.nextByte() << 16
  }

  const bytes = ctx.next(len)
  ctx.addPadding()

  log(`bytes`)(bytesToHex(bytes), `${ field }:bytes`)

  return bytes
}


const getChar = (e: number) => String.fromCharCode(e)