//@flow

import Bluebird from 'bluebird'

import { tsNow } from '../service/time-manager'
import { NetworkerThread } from '../service/networker/index'

// import Logger from '../util/log'
// const log = Logger`long-poll`

// let inited = false

class LongPoll {
  thread: NetworkerThread

  maxWait = 25e3
  pendingTime = -Infinity
  requestTime = -Infinity
  isActive = true

  constructor(thread: NetworkerThread) {
    this.thread = thread
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
    return this.requestTime + 3500 < tsNow()
  }

  sendLongPool(): Promise<any> {
    //TODO add base dc check
    if (!this.isActive) return Bluebird.resolve(false)
    if (!this.allowLongPoll()) return Bluebird.resolve(false)
    this.setPendingTime()
    return this.request()
  }
}

export default LongPoll