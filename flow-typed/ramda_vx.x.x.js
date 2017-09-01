// flow-typed version: <<STUB>>/ramda_v^0.24.0/flow_v0.47.0

/* eslint-disable no-unused-vars, no-redeclare */



declare module 'ramda' {


  declare type Transformer<A,B> = {
    '@@transducer/step': <I,R>(r: A, a: *) => R,
    '@@transducer/init': () => A,
    '@@transducer/result': (result: *) => B
  }

  declare type UnaryFn<A,R> = (a: A) => R;
  declare type BinaryFn<A,B,R> = ((a: A, b: B) => R) & ((a:A) => (b: B) => R);
  declare type UnarySameTypeFn<T> = UnaryFn<T,T>
  declare type BinarySameTypeFn<T> = BinaryFn<T,T,T>
  declare type NestedObject<T> = { [k: string]: T | NestedObject<T> }
  declare type UnaryPredicateFn<T> = (x:T) => boolean
  declare type BinaryPredicateFn<T> = (x:T, y:T) => boolean
  declare type BinaryPredicateFn2<T,S> = (x:T, y:S) => boolean


  declare interface ObjPredicate {
    (value: any, key: string): boolean;
  }

  declare type CurriedFunction2<T1, T2, R> =
    & ((t1: T1, t2: T2) => R)
    & ((t1: T1, ...rest: Array<void>) => (t2: T2) => R)

  declare type CurriedFunction3<T1, T2, T3, R> =
    & ((t1: T1, t2: T2, t3: T3) => R)
    & ((t1: T1, t2: T2, ...rest: Array<void>) => (t3: T3) => R)
    & ((t1: T1, ...rest: Array<void>) => CurriedFunction2<T2, T3, R>)

  declare type CurriedFunction4<T1, T2, T3, T4, R> =
    & ((t1: T1, t2: T2, t3: T3, t4: T4) => R)
    & ((t1: T1, t2: T2, t3: T3, ...rest: Array<void>) => (t4: T4) => R)
    & ((t1: T1, t2: T2, ...rest: Array<void>) => CurriedFunction2<T3, T4, R>)
    & ((t1: T1, ...rest: Array<void>) => CurriedFunction3<T2, T3, T4, R>)

  declare type CurriedFunction5<T1, T2, T3, T4, T5, R> =
    & ((t1: T1) => CurriedFunction4<T2, T3, T4, T5, R>)
    & ((t1: T1, t2: T2) => CurriedFunction3<T3, T4, T5, R>)
    & ((t1: T1, t2: T2, t3: T3) => CurriedFunction2<T4, T5, R>)
    & ((t1: T1, t2: T2, t3: T3, t4: T4) => (t5: T5) => R)
    & ((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R)

  declare type CurriedFunction6<T1, T2, T3, T4, T5, T6, R> =
    & ((t1: T1) => CurriedFunction5<T2, T3, T4, T5, T6, R>)
    & ((t1: T1, t2: T2) => CurriedFunction4<T3, T4, T5, T6, R>)
    & ((t1: T1, t2: T2, t3: T3) => CurriedFunction3<T4, T5, T6, R>)
    & ((t1: T1, t2: T2, t3: T3, t4: T4) => CurriedFunction2<T5, T6, R>)
    & ((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => (t6: T6) => R)
    & ((t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R)


  declare type Curry = & (<T1, T2, TResult>(fn: (a: T1, b: T2) => TResult) => CurriedFunction2<T1,T2, TResult>)
    & (<T1, T2, T3, TResult>(fn: (a: T1, b: T2, c: T3) => TResult) => CurriedFunction3<T1,T2, T3, TResult>)
    & (<T1, T2, T3, T4, TResult>(fn: (a: T1, b: T2, c: T3, d: T4) => TResult) => CurriedFunction4<T1,T2, T3, T4, TResult>)
    & (<T1, T2, T3, T4, T5, TResult>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5) => TResult) => CurriedFunction5<T1,T2, T3, T4, T5, TResult>)
    & (<T1, T2, T3, T4, T5, T6, TResult>(fn: (a: T1, b: T2, c: T3, d: T4, e: T5, f: T6) => TResult) => CurriedFunction6<T1,T2, T3, T4, T5, T6, TResult>)
    & ((fn: Function) => Function)


  declare class Monad<T> {
    chain: Function
  }

  declare class Semigroup<T> {}

  declare class Chain {
    chain<T,V: Monad<T>|Array<T>>(fn: (a:T) => V, x: V): V;
    chain<T,V: Monad<T>|Array<T>>(fn: (a:T) => V): (x: V) => V;
  }

  declare class GenericContructor<T> {
    constructor(x: T): GenericContructor<any>
  }

  declare class GenericContructorMulti {
    constructor(...args: Array<any>): GenericContructor<any>
  }

  declare export function pipe<A,B,C,D,E,F,G,H>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G,
    gh: (g: G) => H
  ): (a: A) => H
  declare export function pipe<A,B,C,D,E,F,G>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F,
    fg: (f: F) => G
  ): (a: A) => G
  declare export function pipe<A,B,C,D,E,F>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E,
    ef: (e: E) => F
  ): (a: A) => F
  declare export function pipe<A,B,C,D,E>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D,
    de: (d: D) => E
  ): (a: A) => E
  declare export function pipe<A,B,C,D>(
    ab: (a: A) => B,
    bc: (b: B) => C,
    cd: (c: C) => D
  ): (a: A) => D
  declare export function pipe<A,B,C>(
    ab: (a: A) => B,
    bc: (b: B) => C
  ): (a: A) => C
  declare export function pipe<A,B>(
    ab: (a: A) => B
  ): (a: A) => B

  declare export function compose<A,B,C,D,E,F,G,H>(
    gh: (g: G) => H,
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => H
  declare export function compose<A,B,C,D,E,F,G>(
    fg: (f: F) => G,
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => G
  declare export function compose<A,B,C,D,E,F>(
    ef: (e: E) => F,
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => F
  declare export function compose<A,B,C,D,E>(
    de: (d: D) => E,
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => E
  declare export function compose<A,B,C,D>(
    cd: (c: C) => D,
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => D
  declare export function compose<A,B,C>(
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => C
  declare export function compose<A,B>(
    ab: (a: A) => B
  ): (a: A) => B


  /**
  * DONE:
  * Function*
  * List*
  * Logic
  * Math
  * Object*
  * Relation
  * String
  * Type
  */

  declare var curry: Curry;
  declare export function curryN(length: number, fn: (...args: Array<any>) => any): Function

  // *Math
  declare var add: CurriedFunction2<number,number,number>;
  declare var inc: UnaryFn<number,number>;
  declare var dec: UnaryFn<number,number>;
  declare var mean: UnaryFn<Array<number>,number>;
  declare var divide: CurriedFunction2<number,number,number>
  declare var mathMod: CurriedFunction2<number,number,number>;
  declare var median: UnaryFn<Array<number>,number>;
  declare var modulo: CurriedFunction2<number,number,number>;
  declare var multiply: CurriedFunction2<number,number,number>;
  declare var negate: UnaryFn<number,number>;
  declare var product: UnaryFn<Array<number>,number>;
  declare var subtract: CurriedFunction2<number,number,number>;
  declare var sum: UnaryFn<Array<number>,number>;

  declare export function filter<V, T: V[] | {[key: string]: V}>(pred: (x: T) => boolean, no: void): (data: T) => T
  declare export function filter<V, T: V[] | {[key: string]: V}>(pred: (x: T) => boolean, data: T): T

  declare export function reject<V, T: V[] | {[key: string]: V}>(pred: (x: T) => boolean, no: void): (data: T) => T
  declare export function reject<V, T: V[] | {[key: string]: V}>(pred: (x: T) => boolean, data: T): T

  // *String
  declare var match: CurriedFunction2<RegExp,string,Array<string|void>>;
  declare export function replace<T: RegExp|string>(t1: T, t2: string, t3: string): string
  declare export function replace<T: RegExp|string>(t1: T, t2: string): (t3: string) => string
  declare export function replace<T: RegExp|string>(t1: T): (t2: string) => (t3: string) => string

  declare export function split<T: RegExp|string>(t1: T, t2: string): string[]
  declare export function split<T: RegExp|string>(t1: T): (t2: string) => string[]

  declare var test: CurriedFunction2<RegExp,string,boolean>
  declare export function toLower(a: string): string;
  declare export function toString(a: any): string;
  declare export function toUpper(a: string): string;
  declare export function trim(a: string): string;

  declare type NativeType =
    typeof Number
  | typeof String
  | typeof Boolean
  | typeof Object
  | typeof Array
  | typeof Function
  | typeof RegExp
  | typeof Symbol

  declare export function is<+T: NativeType>(t: T, v: mixed): boolean
  declare export function is<+T>(t: Class<T>, v: T): true
  declare export function is<+T, +C: Class<T>>(t: C, v: T): true
  declare export function is<+T>(t: Class<T>, v: $Diff<mixed, T>): false
  declare export function is<+T>(t: Class<T>): (v: T) => true
  declare export function is(t: NativeType): (v: mixed) => boolean


  declare var propIs: CurriedFunction3<any,string,Object,boolean>;
  declare export function type(x: ?any): string;
  declare export function isArrayLike(x: any): boolean;
  declare export function isNil(x: ?any): boolean;

  // *List
  declare export function adjust<T>(fn:(a: T) => T, ...rest: Array<void>): (index: number, ...rest: Array<void>) => (src: Array<T>) => Array<T>;
  declare export function adjust<T>(fn:(a: T) => T, index: number, ...rest: Array<void>): (src: Array<T>) => Array<T>;
  declare export function adjust<T>(fn:(a: T) => T, index: number, src: Array<T>): Array<T>;

  declare export function all<T>(fn: UnaryPredicateFn<T>, xs: Array<T>): boolean;
  declare export function all<T>(fn: UnaryPredicateFn<T>, ...rest: Array<void>): (xs: Array<T>) => boolean;

  declare export function any<T>(fn: UnaryPredicateFn<T>, xs: Array<T>): boolean;
  declare export function any<T>(fn: UnaryPredicateFn<T>, ...rest: Array<void>): (xs: Array<T>) => boolean;

  declare export function aperture<T>(n: number, xs: Array<T>): Array<Array<T>>;
  declare export function aperture<T>(n: number, ...rest: Array<void>): (xs: Array<T>) => Array<Array<T>>;

  declare export function append<+E>(x: E): (xs: Array<E>) => Array<E>
  declare export function append<+E>(x: E, xs: Array<E>): Array<E>

  declare export function prepend<E>(x: E, xs: Array<E>): Array<E>
  declare export function prepend<E>(x: E, ...rest: Array<void>): (xs: Array<E>) => Array<E>

  declare export function concat<V,T:Array<V>|string>(x: T, y: T): T;
  declare export function concat<V,T:Array<V>|string>(x: T): (y: T) => T;

  declare export function contains<E>(x: E, xs: Array<E>): boolean
  declare export function contains<E>(x: E): (xs: Array<E>) => boolean

  declare export function drop<V,T:Array<V>|string>(n: number, ...rest: Array<void>):(xs: T) => T;
  declare export function drop<V,T:Array<V>|string>(n: number, xs: T): T;

  declare export function dropLast<V,T:Array<V>|string>(n: number, ...rest: Array<void>):(xs: T) => T;
  declare export function dropLast<V,T:Array<V>|string>(n: number, xs: T): T;

  declare export function dropLastWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => T;
  declare export function dropLastWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, xs:T): T;

  declare export function dropWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => T;
  declare export function dropWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, xs:T): T;

  declare export function dropRepeats<V,T:Array<V>>(xs:T): T;

  declare export function dropRepeatsWith<V,T:Array<V>>(fn: BinaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => T;
  declare export function dropRepeatsWith<V,T:Array<V>>(fn: BinaryPredicateFn<V>, xs:T): T;

  declare export function groupBy<T>(fn: (x: T) => string, xs: Array<T>): {[key: string]: Array<T>}
  declare export function groupBy<T>(fn: (x: T) => string, ...rest: Array<void>): (xs: Array<T>) => {[key: string]: Array<T>}

  declare export function groupWith<T,V:Array<T>|string>(fn: BinaryPredicateFn<T>, xs: V): Array<V>
  declare export function groupWith<T,V:Array<T>|string>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): (xs: V) => Array<V>

  declare export function head<T,V:Array<T>>(xs: V): ?T
  declare export function head<T,V:string>(xs: V): V

  declare export function into<I,T,A:Array<T>,R:Array<*>|string|Object>(accum: R, xf: (a: A) => I, input: A): R
  declare export function into<I,T,A:Array<T>,R>(accum: Transformer<I,R>, xf: (a: A) => R, input: A): R

  declare export function indexOf<E>(x: E, xs: Array<E>): number
  declare export function indexOf<E>(x: E, ...rest: Array<void>): (xs: Array<E>) => number

  declare export function indexBy<V,T:{[key: string]:*}>(fn: (x: T) => string, ...rest: Array<void>): (xs: Array<T>) => {[key: string]: T}
  declare export function indexBy<V,T:{[key: string]:*}>(fn: (x: T) => string, xs: Array<T>): {[key: string]: T}

  declare export function insert<T>(index: number, ...rest: Array<void>): (elem: T) => (src: Array<T>) => Array<T>
  declare export function insert<T>(index: number, elem: T, ...rest: Array<void>): (src: Array<T>) => Array<T>
  declare export function insert<T>(index: number, elem: T, src: Array<T>): Array<T>

  declare export function insertAll<T,S>(index: number, ...rest: Array<void>): (elem: Array<S>) => (src: Array<T>) => Array<S|T>
  declare export function insertAll<T,S>(index: number, elems: Array<S>, ...rest: Array<void>): (src: Array<T>) => Array<S|T>
  declare export function insertAll<T,S>(index: number, elems: Array<S>, src: Array<T>): Array<S|T>

  declare export function join(x: string, xs: Array<any>): string
  declare export function join(x: string, ...rest: Array<void>): (xs: Array<any>) => string

  declare export function last<T,V:Array<T>>(xs: V): ?T
  declare export function last<T,V:string>(xs: V): V

  declare export function none<T>(fn: UnaryPredicateFn<T>, xs: Array<T>): boolean;
  declare export function none<T>(fn: UnaryPredicateFn<T>, ...rest: Array<void>): (xs: Array<T>) => boolean;

  declare export function nth<V,T:Array<V>>(i: number, xs: T): ?V
  declare export function nth<V,T:Array<V>|string>(i: number, ...rest: Array<void>): ((xs: string) => string)&((xs: T) => ?V)
  declare export function nth<T:string>(i: number, xs: T):  T

  declare export function find<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T|O) => ?V|O;
  declare export function find<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, xs:T|O): ?V|O;
  declare export function findLast<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T|O) => ?V|O;
  declare export function findLast<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, xs:T|O): ?V|O;

  declare export function findIndex<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => number
  declare export function findIndex<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, xs:T): number
  declare export function findLastIndex<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => number
  declare export function findLastIndex<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, xs:T): number

  declare export function forEach<T,V>(fn:(x:T) => ?V, xs: Array<T>): Array<T>
  declare export function forEach<T,V>(fn:(x:T) => ?V, ...rest: Array<void>): (xs: Array<T>) => Array<T>

  declare export function lastIndexOf<E>(x: E, xs: Array<E>): number
  declare export function lastIndexOf<E>(x: E, ...rest: Array<void>): (xs: Array<E>) => number

  declare export function map<T,R>(fn: (x:T) => R, xs: Array<T>): Array<R>;
  declare export function map<T,R,S:{map:Function}>(fn: (x:T) => R, xs: S): S;
  declare export function map<T,R>(fn: (x:T) => R, ...rest: Array<void>): ((xs: {[key: string]: T}) => {[key: string]: R}) & ((xs: Array<T>) => Array<R>)
  declare export function map<T,R,S:{map:Function}>(fn: (x:T) => R, ...rest: Array<void>): ((xs:S) => S) & ((xs: S) => S)
  declare export function map<T,R>(fn: (x:T) => R, xs: {[key: string]: T}): {[key: string]: R}

  declare type AccumIterator<A,B,R> = (acc: R, x: A) => [R,B]
  declare export function mapAccum<A,B,R>(fn: AccumIterator<A,B,R>, acc: R, xs: Array<A>): [R, Array<B>];
  declare export function mapAccum<A,B,R>(fn: AccumIterator<A,B,R>, ...rest: Array<void>): (acc: R, xs: Array<A>) => [R, Array<B>];

  declare export function mapAccumRight<A,B,R>(fn: AccumIterator<A,B,R>, acc: R, xs: Array<A>): [R, Array<B>];
  declare export function mapAccumRight<A,B,R>(fn: AccumIterator<A,B,R>, ...rest: Array<void>): (acc: R, xs: Array<A>) => [R, Array<B>];

  declare export function intersperse<E>(x: E, xs: Array<E>): Array<E>
  declare export function intersperse<E>(x: E, ...rest: Array<void>): (xs: Array<E>) => Array<E>

  declare export function pair<A,B>(a:A, b:B): [A,B]
  declare export function pair<A,B>(a:A, ...rest: Array<void>): (b:B) => [A,B]

  declare export function partition<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, xs:T): [T,T]
  declare export function partition<K,V,T:Array<V>|{[key:K]:V}>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T) => [T,T]

  declare export function pluck<V,K:string|number,T:Array<Array<V>|{[key:string]:V}>>(k: K, xs: T): Array<V>
  declare export function pluck<V,K:string|number,T:Array<Array<V>|{[key:string]:V}>>(k: K,...rest: Array<void>): (xs: T) => Array<V>

  declare var range: CurriedFunction2<number,number,Array<number>>;

  declare export function T(): true
  declare export function F(): false

  declare export function remove<T>(from: number, ...rest: Array<void>): ((to: number, ...rest: Array<void>) => (src: Array<T>) => Array<T>) & ((to: number, src: Array<T>) => Array<T>)
  declare export function remove<T>(from: number, to: number, ...rest: Array<void>): (src: Array<T>) => Array<T>
  declare export function remove<T>(from: number, to: number, src: Array<T>): Array<T>

  declare export function repeat<T>(x: T, times: number): Array<T>
  declare export function repeat<T>(x: T, ...rest: Array<void>): (times: number) => Array<T>

  declare export function slice<V,T:Array<V>|string>(from: number, ...rest: Array<void>): ((to: number, ...rest: Array<void>) => (src: T) => T) & ((to: number, src: T) => T)
  declare export function slice<V,T:Array<V>|string>(from: number, to: number, ...rest: Array<void>): (src: T) => T
  declare export function slice<V,T:Array<V>|string>(from: number, to: number, src: T): T

  declare export function sort<V,T:Array<V>>(fn: (a:V, b:V) => number, xs:T): T
  declare export function sort<V,T:Array<V>>(fn: (a:V, b:V) => number, ...rest: Array<void>): (xs:T) => T

  declare export function times<T>(fn:(i: number) => T, n: number): Array<T>
  declare export function times<T>(fn:(i: number) => T, ...rest: Array<void>): (n: number) => Array<T>

  declare export function take<V,T:Array<V>|string>(n: number, xs: T): T;
  declare export function take<V,T:Array<V>|string>(n: number):(xs: T) => T;

  declare export function takeLast<V,T:Array<V>|string>(n: number, xs: T): T;
  declare export function takeLast<V,T:Array<V>|string>(n: number):(xs: T) => T;

  declare export function takeLastWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, xs:T): T;
  declare export function takeLastWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>): (xs:T) => T;

  declare export function takeWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>, xs:T): T;
  declare export function takeWhile<V,T:Array<V>>(fn: UnaryPredicateFn<V>): (xs:T) => T;

  declare export function unfold<T,R>(fn: (seed: T) => [R, T]|boolean, ...rest: Array<void>): (seed: T) => Array<R>
  declare export function unfold<T,R>(fn: (seed: T) => [R, T]|boolean, seed: T): Array<R>

  declare export function uniqBy<T,V>(fn:(x: T) => V, ...rest: Array<void>): (xs: Array<T>) => Array<T>
  declare export function uniqBy<T,V>(fn:(x: T) => V, xs: Array<T>): Array<T>

  declare export function uniqWith<T>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): (xs: Array<T>) => Array<T>
  declare export function uniqWith<T>(fn: BinaryPredicateFn<T>, xs: Array<T>): Array<T>

  declare export function update<T>(index: number, ...rest: Array<void>): ((elem: T, ...rest: Array<void>) => (src: Array<T>) => Array<T>) & ((elem: T, src: Array<T>) => Array<T>)
  declare export function update<T>(index: number, elem: T, ...rest: Array<void>): (src: Array<T>) => Array<T>
  declare export function update<T>(index: number, elem: T, src: Array<T>): Array<T>

  declare export function innerJoin<T, V>(
    fn: (record: T, id: V) => boolean,
    list: T[],
    ids: V[]
  ): T[]
  declare export function innerJoin<T, V>(
    fn: (record: T, id: V) => boolean,
    list: T[],
    ids: void
  ): (ids: V[]) => T[]
  declare export function innerJoin<T, V>(
    fn: (record: T, id: V) => boolean,
    list: void,
    ids: void
  ): (
    | (list: T[], ids: void) => (ids: V[]) => T[]
    | (list: T[], ids: V[]) => T[]
  )
  // TODO `without` as a transducer
  declare export function without<T>(xs: Array<T>): (src: Array<T>) => Array<T>
  declare export function without<T>(xs: Array<T>, src: Array<T>): Array<T>

  declare export function xprod<T,S>(xs: Array<T>, ys: Array<S>): Array<[T,S]>
  declare export function xprod<T,S>(xs: Array<T>, ...rest: Array<void>): (ys: Array<S>) => Array<[T,S]>

  declare export function zip<T,S>(xs: Array<T>, ys: Array<S>): Array<[T,S]>
  declare export function zip<T,S>(xs: Array<T>): (ys: Array<S>) => Array<[T,S]>

  declare export function zipObj<T:string,S>(xs: Array<T>, ys: Array<S>): {[key:T]:S}
  declare export function zipObj<T:string,S>(xs: Array<T>, ...rest: Array<void>): (ys: Array<S>) => {[key:T]:S}

  declare export type NestedArray<T> = Array<T | NestedArray<T>>
  declare export function flatten<T>(xs: NestedArray<T>): Array<T>;

  declare export function fromPairs<T,V>(pair: Array<[T,V]>): {[key: string]:V};

  declare export function init<T,V:Array<T>|string>(xs: V): V;

  declare export function length<T>(xs: Array<T>): number;

  declare export function mergeAll(objs: Array<{[key: string]: any}>):{[key: string]: any};

  declare export function reverse<T,V:Array<T>|string>(xs: V): V;

  declare export function reduce<A, B>(fn: (acc: A, elem: B) => A, ...rest: Array<void>): ((init: A, xs: Array<B>) => A) & ((init: A, ...rest: Array<void>) => (xs: Array<B>) => A);
  declare export function reduce<A, B>(fn: (acc: A, elem: B) => A, init: A, ...rest: Array<void>): (xs: Array<B>) => A;
  declare export function reduce<A, B>(fn: (acc: A, elem: B) => A, init: A, xs: Array<B>): A;

  declare export function reduceBy<A, B>(fn: (acc: B, elem: A) => B, ...rest: Array<void>):
  ((acc: B, ...rest: Array<void>) => ((keyFn:(elem: A) => string, ...rest: Array<void>) => (xs: Array<A>) => {[key: string]: B}) & ((keyFn:(elem: A) => string, xs: Array<A>) => {[key: string]: B}))
  & ((acc: B, keyFn:(elem: A) => string, ...rest: Array<void>) => (xs: Array<A>) => {[key: string]: B})
  & ((acc: B, keyFn:(elem: A) => string, xs: Array<A>) => {[key: string]: B})
  declare export function reduceBy<A, B>(fn: (acc: B, elem: A) => B, acc: B, ...rest: Array<void>):
  ((keyFn:(elem: A) => string, ...rest: Array<void>) => (xs: Array<A>) => {[key: string]: B})
  & ((keyFn:(elem: A) => string, xs: Array<A>) => {[key: string]: B})
  declare export function reduceBy<A, B>(fn: (acc: B, elem: A) => B, acc: B, keyFn:(elem: A) => string): (xs: Array<A>) => {[key: string]: B};
  declare export function reduceBy<A, B>(fn: (acc: B, elem: A) => B, acc: B, keyFn:(elem: A) => string, xs: Array<A>): {[key: string]: B};

  declare export function reduceRight<A, B>(fn: (acc: A, elem: B) => A, ...rest: Array<void>): ((init: A, xs: Array<B>) => A) & ((init: A, ...rest: Array<void>) => (xs: Array<B>) => A);
  declare export function reduceRight<A, B>(fn: (acc: A, elem: B) => A, init: A, ...rest: Array<void>): (xs: Array<B>) => A;
  declare export function reduceRight<A, B>(fn: (acc: A, elem: B) => A, init: A, xs: Array<B>): A;

  declare export function scan<A, B>(fn: (acc: A, elem: B) => A, ...rest: Array<void>): ((init: A, xs: Array<B>) => A) & ((init: A, ...rest: Array<void>) => (xs: Array<B>) => A);
  declare export function scan<A, B>(fn: (acc: A, elem: B) => A, init: A, ...rest: Array<void>): (xs: Array<B>) => A;
  declare export function scan<A, B>(fn: (acc: A, elem: B) => A, init: A, xs: Array<B>): A;

  declare export function splitAt<V,T:Array<V>|string>(i: number, xs: T): [T,T];
  declare export function splitAt<V,T:Array<V>|string>(i: number): (xs: T) => [T,T];
  declare export function splitEvery<V,T:Array<V>|string>(i: number, xs: T): Array<T>;
  declare export function splitEvery<V,T:Array<V>|string>(i: number): (xs: T) => Array<T>;
  declare export function splitWhen<V,T:Array<V>>(fn: UnaryPredicateFn<V>, xs:T): [T,T];
  declare export function splitWhen<V,T:Array<V>>(fn: UnaryPredicateFn<V>): (xs:T) => [T,T];

  declare export function tail<T,V:Array<T>|string>(xs: V): V;

  declare export function transpose<T>(xs: Array<Array<T>>): Array<Array<T>>;

  declare export function uniq<T>(xs: Array<T>): Array<T>;

  declare export function unnest<T>(xs: NestedArray<T>): NestedArray<T>;

  declare export function zipWith<T,S,R>(fn: (a: T, b: S) => R, ...rest: Array<void>): ((xs: Array<T>, ys: Array<S>) => Array<R>) & ((xs: Array<T>, ...rest: Array<void> ) => (ys: Array<S>) => Array<R>)
  declare export function zipWith<T,S,R>(fn: (a: T, b: S) => R, xs: Array<T>, ...rest: Array<void>): (ys: Array<S>) => Array<R>;
  declare export function zipWith<T,S,R>(fn: (a: T, b: S) => R, xs: Array<T>, ys: Array<S>): Array<R>;

  // *Relation
  declare export function equals<+T>(x: T): (y: T) => boolean;
  declare export function equals<+T>(x: T, y: T): boolean;

  declare export function eqBy<A,B>(fn: (x: A) => B, ...rest: Array<void>): ((x: A, y: A) => boolean) & ((x: A, ...rest: Array<void>) => (y: A) => boolean);
  declare export function eqBy<A,B>(fn: (x: A) => B, x: A, ...rest: Array<void>): (y: A) => boolean;
  declare export function eqBy<A,B>(fn: (x: A) => B, x: A, y: A): boolean;

  declare export function propEq(prop: string, ...rest: Array<void>): ((val: *, o: {[k:string]: *}) => boolean) & ((val: *, ...rest: Array<void>) => (o: {[k:string]: *}) => boolean)
  declare export function propEq(prop: string, val: *, ...rest: Array<void>): (o: {[k:string]: *}) => boolean;
  declare export function propEq(prop: string, val: *, o: {[k:string]:*}): boolean;

  declare export function pathEq(path: Array<string>, ...rest: Array<void>): ((val: any, o: Object) => boolean) & ((val: any, ...rest: Array<void>) => (o: Object) => boolean);
  declare export function pathEq(path: Array<string>, val: any, ...rest: Array<void>): (o: Object) => boolean;
  declare export function pathEq(path: Array<string>, val: any, o: Object): boolean;

  declare export function clamp<T:number|string|Date>(min: T, ...rest: Array<void>):
    ((max: T, ...rest: Array<void>) => (v: T) => T) & ((max: T, v: T) => T);
  declare export function clamp<T:number|string|Date>(min: T, max: T, ...rest: Array<void>): (v: T) => T;
  declare export function clamp<T:number|string|Date>(min: T, max: T, v: T): T;

  declare export function countBy<T>(fn: (x: T) => string, ...rest: Array<void>): (list: Array<T>) => {[key: string]: number};
  declare export function countBy<T>(fn: (x: T) => string, list: Array<T>): {[key: string]: number};

  declare export function difference<T>(xs1: Array<T>, ...rest: Array<void>): (xs2: Array<T>) => Array<T>;
  declare export function difference<T>(xs1: Array<T>, xs2: Array<T>): Array<T>;

  declare export function differenceWith<T>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): ((xs1: Array<T>) => (xs2: Array<T>) => Array<T>) & ((xs1: Array<T>, xs2: Array<T>) => Array<T>);
  declare export function differenceWith<T>(fn: BinaryPredicateFn<T>, xs1: Array<T>, ...rest: Array<void>): (xs2: Array<T>) => Array<T>;
  declare export function differenceWith<T>(fn: BinaryPredicateFn<T>, xs1: Array<T>, xs2: Array<T>): Array<T>;

  declare export function eqBy<T>(fn: (x: T) => T, x: T, y: T): boolean;
  declare export function eqBy<T>(fn: (x: T) => T): (x: T, y: T) => boolean;
  declare export function eqBy<T>(fn: (x: T) => T, x: T): (y: T) => boolean;
  declare export function eqBy<T>(fn: (x: T) => T): (x: T) => (y: T) => boolean;

  declare export function gt<T>(x: T, ...rest: Array<void>): (y: T) => boolean;
  declare export function gt<T>(x: T, y: T): boolean;

  declare export function gte<T>(x: T, ...rest: Array<void>): (y: T) => boolean;
  declare export function gte<T>(x: T, y: T): boolean;

  declare export function identical<T>(x: T, ...rest: Array<void>): (y: T) => boolean;
  declare export function identical<T>(x: T, y: T): boolean;

  declare export function intersection<T>(x: Array<T>, y: Array<T>): Array<T>;
  declare export function intersection<T>(x: Array<T>): (y: Array<T>) => Array<T>;

  declare export function intersectionWith<T>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): ((x: Array<T>, y: Array<T>) => Array<T>) & ((x: Array<T>) => (y: Array<T>) => Array<T>);
  declare export function intersectionWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, ...rest: Array<void>): (y: Array<T>) => Array<T>;
  declare export function intersectionWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, y: Array<T>): Array<T>;

  declare export function lt<T>(x: T, ...rest: Array<void>): (y: T) => boolean;
  declare export function lt<T>(x: T, y: T): boolean;

  declare export function lte<T>(x: T, ...rest: Array<void>): (y: T) => boolean;
  declare export function lte<T>(x: T, y: T): boolean;

  declare export function max<T>(x: T, ...rest: Array<void>): (y: T) => T;
  declare export function max<T>(x: T, y: T): T;

  declare export function maxBy<T,V>(fn: (x:T) => V, ...rest: Array<void>): ((x: T, y: T) => T) & ((x: T) => (y: T) => T);
  declare export function maxBy<T,V>(fn: (x:T) => V, x: T, ...rest: Array<void>): (y: T) => T;
  declare export function maxBy<T,V>(fn: (x:T) => V, x: T, y: T): T;

  declare export function min<T>(x: T, ...rest: Array<void>): (y: T) => T;
  declare export function min<T>(x: T, y: T): T;

  declare export function minBy<T,V>(fn: (x:T) => V, ...rest: Array<void>): ((x: T, y: T) => T) & ((x: T) => (y: T) => T);
  declare export function minBy<T,V>(fn: (x:T) => V, x: T, ...rest: Array<void>): (y: T) => T;
  declare export function minBy<T,V>(fn: (x:T) => V, x: T, y: T): T;

  declare export function sortBy<T,V>(fn: (x:T) => V, ...rest: Array<void>): (x: Array<T>) => Array<T>;
  declare export function sortBy<T,V>(fn: (x:T) => V, x: Array<T>): Array<T>;

  declare export function symmetricDifference<T>(x: Array<T>, ...rest: Array<void>): (y: Array<T>) => Array<T>;
  declare export function symmetricDifference<T>(x: Array<T>, y: Array<T>): Array<T>;

  declare export function symmetricDifferenceWith<T>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): ((x: Array<T>, ...rest: Array<void>) => (y: Array<T>) => Array<T>) & ((x: Array<T>, y: Array<T>) => Array<T>);
  declare export function symmetricDifferenceWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, ...rest: Array<void>): (y: Array<T>) => Array<T>;
  declare export function symmetricDifferenceWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, y: Array<T>): Array<T>;

  declare export function union<T>(x: Array<T>, ...rest: Array<void>): (y: Array<T>) => Array<T>;
  declare export function union<T>(x: Array<T>, y: Array<T>): Array<T>;

  declare export function unionWith<T>(fn: BinaryPredicateFn<T>, ...rest: Array<void>): ((x: Array<T>, ...rest: Array<void>) => (y: Array<T>) => Array<T>) & (x: Array<T>, y: Array<T>) => Array<T>;
  declare export function unionWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, ...rest: Array<void>): (y: Array<T>) => Array<T>;
  declare export function unionWith<T>(fn: BinaryPredicateFn<T>, x: Array<T>, y: Array<T>): Array<T>;

  // *Object
  declare export function assoc<T,S,Id: number | string>(key: Id):
    ((val: T) => (src: {[k:Id]:S}) => {[k:Id]:S|T}) & ((val: T, src: {[k:Id]:S}) => {[k:Id]:S|T})
  declare export function assoc<T,S,Id: number | string>(key: Id, val:T): (src: {[k:Id]:S}) => {[k:Id]:S|T}
  declare export function assoc<T,S,Id: number | string>(key: Id, val: T, src: {[k:Id]:S}): {[k:Id]:S|T}

  declare export function assocPath<T,S>(key: Array<string>, ...args: Array<void>):
    ((val: T, ...rest: Array<void>) => (src: {[k:string]:S}) => {[k:string]:S|T})
    & ((val: T) => (src: {[k:string]:S}) => {[k:string]:S|T});
  declare export function assocPath<T,S>(key: Array<string>, val:T, ...args: Array<void>): (src: {[k:string]:S}) => {[k:string]:S|T};
  declare export function assocPath<T,S>(key: Array<string>, val:T, src: {[k:string]:S}): {[k:string]:S|T};

  declare export function clone<T>(src: T): $Shape<T>;

  declare export function dissoc<T,Id: number | string>(key: Id):
    (src: {[k:Id]:T}) => {[k:Id]:T}
  declare export function dissoc<T,Id: number | string>(key: Id, src: {[k:Id]:T}): {[k:Id]:T}

  declare export function dissocPath<T>(key: Array<string>, ...args: Array<void>):
    ((val: T, ...rest: Array<void>) => (src: {[k:string]:T}) => {[k:string]:T})
    & ((val: T) => (src: {[k:string]:T}) => {[k:string]:T});
  declare export function dissocPath<T>(key: Array<string>, val:T, ...args: Array<void>): (src: {[k:string]:T}) => {[k:string]:T};
  declare export function dissocPath<T>(key: Array<string>, val:T, src: {[k:string]:T}): {[k:string]:T};

  declare export function evolve<V,R>(fn: NestedObject<(x:any) => R>, ...rest: Array<void>): (src: NestedObject<any>) => NestedObject<R>;
  declare export function evolve<V,R>(fn: NestedObject<(x:any) => R>, src: NestedObject<any>): NestedObject<R>;

  declare export function eqProps(key: string, ...args: Array<void>):
  ((o1: Object, ...rest: Array<void>) => (o2: Object) => boolean)
  & ((o1: Object, o2: Object) => boolean);
  declare export function eqProps(key: string, o1: Object, ...args: Array<void>): (o2: Object) => boolean;
  declare export function eqProps(key: string, o1: Object, o2: Object): boolean;

  declare export function has(key: string, o: Object): boolean;
  declare export function has(key: string):(o: Object) => boolean;

  declare export function hasIn(key: string, o: Object): boolean;
  declare export function hasIn(key: string): (o: Object) => boolean;

  declare export function invert(o: Object): {[k: string]: Array<string>};
  declare export function invertObj(o: Object): {[k: string]: string};

  declare export function keys(o: Object): Array<string>;

  /* TODO
  lens
  lensIndex
  lensPath
  lensProp
  */

  declare export class Lens<S, T> {  }

  declare export function lens<S, T>(
    getter: (state: S) => T,
    n: void
  ): (setter: (updated: T) => (state: S) => S) => Lens<S, T>
  declare export function lens<S, T>(
    getter: (state: S) => T,
    setter: (updated: T) => (state: S) => S
  ): Lens<S, T>

  declare export function view<S, T>(
    lens: Lens<S, T>,
    n: void
  ): (obj: S) => T
  declare export function view<S, T>(lens: Lens<S, T>, obj: S): T

  declare export function lensPath(path: string[]): Lens<Object, mixed>

  declare export function over<S, T>(
    lens: Lens<S, T>,
    n: void,
    n1: void
  ): (
    | ((value: (x: T) => T, nn: void) => (obj: S) => S)
    | ((value: (x: T) => T, obj: S) => S)
  )
  declare export function over<S, T>(
    lens: Lens<S, T>,
    fn: (x: T) => T,
    n: void
  ): (obj: S, nn: void) => S
  declare export function over<S, T>(lens: Lens<S, T>, fn: (x: T) => T, obj: S): S


  declare export function set<S, T>(
    lens: Lens<S, T>,
    n: void,
    n1: void
  ): (
    | ((value: T, nn: void) => (obj: S) => S)
    | ((value: T, obj: S) => S)
  )
  declare export function set<S, T>(
    lens: Lens<S, T>,
    value: T,
    n: void
  ): (obj: S, nn: void) => S
  declare export function set<S, T>(lens: Lens<S, T>, value: T, obj: S): S

  declare export function mapObjIndexed<O: Object, R>(fn: (val: $Values<O>, key: $Keys<O>, o: O) => R): (o: O) => $ObjMap<O, (key: $Values<O>) => R>
  declare export function mapObjIndexed<O: Object, R>(fn: (val: $Values<O>, key: $Keys<O>, o: O) => R, o: O): $ObjMap<O, (key: $Values<O>) => R>

  declare export function merge<A,B>(o1: A): (o2: B) => A & B;
  declare export function merge<A,B>(o1: A, o2: B): A & B;

  declare export function mergeAll<T>(os: Array<{[k:string]:T}>): {[k:string]:T};

  declare export function mergeWith<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (v1: T, v2: S) => R):
  ((o1: A, ...rest: Array<void>) => (o2: B) => A & B) & ((o1: A, o2: B) => A & B);
  declare export function mergeWith<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (v1: T, v2: S) => R, o1: A, o2: B): A & B;
  declare export function mergeWith<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (v1: T, v2: S) => R, o1: A, ...rest: Array<void>): (o2: B) => A & B;

  declare export function mergeWithKey<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (key: $Keys<A&B>, v1: T, v2: S) => R):
  ((o1: A, ...rest: Array<void>) => (o2: B) => A & B) & ((o1: A, o2: B) => A & B);
  declare export function mergeWithKey<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (key: $Keys<A&B>, v1: T, v2: S) => R, o1: A, o2: B): A & B;
  declare export function mergeWithKey<T,S,R,A:{[k:string]:T},B:{[k:string]:S}>(fn: (key: $Keys<A&B>, v1: T, v2: S) => R, o1: A, ...rest: Array<void>): (o2: B) => A & B;

  declare export function objOf<T>(key: string, ...rest: Array<void>): (val: T) => {[key: string]: T};
  declare export function objOf<T>(key: string, val: T): {[key: string]: T};

  declare export function omit<T:Object>(keys: Array<$Keys<T>>, ...rest: Array<void>): (val: T) => Object;
  declare export function omit<T:Object>(keys: Array<$Keys<T>>, val: T): Object;

  // TODO over

  declare export function path<V,A:?NestedObject<V>>(p: Array<string>, ...rest: Array<void>): (o: A) => ?V;
  declare export function path<V,A:?NestedObject<V>>(p: Array<string>, o: A): ?V;

  declare export function pathOr<T,V,A:NestedObject<V>>(or: T, ...rest: Array<void>):
  ((p: Array<string>, ...rest: Array<void>) => (o: ?A) => V|T)
  & ((p: Array<string>, o: ?A) => V|T);
  declare export function pathOr<T,V,A:NestedObject<V>>(or: T, p: Array<string>, ...rest: Array<void>): (o: ?A) => V|T;
  declare export function pathOr<T,V,A:NestedObject<V>>(or: T, p: Array<string>, o: ?A): V|T;

  declare export function pick<A>(keys: Array<string>, ...rest: Array<void>): (val: {[key:string]: A}) => {[key:string]: A};
  declare export function pick<A>(keys: Array<string>, val: {[key:string]: A}): {[key:string]: A};

  declare export function pickAll<A>(keys: Array<string>, ...rest: Array<void>): (val: {[key:string]: A}) => {[key:string]: ?A};
  declare export function pickAll<A>(keys: Array<string>, val: {[key:string]: A}): {[key:string]: ?A};

  declare export function pickBy<A>(fn: BinaryPredicateFn2<A,string>, ...rest: Array<void>): (val: {[key:string]: A}) => {[key:string]: A};
  declare export function pickBy<A>(fn: BinaryPredicateFn2<A,string>, val: {[key:string]: A}): {[key:string]: A};

  declare export function project<T>(keys: Array<string>, ...rest: Array<void>): (val: Array<{[key:string]: T}>) => Array<{[key:string]: T}>;
  declare export function project<T>(keys: Array<string>, val: Array<{[key:string]: T}>): Array<{[key:string]: T}>;

  declare export function prop<T,O:{[k:string]:T}>(key: $Keys<O>, ...rest: Array<void>): (o: O) => ?T;
  declare export function prop<T,O:{[k:string]:T}>(key: $Keys<O>, o: O): ?T;

  declare export function propOr<T,V,A:{[k:string]:V}>(or: T, ...rest: Array<void>):
  ((p: $Keys<A>, ...rest: Array<void>) => (o: A) => V|T)
  & ((p: $Keys<A>, o: A) => V|T);
  declare export function propOr<T,V,A:{[k:string]:V}>(or: T, p: $Keys<A>, ...rest: Array<void>): (o: A) => V|T;
  declare export function propOr<T,V,A:{[k:string]:V}>(or: T, p: $Keys<A>, o: A): V|T;

  declare export function keysIn(o: Object): Array<string>;

  declare export function props<T,O:{[k:string]:T}>(keys: Array<$Keys<O>>, ...rest: Array<void>): (o: O) => Array<?T>;
  declare export function props<T,O:{[k:string]:T}>(keys: Array<$Keys<O>>, o: O): Array<?T>;

  declare export function toPairs<T,O:{[k:string]:T}>(o: O): Array<[$Keys<O>, T]>;

  declare export function toPairsIn<T,O:{[k:string]:T}>(o: O): Array<[string, T]>;


  declare export function values<T,O:{[k:string]:T}>(o: O): Array<T>;

  declare export function valuesIn<T,O:{[k:string]:T}>(o: O): Array<T|any>;

  declare export function where<T>(predObj: {[key: string]: UnaryPredicateFn<T>}, ...rest: Array<void>): (o: {[k:string]:T}) => boolean;
  declare export function where<T>(predObj: {[key: string]: UnaryPredicateFn<T>}, o: {[k:string]:T}): boolean;

  declare export function whereEq<T,S,O:{[k:string]:T},Q:{[k:string]:S}>(predObj: O, ...rest: Array<void>): (o: $Shape<O&Q>) => boolean;
  declare export function whereEq<T,S,O:{[k:string]:T},Q:{[k:string]:S}>(predObj: O, o: $Shape<O&Q>): boolean;

  // *Function
  declare var __: *;

  declare export function addIndex<A,B>(iterFn:(fn:(x:A) => B, xs: Array<A>) => Array<B>): (fn: (x: A, idx: number, xs: Array<A>) => B, xs: Array<A>) => Array<B>;

  declare export function always<T>(x:T): (x: any) => T;

  declare export function ap<T,V>(fns: Array<(x:T) => V>, ...rest: Array<void>): (xs: Array<T>) => Array<V>;
  declare export function ap<T,V>(fns: Array<(x:T) => V>, xs: Array<T>): Array<V>;

  declare export function apply<T,V>(fn: (...args: Array<T>) => V, ...rest: Array<void>): (xs: Array<T>) => V;
  declare export function apply<T,V>(fn: (...args: Array<T>) => V, xs: Array<T>): V;

  declare export function applySpec<S,V,T:NestedObject<(...args: Array<V>) => S>>(spec: T): (...args: Array<V>) => NestedObject<S>;

  declare export function binary<T>(fn:(...args: Array<any>) => T): (x: any, y: any) => T;

  declare export function bind<T>(fn: (...args: Array<any>) => any, thisObj: T): (...args: Array<any>) => any;

  declare export function call<T,V>(fn: (...args: Array<V>) => T, ...args: Array<V>): T;

  declare export function comparator<T>(fn: BinaryPredicateFn<T>): (x:T, y:T) => number;

  // TODO add tests
  declare export function construct<T>(ctor: Class<GenericContructor<T>>): (x: T) => GenericContructor<T>;

  // TODO add tests
  declare export function constructN<T>(n: number, ctor: Class<GenericContructorMulti<any>>): (...args: any) => GenericContructorMulti<any>;

  // TODO make less generic
  declare export function converge(after: Function, fns: Array<Function>): Function;

  declare export function empty<T>(x: T): T;

  declare export function o<F, G, X>(
    f: (val: G) => F,
  ): (
    g: (val: X) => G,
  ) => (x: X) => F
  declare export function o<F, G, X>(
    f: (val: G) => F,
  ): (
    g: (val: X) => G,
    x: X
  ) => F
  declare export function o<F, G, X>(
    f: (val: G) => F,
    g: (val: X) => G,
  ): (
    x: X
  ) => F
  declare export function o<F, G, X>(
    f: (val: G) => F,
    g: (val: X) => G,
    x: X
  ): F


  declare export function chain<I,V: { chain: Function } | Array<I>, O, VV: V | Array<O>>(
    fn: (a:I) => VV,
    x: V
  ): VV;

  declare export function chain<T,V: { chain: Function } | Array<T>, O, VV: V | Array<O>>(
    fn: (a:T) => VV
  ): (x: V) => VV;

  declare export function flip<A,B,TResult>(fn: (arg0: A, arg1: B) => TResult): CurriedFunction2<B,A,TResult>;
  declare export function flip<A,B,C,TResult>(fn: (arg0: A, arg1: B, arg2: C) => TResult): (( arg0: B, arg1: A, ...rest: Array<void>) => (arg2: C) => TResult) & (( arg0: B, arg1: A, arg2: C) => TResult);
  declare export function flip<A,B,C,D,TResult>(fn: (arg0: A, arg1: B, arg2: C, arg3: D) => TResult): ((arg1: B, arg0: A, ...rest: Array<void>) => (arg2: C, arg3: D) => TResult) & ((arg1: B, arg0: A, arg2: C, arg3: D) => TResult);
  declare export function flip<A,B,C,D,E,TResult>(fn: (arg0: A, arg1: B, arg2: C, arg3: D, arg4:E) => TResult): ((arg1: B, arg0: A, ...rest: Array<void>) => (arg2: C, arg3: D, arg4: E) => TResult) & ((arg1: B, arg0: A, arg2: C, arg3: D, arg4: E) => TResult);

  declare export function identity<T>(x:T): T;

  declare export function invoker<A,B,C,D,O:{[k:string]: Function}>(arity: number, name: $Enum<O>): CurriedFunction2<A,O,D> & CurriedFunction3<A,B,O,D> & CurriedFunction4<A,B,C,O,D>

  declare export function juxt<T,S>(fns: Array<(...args: Array<S>) => T>): (...args: Array<S>) => Array<T>;

  declare export function lift<F: Function>(fn: F): F

  // TODO liftN

  declare export function memoize<A,B,T:(...args: Array<A>) => B>(fn:T):T;

  declare export function nAry<T>(arity: number, fn:(...args: Array<any>) => T): (...args: Array<any>) => T;

  declare export function nthArg<T>(n: number): (...args: Array<T>) => T;

  declare export function of<T>(x: T): Array<T>;

  declare export function once<A,B,T:(...args: Array<A>) => B>(fn:T):T;

  // TODO partial
  // TODO partialRight
  // TODO pipeK
  // TODO pipeP

  declare export function tap<T, +S>(fn: (x: T) => S): (x: T) => T;
  declare export function tap<T, +S>(fn: (x: T) => S, x: T): T;

  // TODO tryCatch

  declare export function unapply<T,V>(fn: (xs: Array<T>) => V): (...args: Array<T>) => V;

  declare export function unary<T>(fn:(...args: Array<any>) => T): (x: any) => T;

  // TODO uncurryN

  //TODO useWith

  declare export function wrap<A,B,C,D,F:(...args: Array<A>) => B>(fn: F, fn2: (fn: F, ...args: Array<C>) => D): (...args: Array<A|C>) => D;

  // *Logic

  declare export function allPass<T>(fns: Array<(...args: Array<T>) => boolean>): (...args: Array<T>) => boolean;

  declare export function and(x: boolean, ...rest: Array<void>): (y: boolean) => boolean;
  declare export function and(x: boolean, y: boolean): boolean;

  declare export function anyPass<T>(fns: Array<(...args: Array<T>) => boolean>): (...args: Array<T>) => boolean;

  declare export function both<T>(x: (...args: Array<T>) => boolean, ...rest: Array<void>): (y: (...args: Array<T>) => boolean) => (...args: Array<T>) => boolean;
  declare export function both<T>(x: (...args: Array<T>) => boolean, y: (...args: Array<T>) => boolean): (...args: Array<T>) => boolean;

  declare export function complement<T>(x: (...args: Array<T>) => boolean): (...args: Array<T>) => boolean;

  declare export function cond<A,B>(fns: Array<[(...args: Array<A>) => boolean, (...args: Array<A>) => B]>): (...args: Array<A>) => B;


  declare export function defaultTo<T,V>(d: T, ...rest: Array<void>): (x: ?V) => V|T;
  declare export function defaultTo<T,V>(d: T, x: ?V): V|T;

  declare export function either(x: (...args: Array<any>) => boolean, ...rest: Array<void>): (y: (...args: Array<any>) => boolean) => (...args: Array<any>) => boolean;
  declare export function either(x: (...args: Array<any>) => boolean, y: (...args: Array<any>) => boolean): (...args: Array<any>) => boolean;

  declare export function ifElse<A,B,C>(cond:(...args: Array<A>) => boolean, ...rest: Array<void>):
  ((f1: (...args: Array<A>) => B, ...rest: Array<void>) => (f2: (...args: Array<A>) => C) => (...args: Array<A>) => B|C)
  & ((f1: (...args: Array<A>) => B, f2: (...args: Array<A>) => C) => (...args: Array<A>) => B|C)
  declare export function ifElse<A,B,C>(
    cond:(...args: Array<any>) => boolean,
    f1: (...args: Array<any>) => B,
    f2: (...args: Array<any>) => C
  ): (...args: Array<A>) => B|C;

  declare export function isEmpty(x:?Array<any>|Object|string): boolean;

  declare export function not(x:boolean): boolean;

  declare export function or(x: boolean, y: boolean): boolean;
  declare export function or(x: boolean): (y: boolean) => boolean;

  declare export function pathSatisfies<T>(cond: (x: T) => boolean, path: Array<string>, o: NestedObject<T>): boolean;
  declare export function pathSatisfies<T>(cond: (x: T) => boolean, path: Array<string>, ...rest: Array<void>): (o: NestedObject<T>) => boolean;
  declare export function pathSatisfies<T>(cond: (x: T) => boolean, ...rest: Array<void>):
  ((path: Array<string>, ...rest: Array<void>) => (o: NestedObject<T>) => boolean)
  & ((path: Array<string>, o: NestedObject<T>) => boolean)

  declare export function propSatisfies<T>(cond: (x: T) => boolean, prop: string, o: NestedObject<T>): boolean;
  declare export function propSatisfies<T>(cond: (x: T) => boolean, prop: string, ...rest: Array<void>): (o: NestedObject<T>) => boolean;
  declare export function propSatisfies<T>(cond: (x: T) => boolean, ...rest: Array<void>):
  ((prop: string, ...rest: Array<void>) => (o: NestedObject<T>) => boolean)
  & ((prop: string, o: NestedObject<T>) => boolean)

  declare export function unless<T,V,S>(pred: UnaryPredicateFn<T>, ...rest: Array<void>):
  ((fn: (x: S) => V, ...rest: Array<void>) => (x: T|S) => T|V)
  & ((fn: (x: S) => V, x: T|S) => T|V);
  declare export function unless<T,V,S>(pred: UnaryPredicateFn<T>, fn: (x: S) => V, ...rest: Array<void>): (x: T|S) => V|T;
  declare export function unless<T,V,S>(pred: UnaryPredicateFn<T>, fn: (x: S) => V, x: T|S): T|V;

  declare export function until<T>(pred: UnaryPredicateFn<T>, ...rest: Array<void>):
  ((fn: (x: T) => T, ...rest: Array<void>) => (x: T) => T)
  & ((fn: (x: T) => T, x: T) => T);
  declare export function until<T>(pred: UnaryPredicateFn<T>, fn: (x: T) => T, ...rest: Array<void>): (x: T) => T;
  declare export function until<T>(pred: UnaryPredicateFn<T>, fn: (x: T) => T, x: T): T;

  declare export function when<T,V,S>(pred: UnaryPredicateFn<T>, ...rest: Array<void>):
  ((fn: (x: S) => V, ...rest: Array<void>) => (x: T|S) => T|V)
  & ((fn: (x: S) => V, x: T|S) => T|V);
  declare export function when<T,V,S>(pred: UnaryPredicateFn<T>, fn: (x: S) => V, ...rest: Array<void>): (x: T|S) => V|T;
  declare export function when<T,V,S>(pred: UnaryPredicateFn<T>, fn: (x: S) => V, x: T|S): T|V;
}
//
// declare module 'ramda/src/both' {
//
//   declare function both<T>(
//     x: (e: T) => boolean,
//     no: void
//   ): (y: (e: T) => boolean) =>
//     (e: T) => boolean;
//
//   declare function both<T, S>(
//     x: (e: T) => boolean,
//     y: (e: S) => boolean
//   ): (e: (T & S)|T) => boolean;
//   declare export default typeof both;
// }
//
// declare module 'ramda/src/chain' {
//
//   //NOTE: class Monad<T> { chain: Function }
//
//   declare function chain<T,V: { chain: Function }>(
//     fn: (a:T) => V,
//     x: V
//   ): V;
//
//   declare function chain<T,V: { chain: Function }>(
//     fn: (a:T) => V,
//     no: void
//   ): (x: V) => V;
//
//   declare function chain<T>(
//     fn: (a:T) => Array<T>,
//     x: Array<T>
//   ): Array<T>;
//
//   declare function chain<T>(
//     fn: (a:T) => Array<T>,
//     no: void
//   ): (x: Array<T>) => Array<T>;
//
//   declare export default typeof chain;
// }
//
// declare module 'ramda/src/contains' {
//   declare function contains(x: string, xs: string|Array<string>): boolean
//   declare function contains(x: string, no: void): (xs: string|Array<string>) => boolean
//   declare function contains<E>(x: E, xs: Array<E>): boolean
//   declare function contains<E>(x: E, no: void): (xs: Array<E>) => boolean
//
//   declare export default typeof contains;
// }
//
// declare module 'ramda/src/find' {
//   declare export function find<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, ...rest: Array<void>): (xs:T|O) => ?V|O;
//   declare export function find<V,O:{[key:string]:*},T:Array<V>|O>(fn: UnaryPredicateFn<V>, xs:T|O): ?V|O;
//   declare export default typeof find;
//
// }
//
// declare module 'ramda/src/flatten' {
//   declare function flatten<E, T: Array<Array<E> | E> | Array<E> | E>(xs:
//   Array<
//     Array<
//       Array<
//         Array<T>
//         | T
//       >
//       | Array<T>
//       | T
//     >
//     | Array<
//       Array<T>
//       | T
//     >
//     | Array<T>
//     | T
//   >): Array<E>;
//   declare export default typeof flatten;
// }
//
// declare module 'ramda/src/has' {
//   declare type Has =
//     <T: { [key: string | number]: any }>(propName: string | number) => (obj: T) => boolean |
//     <T: { [key: string | number]: any }>(propName: string | number, obj: T) => boolean;
//   declare export function has(key: string | number, o: Object): boolean;
//   declare export function has(key: string | number):(o: Object) => boolean;
//   declare export default typeof has;
// }
//
// declare module 'ramda/src/is' {
//   declare function is<T>(t: T): (v: any) => boolean;
//   declare function is<T>(t: T, v: any): boolean;
//   declare export default typeof is;
// }
//
// declare module 'ramda/src/isEmpty' {
//   declare export function isEmpty(x:?Array<any>|Object|string): boolean;
//   declare export default typeof isEmpty;
// }
//
// declare module 'ramda/src/join' {
//   declare function join(x: string, xs: Array<any>): string
//   declare function join(x: string, no: void): (xs: Array<any>) => string
//   declare export default typeof join;
// }
//
// declare module 'ramda/src/map' {
//
//   declare function map<T,R>(
//     fn: (a: T) => R,
//     xs: Array<T>
//   ): Array<R>
//
//   declare function map<T,R,S: { map: Function }>(
//     fn: (a: T) => R,
//     xs: S
//   ): S
//
//   declare function map<T,R>(
//     fn: (a: T) => R,
//     no: void
//   ): (a: Array<T>) => Array<R>
//
//   declare function map<T,R>(
//     fn: (a: T) => R,
//     no: void
//   ): (a: { [key: string]: T }) =>
//     { [key: string]: R }
//
//   declare function map<T,R,S: { map: Function }>(
//     fn: (a: T) => R,
//     no: void
//   ): (a: T) => T
//
//   declare function map<T,R>(
//     fn: (a: T) => R,
//     xs: { [key: string]: T }
//   ): { [key: string]: R }
//
//   declare export default typeof map
// }
//
// declare module 'ramda/src/mapObjIndexed' {
//   declare function mapObjIndexed<A,B>(fn: (val: A, key: string, o: Object) => B, o: {[key: string]: A}): {[key: string]: B};
//   declare function mapObjIndexed<A,B>(fn: (val: A, key: string, o: Object) => B): (o: {[key: string]: A}) => {[key: string]: B};
//   declare export default typeof mapObjIndexed;
// }
//
// declare module 'ramda/src/pathEq' {
//   declare type PathEq =
//     // <T: DataType>(pathList: KeyType[]) => (eq: *) => (obj: T) => boolean |
//     <T: { [key: string | number]: any }>(pathList: Array<string | number>, eq: *) => (obj: T) => boolean
//     // | <T: DataType>(pathList: KeyType[], eq: *, obj: T) => boolean
//
//   declare export default PathEq;
// }
//
// declare module 'ramda/src/pipe' {
//   declare function pipe<A,B,C,D,E,F,G,H>(
//     ab: (a: A) => B,
//     bc: (b: B) => C,
//     cd: (c: C) => D,
//     de: (d: D) => E,
//     ef: (e: E) => F,
//     fg: (f: F) => G,
//     gh: (g: G) => H
//   ): (a: A) => H
//   declare function pipe<A,B,C,D,E,F,G>(
//     ab: (a: A) => B,
//     bc: (b: B) => C,
//     cd: (c: C) => D,
//     de: (d: D) => E,
//     ef: (e: E) => F,
//     fg: (f: F) => G
//   ): (a: A) => G
//   declare function pipe<A,B,C,D,E,F>(
//     ab: (a: A) => B,
//     bc: (b: B) => C,
//     cd: (c: C) => D,
//     de: (d: D) => E,
//     ef: (e: E) => F
//   ): (a: A) => F
//   declare function pipe<A,B,C,D,E>(
//     ab: (a: A) => B,
//     bc: (b: B) => C,
//     cd: (c: C) => D,
//     de: (d: D) => E
//   ): (a: A) => E
//   declare function pipe<A,B,C,D>(
//     ab: (a: A) => B,
//     bc: (b: B) => C,
//     cd: (c: C) => D
//   ): (a: A) => D
//   declare function pipe<A,B,C>(
//     ab: (a: A) => B,
//     bc: (b: B) => C
//   ): (a: A) => C
//   declare function pipe<A,B>(
//     ab: (a: A) => B
//   ): (a: A) => B
//   declare export default typeof pipe;
// }
//
// declare module 'ramda/src/prop' {
//   declare type PropType =
//     <Key: string | number, Value, T: { [key: Key]: Value }>(propName: Key) => (obj: T) => Value |
//     <Key: string | number, Value, T: { [key: Key]: Value }>(propName: Key, obj: T) => Value
//
//   declare export default PropType;
// }
//
// declare module 'ramda/src/propEq' {
//   declare type PropEq = <T: { [key: string | number]: any }>(propName: string | number, eq: *, obj: T) => boolean |
//     <T: { [key: string | number]: any }>(propName: string | number) => (eq: *) => (obj: T) => boolean
//
//   declare export function propEq(prop: string, ...rest: Array<void>): ((val: *, o: {[k:string]: *}) => boolean) & ((val: *, ...rest: Array<void>) => (o: {[k:string]: *}) => boolean)
//   declare export function propEq(prop: string, val: *, ...rest: Array<void>): (o: {[k:string]: *}) => boolean;
//   declare export function propEq(prop: string, val: *, o: {[k:string]:*}): boolean;
//
//   declare export default typeof propEq;
// }
//
// declare module 'ramda/src/reject' {
//   declare function reject<V>(fn: (pred: V) => boolean, xs: Array<V>): Array<V>
//   declare function reject<V>(fn: (pred: V) => boolean, xs: {[key: string]:V}): {[key: string]:V}
//   declare function reject<V>(fn: (pred: V) => boolean, no: void): (xs: Array<V>) => Array<V>
//   declare function reject<V>(fn: (pred: V) => boolean, no: void): (xs: {[key: string]:V}) => {[key: string]:V}
//
//   declare export default typeof reject;
// }
//
// declare module 'ramda/src/replace' {
//   declare function replace(t1: RegExp|string, t2: string, t3: string): string
//   declare function replace(t1: RegExp|string, t2: string): (t3: string) => string
//
//   declare export default typeof replace;
// }
//
// declare module 'ramda/src/split' {
//   declare function split(pattern: RegExp|string, source: string): Array<string>
//   declare function split(pattern: RegExp|string, no: void): (source: string) => Array<string>
//   declare export default typeof split
// }
//
// declare module 'ramda/src/take' {
//   declare function taken<T: Array<*>>(arr: T): T
//   declare function taken(str: string): string
//
//   declare function take<T: Array<*>>(n: number, arr: T): T;
//   declare function take(n: number, str: string): string;
//   declare function take(n: number): typeof taken;
//   declare export default typeof take;
// }
//
// declare module 'ramda/src/toLower' {
//   declare function toLower(a: string): string;
//   declare export default typeof toLower;
// }
//
// declare module 'ramda/src/toUpper' {
//   declare function toUpper(a: string): string;
//   declare export default typeof toUpper;
// }
//
// declare module 'ramda/src/trim' {
//   declare export function trim(str: string): string;
//   declare export default typeof trim;
// }
//
// declare module 'ramda/src/unapply' {
//   declare export type Unapply = <T,V>(fn: (xs: T[]) => V) => (...args: T[]) => V;
//
//   declare var unapply: Unapply<*, *>;
//
//   declare export default Unapply;
// }
//
// declare module 'ramda/src/unnest' {
//   // declare type NestedArray = $PropertyType<$Exports<'ramda'>, 'NestedArray'>;
//   // declare function unnest<T>(xs: NestedArray<T>): NestedArray<T>;
//   declare type Unnest = <T>(xs: Array<T | T[]>) => T[];
//   declare export default Unnest;
// }
//
// declare module 'ramda/src/when' {
//   declare function when<T,V,S>(
//     pred: (a: T) => boolean,
//     no1: void,
//     no2: void
//   ): (fn: (a: S) => V, no: void) =>
//     (x: T|S) => T|V
//
//   declare function when<T,V,S>(
//     pred: (a: T) => boolean,
//     no1: void,
//     no2: void
//   ): (fn: (a: S) => V, x: T|S) => T|V
//
//   declare function when<T,V,S>(
//     pred: (a: T) => boolean,
//     fn: (a: S) => V,
//     no: void
//   ): (x: T|S) => V|T;
//   declare function when<T,V,S>(
//     pred: (a: T) => boolean,
//     fn: (a: S) => V,
//     x: T|S
//   ): T|V;
//
//   declare export default typeof when;
// }
