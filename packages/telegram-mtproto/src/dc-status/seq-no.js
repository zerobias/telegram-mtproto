//@flow

import { uniq, append, drop } from 'ramda'

export default class SeqNo {
  limit: number = 100

  count: number
  first: number
  current: number
  holes: number
  history: number[]
  uniq: number[]
  hasHoles: boolean
  constructor() {
    this.init()
  }
  init() {
    this.count = 0
    this.first = 0
    this.current = 0
    this.holes = 0
    this.history = []
    this.uniq = []
    this.hasHoles = false
  }
  getNext(notContentRelated?: boolean) {
    let seqNo = this.count * 2
    if (!notContentRelated) {
      seqNo++
      this.count++
    }
    this.push(seqNo)
    return seqNo
  }
  push(next: number) {
    this.current = Math.max(this.current, next)
    this.history = append(next, this.history)
    if (this.history.length >= this.limit) {
      const dropCount = this.history.length - this.limit
      this.history = drop(dropCount, this.history)
    }
    this.uniq = uniq(this.history)
    this.findMin()
    this.countHoles()
  }
  findMin() {
    const ln = this.uniq.length
    let min = Infinity
    for (let i = 0; i < ln; i++) {
      const val = this.uniq[i]
      if (val < min)
        min = val
    }
    this.first = min
  }
  countHoles() {
    const ln = this.uniq.length
    if (ln === 0) {
      this.holes = 0
      return
    }
    const range = this.current - this.first
    this.holes = range - ln
    this.hasHoles = this.holes === 0
  }
}
