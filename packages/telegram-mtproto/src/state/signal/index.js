//@flow

import Status, { statuses, type ModuleStatus } from '../../status'
import { root } from '../core'

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
