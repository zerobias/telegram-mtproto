//@flow

// import Promise from 'bluebird'

import { NetMessage } from './net-message'

type MessageMap = Map<string, NetMessage>
type PendingMap = Map<string, number>
type ResendSet = Set<string>

class Pool {
  sent: MessageMap = new Map()
  pending: PendingMap = new Map()
  resend: ResendSet = new Set()
  addResend(msg_id: string) {
    return this.resend.add(msg_id)
  }
  hasResends() {
    return this.resend.size > 0
  }
  deleteResent(msg_id: string) {
    return this.resend.delete(msg_id)
  }
  getResends() {
    return this.resend.values()
  }


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
  sentIterator() {
    return this.sent.entries()
  }

  setPending(msg_id: string, value: number = 0) {
    return this.pending.set(msg_id, value)
  }
  hasPending(msg_id: string) {
    return this.pending.has(msg_id)
  }
  deletePending(msg_id: string) {
    return this.pending.delete(msg_id)
  }
  pendingIterator() {
    return this.pending.entries()
  }
}

export default Pool