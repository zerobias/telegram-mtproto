//@flow

import {
  type IncomingType,
  type RawMessage,
  type RawContainer,
  type RawObject,
  type ApiData,
  type RawError,
  type RawBody,
  type RawInner,
  type MessageDraft,
  type SystemMessage,
} from './index.h'
import { initFlags, isApiObject } from './fixtures'



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
      body = { ...body, inner: { container: ctx.messageID } }
      //$FlowIssue
      const data: RawInner = msg.raw
      if (hasBody(data)) {
        const insideInner = data.body
        // body = { ...body, body: insideInner }
        const { flagsResult, accResult } = processInners(ctx, msg, insideInner)
        flags = { ...flags, ...flagsResult }
        if (accResult != null)
          body = { ...body, ...accResult }
      }
      break
    }
    case 'object': {
      //$FlowIssue
      const data: RawObject = msg.raw
      const { flagsResult, accResult } = processInners(ctx, msg, data)
      flags = { ...flags, ...flagsResult }
      if (accResult != null)
        body = { ...body, ...accResult }
      break
    }
    default: {
      throw new TypeError(`Wrong draft type ${msg.type}`)
    }
  }
  return { flags, ...body, ...omitRaw(msg) }
}

const omitRaw = ({ raw, type, ...msg }) => msg

function processInners(ctx: IncomingType, msg: MessageDraft, body) {
  switch (body._) {
    case 'rpc_result': {
      //$FlowIssue
      const rpcBody: RawBody = body
      return processRpc(ctx, msg, rpcBody)
    }
    default: {
      const accResult: {
        +body: SystemMessage,
      } = { body }
      return {
        flagsResult: { body: true },
        accResult,
      }
    }
  }
}

function processRpc(ctx: IncomingType, msg: MessageDraft, body: RawBody) {
  const outID: string = body.req_msg_id
  let flagsResult = {
    body        : false,
    methodResult: true,
    api         : true,
  }
  let accResult = {
    methodResult: { outID },
  }
  const rslt = body.result
  if (isApiObject(rslt)) {
    flagsResult = {
      ...flagsResult,
      body: true,
    }
    accResult = {
      ...accResult,
      body: rslt,
    }
    if (rslt._ === 'rpc_error') {
      flagsResult = {
        ...flagsResult,
        error: true,
      }
      accResult = {
        ...accResult,
        error: {
          code   : rslt.error_code /*:: || 1 */,
          message: rslt.error_message /*:: || '' */,
        }
      }
    }
  }
  return {
    flagsResult,
    accResult,
  }
}

function hasBody(msg: RawInner): boolean %checks {
  return (
    isApiObject(msg)
    && isApiObject(msg.body)
  )
}

function hasResult(msg: RawBody | RawError/*  | RawObject */): boolean %checks {
  return (
    msg._ === 'rpc_result'
    && typeof msg.req_msg_id === 'string'
    && msg.result != null
  )
}

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
