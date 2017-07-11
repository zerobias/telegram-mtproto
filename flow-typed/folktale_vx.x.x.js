declare module 'folktale/maybe' {
  declare interface MaybeMatcher<T, +A, +B> {
    Just(res: { value: T }): A,
    Nothing(): B,
  }
  declare export class IMaybe<T> {
    getOrElse(onElse: T): T,
    orElse(onElse: T): T,
    map<S>(fn: (obj: T) => S): IMaybe<S>,
    chain<S>(fn: (obj: T) => IMaybe<S>): IMaybe<S>,
    matchWith<+A, +B>(matcher: MaybeMatcher<T, A, B>): A | B
  }
  declare export class IJust<T> extends IMaybe<T> {
    map<S>(fn: (obj: T) => S): IJust<S>,
    chain<S>(fn: (obj: T) => IMaybe<S>): IMaybe<S>,
    matchWith<+A, +B>(matcher: MaybeMatcher<T, A, B>): A,
  }
  declare export class INothing<T> extends IMaybe<T> {
    map<S>(fn: (obj: T) => S): INothing<S>,
    chain<S>(fn: (obj: T) => IMaybe<S>): INothing<S>,
    matchWith<+A, +B>(matcher: MaybeMatcher<T, A, B>): B,
  }
  declare export interface Maybe<T> {
    getOrElse(onElse: T): T,
    orElse(onElse: T): T,
    map<S>(fn: (obj: T) => S): IMaybe<S>,
    chain<S>(fn: (obj: T) => IMaybe<S>): IMaybe<S>,
    matchWith<+A, +B>(matcher: MaybeMatcher<T, A, B>): A | B
  }
  declare export function Just<T>(obj: T): IJust<T>
  declare export function Nothing<T>(): INothing<T>
  declare export function of<T>(obj: T): IJust<T>
  declare export function fromNullable<T>(obj: ?T): IMaybe<T>
  declare export function hasInstance(obj: ?IMaybe<*>): boolean
}

declare module 'folktale/result' {
  declare interface ResultMatcher<Right, Left, -A, -B> {
    Ok(res: { value: Right }): A,
    Error(res: { value: Left }): B,
  }
  declare export class IResult<Right, Left> {
    map<S>(fn: (obj: Right) => S): IResult<S, Left>,
    mapError<NewErr>(fn: (obj: Left) => NewErr): IResult<Right, NewErr>,
    merge(): Right | Left,
    chain<S, NewErr>(fn: (obj: Right) => IResult<S, NewErr>): IResult<S, Left | NewErr>,
    getOrElse(defaults: Right): Right,
    orElse<+S, +NewErr>(fn: (obj: Left) => IResult<S, NewErr>): IResult<Right | S, NewErr>,
    matchWith<A, B>(matcher: ResultMatcher<Right, Left, A, B>): A | B,
  }
  declare export class IOk<Right, Left> extends IResult<Right, Left> {
    map<S>(fn: (obj: Right) => S): IOk<S, Left>,
    merge(): Right,
    chain<S, NewErr>(fn: (obj: Right) => IResult<S, NewErr>): IResult<S, Left | NewErr>,
    orElse<+S, +NewErr>(fn: (obj: Left) => IResult<S, NewErr>): IResult<Right | S, NewErr>,
    matchWith<A, B>(matcher: ResultMatcher<Right, Left, A, B>): A,
  }
  declare export class IError<Right, Left> extends IResult<Right, Left> {
    map<S>(fn: (obj: Right) => S): IError<S, Left>,
    merge(): Left,
    chain<S, NewErr>(fn: (obj: Right) => IResult<S, NewErr>): IResult<S, Left | NewErr>,
    orElse<+S, +NewErr>(fn: (obj: Left) => IResult<S, NewErr>): IResult<Right | S, NewErr>,
    matchWith<A, B>(matcher: ResultMatcher<Right, Left, A, B>): B,
  }

  declare export function fromNullable<Right>(obj: ?Right): IResult<Right, null | void>
  declare export function hasInstance(obj: mixed): boolean

  declare export function of<Right, Left: mixed>(obj: Right): IOk<Right, Left>
  declare export function Ok<Right, Left: mixed>(obj: Right): IOk<Right, Left>
  declare export function Error<Right: mixed, Left>(obj: Left): IError<Right, Left>
  declare var Either: { Ok: typeof Ok, Error: typeof Error }
  declare export default typeof Either
}

declare module 'folktale/validation' {
  declare interface Semigroup<+A> {
    concat(x: Semigroup<A>): Semigroup<A>
  }
  declare export interface IValidation<+T, +Err: Semigroup<*>> {
    concat<+S>(x: $Subtype<IValidation<S, Err>>): $Subtype<IValidation<S, Err>>,
    map<S>(fn: (obj: T) => S): IValidation<S, Err>,
    orElse<+S>(fn: (obj: Err) => IValidation<S, Err>): IValidation<S, Err>,
  }
  declare export interface ISuccess<+T, +Err: Semigroup<*>> extends IValidation<T, Err> {
    concat<+S>(x: ISuccess<S, Err>): ISuccess<S, Err>,
    map<S>(fn: (obj: T) => S): ISuccess<S, Err>,
  }
  declare export interface IFailure<+T, +Err: Semigroup<*>> extends IValidation<T, Err> {
    concat<+S>(x: IFailure<S, Err>): IFailure<S, Err>,
    map<S>(fn: (obj: T) => S): IFailure<S, Err>,
  }
  declare export function Success<T, Err: *>(obj: T): ISuccess<T, Err>
  declare export function Failure<T: *, Err>(obj: Err): IFailure<T, Err>
  declare export function collect<+T, +Err>(list: IValidation<T, Err>[]): IFailure<T, Err>
}

declare module 'folktale/conversions' {
  import type { IMaybe, IJust, INothing } from 'folktale/maybe'
  import type { IResult, IOk, IError } from 'folktale/result'

  declare export function maybeToResult<T, Err>(aMaybe: IMaybe<T>, IFailureValue: Err): IResult<T, Err>
  declare export function maybeToResult<T, Err>(aMaybe: IJust<T>, IFailureValue: Err): IOk<T, Err>
  declare export function maybeToResult<T, Err>(aMaybe: INothing<T>, IFailureValue: Err): IError<T, Err>

  declare export function resultToMaybe<T, +Err>(aResult: IResult<T, Err>): IMaybe<T>
  declare export function resultToMaybe<T, +Err>(aResult: IOk<T, Err>): IJust<T>
  declare export function resultToMaybe<T, +Err>(aResult: IError<T, Err>): INothing<T>

  declare export function nullableToMaybe<T>(obj: ?T): IMaybe<T>
  declare export function nullableToResult<T>(obj: ?T): IResult<T, null | void>
}

declare module 'folktale/lambda' {
  declare export function compose<A,B,C>(
    bc: (b: B) => C,
    ab: (a: A) => B,
  ): (a: A) => C
  declare export function constant<T>(obj: T): (lost: any) => T
  declare export function identity<T>(obj: T): T
}