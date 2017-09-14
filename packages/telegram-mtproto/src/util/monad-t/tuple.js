//@flow

// import { Maybe } from 'folktale/maybe'
import { Maybe } from 'apropos'

import { ᐸMapᐳ, ᐸEmptyᐳ, λMap } from './index.h'
import OnlyStatic from '../only-static'

export class Tuple<+A, +B> implements λMap<'Tuple', B> {
  typeName: 'Tuple'
  +ᐸ1ᐳ: A
  +ᐸ2ᐳ: B
  constructor(a: *, b: *) {
    this.ᐸ1ᐳ /*::; const aa */ = a
    this.ᐸ2ᐳ /*::; const bb */ = b
  }
  fst(): A {
    return this.ᐸ1ᐳ
  }
  snd(): B {
    return this.ᐸ2ᐳ
  }
  bimap<Aʹ, Bʹ>(f: (a: A) => Aʹ, g: (b: B) => Bʹ): Tuple<Aʹ, Bʹ> {
    return new Tuple(f(this.ᐸ1ᐳ), g(this.ᐸ2ᐳ))
  }
  map<Bʹ>(f: (b: B) => Bʹ): Tuple<A, Bʹ> {
    return new Tuple(this.ᐸ1ᐳ, f(this.ᐸ2ᐳ))
  }
  curry<X>(f: (x: Tuple<A, B>) => X): X {
    return f(this)
  }
  uncurry<X>(f: (a: A, b: B) => X): X {
    return f(this.ᐸ1ᐳ, this.ᐸ2ᐳ)
  }
  extend<N>(f: (x: Tuple<A, B>) => N): Tuple<A, N> {
    return new Tuple(this.ᐸ1ᐳ, f(this))
  }
  extract(): B {
    return this.ᐸ2ᐳ
  }
  foldl<X, Z>(f: (b: B, z: Z) => X, z: Z): X {
    return f(this.ᐸ2ᐳ, z)
  }
  foldr<X, Z>(f: (z: Z, b: B) => X, z: Z): X {
    return f(z, this.ᐸ2ᐳ)
  }
  foldMap<X>(f: (b: B) => X): X {
    return f(this.ᐸ2ᐳ)
  }
  equals<Aʹ, Bʹ>(tuple: Tuple<Aʹ, Bʹ>): boolean {
    return this.eqFirst(tuple)
      && this.eqSecond(tuple)
  }
  eqFirst<Aʹ, -Bʹ>(tuple: Tuple<Aʹ, Bʹ>): boolean {
    return eq(this.fst(), tuple.fst())
  }
  eqSecond<-Aʹ, Bʹ>(tuple: Tuple<Aʹ, Bʹ>): boolean {
    return eq(this.snd(), tuple.snd())
  }
  toValue() {
    return [this.ᐸ1ᐳ, this.ᐸ2ᐳ]
  }
  toJSON() {
    return this.toValue()
  }
  toString() {
    return `Tuple( ${String(this.ᐸ1ᐳ)}, ${String(this.ᐸ2ᐳ)} )`
  }
  static of<Aʹ, Bʹ>(a: Aʹ, b: Bʹ): Tuple<Aʹ, Bʹ> {
    return new Tuple(a, b)
  }
}

export class TupleT extends OnlyStatic {
  static fromArray<A, B>(list: [A, B][]): Array<Tuple<A, B>> {
    return list.map(([key, val]) => ofTuple(key, val))
  }
  static of = ofTuple
  static traverseMaybe = traverseMaybe
  static snd = snd
  static fst = fst
}

function traverseMaybe<A, B>(tuple: Tuple<A, Maybe<B>>): Maybe<Tuple<A, B>> {
  const a = tuple.fst()
  const b = tuple.snd()
  return b.map(bVal => new Tuple(a, bVal))
}

function snd<-A, B>(tuple: Tuple<A, B>): B {
  return tuple.snd()
}

function fst<A, -B>(tuple: Tuple<A, B>): A {
  return tuple.fst()
}

function eq(a, b): boolean {
  if (a === b) return true
  if (canCompare(a) && canCompare(b))
    //$off
    return a.equals(b) && b.equals(a)
  return false
}

function ofTuple<Aʹ, Bʹ>(a: Aʹ, b: Bʹ): Tuple<Aʹ, Bʹ> {
  return new Tuple(a, b)
}

const typeID = 'zero-bias/Tuple@1'

export const MTuple: (
  & ᐸMapᐳ<'Tuple'>
  & ᐸEmptyᐳ<'Tuple'>
) = {
  '@@type'            : typeID,
  of                  : <A, B>([a, b]: [A, B]): Tuple<A, B> => new Tuple(a, b),
  'fantasy-land/of'   : <A, B>([a, b]: [A, B]): Tuple<A, B> => new Tuple(a, b),
  empty               : (): Tuple<void, void> => new Tuple(void 0, void 0),
  'fantasy-land/empty': (): Tuple<void, void> => new Tuple(void 0, void 0)
}

/*::  ; const dull = {} */

Object.assign(/*:: dull, */ Tuple, MTuple)

function canCompare(x): boolean {
  return (
    typeof x === 'object'
    && x != null
    && typeof x.equals === 'function'
  )
}

export default Tuple
