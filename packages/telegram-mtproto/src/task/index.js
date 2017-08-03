//@flow
import { type ApiCallResult } from '../state/action'
import flattenMessages from './flatten'

export default function processTask(data: ApiCallResult) {
  const messages = flattenMessages(data)
  const result = processing(messages, data)
  return data
}

function processing(messages, data) {
  return messages.map(msg => singleMessageProcess(msg, data))
}

function singleMessageProcess(message, data) {
  const { thread } = data
  switch (message._) {
    case 'msg_container': {
      break
    }
    case 'msgs_ack': {
      message.msg_ids.forEach(thread.processMessageAck)
      break
    }
    case 'rpc_result': {
      thread.ackMessage(data.message.msg_id)
      const sentMessage =
        thread.state.getSent(message.req_msg_id)
      thread.processMessageAck(message.req_msg_id)
      if (!sentMessage) break
      const { result = null } = message
      if (result == null) break
      console.log('sentMessage', sentMessage, 'message.result', result._)
      break
    }
    case 'rpc_error': {
      thread.emit('rpc-error', {
        threadID   : thread.threadID,
        networkerDC: thread.dcID,
        error      : message,
        sentMessage: data.message,
        message
      })
      break
    }
    case 'message': {
      singleMessageProcess(message.body, data)
      break
    }
    default: {
      console.warn('Unhandled message', message)
    }
  }
}
