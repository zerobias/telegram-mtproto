//@flow

// import memoize from 'memoizee'

import './formatter'

import flatten from 'ramda/src/flatten'
import trim from 'ramda/src/trim'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'
import pipe from 'ramda/src/pipe'
import split from 'ramda/src/split'
import both from 'ramda/src/both'
import is from 'ramda/src/is'
import when from 'ramda/src/when'
import take from 'ramda/src/take'
import reject from 'ramda/src/reject'
import isEmpty from 'ramda/src/isEmpty'
import toUpper from 'ramda/src/isEmpty'
import join from 'ramda/src/join'
import unapply from 'ramda/src/unapply'
import unnest from 'ramda/src/unnest'
import append from 'ramda/src/append'
import flip from 'ramda/src/flip'
import contains from 'ramda/src/contains'
import transduce from 'ramda/src/transduce'

import chalk from 'chalk'
import memoize from 'memoizee'

import { dTimePure } from '../dtime'
import { immediate } from '../smart-timeout'

import Sheduler from './sheduler'
import Debug from './debug'

type VariString = string | string[]

type FullNormalize = (tags: VariString[]) => string





const tagBrackets = (e: string) => `${chalk.gray('[')}${e}${chalk.gray(']')}`

const arrify = unapply(unnest)

const fillLine = when(
  contains('|'),
  pipe(chalk.hidden, chalk.black),
  )

const transducer = (fn: any) => transduce(fn, flip(append), [])

const transNormalize = pipe(
  chain(split(',')),
  map(trim),
  reject(isEmpty),
  map(pipe(chalk.blue, chalk.bold)),
  map(tagBrackets),
  map(fillLine),
)



const fullNormalize: FullNormalize = pipe(
  flatten,
  transducer(transNormalize),
  join('')
)

const makeTime = (time: string) => chalk.gray(chalk.italic(time))


const memoized = memoize(fullNormalize, { length: 1 })


  // const isSimple = either(
  //   is(String),
  //   is(Number)
  // )

// const prettify = unless(
//   isSimple,
//   pretty
// )

interface LoggerInstance {
  (...tags: VariString[]): (...objects: any[]) => void,
  group(name: string): GroupLogger
}

interface GroupLogger {
  (...tags: VariString[]): (...objects: any[]) => void,
  groupEnd(): void
}


//eslint-disable-next-line
const disabledSubfn = (...objects: any[]) => {}
//eslint-disable-next-line
function disabledLogger (...tags: VariString[]) {
  return disabledSubfn
}
disabledLogger.group = (name: string) => {
  function disabledGroupPrinter(...tags) {
    return disabledSubfn
  }
  disabledGroupPrinter.groupEnd = function() { }
  return disabledGroupPrinter
}


const sheduler = new Sheduler

const Logger = (moduleName: VariString, ...rest: string[]) => {
  const fullModule: string[] = arrify(moduleName, ...rest)
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


  const logGroup = function(name: string) {
    const padding = Math.min(Math.max(name.length + 1, 3), 8)
    const padString = `*${Array(padding-2)
      .fill(' ')
      .join('')}*`
    const bigName: string = toUpper(name)
    const pack = [
      () => logger(`#GROUP`)(`--- ---  ${bigName}  --- ---`),
      () => logger(padString)('')
    ]
    function groupPrinter(...tags) {
      const tagStr = memoized([padString, tags])
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
    const tagStr = fullNormalize(tags)
    return (...objects) => logFunction(tagStr, objects)
  }
  loggerFn.group = logGroup

  const logger: LoggerInstance = loggerFn


  const disabledLog: LoggerInstance = disabledLogger
  return debug.enabled
    ? logger
    : disabledLog
}

export { setLogger } from './debug'

export default Logger
