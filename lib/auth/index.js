'use strict'
const AuthKey = require('./auth-key')
const RequestPQ = require('./request-pq')
const RequestDHParams = require('./request-dh-params')
const SetClientDHParams = require('./set-client-dh-params')

function createAuthKey(callback, channel) {
  const max = 10
  let count = 0
  const onFail = err => {
    count+=1
    console.warn(`[createAuthKey] retry ${count}`)
    return count < max
      ? run()
      : Promise.reject(err)
  }
  const run = () => RequestPQ(channel)
    .catch(onFail)
    .then(RequestDHParams)
    .catch(onFail)
    .then(SetClientDHParams)
    .catch(onFail)
  run().then(
    context => callback(null, context),
    onFail)
}

module.exports = {
  AuthKey,
  RequestPQ,
  RequestDHParams,
  SetClientDHParams,
  createAuthKey
}