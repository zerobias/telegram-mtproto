//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'

import { doubleCreator, type ActionPair } from '../helpers'
import {
  type OnSetStatus,
  type OnSeqSet,
  type OnAckAdd,
} from '../index.h'

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
  STATUS_SET: ActionPair<'net/status set', OnSetStatus>,
  SEQ_SET: ActionPair<'net/seq set', OnSeqSet>,
  ACK_ADD: ActionPair<'net/ack add', OnAckAdd>,
  ACK_DELETE: ActionPair<'net/ack delete', OnAckAdd>,
}

type NetworkerMeta = number

const networkerMeta = (_: any, dc: number) => ({ _: 'networker', id: dc })

export const NET: Net = {
  SEND            : doubleCreator('net/send', networkerMeta),
  RECEIVE_RESPONSE: doubleCreator('net/response'),
  NETWORK_ERROR   : doubleCreator('net/error'),
  STATUS_SET      : doubleCreator('net/status set'),
  SEQ_SET         : doubleCreator('net/seq set'),
  ACK_ADD         : doubleCreator('net/ack add'),
  ACK_DELETE      : doubleCreator('net/ack delete'),
}
