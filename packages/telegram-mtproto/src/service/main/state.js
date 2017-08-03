//@flow

import NetworkerThread from '../networker'
import ApiRequest from './request'
import { NetMessage } from '../networker/net-message'


class State {
  threads: Map<string, NetworkerThread> = new Map
  requests: Map<string, ApiRequest> = new Map
  messages: Map<string, NetMessage> = new Map
}

export default State
