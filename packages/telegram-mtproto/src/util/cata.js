//@flow
import { Stream } from 'most'
import { Either } from 'funfix'

export type EitherCase<R, RR, L, LL> = {
  Left(data: L): LL,
  Right(data: R): RR,
}

function cata<R, L, RR, LL>(
  cases: EitherCase<R, RR, L, LL>,
  either: Either<L, R>
): RR | LL {
  const isRight: boolean = either.isRight()
  const { Right, Left } = cases
  if (isRight) {
    const r: R = either.get()
    const result: RR = Right(r)
    return result
  } else {
    const swap: Either<R, L> = either.swap()
    const l: L = swap.get()
    const result: LL = Left(l)
    return result
  }
}

export function cataC<R, L, RR, LL>(cases: EitherCase<R, RR, L, LL>) {
  return function switchCata(either: Either<L, R>): RR | LL {
    const result: RR | LL = cata(cases, either)
    return result
  }
}

export function cataStream<R, L, RR, LL>(cases: EitherCase<R, RR, L, LL>) {
  return function switchCataStream(stream: Stream<Either<L, R>>): Stream<RR | LL> {
    const mapped: Stream<RR | LL> = stream.map((val) => cata(cases, val))
    return mapped
  }
}

export default cata
