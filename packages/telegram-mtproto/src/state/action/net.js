//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import { type ActionPair } from '../helpers'
import { doubleCreator } from '../helpers'

type Net = {
  SEND: ActionPair<'net/send', {
    message: NetMessage,
    options: Object,
    threadID: string,
    thread: NetworkerThread,
    noResponseMsgs: string[],
  }, NetworkerMeta>,
  RECEIVE_RESPONSE: ActionPair<'net/response', {
    message: NetMessage,
    noResponseMsgs: string[],
    result: AxiosXHR<ArrayBuffer>,
    thread: NetworkerThread
  }>,
  NETWORK_ERROR: ActionPair<'net/error', any>,
}

type NetworkerMeta = number

const networkerMeta = (_: any, dc: number) => ({ _: 'networker', id: dc })

export const NET: Net = {
  SEND            : doubleCreator('net/send', networkerMeta),
  RECEIVE_RESPONSE: doubleCreator('net/response'),
  NETWORK_ERROR   : doubleCreator('net/error'),
}


