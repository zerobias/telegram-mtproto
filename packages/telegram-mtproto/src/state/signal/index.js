//@flow

import { type State } from '../index.h'
import { async } from 'most-subject'
import { type Stream } from 'most'
import Status, { statuses, type ModuleStatus } from '../../status'

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}

export const rootSignal: Subject<State> = async()
const root: Stream<State> = rootSignal.multicast()

const isActive = afterStatus(statuses.activated)

export { isActive as active }

export const invoke = root
  .map(state => state.invoke)
  .skipRepeats()

export const storageSet = root
  .map(state => state.storageSet)
  .skipRepeats()

export function afterStatus(status: ModuleStatus) {
  return root
    .map(state => state.status)
    .map(current => Status.gte(current, status))
    .skipRepeats()
}

export const homeDc = root
  .map(state => state.homeDc)
  .skipRepeats()

export const uid = root
  .map(state => state.uid)
  .skipRepeats()

export const networker = root
  .map(state => state.networker)

const stateModel = {
  active: isActive,
  homeDc,
  uid,
  networker,
}

export default stateModel
