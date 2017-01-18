const Promise = require('bluebird')

class Balancer {
  constructor({ concurrency = 5, interval = 500 }={}) {
    this.concurrency = concurrency
    this.interval = interval
    this.active = 0
    this.pendingList = []
    this.isHalt = false
    this.endHook = this.endHook.bind(this)
    this.tryNext = this.tryNext.bind(this)
  }
  get pending() {
    return this.pendingList.length
  }
  tryNext() {
    if (this.pending >= this.concurrency) return
    if (this.pending === 0)
      setTimeout(this.tryNext, this.interval)
    this.active+=1
    this.pendingList.shift()()
  }
  addPending(thunk) {
    this.pendingList.push(thunk)
    this.tryNext()
  }
  endHook() {
    this.active-=1
    this.tryNext()
  }
  task(func, ...args) {
    const caller = (rs, rj) =>
      this.addPending(() => {
        const promise = func(...args)
        promise.then(rs, rj)
        promise.then(this.endHook, this.endHook)
      })
    return new Promise(caller)
  }
  halt() {
    this.tryNext = () => {}
    this.task = () => {}
    this.isHalt = true
  }
}

module.exports = Balancer