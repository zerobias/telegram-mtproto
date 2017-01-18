const Logger = require('get-log')

const LoggerFabric = name => {
  const log = Logger(`mtp:${name}`)
  return log
}

module.exports = LoggerFabric