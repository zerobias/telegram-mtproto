//@flow

import isNode from 'detect-node'

import { nextRandomInt, lshift32 } from '../bin'
import Config from '../config-provider'

import Logger from 'mtproto-logger'

const log = Logger`time-manager`

export const tsNow = (): number => {
  let t = Date.now()
  //eslint-disable-next-line
  if (!isNode) t += window.tsOffset || 0
  return t
}


const generateMessageID = (uid: string) => {
  const timeTicks = tsNow(),
        timeSec = Math.floor(timeTicks / 1000) + Config.timerOffset.get(uid),
        timeMSec = timeTicks % 1000,
        random = nextRandomInt(0xFFFF)

  let messageID = [timeSec, timeMSec << 21 | random << 3 | 4]
  const lastMessageID = Config.lastMessageID.get(uid)
  if (lastMessageID[0] > messageID[0] ||
    lastMessageID[0] == messageID[0] && lastMessageID[1] >= messageID[1]) {
    messageID = [lastMessageID[0], lastMessageID[1] + 4]
  }
  Config.lastMessageID.set(uid, messageID)

  // console.log('generated msg id', messageID, timerOffset)

  return lshift32(messageID[0], messageID[1])
}

export const applyServerTime = (
  uid: string,
  serverTime: number,
  localTime?: number) => {

  const newTimeOffset = serverTime - Math.floor((localTime || tsNow()) / 1000)
  const changed = Math.abs(Config.timerOffset.get(uid) - newTimeOffset) > 10

  Config.lastMessageID.set(uid, [0, 0])
  Config.timerOffset.set(uid, newTimeOffset)
  log`Apply server time`(serverTime, localTime, newTimeOffset, changed)

  return changed
}

export { generateMessageID as generateID }
