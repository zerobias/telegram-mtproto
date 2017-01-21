const AuthKey = require('./auth-key')
const RequestPQ = require('./request-pq')
const RequestDHParams = require('./request-dh-params')
const SetClientDHParams = require('./set-client-dh-params')

const flow = require('get-flow')

function createAuthKey(callback, channel) {
  flow.retryUntilIsDone(callback, null,
    function(callback) {
      flow.runSeries([
        RequestPQ,
        RequestDHParams,
        SetClientDHParams
      ], callback, channel)
    })
}

module.exports = {
  AuthKey,
  RequestPQ,
  RequestDHParams,
  SetClientDHParams,
  createAuthKey
}