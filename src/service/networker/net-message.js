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
  msg_id: string = generateID()
  container: boolean = false
  deferred = blueDefer()
  constructor(seq_no: number, body: BodyBytes) {
    this.seq_no = seq_no
    this.body = body
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
  constructor(seq_no: number, body: BodyBytes, inner: string[]) {
    super(seq_no, body)
    this.container = true
    this.inner = inner
  }
}
