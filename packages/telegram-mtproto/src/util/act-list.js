//@flow

import { createReducer } from 'redux-act'
import { type Reducer } from 'redux'
import { fromPairs } from 'ramda'

import { type ActionPair } from '../state/helpers'

type Act<Field, Type, Payload, Meta> = [
  ActionPair<Type, Payload, Meta>,
  (state: Field, payload: Payload, meta: Meta) => Field
]

export default function actList<Field, Payload, Meta>(
  defaultValue: Field,
  pairs: Act<Field, *, Payload, Meta>[]
): Reducer<Field> {
  const objMap = fromPairs(pairs)
  return createReducer(objMap, defaultValue)
}
