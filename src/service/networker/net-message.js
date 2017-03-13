//@flow

import Promise from 'bluebird'

import { generateID } from '../time-manager'
import blueDefer from '../../util/defer'

type BodyBytes = number[] | Uint8Array

export class NetMessage {
  container: boolean = false
  body: BodyBytes
  msg_id: string = generateID()
  seq_no: number
  isAPI: boolean
  deferred = blueDefer()
  constructor(seq_no: number, body: BodyBytes) {
    this.seq_no = seq_no
    this.body = body
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
