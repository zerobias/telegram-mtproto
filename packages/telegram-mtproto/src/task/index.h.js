//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../service/networker/net-message'
import NetworkerThread from '../service/networker'

export type RawInput = {
  message: NetMessage,
  noResponseMsgs: string[],
  result: AxiosXHR<ArrayBuffer>,
  thread: NetworkerThread
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

export type MessageCore = {
  +id: string,
  +seq: number,
  +session: Uint8Array,
  +dc: number,
}

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

export type MessageDraft = MessageCore & (
  | {
    +type: 'object',
    +raw: RawObject,
  }
  | {
    +type: 'container',
    +raw: string[],
  }
  | {
    +type: 'inner',
    +raw: RawInner,
  }
)

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

export type Conformᐸapiᐳ = ConformᐸmethodResultᐳ

export type Conformᐸerrorᐳ = {
  +error: {
    +code: number,
    +message: string,
  }
} & Conformᐸapiᐳ

export type Conformᐸcontainerᐳ = {
  +container: {
    +contains: string[],
    // +apiMap: Map<string, (string | false)>,
  }
} & MessageMain

/*::
export type DeriveSubtype<B: MessageMain> = <-C: B>(val: C, fn: B => MessageMain) => MessageMain
*/
const reduceBody: Conformᐸbodyᐳ => MessageMain = (val) => val
