//@flow

import { Stream } from 'most'
import * as MostSub from 'most-subject'
import { NetMessage } from '../service/networker/net-message'

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}


const fn = MostSub['as' + 'ync']

export type Bus = {
  net: {
    sendBinary: Subject<{
      url: string,
      data: Int32Array,
      requestOpts: any,
      message: NetMessage
    }>,
    sendNetMessage: Subject<NetMessage>,
  },
}

export const busFactory = (): Bus => ({
  net: {
    sendBinary    : fn(),
    sendNetMessage: fn(),
  }
})

export default busFactory
