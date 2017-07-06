//@flow

import sheduler from './sheduler'
import { makeGroupHeader, makeModuleName, makeTags, makeTime } from './string-transform'
import Debug from './debug'
import disabledLogger from './disabled'
import { dTimePure, immediate } from 'mtproto-shared'

import { type VariString, type LoggerInstance, type GroupLogger } from './index.h'

const Logger = (moduleName: Array<string> | string, ...rest: Array<string>) => {
  const fullModule = makeModuleName([moduleName, rest])
  fullModule.unshift('telegram-mtproto')
  const fullname = fullModule.join(':')
  const padding =
    Array(fullname.length - 17 + 1)
    .fill(' ')
    .join('')
  const debug = Debug(fullname)
  const logFunction = (tag: string, objects: any[]) => {
    const time = makeTime(dTimePure())
    immediate(sheduler.add, debug, time, tag, objects, padding)
  }


  const logGroup = function(name: string): GroupLogger {
    const padding = Math.min(Math.max(name.length + 1, 3), 8)
    const padString = `*${Array(padding-2)
      .fill(' ')
      .join('')}*`
    const pack = [
      () => logger(`#GROUP`)(makeGroupHeader(name)),
      () => logger(padString)('')
    ]
    function groupPrinter(...tags: VariString[]) {
      const tagStr = makeTags([padString, tags])
      return (...objects) => {
        pack.push(() => logFunction(tagStr, objects))
      }
    }
    groupPrinter.groupEnd = function() {
      pack.push(() => logger(`~GROUP`)('-   -   -   -  \n'))
      pack.forEach(fn => fn())
    }
    return groupPrinter
  }
  function loggerFn(...tags) {
    const tagStr = makeTags(tags)
    return (...objects) => logFunction(tagStr, objects)
  }
  loggerFn.group = logGroup

  const logger: LoggerInstance = loggerFn

  return debug.enabled
    ? logger
    : disabledLogger
}

export default Logger
