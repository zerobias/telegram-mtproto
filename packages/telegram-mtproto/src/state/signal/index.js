//@flow

import store from '../core'
import { type State } from '../index.h'
import { async } from 'most-subject'
import { type Stream } from 'most'
import multicast from '@most/multicast'

(multicast: <T>(val: Stream<T>) => Stream<T>)

interface Subject<T> extends Stream<T> {
  next (value: T): Subject<T>,
  error(err: Error): Subject<T>,
  complete (value?: T): Subject<T>,
}

const rootSignal: Subject<State> = async()
const root: Stream<State> = rootSignal.thru(multicast)

const isActive = root
  .map(state => state.active)
  .skipRepeats()

const mainDc = root
  .map(state => state.mainDc)
  .skipRepeats()

const uid = root
  .map(state => state.uid)
  .skipRepeats()

store.subscribe(
  () => rootSignal.next(store.getState())
)

const stateModel = {
  active: isActive,
  mainDc,
  uid,
}

export default stateModel
