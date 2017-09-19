//@flow

import { TypeBuffer } from './type-buffer'
import { lshift32 } from 'Bin'

// import Logger from 'mtproto-logger'
// const log = Logger`tl:reader`



export function readInt(ctx: TypeBuffer): number {
  const result = ctx.nextInt()
  return result
}

export function readLong(ctx: TypeBuffer) {
  const iLow: number = readInt(ctx)
  const iHigh: number = readInt(ctx)

  const res = lshift32(iHigh, iLow)
  return res
}

export function readDouble(ctx: TypeBuffer) {
  const buffer = new ArrayBuffer(8)
  const intView = new Int32Array(buffer)
  const doubleView = new Float64Array(buffer)

  intView[0] = readInt(ctx)
  intView[1] = readInt(ctx)

  return doubleView[0]
}

export function readString(ctx: TypeBuffer) {
  const bytes = readBytes(ctx)
  const sUTF8 = [...bytes]
    .map(getChar)
    .join('')

  return safeEscape(sUTF8)
}

function safeEscape(str: string) {
  let s
  try {
    s = decodeURIComponent(escape(str))
  } catch (e) {
    s = str
  }

  return s
}

export function readBytes(ctx: TypeBuffer) {
  let len = ctx.nextByte()

  if (len == 254) {
    len = ctx.nextByte() |
        ctx.nextByte() << 8 |
        ctx.nextByte() << 16
  }

  const bytes = ctx.next(len)
  ctx.addPadding()

  return bytes
}


const getChar = (e: number) => String.fromCharCode(e)
