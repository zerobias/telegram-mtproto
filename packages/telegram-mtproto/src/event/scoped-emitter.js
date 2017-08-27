//@flow

import EventEmitter, { type EventEmitterType, type EventID, type Listener } from 'eventemitter2'
import arrify from 'Util/arrify'

export default class ScopedEmitter {
  scope: string[]
  root: EventEmitterType
  constructor(scope: EventID, parent: EventEmitterType): ScopedEmitter & EventEmitterType {
    if (parent instanceof ScopedEmitter) {
      this.root = parent.root
      this.scope = combineScope(parent.scope, scope)
    } else {
      this.scope = normalizeScope(scope)
      this.root = parent
    }
    /*:: return this */
  }

  on = (event: EventID, listener: Listener) => {
    const fullEvent = this.scope.concat(normalizeScope(event))
    return this.root.on(fullEvent, listener)
  }
  off = (event: string, listener: Listener) => {
    const fullEvent = [...this.scope, event].join('.')
    return this.root.off(fullEvent, listener)
  }
  emit = (event: EventID, ...values: any[]) => {
    const fullEvent = this.scope.concat(normalizeScope(event))
    return this.root.emit(fullEvent, ...values)
  }
  addEventListener = this.on
  removeEventListener = this.off
}

export function scopedEmitter(scope: EventID, parent: EventEmitterType | EventEmitter | ScopedEmitter) {
  return new ScopedEmitter(scope, parent)
}

const normalizeScope = (scope: EventID) => arrify(scope)

const reduceStarter: string[] = []

const combineScope = (...scopes: EventID[]) => scopes.reduce(
  (acc, val) => acc.concat(normalizeScope(val)),
  reduceStarter
)
