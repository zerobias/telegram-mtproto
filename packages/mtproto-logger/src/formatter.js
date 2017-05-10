//@flow

import { format } from 'util'

const stream = process.stdout
const write = (e: string) => {
  stream.write(`\n${e}`)
}

const replaceModuleName = (str: string) => str.replace('telegram-mtproto:', '')


const formatLines = (str: any[]) => format(...str).split('\n')

const writer = (log: *) => (...str: any[]) => {
  const splits = formatLines(str)
  const result = splits.map(replaceModuleName)
  result.forEach(write)
}

export default writer
