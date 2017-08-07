//@flow

import { type AxiosXHR } from 'axios'

import { NetMessage } from '../service/networker/net-message'
import NetworkerThread from '../service/networker'

export  type RawInput = {
  message: NetMessage,
  noResponseMsgs: string[],
  result: AxiosXHR<ArrayBuffer>,
  thread: NetworkerThread
}

export interface RawObject {
  +_: string,
}

export interface RawBody extends RawObject {
  +req_msg_id: string,
  +result?: RawObject,
}

export interface RawInner extends RawObject {
  +body: RawBody,
  +bytes: number,
  +msg_id: string,
  +seqno: number,
}

export interface RawContainer extends RawObject {
  +messages: RawInner[]
}

export type  RawMessage = RawContainer | RawObject

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

export type Conformᐸapiᐳ = {
  +api: {
    +resultType: string,
  }
} & ConformᐸmethodResultᐳ & MessageMain

export type Conformᐸcontainerᐳ = {
  +container: {
    +contains: string[],
    +apiMap: Map<string, (string | false)>,
  }
} & MessageMain

/*::
export type DeriveSubtype<B: MessageMain> = <-C: B>(val: C, fn: B => MessageMain) => MessageMain
*/
const reduceBody: Conformᐸbodyᐳ => MessageMain = (val) => val
