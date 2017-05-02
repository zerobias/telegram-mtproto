//@flow

import type { EventEmitterType, EventID, Listener } from 'eventemitter2'
import arrify from '../util/arrify'

const normalizeScope = (scope: EventID) => arrify(scope)

const reduceStarter: string[] = []

const combineScope = (...scopes: EventID[]) => scopes.reduce(
  (acc, val) => acc.concat(normalizeScope(val)),
  reduceStarter
)

class ScopedEmitter implements EventEmitterType {
  scope: string[]
  root: EventEmitterType
  constructor(scope: EventID, parent: EventEmitterType) {
    if (parent instanceof ScopedEmitter) {
      this.root = parent.root
      this.scope = combineScope(parent.scope, scope)
    } else {
      this.scope = normalizeScope(scope)
      this.root = parent
    }
  }

  on = (event: EventID, listener: Listener) => {
    const fullEvent = this.scope.concat(normalizeScope(event))
    // console.log('on', 'event', event, 'fullEvent', fullEvent, 'scope', this.scope, normalizeScope(event))
    return this.root.on(fullEvent, listener)
  }
  off = (event: string, listener: Listener) => {
    const fullEvent = [...this.scope, event].join('.')
    return this.root.off(fullEvent, listener)
  }
  emit = (event: EventID, ...values: any[]) => {
    const fullEvent = this.scope.concat(normalizeScope(event))
    // console.log('emit', 'event', event, 'fullEvent', fullEvent, 'scope', this.scope, normalizeScope(event))
    return this.root.emit(fullEvent, ...values)
  }
}

export default ScopedEmitter
