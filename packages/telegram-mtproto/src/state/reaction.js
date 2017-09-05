//@flow

import { dispatch } from './portal'
import { NET } from './action'
import Config from '../config-provider'

export function requestNextSeq(uid: string, dc: number, notContentRelated?: boolean) {
  const currentSeq = Config.seq.get(uid, dc)
  console.warn(dc, currentSeq)
  let seqNo = currentSeq * 2
  let nextSeq = currentSeq
  if (!notContentRelated) {
    seqNo++
    nextSeq++
  }
  console.warn(dc, nextSeq)
  Config.seq.set(uid, dc, nextSeq)
  // dispatch(NET.SEQ_SET({ dc, seq: nextSeq }), uid)
  return seqNo
}
