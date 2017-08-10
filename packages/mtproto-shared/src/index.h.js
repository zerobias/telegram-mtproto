//@flow

export interface AsyncStorage {
  get(key: string): Promise<any>,
  set(key: string, val: any): Promise<void>,
  remove(...keys: string[]): Promise<void>,
  clear(): Promise<void>,
}
