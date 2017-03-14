export type CurState = {
  [k: string]: any;
  syncPending?: {
    ptsAwaiting?: ?boolean;
    seqAwaiting?: ?boolean;
  }
}

export type UpdatesState = {
  pts : number,
  qts : number,
  date: number,
  seq : number,
  unread_count: number,

}

export type ProcessUpdate = {

}

export type DifferenceEmpty = {
  _: 'updates.differenceEmpty',
  date: number,
  seq: number
}