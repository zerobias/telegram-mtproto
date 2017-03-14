//@flow

import Debug from 'debug'

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

import { dTime } from '../service/time-manager'

type VariString = string | string[]

type Normalize = (tag: string) => string
type FullNormalize = (tags: VariString) => string

const tagNormalize: Normalize = e => `[${e}]`

const arrify = unapply(unnest)

const fullNormalize: FullNormalize = pipe(
  arrify,
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

const Logger = (moduleName: VariString, ...thanksFlow: string[]) => {
  const fullModule: string[] = arrify(moduleName, ...thanksFlow)
  fullModule.unshift('telegram-mtproto')
  const fullname = fullModule.join(':')
  const debug = Debug(fullname)
  const logger = (tags: string | string[]) => {
    const tagStr = fullNormalize(tags)
    return (...objects: any[]) => {
      const time = dTime()
      const results = objects.map(stringNormalize)
      const first = results[0] || ''
      const other = tail(results)
      const firstLine = [tagStr, time, first].join('  ')
      setTimeout(debug, 200, firstLine, ...other)
    }
  }
  return logger
}

export default Logger