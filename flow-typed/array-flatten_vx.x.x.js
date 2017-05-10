declare module 'flatten' {
  declare export interface NestedArray <T> extends Array<T | NestedArray<T>> {}
  declare function flatten <T> (array: NestedArray<T>): T[]

  declare export interface NestedList <T> {
    [index: number]: T | NestedList<T>;
    length: number;
  }

  declare export function from <T> (array: NestedList<T>): T[];
  declare export function depth <T> (array: NestedArray<T>, depth: number): NestedArray<T>;
  declare export function depthFrom <T> (array: NestedList<T>, depth: number): NestedArray<T>;
  declare export default typeof flatten
}
