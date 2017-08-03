//@flow

import Emitter from 'eventemitter2'
import { fromEvent } from 'most'
import { type Stream } from 'most'

import Debug from './debug'

const emitter = new Emitter()


const eventsHandler = (queue: LogEvent[][]): LogEvent[] => {
  const result = []
  const ln = queue.length
  for (let i = 0; i < ln; i++) {
    const qInstance = queue[i]
    const qLn = qInstance.length
    for (let j = 0; j < qLn; j++)
      result.push(qInstance[j])
  }
  return result
}

export const logStream: Stream<LogEvent[]> = fromEvent('log', emitter).map(eventsHandler)
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

const stringLimiting =
  (str: *) =>
    typeof str === 'string' && str > 50
      ? str.slice(0, 150)
      : str

const normalizeVaules = (list: any[]) => {
  if (list.length === 0) return [' ']
  return list.map(stringLimiting)
}


const isSingleObject = (results: any[]) =>
  results.length === 1 &&
  typeof results[0] === 'object'


export class Sheduler {
  queue: LogEvent[][] = []
  buffer: LogEvent[] = []

  add = (log: Debug.IDebugger,
    time: string,
    tagStr: string,
    values: any[]) => {
    const results = normalizeVaules(values)
    if (isSingleObject(results))
      results.unshift('%O')
    const firstLine = [tagStr, time].join('  ')

    this.buffer.push(new LogEvent(log, [firstLine]))
    this.buffer.push(new LogEvent(log, results))

  }

  sheduleBuffer = () => {
    this.queue.push(this.buffer)
    this.buffer = []
  }

  print = () => {
    emitter.emit('log', this.queue)
    for (const buffer of this.queue)
      for (const logEvent of buffer)
        logEvent.print()
    this.queue = []
  }

  constructor(sheduleInterval: number = 50,
              printInterval: number = 200) {
    setInterval(this.sheduleBuffer, sheduleInterval)
    setInterval(this.print, printInterval)
  }
}

const sheduler = new Sheduler

export default sheduler
