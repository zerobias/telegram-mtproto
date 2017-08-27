declare module 'mtproto-shared' {
  export interface AsyncStorage {
    get(key: string): Promise<any>
    set(key: string, val: any): Promise<void>
    has(key: string): Promise<boolean>
    remove(...keys: Array<string>): Promise<void>
  }
}
