
declare module 'funfix' {
  declare export class Either<+L, +R> {
    get(): R;
    getOrElse<RR>(fallback: RR): R | RR;
    getOrElseL<RR>(thunk: () => RR): R | RR;

    isLeft(): boolean;
    left(): Either<L, void>;
    isRight(): boolean;
    right(): Either<void, R>;
    contains(elem: R): boolean;
    exists(p: (r: R) => boolean): boolean;
    filterOrElse<LL>(p: (r: R) => boolean, zero: () => LL): Either<L | LL, R>;
    flatMap<S>(f: (r: R) => Either<L, S>): Either<L, S>;
    fold<S>(left: (l: L) => S, right: (r: R) => S): S;
    forAll(p: (r: R) => boolean): boolean;
    map<C>(f: (r: R) => C): Either<L, C>;
    forEach(cb: (r: R) => void): void;
    swap(): Either<R, L>;
    toOption(): Option<R>;
    equals(other: Either<L, R>): boolean;
    hashCode(): number;

    +_funKindF: Either<L, any>;
    +_funKindA: R;

    // Implements Constructor<T>
    static +_funErasure: Either<any, any>;

    static left<L, R>(value: L): Either<L, R>;
    static right<L, R>(value: R): Either<L, R>;

    static map2<A1,A2,L,R>(fa1: Either<L,A1>, fa2: Either<L,A2>,
                          f: (A1, A2) => R): Either<L, R>;
    static map3<A1,A2,A3,L,R>(fa1: Either<L,A1>, fa2: Either<L,A2>, fa3: Either<L,A3>,
                              f: (A1, A2, A3) => R): Either<L, R>;
    static map4<A1,A2,A3,A4,L,R>(
      fa1: Either<L,A1>, fa2: Either<L,A2>, fa3: Either<L,A3>, fa4: Either<L,A4>,
      f: (A1, A2, A3, A4) => R): Either<L, R>;
    static map5<A1,A2,A3,A4,A5,L,R>(
      fa1: Either<L,A1>, fa2: Either<L,A2>, fa3: Either<L,A3>, fa4: Either<L,A4>, fa5: Either<L,A5>,
      f: (A1, A2, A3, A4, A5) => R): Either<L, R>;
    static map6<A1,A2,A3,A4,A5,A6,L,R>(
      fa1: Either<L,A1>, fa2: Either<L,A2>, fa3: Either<L,A3>, fa4: Either<L,A4>, fa5: Either<L,A5>, fa6: Either<L,A6>,
      f: (A1, A2, A3, A4, A5, A6) => R): Either<L, R>;

    static tailRecM<L, A, B>(a: A, f: (a: A) => Either<L, Either<A, B>>): Either<L, B>;
  }

  declare export function Left<L>(value: L): Either<L, void>;
  declare export function Right<R>(value: R): Either<void, R>;

  declare export class Option<+A> {
    get(): A;
    getOrElse<AA>(fallback: AA): A | AA;
    getOrElseL<AA>(thunk: () => AA): A | AA;
    orElse<AA>(fallback: Option<AA>): Option<A | AA>;
    orElseL<AA>(thunk: () => Option<AA>): Option<A | AA>;
    orNull(): A | null;

    chain<B>(f: (a: A) => Option<B>): Option<B>;
    contains(elem: A): boolean;
    equals(that: Option<A>): boolean;
    exists(p: (a: A) => boolean): boolean;
    filter(p: (a: A) => boolean): Option<A>;
    flatMap<B>(f: (a: A) => Option<B>): Option<B>;
    fold<B>(fallback: () => B, f: (a: A) => B): B;
    forAll(p: (a: A) => boolean): boolean;
    forEach(cb: (a: A) => void): void;
    hashCode(): number;
    isEmpty(): boolean;
    map<B>(f: (a: A) => B): Option<B>;
    mapN<B>(f: (a: A) => B): Option<B>;
    nonEmpty(): boolean;

    // Implements HK<F, A>
    +_funKindF: Option<any>;
    +_funKindA: A;

    // Implements Constructor<T>
    static +_funErasure: Option<any>;

    static empty<A>(): Option<A>;
    static none(): Option<void>;
    static of<A>(value: ?A): Option<A>;
    static pure<A>(value: A): Option<A>;
    static some<A>(value: A): Option<A>;

    static map2<A1,A2,R>(fa1: Option<A1>, fa2: Option<A2>,
                        f: (A1, A2) => R): Option<R>;
    static map3<A1,A2,A3,R>(fa1: Option<A1>, fa2: Option<A2>, fa3: Option<A3>,
                            f: (A1, A2, A3) => R): Option<R>;
    static map4<A1,A2,A3,A4,R>(fa1: Option<A1>, fa2: Option<A2>, fa3: Option<A3>, fa4: Option<A4>,
                              f: (A1, A2, A3, A4) => R): Option<R>;
    static map5<A1,A2,A3,A4,A5,R>(
      fa1: Option<A1>, fa2: Option<A2>, fa3: Option<A3>, fa4: Option<A4>, fa5: Option<A5>,
      f: (A1, A2, A3, A4, A5) => R): Option<R>;
    static map6<A1,A2,A3,A4,A5,A6,R>(
      fa1: Option<A1>, fa2: Option<A2>, fa3: Option<A3>, fa4: Option<A4>, fa5: Option<A5>, fa6: Option<A6>,
      f: (A1, A2, A3, A4, A5, A6) => R): Option<R>;

    static tailRecM<A, B>(a: A, f: (a: A) => Option<Either<A, B>>): Option<B>;
  }

  declare export function Some<A>(value: A): Option<A>;
  declare export var None: Option<void>;

  declare export class Try<+A> {
    get(): A;
    getOrElse<AA>(fallback: AA): A | AA;
    getOrElseL<AA>(thunk: () => AA): A | AA;
    orElse<AA>(fallback: Try<AA>): Try<A | AA>;
    orElseL<AA>(thunk: () => Try<AA>): Try<A | AA>;
    orNull(): A | null;

    isSuccess(): boolean;
    isFailure(): boolean;
    failed(): Try<any>;
    fold<R>(failure: (error: any) => R, success: (a: A) => R): R;
    filter(p: (a: A) => boolean): Try<A>;
    flatMap<B>(f: (a: A) => Try<B>): Try<B>;
    chain<B>(f: (a: A) => Try<B>): Try<B>;
    map<B>(f: (a: A) => B): Try<B>;
    forEach(cb: (a: A) => void): void;
    recover<AA>(f: (error: any) => AA): Try<A | AA>;
    recoverWith<AA>(f: (error: any) => Try<AA>): Try<A | AA>;
    toOption(): Option<A>;
    toEither(): Either<any, A>;
    equals(that: Try<A>): boolean;
    hashCode(): number;

    // Implements HK<F, A>
    +_funKindF: Try<any>;
    +_funKindA: A;

    // Implements Constructor<T>
    static +_funErasure: Try<any>;

    static of<A>(thunk: () => A): Try<A>;
    static pure<A>(value: A): Try<A>;
    static unit(): Try<void>;
    static success<A>(value: A): Try<A>;
    static failure<A>(e: any): Try<A>;

    static map2<A1,A2,R>(
      fa1: Try<A1>, fa2: Try<A2>,
      f: (A1, A2) => R): Try<R>;
    static map3<A1,A2,A3,R>(
      fa1: Try<A1>, fa2: Try<A2>, fa3: Try<A3>,
      f: (A1, A2, A3) => R): Try<R>;
    static map4<A1,A2,A3,A4,R>(
      fa1: Try<A1>, fa2: Try<A2>, fa3: Try<A3>, fa4: Try<A4>,
      f: (A1, A2, A3, A4) => R): Try<R>;
    static map5<A1,A2,A3,A4,A5,R>(
      fa1: Try<A1>, fa2: Try<A2>, fa3: Try<A3>, fa4: Try<A4>, fa5: Try<A5>,
      f: (A1, A2, A3, A4, A5) => R): Try<R>;
    static map6<A1,A2,A3,A4,A5,A6,R>(
      fa1: Try<A1>, fa2: Try<A2>, fa3: Try<A3>, fa4: Try<A4>, fa5: Try<A5>, fa6: Try<A6>,
      f: (A1, A2, A3, A4, A5, A6) => R): Try<R>;

    static tailRecM<A, B>(a: A, f: (a: A) => Try<Either<A, B>>): Try<B>;
  }

  declare export function Success<A>(value: A): Try<A>;
  declare export function Failure(e: any): Try<void>;
}
