//@flow

export type ModuleStatus =
  | 'init'
  | 'loaded'
  | 'dc detected'
  | 'activated'

/*::
opaque type EmptyStatus: ModuleStatus = 'init'
*/

export const statuses: {
  init: 'init',
  loaded: 'loaded',
  dcDetected: 'dc detected',
  activated: 'activated'
} = {
  init      : 'init',
  loaded    : 'loaded',
  dcDetected: 'dc detected',
  activated : 'activated',
}

const statusList: ModuleStatus[] = [
  'init',
  'loaded',
  'dc detected',
  'activated'
]

const iso = {
  from(status: ModuleStatus) {
    const index = statusList.indexOf(status)
    if (index === -1) return 0
    return index
  },
  to(index: number): ModuleStatus {
    if (index < 0 || index > statusList.length - 1)
      return Status.empty()
    return statusList[index]
  },
  pro(fn: (index: number) => number): (status: ModuleStatus) => ModuleStatus {
    return (status: ModuleStatus) => iso.to(fn(iso.from(status)))
  }
}

const Status = {
  empty: (): ModuleStatus => statuses.init,
  next : iso.pro(n => n + 1),
  back : iso.pro(n => n - 1),
  eq   : (s1: ModuleStatus, s2: ModuleStatus) => s1 === s2,
  gt(s1: ModuleStatus, s2: ModuleStatus): boolean {
    return iso.from(s1) > iso.from(s2)
  },
  gte: (s1: ModuleStatus, s2: ModuleStatus) =>
    Status.eq(s1, s2) || Status.gt(s1, s2),
  ensure(obj: mixed): ModuleStatus {
    switch (obj) {
      case 'init': return 'init'
      case 'loaded': return 'loaded'
      case 'dc detected': return 'dc detected'
      case 'activated': return 'activated'
      default: return Status.empty()
    }
  },
  is: isStatus
}

function isStatus(obj: mixed): boolean %checks {
  return statuses.init === obj
    || statuses.loaded === obj
    || statuses.dcDetected === obj
    || statuses.activated === obj
}

export default Status
