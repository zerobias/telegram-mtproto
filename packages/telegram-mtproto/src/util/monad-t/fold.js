//@flow

/* eslint-disable no-undef, flowtype/generic-spacing */

// import { type λ } from '@'

import { Left, Right, Apropos } from 'apropos'

import { resolve, reject, Fluture } from 'fluture'

import { Maybe } from 'folktale/maybe'

type λ<M, First, Second> = {
  // +typeclass: M,
  fold<Mʹ>(
    l: (x: First) => λ<Mʹ, any, any>,
    r: (x: Second) => λ<Mʹ, any, any>,
  ): λ<Mʹ, First, Second>
}

type WithMap<A, B> =
  // | Aproposᐸmapᐳ<A, B>
  | Flutureᐸmapᐳ<A, B>
  // | Maybeᐸmapᐳ

// opaque type Aproposᐸmapᐳ<First, Second>: λ<
//   Class<Apropos>, First, Second
// > = Apropos<First, Second>
opaque type Flutureᐸmapᐳ<First, Second>: λ<
  typeof Fluture, First, Second
> = Fluture<First, Second>
// export opaque type Maybeᐸmapᐳ<Second>: λ<
//   typeof Maybe, void, Second
// > = Maybe<Second>
opaque type λᐸmapᐳ<
  M:
    // | typeof Apropos
    typeof Fluture
    // | typeof Maybe,
    , Second, First = void
>: λ<
  M, First, Second
>
  =
  // | Aproposᐸmapᐳ<Second, First>
  | Flutureᐸmapᐳ<Second, First>
  // | Maybeᐸmapᐳ<Second>
//*/
// type NaturalTransformation<-MI, +MO> = <A, B>(x: λ<MI, A, B>) => λ<MO, A, B>
// type Wrap<+MO> = <-MI, A, B>(x: λ<MI, A, B>) => λ<MO, A, B>

// export function foldEither<-M, First, Second>(
//   x: λᐸmapᐳ<M, First, Second>
// ): Apropos<Second, First> {
//   declare var result: Apropos<Second, First>
//   return /*:: ( */ x /*:: , result )
// }
// const dull1 = (a: any, Left: any, Right: any) => { a */.fold(Left, Right) }

// type FoldFuture<First, Second = void> = <+M>(
//   x: λᐸmapᐳ<M, First, Second>
// ) => Fluture<First, Second>

function wrapFuture<A, B>(x: λᐸmapᐳ<WithMap<A, B>, A, B>): Fluture<B, A> {
  return x.fold(reject, resolve)
}
// const foldFuture = ((): FoldFuture => x => {
//   declare var result: Fluture<First, Second>
//   return /*:: ( */ x /*:: , result )
// })()
// const dull2 = (a: any, Left: any, Right: any) => { a */.fold(reject, resolve) }

declare var left: Apropos<'left', true>

const data: Fluture<true, 'left'> = wrapFuture(left)
//
// declare var may: Maybe<'may'>
// const datamay: Fluture<'may', void> = foldFuture(may)
//
// datamay
data
