//@flow

import { type ApiCallResult } from '../state/action'
import { assertApiType, assertMsgId } from './assert'

export default function flatten(data: ApiCallResult) {
  return flattenMessages(data.result.response)
}

function flattenMessages(rootMessage): Array<*> {
  switch (rootMessage._) {
    case 'msg_container': {
      return rootMessage.messages
        .map(transformInner)
        .concat([simplifyContainer(rootMessage)])
    }
    case 'rpc_result': {
      return [rootMessage]
    }
    case 'msgs_ack': {
      return [rootMessage]
    }
    case 'new_session_created': {
      return [rootMessage]
    }
    case 'message': {
      return flattenMessages(rootMessage.body)
    }
    default: {
      console.log(`Unexpected case`, rootMessage)
      return [rootMessage]
    }
  }
}

function transformInner(message) {
  assertMsgId(message)
  assertApiType(message, 'message')
  message.body && console.log(message.body._)
  // message.body && assertApiType(message.body, 'rpc_result')
  return message
}

function simplifyContainer({ messages, ...rest }) {
  const msgIds = messages.map(({ msg_id }) => msg_id)
  return {
    ...rest,
    messages: msgIds
  }
}
