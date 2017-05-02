//@flow

import Debug from 'debug'
// import isNode from 'detect-node'
import fmt from './formatter'

export const setLogger = (customLogger: Function) => {
  Debug.log = customLogger
}

/*function formatArgs(args: string[]) {
  const name = this.namespace
  const useColors = this.useColors

  if (useColors) {
    const c = this.color
    const prefix = `\u001b[3${c};1m${name} \u001b[0m`

    args[0] = prefix + args[0].split('\n').join(`\n${prefix}`)
    args.push(`\u001b[3${c}m+${exports.humanize(this.diff)}\u001b[0m`)
  } else {
    args[0] = `${new Date().toUTCString()} ${name} ${args[0]}`
  }
}

Debug.formatArgs = formatArgs*/

setLogger(fmt(Debug.log))

export default Debug
