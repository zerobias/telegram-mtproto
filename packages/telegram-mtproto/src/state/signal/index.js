//@flow

import store from '../core'
import { type State } from '../index.h'
import { async } from 'most-subject'
import { type Stream } from 'most'

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}

export const rootSignal: Subject<State> = async()
const root: Stream<State> = rootSignal.multicast()

const isActive = root
  .map(state => state.active)
  .skipRepeats()

const mainDc = root
  .map(state => state.mainDc)
  .skipRepeats()

const uid = root
  .map(state => state.uid)
  .skipRepeats()

const networker = root
  .map(state => state.networker)

const stateModel = {
  active: isActive,
  mainDc,
  uid,
  networker,
}

export default stateModel
