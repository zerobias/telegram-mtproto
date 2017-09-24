//@flow

import { doubleCreator, type ActionPair } from '../helpers'
import {
  type OnSeqSet,
  type OnAckAdd,
  type OnReceiveResponse,
  type OnNetSend,
  type OnNetEncrypt,
} from '../index.h'

type Net = {
  ENCRYPT: ActionPair<'net/encrypt', OnNetEncrypt>,
  SEND: ActionPair<'net/send', OnNetSend>,
  RECEIVE_RESPONSE: ActionPair<'net/response', OnReceiveResponse>,
  NETWORK_ERROR: ActionPair<'net/error', any>,
  SEQ_SET: ActionPair<'net/seq set', OnSeqSet>,
  ACK_ADD: ActionPair<'net/ack add', OnAckAdd>,
  ACK_DELETE: ActionPair<'net/ack delete', OnAckAdd>,
}

export const NET: Net = {
  ENCRYPT         : doubleCreator('net/encrypt'),
  SEND            : doubleCreator('net/send'),
  RECEIVE_RESPONSE: doubleCreator('net/response'),
  NETWORK_ERROR   : doubleCreator('net/error'),
  SEQ_SET         : doubleCreator('net/seq set'),
  ACK_ADD         : doubleCreator('net/ack add'),
  ACK_DELETE      : doubleCreator('net/ack delete'),
}
