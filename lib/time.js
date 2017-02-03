'use strict'
const getLogger = require('./logger')

// Time offset between local time and server time
let timeOffset = 0
let lastResponse = Number.MAX_VALUE

const getLocalTimelogger = getLogger('time.getLocalTime')
exports.getLocalTime = function getLocalTime() {
  const offset = (timeOffset * 1000)
  const localtime = new Date().getTime() + offset
  getLocalTimelogger.debug('Return the local TIME (synchronized with the server) %s and timeOffset %s', localtime, offset)
  return localtime
}

const timeSynchronizationlogger = getLogger('time.timeSynchronization')
// Synchronize the local time with the server time
exports.timeSynchronization = function timeSynchronization(serverTime, requestDuration) {
  const localTime = Math.floor(new Date().getTime() / 1000)
  let response = requestDuration / 2
  timeSynchronizationlogger.debug('ServerTime %ss - LocalTime %ss - Response in %sms',
          serverTime, localTime, response)
  if (lastResponse > response) {
    lastResponse = response
    response = Math.floor(response / 1000)
    timeOffset = ((serverTime + response) - localTime)
    timeSynchronizationlogger
      .debug('time-synchronization: (ServerTime %ss + server-response %ss) - LocalTime %ss = timeOffset %ss',
            serverTime, response, localTime, timeOffset)
  } else {
    timeSynchronizationlogger
      .debug('NO time-synchronization: the server-response (%s) took more time than the previous one (%s)',
            response, lastResponse)
  }
}