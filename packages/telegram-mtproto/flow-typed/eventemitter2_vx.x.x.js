// flow-typed signature: eb98ead5cc046825b5967cba926ea06e
// flow-typed version: <<STUB>>/eventemitter2_v^4.1.0/flow_v0.43.1

declare module 'eventemitter2' {
  declare export type eventNS = string[];
  declare export type EventID = string[] | string
  declare export type Emit = (event: EventID, ...values: any[]) => boolean
  declare export type On = (event: EventID, listener: Listener) => EventEmitter2
  declare export interface ConstructorOptions {

    /**
     *
     * @default  false
     * @description  set this to `true` to use wildcards.
     */
    wildcard ? : boolean,

    /**
     *
     * @default  '.'
     * @description  the delimiter used to segment namespaces.
     */
    delimiter ? : string,

    /**
     *
     * @default  true
     * @description  set this to `true` if you want to emit the newListener events.
     */
    newListener ? : boolean,

    /**
     *
     * @default  10
     * @description  the maximum amount of listeners that can be assigned to an event.
     */
    maxListeners ? : number,

    /**
     *
     * @default  false
     * @description  show event name in memory leak message when more than maximum amount of listeners is assigned, default false
     */
    verboseMemoryLeak ? : boolean
  }
  declare export interface Listener {
    (...values: any[]): void
  }
  declare export interface EventAndListener {
    (event: EventID, ...values: any[]): void
  }
  declare export interface EventEmitterType {
    emit(event: EventID, ...values: any[]): boolean;
    on(event: EventID, listener: Listener): EventEmitterType;
    off(event: string, listener: Listener): EventEmitterType;
  }
  declare export class EventEmitter2 {
    constructor(options ? : ConstructorOptions): this;
    emit(event: EventID, ...values: any[]): boolean;
    emitAsync(event: EventID, ...values: any[]): Promise < any[] > ;
    addListener(event: string, listener: Listener): this;
    on(event: EventID, listener: Listener): this;
    prependListener(event: EventID, listener: Listener): this;
    once(event: EventID, listener: Listener): this;
    prependOnceListener(event: EventID, listener: Listener): this;
    many(event: EventID, timesToListen: number, listener: Listener): this;
    prependMany(event: EventID, timesToListen: number, listener: Listener): this;
    onAny(listener: EventAndListener): this;
    prependAny(listener: EventAndListener): this;
    offAny(listener: Listener): this;
    removeListener(event: EventID, listener: Listener): this;
    off(event: string, listener: Listener): this;
    removeAllListeners(event ? : string | eventNS): this;
    setMaxListeners(n: number): void;
    eventNames(): string[];
    listeners(event: EventID): () => {}[];
    listenersAny(): () => {}[]
  }
  declare export default typeof EventEmitter2;
}