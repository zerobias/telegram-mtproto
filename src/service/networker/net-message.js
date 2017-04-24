//@flow

import forEachObjIndexed from 'ramda/src/forEachObjIndexed'

import { generateID } from '../time-manager'
import blueDefer from '../../util/defer'

type BodyBytes = number[] | Uint8Array

export class NetMessage {
  body: BodyBytes
  seq_no: number
  isAPI: boolean
  acked: boolean = false
  msg_id: string
  container: boolean = false
  deferred: *
  constructor(uid: string, seq_no: number, body: BodyBytes) {
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
  }
}

export class NetContainer extends NetMessage {
  inner: string[]
  constructor(uid: string, seq_no: number, body: BodyBytes, inner: string[]) {
    super(uid, seq_no, body)
    this.container = true
    this.inner = inner
  }
}
