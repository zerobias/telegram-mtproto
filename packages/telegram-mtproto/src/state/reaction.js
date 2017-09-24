//@flow

import Config from 'ConfigProvider'
import { type UID, type DCNumber } from 'Newtype'

export function requestNextSeq(uid: UID, dc: DCNumber, notContentRelated?: boolean) {
  const currentSeq = Config.seq.get(uid, dc)
  if (__DEV__)
    console.warn(dc, currentSeq)
  let seqNo = currentSeq * 2
  let nextSeq = currentSeq
  if (!notContentRelated) {
    seqNo++
    nextSeq++
  }
  if (__DEV__)
    console.warn(dc, nextSeq)
  Config.seq.set(uid, dc, nextSeq)
  // dispatch(NET.SEQ_SET({ dc, seq: nextSeq }), uid)
  return seqNo
}
