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

/*::
opaque type Int = number
opaque type StringDec: string = string
opaque type Uid: string = string
opaque type NonNegativeInt: Int = number
opaque type DcInt: NonNegativeInt = number
*/


export type MessageMain = {
  +id: string,
  +seq: number,
  +session: number[],
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
