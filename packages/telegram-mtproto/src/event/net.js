//@flow

import { Future, encaseP3 } from 'fluture'
import { type Fluture } from 'fluture'
// import { Ok, Error } from 'folktale/result'

import { type Bus } from './bus'
import { MTProto } from '../service/main'

export const sendBinary = (ctx: MTProto) =>
  ctx.bus$.net.sendBinary

