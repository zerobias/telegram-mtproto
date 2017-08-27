//@flow

import { type Stream } from 'most'
import { createAction } from 'redux-act'
import { select } from 'redux-most'

import Status, { type ModuleStatus } from '../status'
import { rootStream } from './portal'



type ActionCreator<Type, Payload> =
  (stream: Stream<any>) =>
    Stream<Action<Type, Payload>>

declare class Act<Tag = 'action'> { toString(): Tag }

type Action<Tag = 'action', Payload = {}, Meta = void> = {
  (payload: Payload, meta: Meta): Action<Tag, Payload>,
  // call$(payload: Payload, meta: Meta): Action<Tag, Payload>,
  // (payload: Payload): Action<Tag, Payload>,
  getType(): Tag,
  type: Tag,
  payload: Payload,
}

const actionSelector =
  (action: any): ActionCreator<any, any> =>
    (stream) => select(action, stream)

export type ActionPair<Type, Payload, Meta = void> = Action<Type, Payload, Meta> & {
  stream: ActionCreator<Type, Payload>,
  type: Type,
}

export function doubleCreator<Type, Payload, Meta>(
  tag: Type, meta?: (pl: Payload, meta: Meta) => any
): ActionPair<Type, Payload, Meta> {
  const action: ActionPair<Type, Payload> = typeof meta === 'function'
    ? createAction(tag, (x) => x, meta)
    : createAction(tag)
  const stream: ActionCreator<Type, Payload> = actionSelector(action.getType())
  Object.defineProperties(action, {
    stream: {
      value     : stream,
      enumerable: false,
    },
    type: {
      value     : action.getType(),
      enumerable: false,
    }
  })
  return action
}

export function afterStatus(status: ModuleStatus) {
  return rootStream
    .map(state => state.status)
    .map(current => Status.gte(current, status))
    .skipRepeats()
}


export const guardedReducer = <S, -P>(
  guards: ((state: S, payload: P) => boolean)[],
  reducer: (state: S, payload: P) => S,
) => (state: S, payload: P) => {
  for (let i = 0, ln = guards.length; i < ln; i++) {
    const guard = guards[i]
    if (!guard(state, payload))
      return state
  }
  return reducer(state, payload)
}
