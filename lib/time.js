//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export functions
exports.getLocalTime = getLocalTime;
exports.timeSynchronization = timeSynchronization;

// Import dependencies
var getLogger = require('get-log');

// Time offset between local time and server time
var timeOffset = 0;
var lastResponseTime = Number.MAX_VALUE;

function getLocalTime() {
    var logger = getLogger('time.getLocalTime');
    var localtime = new Date().getTime() + timeOffset;
    if (logger.isDebugEnabled()) {
        logger.debug("Return the local TIME (synchronized with the server) %s and timeOffset %s", localtime, timeOffset);
    }
    return  localtime;
}

// Synchronize the local time with the server time
function timeSynchronization(serverTime, requestDuration) {
    var logger = getLogger('time.timeSynchronization');
    var localTime = new Date().getTime();
    var responseTime = requestDuration / 2;
    if (lastResponseTime > responseTime) {
        lastResponseTime = responseTime;
        timeOffset = (serverTime + responseTime) - localTime;
        logger.info('(ServerTime %s + ServerResponseTime %s) - LocalTime %s = timeOffset %s ',
            serverTime, responseTime, localTime, timeOffset);
    } else {
        logger.info('Discarded: ServerResponseTime (%s) higher than previous one (%s) ',
            responseTime, lastResponseTime);
    }
}