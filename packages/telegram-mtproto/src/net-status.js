//@flow

import { async } from 'most-subject'
import { Stream, type Sink } from 'most'

import { emitter } from './state/portal'

export type NetStatus =
  | 'halt'
  | 'load'
  | 'guest'
  | 'active'

export const netStatuses: {
  halt: 'halt',
  load: 'load',
  guest: 'guest',
  active: 'active'
} = {
  halt  : 'halt',
  load  : 'load',
  guest : 'guest',
  active: 'active',
}

const statusList: NetStatus[] = [
  'halt',
  'load',
  'guest',
  'active'
]

const iso = {
  from(status: NetStatus) {
    const index = statusList.indexOf(status)
    if (index === -1) return 0
    return index
  },
  to(index: number): NetStatus {
    if (index < 0 || index > statusList.length - 1)
      return Status.empty()
    return statusList[index]
  },
  pro(fn: (index: number) => number): (status: NetStatus) => NetStatus {
    return (status: NetStatus) => iso.to(fn(iso.from(status)))
  }
}

const Status = {
  empty: (): NetStatus => netStatuses.halt,
  top  : (): NetStatus => netStatuses.active,
  next : iso.pro(n => n + 1),
  back : iso.pro(n => n - 1),
  eq   : (s1: NetStatus, s2: NetStatus) => s1 === s2,
  gt(s1: NetStatus, s2: NetStatus): boolean {
    return iso.from(s1) > iso.from(s2)
  },
  gte: (s1: NetStatus, s2: NetStatus) =>
    Status.eq(s1, s2) || Status.gt(s1, s2),
  max: (s1: NetStatus, s2: NetStatus) =>
    Status.gt(s1, s2)
      ? s1
      : s2,
  min: (s1: NetStatus, s2: NetStatus) =>
    Status.gt(s1, s2)
      ? s2
      : s1,
  ensure(obj: mixed): NetStatus {
    switch (obj) {
      case 'halt': return 'halt'
      case 'load': return 'load'
      case 'guest': return 'guest'
      case 'active': return 'active'
      default: return Status.empty()
    }
  },
  is: isStatus
}

function isStatus(obj: mixed): boolean %checks {
  return netStatuses.halt === obj
    || netStatuses.load === obj
    || netStatuses.guest === obj
    || netStatuses.active === obj
}




declare class Subj<+T> extends Stream<T> {
  +source: Sink<T>,

  next (value: T): void,
  error <Err: Error> (err: Err): void,
  complete (value?: T): void,
}

type AsyncSubj = <+T>() => Subj<T>

/*::
(async: AsyncSubj)
*/

function pushList<T>(list: T[], subj: Subj<T>) {
  for (let i = 0, ln = list.length; i < ln; i++)
    subj.next(list[i])
}

export function netStatusGuard<T>(minStatus: NetStatus, guard: Stream<NetStatus>, source: Stream<T>): Stream<T> {
  const result = async()
  let buffer: T[] = []
  let active = false
  emitter.on('cleanup', () => {
    buffer = []
    // active = false
  })
  source.subscribe({
    next(x: T) {
      active
        ? result.next(x)
        : buffer.push(x)
    },
    error(x) {
      result.error(x)
    },
    complete(x?: T) {
      pushList(buffer, result)
      result.complete(x)
    }
  })

  guard
    .map(x => Status.gte(x, minStatus))
    .skipRepeats()
    .observe(x => {
      if (x) pushList(buffer, result)
      active = x
      buffer = []
    })
  return result
}

export default Status
