export type CurState = {
  [k: string]: any;
  syncPending?: {
    ptsAwaiting?: ?boolean;
    seqAwaiting?: ?boolean;
  }
}

export type UpdatesState = any;

