'use strict'
const Logger = require('get-log')

const LoggerFabric = name => {
  const log = Logger(`mtp:${name}`)
  return new Proxy(log, {
    get: (obj, prop) => {
      if (prop === 'debug')
        return Reflect.get(obj, 'isDebugEnabled')()
          ? Reflect.get(obj, 'debug')
          : () => {}
      else return Reflect.get(obj, prop)
    }
  })
}

module.exports = LoggerFabric