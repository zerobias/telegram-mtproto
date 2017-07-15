//@flow

import Bluebird from 'bluebird'

import { tsNow } from '../service/time-manager'
import { NetworkerThread } from '../service/networker/index'
import { active } from '../state/signal'

import Logger from 'mtproto-logger'
const log = Logger`long-poll`

// let inited = false

const waitToTime = async(poll: LongPoll): Promise<void> => {
  while (!poll.allowLongPoll())
    await new Promise(rs => setTimeout(rs, 500))
}

class LongPoll {
  thread: NetworkerThread

  maxWait = 25e3
  pendingTime = Date.now()
  requestTime = Date.now()
  isActive = false
  alreadyWaitPending: boolean = false
  pending: Promise<any>
  constructor(thread: NetworkerThread) {
    this.thread = thread
    active
      .observe(val => this.isActive = val)
    // if (inited) {
    //   log('Networker')(thread)
    //   //$ FlowIssue
    //   this.request = () => Bluebird.resolve()
    // }
    // inited = true
  }

  setPendingTime() {
    const now = tsNow()
    this.requestTime = now
    this.pendingTime = now + this.maxWait
  }
  async request() {
    const result = await this.thread.wrapMtpCall('http_wait', {
      max_delay : 1000,
      wait_after: 500,
      max_wait  : this.maxWait
    }, {
      noResponse: true,
      longPoll  : true,
      // notContentRelated: true
    })
    this.thread.checkLongPoll()
    return result
  }

  writePollTime() {
    this.requestTime = tsNow()
  }

  allowLongPoll() {
    const result = this.requestTime + 1500 < tsNow()
    log`allow long poll`(result)
    return result
  }
  async sending() {
    this.alreadyWaitPending = true
    await waitToTime(this)
    this.alreadyWaitPending = false
    this.setPendingTime()
    const result = await this.request()
    return result
  }
  async sendLongPool(): Promise<any> {
    //TODO add base dc check
    if (!this.isActive) return false
    if (this.allowLongPoll()) {
      this.pending = this.sending()
    }

    const result = await this.pending
    return result
  }
}

export default LongPoll
