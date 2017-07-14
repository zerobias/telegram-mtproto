//@flow

import Bluebird from 'bluebird'
import { Stream, of } from 'most'

import Logger from 'mtproto-logger'
import { type HoldSubject } from '../property'
const log = Logger`observer`

type Observable<T> = {
  //$FlowIssue
  next(val: mixed): Stream<T>,
  error(err: Error): Stream<T>,
  complete(val: mixed): Promise<T>,
}

//$FlowIssue
function Observer<T>({ next, error, complete }: Observable<T>) {
  //$FlowIssue
  return (stream: HoldSubject<T>) =>
    Bluebird.try(() => {
      const streamNext: Stream<T | Stream<T>> =
        stream
          .map(
            val => Bluebird
              //$FlowIssue
              .try(() => next(val))
              .tap(data => {
                if (isStream(data) === false)
                  stream.complete(data)
              }))
          .awaitPromises()
      return streamNext
        .chain(val => isStream(val) ? val : of(val))
        .recoverWith(error)
        // .tap(log`after recover`)
        .observe(x => x)
    }).then(complete)
}

function isStream(val): boolean %checks {
  return val instanceof Stream
}

export default Observer
