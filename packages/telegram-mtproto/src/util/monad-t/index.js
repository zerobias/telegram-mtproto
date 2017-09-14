//@flow

import { Right, Left, of, ofL, type Apropos } from 'apropos'
import { append } from 'ramda'
import { Fluture, of as resolve, reject, Future } from 'fluture'
// import { Maybe, Just } from 'folktale/maybe'

import { Maybe } from 'apropos'
const { Just } = Maybe

import * as Identity from './identity'

export {
  Identity
}


import OnlyStatic from '../only-static'
import { TupleT, Tuple, MTuple } from './tuple'

export { TupleT, Tuple, MTuple }
export { KeyValue } from './key-value'

export function maybeAp<I, O>(fn: Maybe<((x: I) => O)>, val: Maybe<I>): Maybe<O> {
  return val.chain(data => fn.map(f => f(data)))
}

export const traverseMaybe = (() => {
  function traverseMaybe<T>(list: Maybe<T>[]): Maybe<T[]> {
    const initial: T[] = []
    return list.reduce(traverseReducer, Just(initial))
  }

  function traverseReducer<T>(acc: Maybe<T[]>, val: Maybe<T>): Maybe<T[]> {
    return maybeAp(val.map(append), acc)
  }

  return traverseMaybe
})()

function traverseMaybe3<A, B, C>(a: Maybe<A>, b: Maybe<B>, c: Maybe<C>): Maybe<[A, B, C]> {
  //$off
  const result: any = traverseMaybe([a, b, c])
  const vector3: Maybe<[A, B, C]> = result
  return vector3
}

function futureEitherWrap<L, R>(
  future: Fluture<R, L>
): Fluture<Apropos<L, R>, void> {
  declare var foldMerge: FoldMerge<L, R>
  const res = /*:: foldMerge(*/  future.fold(Left, Right)
  /*:: )*/
  return res
}

type FoldMerge<L, R> = <LI, RI>(
  fluture: Fluture<RI, LI>
) => Fluture<Apropos<L, R>, void>

export class FutureEither<Reject, Resolve> {
  value: Fluture<Apropos<Reject, Resolve>, *>
  constructor(value: Fluture<Apropos<Reject, Resolve>, void>) {
    this.value = value
  }
  promise(): Promise<Apropos<Reject, Resolve>> {
    return this.value.promise()
  }
  map<RN>(fn: (x: Resolve) => RN): FutureEither<Reject, RN> {
    return new FutureEither(this.value.map(either => either.map(fn)))
  }
  mapL<F>(fn: (err: Reject) => F): FutureEither<F, Resolve> {
    return new FutureEither(this.value.map(either => either.mapL(fn)))
  }
  chain<LN, RN>(fn: (x: Resolve) => Apropos<LN, RN>): FutureEither<Reject | LN, RN> {
    return new FutureEither(this.value.map(either => either.chain(fn)))
  }
  chainL<LN, RN>(fn: (err: Reject) => Apropos<LN, RN>): FutureEither<LN, Resolve | RN> {
    return new FutureEither(this.value.map(either => either.chainL(fn)))
  }
  chainAsync<LN, RN>(
    fn: (x: Resolve) => Fluture<RN, LN>
  ): FutureEither<Reject | LN, RN> {
    return futureEither(
      this.toPlainFuture().chain(fn)
    )
  }
  chainAsyncL<LN, RN>(
    fn: (x: Reject) => Fluture<RN, LN>
  ): FutureEither<LN, Resolve | RN> {
    return futureEither(
      this.toPlainFuture().chainRej(fn)
    )
  }
  toPlainFuture(): Fluture<Resolve, Reject> {
    return this.value
      .chain(
        (x: Apropos<Reject, Resolve>): Fluture<Resolve, Reject> =>
          eitherToFuture(x))
  }
}

export function futureEither<L, R>(future: Fluture<R, L>): FutureEither<L, R> {
  return new FutureEither(futureEitherWrap(future))
}

export function eitherToFuture<L, R>(either: Apropos<L, R>): Fluture<R, L> {
  return Future((rj, rs) => {
    either.bitap(rj, rs)
  })
}

export class FutureT extends OnlyStatic {
  static futureEither<L, R>(future: Fluture<R, L>): FutureEither<L, R> {
    const wrapped = futureEitherWrap(future)
    return new FutureEither(wrapped)
  }
  static wrapEither = futureEitherWrap
}

export class EitherT extends OnlyStatic {
  static toFuture = eitherToFuture
  static futureEither<L, R>(either: Apropos<L, R>): FutureEither<L, R> {
    const asFuture = EitherT.toFuture(either)
    return FutureT.futureEither(asFuture)
  }
  //$off
  static both<L1, R1, L2, R2>(e1: Apropos<L1, R1>, e2: Apropos<L2, R2>): Apropos<L1 | L2, [R1, R2]> {
    if (e1.isLeft()) return e1
    return e2.isRight()
      //$off
      ? Right([e1.value, e2.value])
      : e2
  }

  static unwrapMaybe<L, LN, R>(toLeft: () => LN, either: Apropos<L, Maybe<R>>) {
    return either
      .logic({
        cond: MaybeT.isJust,
        pass: MaybeT.unsafeGet,
        fail: toLeft,
      })
  }
}



export class MaybeT extends OnlyStatic {
  static traverse = traverseMaybe

  static both<T1, T2>(m1: Maybe<T1>, m2: Maybe<T2>): Maybe<[T1, T2]> {
    const pair: any[] = [m1, m2]
    return traverseMaybe(pair)
    /*::
      .map(() => [unsafeGetMaybe(m1), unsafeGetMaybe(m2)])
    */
  }
  static traverse3 = traverseMaybe3

  static unsafeGet<T>(x: Maybe<T>): T {
    return x.fold(
      ERR.isNothing,
      x => x
    )
  }

  static ap<I, O>(fn: Maybe<((x: I) => O)>, val: Maybe<I>): Maybe<O> {
    return val.chain(data => fn.map(f => f(data)))
  }

  static toEither<L, R>(toLeft: () => L, m: Maybe<R>): Apropos<L, R> {
    return m.fold(
      () => Left(toLeft()),
      Right
    )
  }

  static toEitherR<R>(m: Maybe<R>): Apropos<void, R> {
    return MaybeT.toEither(() => void 0, m)
  }

  static toFuture<L, R>(toLeft: () => L, m: Maybe<R>): Fluture<R, L> {
    return m.fold(
      () => reject(toLeft()),
      resolve
    )
  }

  static fold<T>(toLeft: () => T, m: Maybe<T>): T {
    return m.fold(toLeft, x => x)
  }

  static toFutureR<R>(m: Maybe<R>): Fluture<R, void> {
    return MaybeT.toFuture(() => void 0, m)
  }

  static isJust<-T>(x: Maybe<T>): boolean {
    return x.isJust()
  }

}


export { These } from './these'
export type { λThese } from './these'

/*::
type UnsafeGetMaybe = <T>(x: Maybe<T>) => T
declare var unsafeGetMaybe: UnsafeGetMaybe
*/

const ERR = {
  isNothing() { throw new Error(`UnsafeMaybeValue recieve nothing`) }
}
