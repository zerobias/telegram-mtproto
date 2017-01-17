const Logger = require('get-log')

const LoggerFabric = name => {
  const log = Logger(name)
  const wrapper = () => {}
  return new Proxy(log, {
    get: (obj, prop) => {
      if (prop === 'isDebugEnabled')
        console.log('debug')
      if (prop === 'debug') {
        return Reflect.get(obj, 'isDebugEnabled')()
          ? Reflect.get(obj, prop)
          : wrapper
      } else return Reflect.get(obj, prop)
    }
  })
}

module.exports = LoggerFabric