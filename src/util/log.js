//@flow

import Debug from 'debug'
import { trim, map, chain, pipe, split,
  both, is, when, take, reject, isEmpty, join } from 'ramda'
import { dTime } from '../service/time-manager'

type Normalize = (tag: string) => string
type FullNormalize = (tags: string[]) => string

const tagNormalize: Normalize = pipe(
  // toUpper,
  e => `[${e}]`
)

const fullNormalize: FullNormalize = pipe(
  chain(split(',')),
  map(trim),
  reject(isEmpty),
  map(tagNormalize),
  join('')
)

const stringNormalize = when(
  both(is(String), e => e.length > 50),
  take(50)
)

const Logger = (...moduleName: string[]) => {
  moduleName.unshift('telegram-mtproto')
  const fullname = moduleName.join(':')
  const debug = Debug(fullname)
  const logger = (tags: string[]) => {
    const tagStr = fullNormalize(tags)
    return (...objects: any[]) => {
      const time = dTime()
      //$FlowIssue
      const [ first = '', ...other ] = objects.map(stringNormalize)
      const firstLine = [tagStr, time, first].join('  ')
      setTimeout(debug, 200, firstLine, ...other)
    }
  }
  return logger
}

export default Logger