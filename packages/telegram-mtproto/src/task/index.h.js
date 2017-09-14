//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../service/networker/net-message'
import NetworkerThread from '../service/networker'
import { type DCNumber, type UID } from 'Newtype'

export type RawInput = {
  message: NetMessage,
  noResponseMsgs: string[],
  result: AxiosXHR<ArrayBuffer>,
  thread: NetworkerThread,
  dc: DCNumber,
  uid: UID,
}

export type IncomingType = RawInput & {
  messageID: string,
  sessionID: Uint8Array,
  seqNo: number
}

export type RawError = {
  +_: 'rpc_error',
  +error_code: number,
  +error_message: string,
}

export type RawObject = {
  +_: string,
}


export type ApiData = {
  +_: string,
  +flags?: number,
}

export type SystemMessage = {
  +_: 'new_session_created' | string,
  +[field: string]: string,
}

export type RawBody = {
  +_: 'rpc_result',
  +req_msg_id: string,
  +result?: RawError | ApiData,
}

export type RawInner = {
  +_: string,
  +body: RawBody | SystemMessage,
  +bytes: number,
  +msg_id: string,
  +seqno: number,
}

export type RawContainer = {
  +_: string,
  +messages: RawInner[]
}

export type  RawMessage = RawContainer | RawBody | RawObject

/*::
opaque type Int = number
opaque type StringDec: string = string
opaque type Uid: string = string
opaque type NonNegativeInt: Int = number
opaque type DcInt: NonNegativeInt = number
*/

export type MessageCore = {|
  +id: string,
  +seq: number,
  +session: number[],
  +dc: number,
|}

export type MessageMain = {
  +id: string,
  +seq: number,
  +session: Uint8Array,
  +dc: number,
  +flags: {
    +api: boolean,
    +inner: boolean,
    +container: boolean,
    +incoming: boolean,
    +methodResult: boolean,
    +body: boolean,
    +error: boolean,
  }
}

export type MessageDraft =
  | {
    ...MessageCore,
    +type: 'object',
    +raw: RawObject,
  }
  | {
    ...MessageCore,
    +type: 'container',
    +raw: string[],
  }
  | {
    ...MessageCore,
    +type: 'inner',
    +raw: RawInner,
  }


export type Conformᐸincomingᐳ = {
  +incoming: {
    +timestamp: number,
  }
} &  MessageMain

export type ConformᐸmethodResultᐳ = {
  +methodResult: { +outID: string }
} & Conformᐸincomingᐳ & MessageMain

export type Conformᐸinnerᐳ = {
  +inner: { +container: string }
} & MessageMain

export type Conformᐸbodyᐳ = {
  +body: {
    +_: string,
    +[field: string]: any,
  }
} & MessageMain

// /* {
//   +api: {
//     +resultType: string,
//   }
// } & */

//$FlowIssue
export type Conformᐸapiᐳ = {
  +api: {
    +resolved: boolean,
    +apiID: string,
  }
} & ConformᐸmethodResultᐳ

export type Conformᐸerrorᐳ = {
  +error: {
    +code: number,
    +message: string,
    +handled: boolean,
  }
} & Conformᐸapiᐳ

export type Conformᐸcontainerᐳ = {
  +container: {
    +contains: string[],
    // +apiMap: Map<string, (string | false)>,
  }
} & MessageMain

export type MessageUnit = {
  +id: string,
  +seq: number,
  +session: Uint8Array,
  +dc: number,
  +flags: {
    +api: boolean,
    +inner: boolean,
    +container: boolean,
    +incoming: boolean,
    +methodResult: boolean,
    +body: boolean,
    +error: boolean,
  },
  +api: {
    +resolved: boolean,
    +apiID: string,
  },
  +inner: { +container: string },
  +container: {
    +contains: string[],
  },
  +incoming: {
    +timestamp: number,
  },
  +methodResult: { +outID: string },
  +body: {
    +_: string,
    +[field: string]: any,
  },
  +error: {
    +code: number,
    +message: string,
    +handled: boolean,
  },
}

export type ᐸPatchᐳMessage = { dc: number, id: string }

export type ᐸPatchᐳProcessAck = ᐸPatchᐳMessage
export type ᐸPatchᐳAck = ᐸPatchᐳMessage
export type ᐸPatchᐳHome = number
export type ᐸPatchᐳAuthKey = { dc: number, authKey: number[] | false }
export type ᐸPatchᐳReqResend = ᐸPatchᐳMessage
export type ᐸPatchᐳResend = ᐸPatchᐳMessage
export type ᐸPatchᐳLastMesages = ᐸPatchᐳMessage
export type ᐸPatchᐳSalt = { dc: number, salt: number[] }
export type ᐸPatchᐳSession = {
  dc: number,
  session: number[],
  seq: number,
  first: string
}

export type ᐸPatchᐳSummary = {
  processAck: ᐸPatchᐳProcessAck[],
  ack: ᐸPatchᐳAck[],
  // home: ᐸPatchᐳHome[],
  // auth: ᐸPatchᐳAuthKey[],
  reqResend: ᐸPatchᐳReqResend[],
  // resend: ᐸPatchᐳResend[],
  // lastMessages: ᐸPatchᐳLastMesages[],
  // salt: ᐸPatchᐳSalt[],
  // session: ᐸPatchᐳSession[],
}


type ReducedMessage = { [dc: number]: string[] }
// type MaybeKey = { [dc: number]: number[] | false }

export type ᐸPatchᐳSummaryReduced = {
  processAck: ReducedMessage,
  ack: ReducedMessage,
  // home: ᐸPatchᐳHome[],
  // auth: MaybeKey,
  reqResend: ReducedMessage,
  // resend: ReducedMessage,
  // lastMessages: ReducedMessage,
  // salt: MaybeKey,
  // session: { [dc: number]: ᐸPatchᐳSession | false },
}

export type DcAuth = {
  auth: number[] | false,
  salt: number[] | false,
  session: ᐸPatchᐳSession | false,
}

export type PUnitList = {
  normalized: MessageUnit[],
  summary: ᐸPatchᐳSummaryReduced,
}
