//@flow

import Debug from 'debug'
import fmt from './formatter'

export const setLogger = (customLogger: Function) => {
  Debug.log = customLogger
}

setLogger(fmt(Debug.log))

export default Debug
