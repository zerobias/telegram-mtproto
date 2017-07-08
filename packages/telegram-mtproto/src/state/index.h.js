//@flow

export type MessageHistory = {
  id: string,
  seqNo: number,
  direction: 'in' | 'out'
}

export type State = {
  _: true,
  active: boolean,
  mainDc: number,
  uid: string,
  messageHistory: MessageHistory[],
}

