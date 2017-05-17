//@flow

import { hold } from '@most/hold'
import { fromEvent } from 'most'
import type { Stream } from 'most'
import EventEmitter from 'eventemitter2'

const Property = <+T>(name: string, value: T, emitter: EventEmitter) => {
  const plainStream: Stream<T> = fromEvent(name, emitter)
  const property = hold(plainStream)
  return {
    get: property,
    set(value: T) {
      emitter.emit(name, value)
    }
  }
}

export default Property
