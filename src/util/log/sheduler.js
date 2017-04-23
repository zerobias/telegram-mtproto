//@flow

import both from 'ramda/src/both'
import is from 'ramda/src/is'
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

const stringLimiting = when(
    both(is(String), e => e.length > 50),
    take(150)
  )

const isSingleObject = (results: any[]) =>
  results.length === 1 &&
  is(Object, results[0])

class Sheduler {
  queue: LogEvent[][] = []
  buffer: LogEvent[] = []

  add = (log: Debug.IDebugger,
    time: string,
    tagStr: string,
    values: mixed[]) => {
    const results = values.map(stringLimiting)
    if (isSingleObject(results))
      results.unshift('%O')
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

  constructor(sheduleInterval: number = 50,
              printInterval: number = 300) {
    setInterval(this.sheduleBuffer, sheduleInterval)
    setInterval(this.print, printInterval)
  }
}

export default Sheduler
