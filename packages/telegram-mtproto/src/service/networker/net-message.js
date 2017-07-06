//@flow

import { forEachObjIndexed } from 'ramda'

import { generateID } from '../time-manager'
import blueDefer from '../../util/defer'
import type { Defer } from '../../util/defer'

type BodyBytes = number[] | Uint8Array

export class NetMessage {
  uid: string
  body: BodyBytes
  seq_no: number
  isAPI: boolean
  acked: boolean = false
  msg_id: string
  container: boolean = false
  notContentRelated: boolean = false
  deferred: Defer
  requestID: ?string
  dc: ?number
  dcID: ?number
  noShedule: ?boolean
  resultType: ?string
  createNetworker: boolean = false
  longPoll: boolean = false
  constructor(uid: string, seq_no: number, body: BodyBytes) {
    this.uid = uid
    this.msg_id = generateID(uid)
    this.seq_no = seq_no
    // this.body = body
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
    forEachObjIndexed(this.copyHelper, options)
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
    /*
    else if (this.body != null) return this.body.length
    return 0*/
  }
  clone(seq_no: number, dc: number/* | '@@home'*/): NetMessage {
    const copy = new NetMessage(this.uid, seq_no, this.body)
    const result = clone(this, copy, dc)
    return result
  }
  // toJSON() {
  //   return {
  //     uid      : this.uid,
  //     deferred : this.deferred,
  //     requestID: this.requestID,
  //     noShedule: this.noShedule,

  //   }
  // }
}

export class NetContainer extends NetMessage {
  inner: string[]
  constructor(uid: string, seq_no: number, body: BodyBytes, inner: string[]) {
    super(uid, seq_no, body)
    this.container = true
    this.inner = inner
  }
  clone(seq_no: number, dc: number/* | '@@home'*/): NetContainer {
    const copy = new NetContainer(this.uid, seq_no, this.body, this.inner)
    const result = clone(this, copy, dc)
    return result
  }
}

function clone <+T: NetMessage>(orig: T, copy: T, dc: number): T {
  copy.dc = dc
  copy.isAPI = orig.isAPI
  copy.notContentRelated = orig.notContentRelated
  copy.deferred = orig.deferred
  copy.acked = orig.acked
  copy.noShedule = orig.noShedule
  copy.createNetworker = orig.createNetworker
  copy.dcID = orig.dcID
  copy.resultType = orig.resultType
  return copy
}

export type {
  NetMessage as NetMessageType,
  NetContainer as NetContainerType
}
