//@flow

import { rootStream } from '../portal'
import NetStatus, { netStatuses as stats, type NetStatus as Status } from '../../net-status'
import { faucetC } from '../../pull-stream'

const netStatuses = rootStream
  .map(state => state.netStatus)
  // .skipRepeats()
  .multicast()

export const netStatus = (dc: number) =>
  netStatuses
    .map(obj => NetStatus.ensure(obj[dc]))
    .skipRepeats()

export const moduleStatus = rootStream
  .map(state => state.status)
  // .skipRepeats()
  .multicast()

export const homeDc = rootStream
  .map(state => state.homeDc)
  .skipRepeats()

export const homeStatus = netStatuses
  .combine((obj, dc) => NetStatus.ensure(obj[dc]), homeDc)
  .skipRepeats()

export const onHomeStatus = (status: Status) => faucetC(
  homeStatus
    .map(e => NetStatus.gte(e, status))
    .skipRepeats()
)

export const guestStatus = onHomeStatus(stats.halt)

export const invoke = rootStream
  .map(state => state.invoke)
  .skipRepeats()

export const requestMap = rootStream
  .map(state => state.request)
  .skipRepeats()

export const uid = rootStream
  .map(state => state.uid)
  .skipRepeats()

export const networker = rootStream
  .map(state => state.networker)

