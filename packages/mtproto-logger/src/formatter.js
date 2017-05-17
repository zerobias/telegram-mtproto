//@flow

import { format } from 'util'
import { supportsColor, stripColor } from 'chalk'

const stream = process.stdout
const write = (e: string) => {
  stream.write(`\n${e}`)
}

const replaceModuleName = (str: string) => str.replace('telegram-mtproto:', '')

let prepareString = replaceModuleName
if (!supportsColor)
  prepareString = (str: string) => stripColor(replaceModuleName(str))

const formatLines = (str: any[]) => format(...str).split('\n')

const writer = (log: *) => (...str: any[]) => {
  const splits = formatLines(str)
  const result = splits.map(prepareString)
  result.forEach(write)
}

export default writer
