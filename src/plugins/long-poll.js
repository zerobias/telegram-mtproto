//@flow

import Promise from 'bluebird'

import { tsNow } from '../service/time-manager'
import { NetworkerThread } from '../service/networker/index'

let inited = false

class LongPoll {
  thread: NetworkerThread

  maxWait = 25e3
  pendingTime = -Infinity
  isActive = true

  constructor(thread: NetworkerThread) {
    this.thread = thread
    if (inited) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!! re init', thread)
      //$FlowIssue
      this.request = () => Promise.resolve()
    }
    inited = true
  }

  setPendingTime() {
    this.pendingTime = tsNow() + this.maxWait
  }
  request() {
    return this.thread.wrapMtpCall('http_wait', {
      max_delay : 500,
      wait_after: 150,
      max_wait  : this.maxWait
    }, {
      noResponse: true,
      longPoll  : true,
      // notContentRelated: true
    })
  }

  sendLongPool(): Promise<any> {
    //TODO add base dc check
    if (!this.isActive) return Promise.resolve(false)
    this.setPendingTime()
    return this.request()
  }
}

export default LongPoll