//@flow

import { async, hold } from 'most-subject'
import { Stream, Sink, Source } from 'most'
interface HoldSubjectSource<T> extends Source<T>, Sink<T> { }
interface SubjectT<T> {
  +source: Source<T> & Sink<T>,

  next (value: T): Subject<T>,
  error <Err: Error> (err: Err): Subject<T>,
  complete (value?: T): Subject<T>,
}

type Subject<T> = Stream<T> | SubjectT<T>

type HoldSubjectT<T> = {
  source: HoldSubjectSource<T>,

  next (value: T): HoldSubject<T>,
  error <Err: Error> (err: Err): HoldSubject<T>,
  complete (value?: T): HoldSubject<T>,
}

export interface HoldSubject<T> extends Stream<T>, HoldSubjectT<T>, SubjectT<T> { }

type Hold = <T>(bufferSize: number, subject: Subject<T>) => HoldSubject<T>
type Async = <T>() => Subject<T>

(async: Async);
(hold: Hold)

function Property<T>(name: string, value: T): HoldSubject<T> {
  const plainStream: Subject<T> = async()
  const property: HoldSubject<T> = hold(1, plainStream)
  property.next(value)
  return property
}

export function subject<T>(value: T): HoldSubject<T> {
  const plainStream: HoldSubject<T> = async()
  return plainStream
}

export default Property

