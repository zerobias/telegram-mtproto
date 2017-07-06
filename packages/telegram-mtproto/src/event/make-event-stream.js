//@flow

import { fromEvent } from 'most'
import type { EventEmitterType } from 'eventemitter2'


export function makeEventStream(emitter: EventEmitterType) {
  return function<CastType>(
    name: string[] | string,
    casted: CastType) {
    const eventName = Array.isArray(name)
      ? name.join('.')
      : name
    let eventStream
    if (typeof casted === 'function') {
      eventStream = fromEvent(eventName, emitter)
    } else {
      eventStream = fromEvent(eventName, emitter)
    }
    return eventStream
  }
}
