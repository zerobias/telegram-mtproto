//@flow

import { Stream } from 'most'
import { replace } from 'ramda'
import { createAction, createReducer } from 'redux-act'
import { select } from 'redux-most'

export type ActReducer<Field> = {
  <-A>(state: Field, action: A): Field,
  $call<-A>(state: Field, action: A): Field,
  on<Type, Payload, Meta>(
    action: ActionPair<Type, Payload, Meta>,
    reducer: (state: Field, payload: Payload) => Field
  ): ActReducer<Field>,
}

export function makeReducer<Field>(defs: Field): ActReducer<Field> {
  const reducer: ActReducer<Field> = createReducer({}, defs)
  return reducer
}

// function on<Field, Type, Payload, Meta>(
//   field: ActReducer<Field>,
//   action: ActionPair<Type, Payload, Meta>,
//   reducer: (state: Field, payload: Payload) => Field
// ) {
//   if (typeof field.on === 'function') {
//     field.on(action, reducer)
//     return field
//   }
//   throw new TypeError('')
// }

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
  short: string,
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
    },
    short: {
      value: String(tag)
    },
  })
  return action
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

export const trimType: (type: string) => string =
  replace(/\[\d+\]\s*/, '')
