//@flow

import * as Result from 'folktale/result'
import { type IResult } from 'folktale/result'

export interface ResultMatcher<Right, Left, -A, -B> {
  Right(res: { value: Right }): A,
  Left(res: { value: Left }): B,
}

export class Either<Right, Left> {
  inner: IResult<Right, Left>
  chiral: 'Left' | 'Right'
  value: Right | Left
  constructor(inner: IResult<Right, Left>) {
    Object.defineProperty(this, 'inner', {
      value     : inner,
      enumerable: false
    })
    this.chiral = this.matchWith({
      Right: () => 'Right',
      Left : () => 'Left',
    })
    this.value = inner.value
  }
  map<Right1>(fn: (obj: Right) => Right1): Either<Right1, Left> {
    return new Either(this.inner.map(fn))
  }
  mapError<Left1>(fn: (obj: Left) => Left1): Either<Right, Left1> {
    return new Either(this.inner.mapError(fn))
  }
  merge(): Right | Left {
    return this.inner.merge()
  }
  chain<Right1, Left1>(fn: (obj: Right) => Either<Right1, Left1>): Either<Right1, Left | Left1> {
    //$FlowIssue
    const chained: Either<Right1, Left | Left1> = this.matchWith({
      Right: (res: { value: Right }) => fn(res.value),
      Left : () => this,
    })
    return chained
  }
  getOrElse(defaults: Right): Right {
    return this.inner.getOrElse(defaults)
  }
  orElse<Right1, Left1>(fn: (obj: Left) => Either<Right1, Left1>): Either<Right | Right1, Left1> {
    //$FlowIssue
    const chained: Either<Right | Right1, Left1> = this.matchWith({
      Right: () => this,
      Left : (res: { value: Left }) => fn(res.value),
    })
    return chained
  }
  matchWith<A, B>(matcher: ResultMatcher<Right, Left, A, B>): A | B {
    return this.inner.matchWith({
      Ok   : matcher.Right,
      Error: matcher.Left,
    })
  }
  cata<A, B>(matcher: ResultMatcher<Right, Left, A, B>): A | B {
    return this.matchWith(matcher)
  }
}

export function of<Right, -Left: mixed>(obj: Right): Either<Right, Left> {
  const inner = Result.of(obj)
  return new Either(inner)
}

export function Right<R, -Left: mixed>(obj: R): Either<R, Left> {
  return of(obj)
}

export function Left<-Right: mixed, L>(obj: L): Either<Right, L> {
  const inner = Result.Error(obj)
  return new Either(inner)
}

export function fromNullable<Right>(obj: ?Right): Either<Right, null | void> {
  return new Either(Result.fromNullable(obj))
}

export function withPred<T>(pred: $Pred<1>, val: T): Either<*, *> {
  if (pred(val)) {
    return Right(val)
  } else {
    return Left(val)
  }
}

export default of
