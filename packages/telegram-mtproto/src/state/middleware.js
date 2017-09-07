//@flow
import { type Middleware } from 'redux'
import { replace, trim, pipe } from 'ramda'
import Logger from 'mtproto-logger'
const log = Logger`redux-core`

export const tryAddUid = () => (next: (action: any) => any) => (action: mixed) => {
  const send = () => next(action)
  if (typeof action !== 'object' || action == null) return
  if (typeof action.uid === 'string') return send()
  if (typeof action.payload === 'object' && action.payload != null && typeof action.payload.uid === 'string')
    action.uid = action.payload.uid
  return next(action)
}

export const skipEmptyMiddleware = () => (next: *) => (action: *) => {
  if (
    getActionType(action) === 'networker/sent delete'
    && Array.isArray(action.payload)
    && action.payload.length === 0
  ) //TODO Remove hardcode
    log`skip empty`(action.type)
  else
    return next(action)
}

type ActionObject = {
  type: string,
  payload: mixed,
  meta: {
    debounced: boolean
  },
}
/*::
declare var actionObject: ActionObject
declare var dataArray: Array<any>
const actionArray = { ...actionObject, payload: dataArray }

type ActionArray = typeof actionArray
*/

const removeTypeIndex = replace(/\[\d+\] /, '')

const getActionType = pipe(
  (e: ActionObject) => e.type || '',
  removeTypeIndex,
  trim
)

export const normalizeActions =
  <Defaults: { [field: string]: any }>(defaults: Defaults) => () =>
    (next: *) => (action: *) => next({ ...defaults, ...action })
