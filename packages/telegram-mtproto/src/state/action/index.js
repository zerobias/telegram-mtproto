//@flow

import { NetMessage } from '../../service/networker/net-message'
import { NetworkerThread } from '../../service/networker'
import { type MTP } from '../../mtp.h'

export type NetIncomingData = {
  message: NetMessage,
  result: {
    response: MTP,
    messageID: string,
    sessionID: Uint8Array,
    seqNo: number
  },
  thread: NetworkerThread
}



export { MAIN } from './main'
export type { InitType } from './main'

export { NET } from './net'

export { AUTH } from './auth'

export { NETWORKER_STATE } from './networker-state'

export { API } from './api'

export type { ApiMetaPL, ApiNewRequest, ApiCallResult } from './api'
