//@flow

function toBuffer8(arr/*:: : number[] */) {
  return new Uint8Array(arr).buffer
}

function freezeTime(time/*:: : number */) {
  const now = Date.now
  //$FlowIssue
  Date.now = jest.fn(() => time)
  return function unfreeze() {
    //$FlowIssue
    Date.now = now
  }
}

module.exports = {
  toBuffer8,
  freezeTime,
}
