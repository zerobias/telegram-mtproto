//@flow

import chalk from 'chalk'

import flatten from 'array-flatten'

import { memoize } from 'mtproto-shared'

const brackets = {
  open : chalk.gray('['),
  close: chalk.gray(']')
}

const createGroupHeader = (str: string) => {
  const text = str.trim().toUpperCase()
  const colorfull = chalk.bold(chalk.magenta(text))
  const result = `--- ---  ${colorfull}  --- ---`
  return result
}


const noOpNormalizeTag = (str: string) => {
  const trimmed = str.trim()
  if (trimmed === '') return ''
  if (trimmed.indexOf('|') !== -1)
    return Array(trimmed.length+2)
      .fill(' ')
      .join('')
  const colorfull = chalk.bold(chalk.blue(trimmed))
  const enclosed = `${brackets.open}${colorfull}${brackets.close}`
  return enclosed
}

const mapToString =
  (str: *): string =>
    typeof str === 'string'
      ? str
      : str.toString()

const flatSplit =
  (acc: string[], val: string) => {
    acc.push(...val.split(','))
    return acc
  }

const normalizeTags = (list: *) => {
  const flatList: string[] = flatten(list)
  const result =
    flatList
      .map(mapToString)
      .reduce(flatSplit, [])
      .map(noOpNormalizeTag)
      .join(''); //eslint-disable-line
  return result
}

const trimReject =
  (acc: string[], val: string) => {
    const result = val.trim()
    if (result !== '')
      acc.push(result)
    return acc
  }

export const makeModuleName = (list: *) => {
  const flatList: string[] = flatten(list)
  const result =
    flatList
      .map(mapToString)
      .reduce(flatSplit, [])
      .reduce(trimReject, []); //eslint-disable-line
  return result
}

export const makeTime = (time: string) => chalk.gray(chalk.italic(time))


export const makeTags = memoize(normalizeTags)

export const makeGroupHeader = memoize(createGroupHeader)

