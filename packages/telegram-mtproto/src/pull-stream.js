//@flow

import { append, prepend, head, tail } from 'ramda'
import { type Stream } from 'most'
import Property from './property'
import Logger from 'mtproto-logger'
const log = Logger`pull-stream`

export interface Consumer<T> {
  (next: () => void, fallback: (val: T) => void): (val: T) => () => void
}

export default class PullStream<T> {
  source: Stream<T>
  consumer: (val: T) => () => void
  buffer: T[] = []
  empty: boolean = true
  length: number = 0
  busy: boolean = true
  locked: boolean = true
  isTerminated: boolean = false
  $SymbolIterator: Iterator<T>
  constructor(source: Stream<T>, consumer: Consumer<T>, controlStream: Stream<boolean>) {
    this.source = source
    this.consumer = consumer(
      this.next.bind(this),
      this.fallback.bind(this)
    )
    source.observe((val: T) => {
      log`source`(val)
      this.push(val)
    })
    controlStream
      .skipRepeats()
      .observe(val => {
        this.locked = !val
        log`control`(val)
        this.update()
      })
  }
  update() {
    log`update, busy, locked`(this.busy, this.locked)
    this.length = this.buffer.length
    if (!this.busy && !this.locked)
      this.feed()
  }
  push<-E: T | T[]>(val: E) {
    this.empty = false
    this.buffer = Array.isArray(val)
      ? this.buffer.concat(val)
      : append(val, this.buffer)
    this.update()
  }
  pushFirst(val: T | T[]) {
    this.empty = false
    this.buffer = Array.isArray(val)
      ? val.concat(this.buffer)
      : prepend(val, this.buffer)
    this.update()
  }
  /**
   * Force push next value into consumer
   *
   * @private
   * @memberof PullStream
   */
  feed() {
    const val = head(this.buffer)
    if (val == null) return
    this.busy = true
    this.buffer = tail(this.buffer)
    if (this.buffer.length === 0)
      this.empty = true
    this.length = this.buffer.length
    this.cancel = this.consumer(val)
  }
  /**
   * Callback, used **only** by consumer
   *
   * @private
   * @memberof PullStream
   */
  next() {
    if (this.empty)
      this.busy = false
    else
      this.feed()
  }
  /**
   * Cancellation callback, used **only** by consumer
   *
   * @private
   * @memberof PullStream
   */
  fallback(val: T) {
    this.busy = true
    this.push(val)
  }
  cancel: () => void = noop
  clean() {
    this.empty = true
    this.length = 0
    this.buffer = []
  }
  replace(list: T[]) {
    this.clean()
    this.push(list)
  }
  stop() {
    this.clean()
    this.isTerminated = true
    //$FlowIssue
    this.push = noop
    //$FlowIssue
    this.feed = noop
  }
  //$FlowIssue
  * [Symbol.iterator]() {
    yield* this.buffer
  }
}

export function faucet<T>(source: Stream<T>, controlStream: Stream<boolean>): Stream<T> {
  const init: T = ({}: any)
  const prop = Property('', init)
  const stream = prop.skip(1).multicast()
  const consumer: Consumer<T> =
    (next: () => void, fallback: (val: T) => void) => {
      prop.observe(() => next())
      return (val: T) => {
        prop.next(val)
        return () => {}
      }
    }
  new PullStream(source, consumer, controlStream)
  return stream
}

export function faucetC(controlStream: Stream<boolean>) {
  return function<T>(source: Stream<T>): Stream<T> {
    return faucet(source, controlStream)
  }
}

function noop() {}

