//@flow

import Emitter from 'eventemitter2'
import { fromEvent, Stream } from 'most'

import { type State } from './index.h'

export const emitter = new Emitter({
  wildcard: true
})

export function emitState(state: State) {
  emitter.emit('state', state)
}

export function onDispatch(dispatch: any) {
  emitter.on('dispatch', dispatch)
}

export function dispatch(action: any, uid: string) {
  if (typeof uid !== 'string') {
    throw new TypeError(`uid must be string, got ${typeof uid} ${uid}`)
  }
  action.uid = uid
  emitter.emit('dispatch', action)
}

export const rootStream: Stream<State> = fromEvent('state', emitter)
  .skipRepeats()
  .multicast()

let currentState: State

rootStream.observe(state => {
  currentState = state
})

export const getState: () => State = () => currentState
