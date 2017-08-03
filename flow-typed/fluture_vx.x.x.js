declare module 'fluture' {
  declare function cancel<+Resolve, +Reject>(): void
  declare export class Fluture<Resolve, Reject> {
    map<T>(fn: (data: Resolve) => T): Fluture<T, Reject>,
    bimap<T, F>(left: (err: Reject) => F, right: (data: Resolve) => T): Fluture<T, F>,
    chain<T, F>(fn:
      (data: Resolve) => Fluture<T, F>
    ): Fluture<T, F | Reject>,
    swap(): Fluture<Reject, Resolve>,
    mapRej<F>(fn: (err: Reject) => F): Fluture<Resolve, F>,
    chainRej<F>(fn: (err: Reject) => Fluture<Resolve, F>): Fluture<Resolve, F>,
    fork(
      left: (err: Reject) => any,
      right: (data: Resolve) => any
    ): () => void,
    promise(): Promise<Resolve>,

    or<T, F>(alt: Fluture<T, F>): Fluture<Resolve | T, Reject | F>,
    and<T, F>(alt: Fluture<T, F>): Fluture<Resolve | T, Reject | F>,
    both<T, F>(futureB: Fluture<T, F>): Fluture<[Resolve, T], Reject | F>,
    fold<T, F>(
      left: (val: Reject) => F,
      right: (val: Resolve) => T
    ): Fluture<T | F, void>,
    value(): Resolve,
  }

  declare export function Future<Resolve, Reject>(fn: (rj: (err: Reject) => void, rs: (data: Resolve) => void) => ((() => void) | void)): Fluture<Resolve, Reject>
  declare export function encaseP2<+A, +B, Resolve>(fn:(a: A, b: B) => Promise<Resolve>): ((a: A, b: B) => Fluture<Resolve, mixed> | (a: A) => (b: B) => Fluture<Resolve, mixed>)
  declare export function encaseP3<+A, +B, +C, Resolve>(fn:(a: A, b: B, c: C) => Promise<Resolve>): (a: A, b: B, c: C) => Fluture<Resolve, mixed>

  // type Curry2<A, B, Resolve, Reject> = {
  //   (a: A, b: B): Fluture<Resolve, Reject>,
  //   (a: A): (b: B) => Fluture<Resolve, Reject>,
  // }

  declare function CurryFuture2<+A, B, -Resolve, -Reject>(a: A): (b: B) => Fluture<Resolve, Reject>
  declare function CurryFuture2<+A, +B, -Resolve, -Reject>(a: A, b: B): Fluture<Resolve, Reject>
  declare export function encase2<+A, +B, Resolve>(fn:(a: A, b: B) => Resolve): (a: A) => (b: B) => Fluture<Resolve, mixed>
  declare export function encase3<+A, +B, +C, Resolve>(fn:(a: A, b: B, c: C) => Resolve): (a: A) => (b: B) => (b: B) => Fluture<Resolve, mixed>
  declare export function encaseP<A, Resolve>(fn:(a: A) => Promise<Resolve>): (a: A) => Fluture<Resolve, mixed>
  declare export function encase<+A, Resolve>(fn:(a: A) => Resolve): (a: A) => Fluture<Resolve, mixed>

  declare export function reject<F>(error: F): Fluture<void, F>
  declare export function resolve<T>(value: T): Fluture<T, void>
  declare export function after<T>(time: number, value: T): Fluture<T, void>

  declare export function both<TA, FA, TB, FB>(futureA: Fluture<TA, FA>, futureB: Fluture<TB, FB>): Fluture<[TA, TB], FA | FB | [FA, FB]>
  declare export function or<TA, FA, TB, FB>(futureA: Fluture<TA, FA>, futureB: Fluture<TB, FB>): Fluture<TA | TB, FA | FB>
  declare export function and<TA, FA, TB, FB>(futureA: Fluture<TA, FA>, futureB: Fluture<TB, FB>): Fluture<TA | TB, FA | FB>
  declare export function isFuture(val: mixed): boolean
  declare export function of<T>(val: T): Fluture<T, mixed>
}
