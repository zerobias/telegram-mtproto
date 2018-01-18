//@flow

import {fromEvent, Stream, from} from 'most'
import {emitter, emit} from './pubsub'
import {Action} from './action'
import {UniqGuard} from './fixtures'
import {resolver, type ActInit} from './act-init'
import {getStoreId} from './register'

export function combineEpics() {

}

export class Epic<A, Store> {

  fn: *
  constructor<R>(
    action: Action<A>,
    fn: (data$: Stream<A>, state: Stream<Store>) => Stream<R>
  ) {

    this.fn = (state: Stream<Store>): Stream<R> => fn(from(action), state)
  }
  use(storeId: number) {

  }
}
