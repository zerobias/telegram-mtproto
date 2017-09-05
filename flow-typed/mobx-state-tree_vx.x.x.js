



declare module 'mobx-state-tree' {
  declare export interface IType<S, T> {
    name: string,
    flags: TypeFlags,
    is(thing: any): boolean,
    validate(thing: any, context: IContext): IValidationResult,
    create(snapshot?: S, environment?: any): T,
    isType: boolean,
    describe(): string,
    Type: T,
    SnapshotType: S,
  }

  declare interface IObservableArray<T> {}

  declare type IMiddlewareEventType =
    | "action"
    | "process_spawn"
    | "process_resume"
    | "process_resume_error"
    | "process_return"
    | "process_throw"
// | "task_spawn TODO, see #273"

  declare type IStateTreeNode = {
    +$treenode?: any,
  }

  declare export type IMiddlewareEvent = {
    type: IMiddlewareEventType,
    name: string,
    id: number,
    parentId: number,
    rootId: number,
    context: IStateTreeNode,
    tree: IStateTreeNode,
    args: any[],
  }

  declare interface IMiddleWareApi {
    getState: () => any,
    dispatch: (action: any) => void,
  }

  declare type MiddleWare = (
    middlewareApi: IMiddleWareApi
  ) => ((next: (action: IMiddlewareEvent) => void) => void)

  declare export interface IReduxStore extends IMiddleWareApi {
    subscribe(listener: (snapshot: any) => void): any
  }

  declare export function connectReduxDevtools(remoteDevDep: any, model: any): void
  declare export function asReduxStore(model: any, ...middlewares: MiddleWare[]): IReduxStore


  declare export type Snapshot<T> = {
    [key: string]: Snapshot<any>
  }

  declare export interface IModelType<S, T> extends IComplexType<S, T & IStateTreeNode> {
    named(newName: string): IModelType<S, T>,
    props<SP, TP>(
        props: { [key: string]: IType<any, any> }/*{ [K in keyof TP]: IType<any, TP[K]> | TP[K] } &
            { [K in keyof SP]: IType<SP[K], any> | SP[K] }*/
    ): IModelType<S & Snapshot<SP>, T & TP>,
    views<V: Object>(fn: (self: T & IStateTreeNode) => V): IModelType<S, T & V>,
    actions<A: { [name: string]: Function }>(
        fn: (self: T & IStateTreeNode) => A
    ): IModelType<S, T & A>,
    preProcessSnapshot(fn: (snapshot: any) => S): IModelType<S, T>,
  }
  declare export type ITypeDispatcher = (snapshot: any) => IType<any, any>

  declare type IModelProperties<T> = {[key: string]: IType<any, any>}

  declare function reference<T>(factory: IType<any, T>): IType<string | number, T>

  declare function maybe<S, T>(type: IType<S, T>): IType<S | null | void, T | null>

  declare function model<T>(
    name: string,
    properties?: IModelProperties<T>
  ): IModelType<Snapshot<T>, T>
  declare function model<T>(properties?: IModelProperties<T>): IModelType<Snapshot<T>, T>

  declare function union<SA, SB, TA, TB>(A: IType<SA, TA>, B: IType<SB, TB>): IType<SA | SB, TA | TB>
  declare function union<SA, SB, TA, TB>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>
  ): IType<SA | SB, TA | TB>

  declare function union<SA, SB, SC, TA, TB, TC>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
  ): IType<SA | SB | SC, TA | TB | TC>
  declare function union<SA, SB, SC, TA, TB, TC>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>
  ): IType<SA | SB | SC, TA | TB | TC>


  declare function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
  ): IType<SA | SB | SC | SD, TA | TB | TC | TD>
  declare function union<SA, SB, SC, SD, TA, TB, TC, TD>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>
  ): IType<SA | SB | SC | SD, TA | TB | TC | TD>



  declare function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
  ): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>

  declare function union<SA, SB, SC, SD, SE, TA, TB, TC, TD, TE>(
    dispatch: ITypeDispatcher,
    A: IType<SA, TA>,
    B: IType<SB, TB>,
    C: IType<SC, TC>,
    D: IType<SD, TD>,
    E: IType<SE, TE>
  ): IType<SA | SB | SC | SD | SE, TA | TB | TC | TD | TE>



  declare interface IContextEntry {
    path: string,
    type?: IType<any, any>,
  }

  declare type IContext = IContextEntry[]
  declare interface IValidationError {
      context: IContext,
      value: any,
      message?: string,
  }
  declare type IValidationResult = IValidationError[]

  declare export interface ISimpleType<T> extends IType<T, T> {}
  declare export interface ISnapshottable<S> {}
  declare export interface IComplexType<S, T> extends IType<S, T & IStateTreeNode> {
    create(snapshot?: S, environment?: any): T & ISnapshottable<S>,
  }

  declare interface IExtendedObservableMap<T> {
    put(value: T | any): IExtendedObservableMap<T>
  }
  declare function map<S, T>(
    subtype: IType<S, T>
  ): IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>>

  declare function identifier<T>(no: void): T

  declare function identifier<T>(baseType: IType<T, T>): IType<T, T>



  declare opaque type TypeFlags: number

  declare export var types: {
    string: ISimpleType<string>,
    number: ISimpleType<number>,
    boolean: ISimpleType<boolean>,
    nullType: ISimpleType<null>,
    undefinedType: ISimpleType<void>,
    Date: IType<number, Date>,
    array<S, T>(subtype: IType<S, T>): IComplexType<S[], IObservableArray<T>>,
    union: typeof union,
    model: typeof model,
    reference: typeof reference,
    maybe: typeof maybe,
    map: typeof map,
    identifier: typeof identifier,
  }
}
