//@flow

import NetworkerThread from '../networker'
import Request from './request'
import { NetMessage } from '../networker/net-message'


class State {
  threads: Map<string, NetworkerThread> = new Map
  requests: Map<string, Request> = new Map
  messages: Map<string, NetMessage> = new Map
}

export default State
