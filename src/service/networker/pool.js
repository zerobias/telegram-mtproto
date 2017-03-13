//@flow

// import Promise from 'bluebird'

import { NetMessage } from './net-message'

type MessageMap = Map<string, NetMessage>

class Pool {
  sent: MessageMap = new Map()
  addSent(message: NetMessage) {
    this.sent.set(message.msg_id, message)
  }
  getSent(msg_id: string): NetMessage {
    //$FlowIssue
    return this.sent.get(msg_id)
  }
  hasSent(msg_id: string) {
    return this.sent.has(msg_id)
  }
  deleteSent(message: NetMessage) {
    return this.sent.delete(message.msg_id)
  }
  iterator() {
    return this.sent.entries()
  }
}

export default Pool