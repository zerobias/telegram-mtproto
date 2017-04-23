// flow-typed signature: a379340a5d360a5a86716b8e3ed03d31
// flow-typed version: 3a109ae4bc/bluebird_v3.x.x/flow_>=v0.33.x

declare module 'bluebird' {

  type RangeError = Error;
  type CancellationErrors = Error;
  type TimeoutError = Error;
  type RejectionError = Error;
  type OperationalError = Error;

  type ConcurrencyOption = {
    concurrency: number,
  };
  type SpreadOption = {
    spread: boolean;
  };
  type MultiArgsOption = {
    multiArgs: boolean;
  };
  type BluebirdConfig = {
    warnings?: boolean,
    longStackTraces?: boolean,
    cancellation?: boolean,
    monitoring?: boolean
  };

  declare class PromiseInspection<T> {
    isCancelled(): boolean;
    isFulfilled(): boolean;
    isRejected(): boolean;
    pending(): boolean;
    reason(): any;
    value(): T;
  }

  type PromisifyOptions = {
    multiArgs?: boolean,
    context: any
  };

  declare type PromisifyAllOptions = {
    suffix?: string;
    filter?: (name: string, func: Function, target?: any, passesDefaultFilter?: boolean) => boolean;
    // The promisifier gets a reference to the original method and should return a function which returns a promise
    promisifier?: (originalMethod: Function) => () => Bluebird$Promise<any> ;
  };

  declare type $Promisable<T> = Promise<T> | T;

  declare class Bluebird$Promise<R> extends Promise<R>{
    static Defer: Class<Defer>;
    static PromiseInspection: Class<PromiseInspection<any>>;

    static all<T>(Promises: $Promisable<Iterable<$Promisable<T>>>): Bluebird$Promise<Array<T>>;
    static props(input: $Promisable<Object | Map<string, any>>): Bluebird$Promise<R>;
    static any<T>(Promises: Array<$Promisable<T>>): Bluebird$Promise<T>;
    static race<T>(Promises: Array<$Promisable<T>>): Bluebird$Promise<T>;
    static reject<T>(error?: any): Bluebird$Promise<T>;
    static resolve<T>(object?: $Promisable<T>): Bluebird$Promise<T>;
    static some<T>(Promises: Array<$Promisable<T>>, count: number): Bluebird$Promise<Array<T>>;
    static join<T, A>(
      value1: $Promisable<A>,
      handler: (a: A) => $Promisable<T>
    ): Bluebird$Promise<T>;
    static join<T, A, B>(
      value1: $Promisable<A>,
      value2: $Promisable<B>,
      handler: (a: A, b: B) => $Promisable<T>
    ): Bluebird$Promise<T>;
    static join<T, A, B, C>(
      value1: $Promisable<A>,
      value2: $Promisable<B>,
      value3: $Promisable<C>,
      handler: (a: A, b: B, c: C) => $Promisable<T>
    ): Bluebird$Promise<T>;
    static map<T, U>(
      Promises: Array<$Promisable<T>>,
      mapper: (item: T, index: number, arrayLength: number) => $Promisable<U>,
      options?: ConcurrencyOption
    ): Bluebird$Promise<Array<U>>;
    static mapSeries<T, U>(
      Promises: Array<$Promisable<T>>,
      mapper: (item: T, index: number, arrayLength: number) => $Promisable<U>
    ): Bluebird$Promise<Array<U>>;
    static reduce<T, U>(
      Promises: Array<$Promisable<T>>,
      reducer: (total: U, current: T, index: number, arrayLength: number) => $Promisable<U>,
      initialValue?: $Promisable<U>
    ): Bluebird$Promise<U>;
    static filter<T>(
      Promises: Array<$Promisable<T>>,
      filterer: (item: T, index: number, arrayLength: number) => $Promisable<bool>,
      option?: ConcurrencyOption
    ): Bluebird$Promise<Array<T>>;
    static each<T>(
      Promises: Array<$Promisable<T>>,
      iterator: (item: T, index: number, arrayLength: number) => $Promisable<mixed>,
    ): Bluebird$Promise<Array<T>>;
    static try<T>(fn: () => $Promisable<T>, args?: Array<any>, ctx?:any): Bluebird$Promise<T>;
    static attempt<T>(fn: () => $Promisable<T>, args?:Array<any>, ctx?:any): Bluebird$Promise<T>;
    static delay<T>(ms: number, value: $Promisable<T>): Bluebird$Promise<T>;
    static delay(ms: number): Bluebird$Promise<void>;
    static config(config: BluebirdConfig): void;

    static defer(): Defer;
    static setScheduler(scheduler: (callback: (...args: Array<any>) => void) => void): void;
    static promisify(nodeFunction: Function, receiver?: PromisifyOptions): Function;
    static promisifyAll(target: Object|Array<Object>, options?: PromisifyAllOptions): void;

    static coroutine(generatorFunction: Function): Function;
    static spawn<T>(generatorFunction: Function): Bluebird$Promise<T>;

    // It doesn't seem possible to have type-generics for a variable number of arguments.
    // Handle up to 3 arguments, then just give up and accept 'any'.
    static method<T>(fn: () => $Promisable<T>): () => Bluebird$Promise<T>;
    static method<T, A>(fn: (a: A) => $Promisable<T>): (a: A) => Bluebird$Promise<T>;
    static method<T, A, B>(fn: (a: A, b: B) => $Promisable<T>): (a: A, b: B) => Bluebird$Promise<T>;
    static method<T, A, B, C>(fn: (a: A, b: B, c: C) => $Promisable<T>): (a: A, b: B, c: C) => Bluebird$Promise<T>;
    static method<T>(fn: (...args: any) => $Promisable<T>): (...args: any) => Bluebird$Promise<T>;

    static cast<T>(value: $Promisable<T>): Bluebird$Promise<T>;
    static bind(ctx: any): Bluebird$Promise<void>;
    static is(value: any): boolean;
    static longStackTraces(): void;

    static onPossiblyUnhandledRejection(handler: (reason: any) => any): void;
    static fromCallback<T>(resolver: (fn: (error?:Error, value?: T) => any) => any, options?: MultiArgsOption): Bluebird$Promise<T>;

    constructor(callback: (
      resolve: (result?: $Promisable<R>) => void,
      reject: (error?: any) => void
    ) => mixed): void;
    then<U>(onFulfill?: (value: R) => $Promisable<U>, onReject?: (error: any) => $Promisable<U>): Bluebird$Promise<U>;
    catch<U>(onReject?: (error: any) => $Promisable<U> | void): Bluebird$Promise<U>;
    caught<U>(onReject?: (error: any) => $Promisable<U> | void): Bluebird$Promise<U>;
    error<U>(onReject?: (error: any) => $Promisable<U> | void): Bluebird$Promise<U>;
    done<U>(onFulfill?: (value: R) => mixed, onReject?: (error: any) => mixed): void;
    finally<T>(onDone?: (value: R) => mixed): Bluebird$Promise<T>;
    lastly<T>(onDone?: (value: R) => mixed): Bluebird$Promise<T>;
    tap<T>(onDone?: (value: R) => mixed): Bluebird$Promise<T>;
    delay(ms: number): Bluebird$Promise<R>;
    timeout(ms: number, message?: string): Bluebird$Promise<R>;
    cancel(): void;

    bind(ctx: any): Bluebird$Promise<R>;
    call(propertyName: string, ...args: Array<any>): Bluebird$Promise<any>;
    throw(reason: Error): Bluebird$Promise<R>;
    thenThrow(reason: Error): Bluebird$Promise<R>;
    all<T>(): Bluebird$Promise<Array<T>>;
    any<T>(): Bluebird$Promise<T>;
    some<T>(count: number): Bluebird$Promise<Array<T>>;
    race<T>(): Bluebird$Promise<T>;
    map<T, U>(mapper: (item: T, index: number, arrayLength: number) => $Promisable<U>, options?: ConcurrencyOption): Bluebird$Promise<Array<U>>;
    mapSeries<T, U>(mapper: (item: T, index: number, arrayLength: number) => $Promisable<U>): Bluebird$Promise<Array<U>>;
    reduce<T, U>(
      reducer: (total: T, item: U, index: number, arrayLength: number) => $Promisable<T>,
      initialValue?: $Promisable<T>
    ): Bluebird$Promise<T>;
    filter<T>(filterer: (item: T, index: number, arrayLength: number) => $Promisable<bool>, options?: ConcurrencyOption): Bluebird$Promise<Array<T>>;
    each<T, U>(iterator: (item: T, index: number, arrayLength: number) => $Promisable<U>): Bluebird$Promise<Array<T>>;
    asCallback<T>(callback: (error?:any, value?: T) => any, options?: SpreadOption): void;
    return<T>(value: T): Bluebird$Promise<T>;
    thenReturn<T>(value: T): Bluebird$Promise<T>;
    spread<T>(...args: Array<T>): Bluebird$Promise<R>;

    reflect(): Bluebird$Promise<PromiseInspection<any>>;

    isFulfilled(): bool;
    isRejected(): bool;
    isPending(): bool;
    isResolved(): bool;

    value(): R;
    reason(): any;
  }

  declare class Defer <Resolve, Reject> {
    promise: Bluebird$Promise<Resolve | Reject>;
    resolve: (value: Resolve) => any;
    reject: (value: Reject) => any;
  }

  export default Bluebird$Promise
}
