import isNode from 'detect-node'

import { TimeOffset } from '../store'
import { nextRandomInt, lshift32 } from '../bin'

import Logger from '../util/log'

const log = Logger`time-manager`

export const tsNow = seconds => {
  let t = +new Date()
  //eslint-disable-next-line
  if (!isNode) t += window.tsOffset || 0
  return seconds
    ? Math.floor(t / 1000)
    : t
}

export { dTime } from '../util/dtime'

let lastMessageID = [0, 0]
let timerOffset = 0

const offset = TimeOffset.get()
if (offset) timerOffset = offset

const generateMessageID = () => {
  const timeTicks = tsNow(),
        timeSec = Math.floor(timeTicks / 1000) + timerOffset,
        timeMSec = timeTicks % 1000,
        random = nextRandomInt(0xFFFF)

  let messageID = [timeSec, timeMSec << 21 | random << 3 | 4]
  if (lastMessageID[0] > messageID[0] ||
    lastMessageID[0] == messageID[0] && lastMessageID[1] >= messageID[1]) {
    messageID = [lastMessageID[0], lastMessageID[1] + 4]
  }

  lastMessageID = messageID

  // console.log('generated msg id', messageID, timerOffset)

  return lshift32(messageID[0], messageID[1])
}

export const applyServerTime = (serverTime, localTime) => {
  const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000)
  const changed = Math.abs(timerOffset - newTimeOffset) > 10
  TimeOffset.set(newTimeOffset)

  lastMessageID = [0, 0]
  timerOffset = newTimeOffset
  log('Apply server time')(serverTime, localTime, newTimeOffset, changed)

  return changed
}

export { generateMessageID as generateID }
