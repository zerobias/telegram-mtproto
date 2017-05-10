//@flow

import { fromEvents } from 'kefir'
import type { EventEmitterType } from 'eventemitter2'

const cast: any = (obj) => obj
interface CastFn <V>{
  (obj: V): V
}

export function makeEventStream(emitter: EventEmitterType) {
  return function<CastType>(
    name: string[] | string,
    casted: CastType) {
    const casts: CastFn<CastType> = (cast: any)
    const eventName = Array.isArray(name)
      ? name.join('.')
      : name
    let eventStream
    if (typeof casted === 'function') {
      eventStream = fromEvents(emitter, eventName, casted)
    } else {
      eventStream = fromEvents(emitter, eventName, casts)
    }
    return eventStream
  }
}
