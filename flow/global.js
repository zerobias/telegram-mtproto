//@flow

declare export var __DEV__: boolean
declare export function preval<T>(...vars: any[]): T

type $Spread<A, B, C = {}, D = {}> = /*::
  {
    ...$Exact<A>,
    ...$Exact<B>,
    ...$Exact<C>,
    ...$Exact<D>,
  }
type ____noop1<A, B, C, D> =
*/ A & B & C & D

