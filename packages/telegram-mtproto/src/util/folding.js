//@flow

import { Right, Left, Either } from './either'
import { Future } from 'fluture'
import { type Fluture } from 'fluture'

function folding<R, L>(future: Fluture<R, L>): Fluture<Either<R, L>, void> {
  //$ FlowIssue
  const fold: Fluture<Either<R, L>, void> = future.fold(Left, Right)
  return fold
}

export function FutureFold<Resolve, Reject>(
  fn: (rj: (err: Reject) => void,
       rs: (data: Resolve) => void
    ) => ((() => void) | void)
): Fluture<Either<Resolve, Reject>, void> {
  const future: Fluture<Resolve, Reject> = Future(fn)
  const futureFold: Fluture<Either<Resolve, Reject>, void> = folding(future)
  return futureFold
}

export default folding
