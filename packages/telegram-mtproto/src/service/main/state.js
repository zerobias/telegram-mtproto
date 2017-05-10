//@flow

import type { EventEmitterType } from 'eventemitter2'

import NetworkerThread from '../networker'
import Request from './request'
import { NetMessage } from '../networker/net-message'

class MapEmitter extends Map {
  emitter: EventEmitterType
  scope: string
  constructor(emitter: EventEmitterType, scope: string) {
    super()
    this.scope = scope
    Object.defineProperty(this, 'emitter', {
      enumerable  : false,
      configurable: true,
      writable    : false,
      value       : emitter
    })
  }
  set(key: string, value: any) {
    this.emitter.emit(this.scope, { key, value })
    return super.set(key, value)
  }
  delete(key: string) {
    this.emitter.emit(this.scope, key)
    return super.delete(key)
  }
  //$FlowIssue
  [Symbol.species](prop: *) {
    return new Map(prop)
  }
}

class State {
  threads: Map<string, NetworkerThread> = new Map
  requests: Map<string, Request> = new Map
  messages: Map<string, NetMessage> = new Map
}

export default State
