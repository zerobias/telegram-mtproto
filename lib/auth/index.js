exports.AuthKey = require('./auth-key')
exports.RequestPQ = require('./request-pq')
exports.RequestDHParams = require('./request-dh-params')
exports.SetClientDHParams = require('./set-client-dh-params')
exports.createAuthKey = createAuthKey

const flow = require('get-flow')

function createAuthKey(callback, channel) {
  flow.retryUntilIsDone(callback, null,
    function(callback) {
      flow.runSeries([
        require('./request-pq'),
        require('./request-dh-params'),
        require('./set-client-dh-params')
      ], callback, channel)
    })
}
