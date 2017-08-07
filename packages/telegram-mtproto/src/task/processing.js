//@flow

import {
  type RawInput,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type RawInner,
  type MessageDraft,
} from './index.h'
import { initFlags } from './fixtures'

type IncomingType = RawInput & {
  messageID: string,
  sessionID: Uint8Array,
  seqNo: number
}

export default function processing(ctx: IncomingType, list: MessageDraft[]) {
  return list.map(msg => processSingle(ctx, msg))
}

function processSingle(ctx: IncomingType, msg: MessageDraft) {
  let { flags, ...body } = getIncoming()
  flags = initFlags(flags)
  switch (msg.type) {
    case 'container': {
      flags = { ...flags, container: true }
      //$FlowIssue
      const contains: string[] = msg.raw
      body = { ...body, container: { contains } }
      break
    }
    case 'inner': {
      flags = { ...flags, inner: true }
      break
    }
    case 'object': {

      break
    }
    default: {
      throw new TypeError(`Wrong draft type ${msg.type}`)
    }
  }
  return { flags, ...body, ...omitRaw(msg) }
}

const omitRaw = ({ raw, ...msg }) => msg

type ContextFn<-Ctx, -E, +R> = (ctx: Ctx, elem: E) => R

const contextMap = <Ctx, E, R>(fn: ContextFn<Ctx, E, R>) => (ctx: Ctx, list: E[]): R[] => list.map((e: E) => fn(ctx, e))


const contextReduce = <Ctx, Src, E>(toElem: (x: Src) => E, fns: Array<((ctx: Ctx, src: Src, e: E) => E)>) =>
  (ctx: Ctx) => (src: Src): E => {
    let e = toElem(src)
    for (let i = 0, ln = fns.length; i< ln; i++) {
      const fn = fns[i]
      const result = fn(ctx, src, e)
      e = result
    }
    return e
  }


const mergeFragments = ({ flags: flags1, ...o1 }, { flags: flags2, ...o2 }) => ({
  flags: {
    ...flags1,
    ...flags2,
  },
  ...o1,
  ...o2,
})

const getIncoming = () => ({
  flags: {
    incoming: true,
  },
  incoming: {
    timestamp: Date.now()
  }
})
