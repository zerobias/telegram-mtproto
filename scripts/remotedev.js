const remotedev = require('remotedev-server')

const remote = remotedev({
  hostname: 'localhost',
  port    : 8000,
})

module.exports = remote
