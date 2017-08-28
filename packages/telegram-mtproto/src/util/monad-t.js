//@flow

import { Right, Left, of, ofL, type Apropos } from 'apropos'
import { append } from 'ramda'
import { Fluture, of as resolve, reject, Future } from 'fluture'
import { Maybe, Just, Nothing, fromNullable } from 'folktale/maybe'


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

// const d = futureEitherWrap(Future((rj, rs) => {
//   if ('abc'.length > 1) rs(0)
//   else rj('00')
//   }))


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

class OnlyStatic {
  constructor() {
    throw new Error(`Created instance of only static class`)
  }
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
  static unsafeGet<T>(x: Maybe<T>): T {
    return x.matchWith({
      Just({ value }): T {
        return value
      },
      Nothing: ERR.isNothing,
    })
  }

  static ap<I, O>(fn: Maybe<((x: I) => O)>, val: Maybe<I>): Maybe<O> {
    return val.chain(data => fn.map(f => f(data)))
  }

  static toEither<L, R>(toLeft: () => L, m: Maybe<R>): Apropos<L, R> {
    return m.matchWith({
      Just({ value }) {
        return Right(value)
      },
      Nothing() {
        return Left(toLeft())
      }
    })
  }

  static toEitherR<R>(m: Maybe<R>): Apropos<void, R> {
    return MaybeT.toEither(() => void 0, m)
  }

  static toFuture<L, R>(toLeft: () => L, m: Maybe<R>): Fluture<R, L> {
    return m.matchWith({
      Just({ value }) {
        return resolve(value)
      },
      Nothing() {
        return reject(toLeft())
      }
    })
  }

  static fold<T>(toLeft: () => T, m: Maybe<T>): T {
    return m.matchWith({
      Just({ value }) {
        return value
      },
      Nothing() {
        return toLeft()
      }
    })
  }

  static toFutureR<R>(m: Maybe<R>): Fluture<R, void> {
    return MaybeT.toFuture(() => void 0, m)
  }

  static isJust</*::-*/T>(x: Maybe<T>): boolean {
    return x.matchWith(/*::(*/isJustMatcher/*::, {
      Just(x: any) { return true },
      Nothing() { return false },
    })*/)
  }

}

const futureValue = x => resolve(x).mapRej(a => void 0)

function* monadicChain() {
  type X = 'x'
  const x: X = 'x'
  declare var out1: Apropos<void, 'x'>
  declare var out2: Fluture<{ b: 'abc' }, TypeError>
  const res2 = yield out2
  const res3 = yield out2
  const res4 = yield out2
  return out1
}

export async function go<-L, -R, LO, RO>(
  gen: Generator<Fluture<R, L>, Apropos<LO, RO>, Apropos<L, R>>
): Promise<Apropos<LO, RO>> {
  // const { value, done } = gen.next(val)
  declare var fake: Apropos<L, R>
  declare var fakeRes: { done: false, value: Fluture<R, L> }
  declare var fakeOut: Apropos<LO, RO>
  let next
  let iteration: {
    done: false,
    value: Fluture<R, L>,
  } | {
    done: true,
    value?: Apropos<LO, RO>,
  }
  while (true) {
    iteration = gen.next(next)
    if (iteration.done === true) {
      const { value = (next/*::, fakeOut */) } = iteration
      return value
    }
    const { value } = iteration
    const wrapped = futureEitherWrap(value)
    const result = await wrapped.promise()
    next = result
  }
  return fakeOut
}

export async function co() {

}

function* Gen1(input) { console.log(input); const x = yield 'out'; return x }

function* Gen(input) {
  const r1 = yield 1
  const r2 = yield* Gen1('gen 1')
  const r3 = yield [input, r1, r2]
  return r3
}

function* NextGen(input) {
  const r1 = yield 'a'
  const r2 = yield Gen1('gen 1 yield')
  const r3 = yield 'b'
  const r4 = yield * Gen('Gen')
  const r5 = yield [r1, r2, r3, r4]
  return r5
}


async function goo() {
  const x = monadicChain()
  // declare var dull: Apropos<*, *>
  declare var data1: Apropos<void, 'x'>
  declare var data2: Apropos<TypeError, { b: 'abc' }>
  // const fromGen = x.next(dull)
  // const first = await go(x, dull)
  // const a = await go(x, data1)
  const b = await go(x)
  // const b = x.next({ c: 3 }).value
  const xx = x
  return b
}

const isJustMatcher = {
  Just   : (/*::x: any*/) => true,
  Nothing: () => false,
}

/*::
type UnsafeGetMaybe = <T>(x: Maybe<T>) => T
declare var unsafeGetMaybe: UnsafeGetMaybe
*/

const ERR = {
  isNothing() { throw new Error(`UnsafeMaybeValue recieve nothing`) }
}
