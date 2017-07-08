//@flow

import { of } from 'most'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

import { subject } from '../property'

export const skipEmptyMiddleware = (store: *) => (next: *) => (action: *) => {
  if (Array.isArray(action.payload) && action.payload.length === 0)
    log`skip empty`(action.type)
  else
    return next(action)
}

export const debounceMiddleware = ({ dispatch }: *) => (next: *) => {
  const actionStream = subject({ type: '', payload: {} })
  actionStream
    .tap(log`action`)
    .map(action => {
      if (action.meta == null)
        //$FlowIssue
        action.meta = {}
      action.meta.debounced = true
      return action
    })
    .concatMap(val => of(val).delay(50))
    .observe(dispatch)
  return (action: *) => {
    if (action.meta && action.meta.debounced)
      return next(action)
    return actionStream.next(action)
  }
}

