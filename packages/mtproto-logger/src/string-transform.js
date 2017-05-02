//@flow

import chalk from 'chalk'

import flatten from 'ramda/src/flatten'
import trim from 'ramda/src/trim'
import map from 'ramda/src/map'
import chain from 'ramda/src/chain'
import pipe from 'ramda/src/pipe'
import split from 'ramda/src/split'
import when from 'ramda/src/when'
import reject from 'ramda/src/reject'
import isEmpty from 'ramda/src/isEmpty'
import toUpper from 'ramda/src/toUpper'
import join from 'ramda/src/join'
import append from 'ramda/src/append'
import flip from 'ramda/src/flip'
import contains from 'ramda/src/contains'
import transduce from 'ramda/src/transduce'

import { memoize } from 'mtproto-shared'

const brackets = {
  open : chalk.gray('['),
  close: chalk.gray(']')
}

const tagBrackets = (e: string) => `${brackets.open}${e}${brackets.close}`

const fillLine = when(
  contains('|'),
  pipe(chalk.hidden, chalk.black),
)

type Transducer = <T>(fn: T) => T

const transducer: Transducer = (fn) => transduce(fn, flip(append), [])

const createGroupHeader = pipe(
  trim,
  toUpper,
  chalk.magenta,
  chalk.bold,
  name => `--- ---  ${name}  --- ---`
)

const noOpNormalizeTags = pipe(
  chain(split(',')),
  map(trim),
  reject(isEmpty),
  map(pipe(chalk.blue, chalk.bold)),
  map(tagBrackets),
  map(fillLine),
)

const normalizeTags = pipe(
  flatten,
  transducer(noOpNormalizeTags),
  join('')
)


export const makeModuleName = pipe(
  flatten,
  chain(split(',')),
  map(trim),
  reject(isEmpty),
)

export const makeTime = (time: string) => chalk.gray(chalk.italic(time))


export const makeTags = memoize(normalizeTags)

export const makeGroupHeader = memoize(createGroupHeader)

