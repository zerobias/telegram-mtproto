//@flow

import both from 'ramda/src/both'
import is from 'ramda/src/is'
import isNil from 'ramda/src/isNil'
import isEmpty from 'ramda/src/isEmpty'
import pipe from 'ramda/src/pipe'
import map from 'ramda/src/map'
import when from 'ramda/src/when'
import take from 'ramda/src/take'
import tail from 'ramda/src/tail'

import Debug from './debug'

class LogEvent {
  log: Debug.IDebugger
  values: mixed[]
  constructor(log: Debug.IDebugger, values: mixed[]) {
    this.log = log
    this.values = values
  }
  print() {
    this.log(...this.values)
  }
}

const ensureNonEmpty =
  (list: any[]) => isEmpty(list)
    ? [' ']
    : list

const stringLimiting = when(
    both(is(String), e => e.length > 50),
    take(150)
  )

const normalizeVaules: <V>(list: V) => V = pipe(
  map(stringLimiting),
  ensureNonEmpty
)

const isSingleObject = (results: any[]) =>
  results.length === 1 &&
  // !isNil(results[0]) &&
  is(Object, results[0])
  // !isEmpty(results[0])


class Sheduler {
  queue: LogEvent[][] = []
  buffer: LogEvent[] = []

  add = (log: Debug.IDebugger,
    time: string,
    tagStr: string,
    values: mixed[],
    padding: string) => {
    const results = normalizeVaules(values)
    if (isSingleObject(results))
      results.unshift('%O')
    const first = results[0]
    const other = tail(results)
    const firstLine = [tagStr, time].join('  ')

    this.buffer.push(new LogEvent(log, [firstLine]))
    this.buffer.push(new LogEvent(log, [first, ...other]))

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

  constructor(sheduleInterval: number = 50,
              printInterval: number = 300) {
    setInterval(this.sheduleBuffer, sheduleInterval)
    setInterval(this.print, printInterval)
  }
}

export default Sheduler
