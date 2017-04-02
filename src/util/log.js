//@flow

// import memoize from 'memoizee'

import Debug from 'debug'

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
import join from 'ramda/src/join'
import unapply from 'ramda/src/unapply'
import unnest from 'ramda/src/unnest'
import tail from 'ramda/src/tail'

import dTime from './dtime'
import { immediate } from './smart-timeout'

type VariString = string | string[]

type Normalize = (tag: string) => string
type FullNormalize = (tags: VariString[]) => string

const tagNormalize: Normalize = e => `[${e}]`

const arrify = unapply(unnest)

const fullNormalize: FullNormalize = pipe(
  flatten,
  chain(split(',')),
  map(trim),
  reject(isEmpty),
  map(tagNormalize),
  join('')
)

const stringNormalize = when(
  both(is(String), e => e.length > 50),
  take(150)
)
// const isSimple = either(
//   is(String),
//   is(Number)
// )

// const prettify = unless(
//   isSimple,
//   pretty
// )

const genericLogger = Debug('telegram-mtproto')

class LogEvent {
  log: typeof genericLogger
  values: mixed[]
  constructor(log: typeof genericLogger, values: mixed[]) {
    this.log = log
    this.values = values
  }
  print() {
    this.log(...this.values)
  }
}

class Sheduler {
  queue: LogEvent[][] = []
  buffer: LogEvent[] = []
  add = (log: typeof genericLogger, time: string, tagStr: string, values: mixed[]) => {
    const results = values.map(stringNormalize)
    const first = results[0] || ''
    const other = tail(results)
    const firstLine = [tagStr, time, first].join('  ')
    this.buffer.push(new LogEvent(log, [firstLine, ...other]))
  }
  sheduleBuffer = () => {
    this.queue.push(this.buffer)
    this.buffer = []
  }
  print = () => {
    for (const buffer of this.queue)
      for (const logEvent of buffer)
        logEvent.print()
    this.queue = []
  }
  constructor() {
    setInterval(this.sheduleBuffer, 50)
    setInterval(this.print, 300)
  }
}

const sheduler = new Sheduler

const Logger = (moduleName: VariString, ...rest: string[]) => {
  const fullModule: string[] = arrify(moduleName, ...rest)
  fullModule.unshift('telegram-mtproto')
  const fullname = fullModule.join(':')
  const debug = Debug(fullname)
  const logger = (...tags: (string | string[])[]) => {
    const tagStr = fullNormalize(tags)
    return (...objects: any[]) => {
      const time = dTime()
      immediate(sheduler.add, debug, time, tagStr, objects)
    }
  }
  return logger
}

export const setLogger = (customLogger: Function) => {
  Debug.log = customLogger
}

export default Logger