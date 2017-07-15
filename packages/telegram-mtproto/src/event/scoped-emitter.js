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
  addEventListener = this.on
  removeEventListener = this.off
}


// const Predicate = tagged('Predicate', ['f'])

// Make a Predicate that runs `f` to get
// from `b` to `a`, then uses the original
// Predicate function!
// contramap :: Predicate a ~> (b -> a)
//                          -> Predicate b
// Predicate.prototype.contramap =
//   function(f) {
//     return Predicate(
//       x => this.f(f(x))
//     )
//   }



interface ScopeType {
  value: string[],
  // static of(val: string[]): ScopeType,
  map(fn: (val: string[]) => string[]): ScopeType,
  concat(e: ScopeType): ScopeType,
  ap(root: EventEmitterType): Emitter,
  equals(val: ScopeType): boolean
}




type Emitter = <V>(val: V) => boolean

export class EventScope/*ᐸElementTᐳ*/ {
  value: string[]
  joined: string
  static of(val: string[] | string) {
    let list
    if (Array.isArray(val))
      list = val
    else
      list = [val]
    return new EventScope(list)
  }
  map(fn: (val: string[]) => string[]) {
    return EventScope.of(fn(this.value))
  }
  concat(e: ScopeType) {
    return EventScope.of([...this.value, ...e.value])
  }
  ap<T>(fn: (list: string[]) => T): T {
    return fn(this.value)
  }
  equals(scope: EventScope) {
    for (const [index, str] of this.value.entries())
      if (str !== scope.value[index])
        return false
    return true
  }
  static empty() {
    return EventScope.of([])
  }
  constructor(val: string[]) {
    this.value = val
    this.joined = val.join('.')
  }
}

export const emitScope =
  (es: EventScope) =>
    (em: EventEmitterType) =>
      <-T>(data: T) => em.emit(es.value, data)

// export const fromScope =
//   (es: EventScope) =>
//     (em: EventEmitterType) =>
//       fromEvents(em, es.joined)

// const ex = EventScope.of(['uid', 'scope'])

// const mp = (val: string[]) => [val[0], 'a']
// const ex1 = ex.map(mp)
export default ScopedEmitter
