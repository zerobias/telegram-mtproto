//@flow


export type State = {
  _: true,
  active: boolean,
  mainDc: number,
  uid: string,
  messageHistory: { id: string, seqNo: number }[],
}

