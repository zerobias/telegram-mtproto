//@flow

import Promise from 'bluebird'

import { tsNow } from '../service/time-manager'
import typeof { NetworkerThread } from '../service/networker/index'

class LongPool {
  thread: NetworkerThread

  maxWait = 25e3
  pendingTime = -Infinity
  isActive = true

  constructor(thread: NetworkerThread) {
    this.thread = thread
  }

  setPendingTime() {
    this.pendingTime = tsNow() + this.maxWait
  }
  request(): Promise<any> {
    return this.thread.wrapMtpCall('http_wait', {
      max_delay : 500,
      wait_after: 150,
      max_wait  : this.maxWait
    }, {
      noResponse: true,
      longPoll  : true
    })
  }

  async sendLongPool() {
    //TODO add base dc check
    if (!this.isActive) return false
    this.setPendingTime()
    return this.request()
  }
}

export default LongPool