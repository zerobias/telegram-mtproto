//@flow

export type ProcessMessage = {
  event: 'process-message',
  value: {
    message: *,
    messageID: string,
    sessionID: Uint8Array,
    threadID: string,
  }
}