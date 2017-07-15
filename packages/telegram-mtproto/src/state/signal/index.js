//@flow

import store from '../core'
import { type State } from '../index.h'
import { async } from 'most-subject'
import { type Stream } from 'most'
import Config from '../../config-provider'
import { faucetC } from '../../pull-stream'

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

export { isActive as active }
export const whenActive = faucetC(isActive)

export const homeDc = root
  .map(state => state.homeDc)
  .skipRepeats()

export const uid = root
  .map(state => state.uid)
  .skipRepeats()

export const networker = root
  .map(state => state.networker)

const stateModel = {
  active: isActive,
  homeDc,
  uid,
  networker,
}

export default stateModel
