//@flow

import Bluebird from 'bluebird'
import { encaseP2, cache } from 'fluture'

import { tsNow } from '../service/time-manager'
/*:: import { NetworkerThread } from '../service/networker' */

import Logger from 'mtproto-logger'
const log = Logger`long-poll`
import Config from 'ConfigProvider'


function longPollRequest(thread: NetworkerThread, maxWait: number) {
  return thread.wrapMtpCall('http_wait', {
    max_delay : 0,
    wait_after: 200,
    max_wait  : maxWait
  }, requestOpts)
}

const futureRequest = (thread, maxWait) => encaseP2(
  longPollRequest, thread, maxWait
)

/*::
declare var fakeThread: NetworkerThread
const future = futureRequest(fakeThread, 25e3)
type FutureRequest = typeof future
*/

export default class LongPoll {
  thread: NetworkerThread
  currentRequest: FutureRequest | void
  futureRequest: FutureRequest
  maxWait = 15e3
  pendingTime = Date.now()
  requestTime = Date.now()
  alreadyWaitPending: boolean = false
  constructor(thread: NetworkerThread) {
    this.thread = thread
    // if (inited) {
    //   log('Networker')(thread)
    //   //$ FlowIssue
    //   this.request = () => Bluebird.resolve()
    // }
    // inited = true

  }
  get pending(): Promise<any> {
    if (!this.currentRequest)
      this.currentRequest = cache(futureRequest(this.thread, this.maxWait)
        .map(x => {
          delete this.currentRequest
          this.thread.checkLongPoll()
          this.pending
        }))
    return this.currentRequest.promise()
  }

  setPendingTime() {
    const now = tsNow()
    this.requestTime = now
    this.pendingTime = now + this.maxWait
  }

  async request() {
    await this.pending
  }

  writePollTime() {
    this.requestTime = tsNow()
  }

  allowLongPoll() {
    return true
    // const result = this.requestTime + WAIT < tsNow()
    // log`allow long poll`(result)
    // return result
  }
  // async sending() {
  //   this.alreadyWaitPending = true
  //   await waitToTime(this)
  //   this.alreadyWaitPending = false
  //   this.setPendingTime()
  //   const result = await this.request()
  //   return result
  // }
  async sendLongPool(): Promise<any> {
    //TODO add base dc check
    if (Config.halt.get(this.thread.uid, this.thread.dcID)) return Bluebird.resolve(false)
    // return cache(futureRequest(this.thread, this.maxWait)
    //   .map(x => {
    //     log`poll response`(x)
    //     // delete this.currentRequest
    //     this.thread.checkLongPoll()
    //     // this.pending
    //   })).promise()
    // if (this.allowLongPoll()) {
    //   this.pending = this.sending()
    // }

    const result = await this.pending
    return result
  }
}

const requestOpts = {
  noResponse       : true,
  longPoll         : true,
  notContentRelated: true
}
