//@flow

/* eslint-disable no-whitespace-before-property */

import { toString, equals } from 'ramda'

import {
  ᐸMapᐳ,
  ᐸChainᐳ,
  ᐸEmptyᐳ,
  ᐸChainRecᐳ,
  ᐸOfᐳ,
  λMap,
  λChain,
} from './index.h'

export type ChainRec<T> = {
  isNext: boolean,
  value: T,
}

export type CanBeMapped<V> = {
  map<T>(fn: (x: V) => T): CanBeMapped<T>,
}

type ChainRecF = <T>(x: T) => ChainRec<T>

type ChainRecIterator = <-I, O>(next: ChainRecF, done: ChainRecF, value: I) => ChainRec<O>

class ChainRecNext<T> {
  isNext: boolean = true
  done: boolean = false
  value: T
  constructor(value: T): ChainRec<T> {
    this.value = value
    /*:: return this */
  }
  static of<Tʹ>(value: Tʹ): ChainRec<Tʹ> {
    return new ChainRecNext(value)
  }
}

class ChainRecDone<T> {
  isNext: boolean = false
  done: boolean = true
  value: T
  constructor(value: T): ChainRec<T> {
    this.value = value
    /*:: return this */
  }
  static of<Tʹ>(value: Tʹ): ChainRec<Tʹ> {
    return new ChainRecDone(value)
  }
}

/**
 * A data type that holds a value and exposes a monadic api.
 */
export
class Identity<T>
implements
  λMap<'Identity', T>,
  λChain<'Identity', T>
{
  typeName: 'Identity'
  value: T
  /**
   * Constructs a new `Identity[a]` data type that holds a single
   * value `a`.
   * @param {*} a Value of any type
   * @sig a -> Identity[a]
   */
  constructor(value: T) {
    if (value instanceof ChainRecNext || value instanceof ChainRecDone)
      this.value = value.value
    else
      this.value = value
  }

  /**
   * Functor specification. Creates a new `Identity[a]` mapping function `f` onto
   * `a` returning any value b.
   * @param {Function} f Maps `a` to any value `b`
   * @returns Identity[b]
   * @sig @Identity[a] => (a -> b) -> Identity[b]
   */
  map<O>(f: (x: T) => O): Identity<O> {
    return new Identity(f(this.value))
  }

  /**
   * Chain specification. Transforms the value of the `Identity[a]`
   * type using an unary function to monads. The `Identity[a]` type
   * should contain a function, otherwise an error is thrown.
   *
   * @param {Function} fn Transforms `a` into a `Monad[b]`
   * @returns Monad[b]
   * @sig (Identity[a], m: Monad[_]) => (a -> m[b]) -> m[b]
   */
  chain<Name, O>(fn: (x: T) => λChain<Name, O>): λChain<Name, O> {
    return fn(this.value)
  }

  /**
   * Returns the value of `Identity[a]`
   *
   * @returns a
   * @sig (Identity[a]) => a
   */
  get(): T {
    return this.value
  }

  equals(value: any): boolean {
    if (value instanceof Identity)
      return equals(this.value, value.value)
    return equals(this.value, value)
  }

  toString() {
    return `Identity(${  toString(this.value)  })`
  }

  static is = is

  static of = of

  static empty = empty

  // static ap = ap

  static chainRec = chainRec
}

const typeID = 'zero-bias/Identity@1'

export const MIdentity: (
  & ᐸMapᐳ<'Identity'>
  & ᐸOfᐳ<'Identity'>
  & ᐸEmptyᐳ<'Identity'>
  & ᐸChainᐳ<'Identity'>
  & ᐸChainRecᐳ<'Identity'>
) = {
  '@@type'               : typeID,
  chainRec,
  'fantasy-land/chainRec': chainRec,
  of                     : <T>(value: T): Identity<T> => new Identity(value),
  'fantasy-land/of'      : <T>(value: T): Identity<T> => new Identity(value),
  empty                  : (): Identity<void> => new Identity(void 0),
  'fantasy-land/empty'   : (): Identity<void> => new Identity(void 0),
}

export function empty(): Identity<void> {
  return new Identity(void 0)
}

export function is(value: any): boolean {
  return value instanceof Identity
}

/**
 * Applicative specification. Creates a new `Identity[a]` holding the value `a`.
 * @param {*} a Value of any type
 * @returns Identity[a]
 * @sig a -> Identity[a]
 */
export function of<Tʹ>(value: Tʹ): Identity<Tʹ> {
  return new Identity(value)
}

export function chainRec<Tʹ, N>(f: ChainRecIterator, i: Tʹ): Identity<N> {
  let state = new ChainRecNext(i)
  while (state.isNext) {
    state = f(ChainRecNext.of, ChainRecDone.of, state.value)
  }
  declare var n: N
  return new Identity((state.value /*:: , n */ ))
}

/**
 * Apply specification. Applies the function inside the `Identity[a]`
 * type to another applicative type.
 * @param {Applicative[a]} app Applicative that will apply its function
 * @returns Applicative[b]
 * @sig (Identity[a -> b], f: Applicative[_]) => f[a] -> f[b]
 */

export function ap<I, O>(mapper: Identity<((x: I) => O)>, value: CanBeMapped<I>): CanBeMapped<O> {
  return value.map(mapper.value)
}


/*::  ; const dull = {} */

Object.assign(/*:: dull, */ Identity, MIdentity)

// //eslint-disable-next-line
// Identity.prototype /*:: ; dull */ .ap =
//   function(value: any) {
//     return Identity.ap(this, value)
//   }
