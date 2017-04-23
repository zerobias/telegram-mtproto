//@flow

import { format } from 'util'
import flatten from 'ramda/src/flatten'
import replace from 'ramda/src/replace'

const stream = process.stdout

const formatter = (log) => (...str: any[]) => {
  // const fmt = format(...str)
  // console.log(fmt)
  // console.log(fmt.replace('telegram-mtproto:', ''))

  const splits = flatten(format(...str)
    .split('\n'))
  const result = splits.map(
    replace('telegram-mtproto:', ''))
  // console.log(result)
  flatten(result).map(e => stream.write('\n'+e))
}

export default formatter
