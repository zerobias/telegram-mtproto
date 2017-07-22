//@flow

import { Either } from 'funfix'
import { Future } from 'fluture'
import { type Fluture } from 'fluture'

function folding<R, L>(future: Fluture<R, L>): Fluture<Either<L, R>, void> {
  const fold: Fluture<Either<L, R>, void> = future.fold(Either.left, Either.right)
  return fold
}

export function FutureFold<Resolve, Reject>(
  fn: (rj: (err: Reject) => void,
       rs: (data: Resolve) => void
    ) => ((() => void) | void)
): Fluture<Either<Reject, Resolve>, void> {
  const future: Fluture<Resolve, Reject> = Future(fn)
  const futureFold: Fluture<Either<Reject, Resolve>, void> = folding(future)
  return futureFold
}

export default folding
