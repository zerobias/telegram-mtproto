//@flow

import { rootStream } from '../portal'

export const requestMap = rootStream
  .map(state => state.request)
  .skipRepeats()
