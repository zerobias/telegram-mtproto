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
  type MessageUnit,
} from './index.h'
import { initFlags, isApiObject } from './fixtures'
import { resolveRequest } from '../state/query'
import { MaybeT } from 'Monad'


export default function processing(ctx: IncomingType, list: MessageDraft[]) {
  return list
    .map(msg => processSingle(ctx, msg))
}

//$off
function processSingle(ctx: IncomingType, msg: MessageDraft): MessageUnit {
  let { flags, ...body } = getIncoming()
  flags = initFlags(flags)
  switch (msg.type) {
    case 'container': {
      flags = { ...flags, container: true }
      const contains: string[] = msg.raw
      body = { ...body, container: { contains } }
      break
    }
    case 'inner': {
      flags = { ...flags, inner: true }
      body = { ...body, inner: { container: ctx.messageID } }
      const data: RawInner = msg.raw
      if (hasBody(data)) {
        const insideInner = data.body
        const { flagsResult, accResult } = processInners(ctx, msg, insideInner)
        flags = { ...flags, ...flagsResult }
        if (accResult != null)
          body = { ...body, ...accResult }
      }
      break
    }
    case 'object': {
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
  const { uid, dc } = ctx
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
    const maybeApiID = resolveRequest(uid, dc, outID)
    let apiID: string = '',
        resolved = false
    if (MaybeT.isJust(maybeApiID)) {
      apiID = MaybeT.unsafeGet(maybeApiID)
      resolved = true
    }
    accResult = {
      ...accResult,
      body: rslt,
      api : {
        resolved,
        apiID,
      },
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
          handled: false,
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

const getIncoming = () => ({
  flags: {
    incoming: true,
  },
  incoming: {
    timestamp: Date.now()
  }
})
