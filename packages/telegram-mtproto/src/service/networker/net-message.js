//@flow

import { generateID } from '../time-manager'
import blueDefer, { type Defer } from 'Util/defer'
import { type DCNumber } from 'Newtype'

type BodyBytes = number[] | Uint8Array

export type NetMessageType =
  | 'container'
  | 'api'
  | 'polling'
  | 'ack/resend'
  | 'other'

export class NetMessage {
  type: NetMessageType
  uid: string
  body: BodyBytes
  seq_no: number
  isAPI: boolean
  innerAPI: ?(string | boolean)[]
  acked: boolean = false
  msg_id: string
  container: boolean = false
  notContentRelated: boolean = false
  deferred: Defer
  requestID: ?string
  dc: DCNumber
  noShedule: ?boolean
  resultType: ?string
  createNetworker: boolean = false
  longPoll: boolean = false

  constructor(
    uid: string,
    dc: DCNumber,
    seq_no: number,
    body: BodyBytes,
    type: NetMessageType = 'other'
  ) {
    this.type = type
    this.uid = uid
    this.dc = dc
    this.msg_id = generateID(uid)
    this.seq_no = seq_no
    Object.defineProperty(this, 'body', {
      enumerable  : false,
      configurable: true,
      writable    : true,
      value       : body
    })
    Object.defineProperty(this, 'deferred', {
      enumerable  : false,
      configurable: true,
      writable    : true,
      value       : blueDefer()
    })
    Object.defineProperty(this, 'copyHelper', {
      enumerable  : false,
      configurable: true,
      writable    : true,
      value       : this.copyHelper
    })
  }
  copyOptions(options: Object) { //TODO remove this
    for (const [key, val] of Object.entries(options))
      this.copyHelper(val, key)
  }
  copyHelper = (value: any, key: string) => {
    //$FlowIssue
    this[key] = value
  }
  size() {
    if (this.body instanceof Uint8Array)
      return this.body.byteLength
    else
      return this.body.length
  }
  clone(seq_no: number, dc: DCNumber): NetMessage {
    const copy = new NetMessage(this.uid, dc, seq_no, this.body, this.type)
    const result = clone(this, copy)
    return result
  }
}

export class NetContainer extends NetMessage {
  inner: string[]
  type: NetMessageType
  constructor(
    uid: string,
    dc: DCNumber,
    seq_no: number,
    body: BodyBytes,
    inner: string[],
    innerApi: (string | boolean)[]
  ) {
    super(uid, dc, seq_no, body, 'container')
    this.container = true
    this.inner = inner
    this.innerAPI = innerApi
  }
  clone(seq_no: number, dc: DCNumber): NetContainer {
    const copy = new NetContainer(this.uid, dc, seq_no, this.body, this.inner, this.innerAPI /*:: || [] */)
    const result = clone(this, copy)
    return result
  }
}

function clone <+T: NetMessage>(orig: T, copy: T): T {
  copy.isAPI = orig.isAPI
  copy.notContentRelated = orig.notContentRelated
  copy.deferred = orig.deferred
  copy.acked = orig.acked
  copy.noShedule = orig.noShedule
  copy.createNetworker = orig.createNetworker
  copy.resultType = orig.resultType
  return copy
}
