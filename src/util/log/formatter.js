//@flow

import { format } from 'util'
import replace from 'ramda/src/replace'

const stream = process.stdout
const write = (e: string) => {
  stream.write(`\n${e}`)
}

const replaceModuleName = replace('telegram-mtproto:', '')


const formatLines = (str: any[]) => format(...str).split('\n')

const writer = (log: *) => (...str: any[]) => {
  // const fmt = format(...str)
  // console.log(fmt)
  // console.log(fmt.replace('telegram-mtproto:', ''))

  const splits = formatLines(str)
  const result = splits.map(replaceModuleName)
  // console.log(result)
  // flatten(result).map(write)
  result.forEach(write)
}

export default writer
