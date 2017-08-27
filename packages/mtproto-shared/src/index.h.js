//@flow

export interface AsyncStorage {
  get(key: string): Promise<any>,
  set(key: string, val: any): Promise<void>,
  has(key: string): Promise<boolean>,
  remove(...keys: string[]): Promise<void>,
}
