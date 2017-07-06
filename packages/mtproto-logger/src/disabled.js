//@flow

import { type VariString, type LoggerInstance, type GroupLogger } from './index.h'

//eslint-disable-next-line
const disabledSubfn = (...objects: any[]) => {}
//eslint-disable-next-line
function logger(...tags: VariString[]) {
  return disabledSubfn
}

logger.group = (name: string): GroupLogger => {
  function disabledGroupPrinter(...tags) {
    return disabledSubfn
  }
  disabledGroupPrinter.groupEnd = function() { }
  return disabledGroupPrinter
}

const disabledLogger: LoggerInstance = logger

export default disabledLogger
