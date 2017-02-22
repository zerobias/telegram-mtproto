declare module 'telegram-mtproto' {
  class ApiManager {
    constructor()
    constructor({ serverConfig, appSettings, schema, debug }: { serverConfig?: Object, appSettings?: Object, schema?: Object, debug?: boolean })
    mtpGetNetworker(dc: number): any
    mtpGetNetworker(dc: number, options: Object): any
    mtpInvokeApi<T>(method: string): Promise<T>
    mtpInvokeApi<T>(method: string, params: Object): Promise<T>
    mtpInvokeApi<T>(method: string, params: Object, options: Object): Promise<T>
    on(event: string|string[], handler: Function)
  }
  const api: ApiManager
  interface AsyncStorage {
    get(...keys: string[]): Promise<any[]>
    set(obj: Object): Promise<Object>
    remove(...keys: string[]): Promise<any>
    clear(): Promise<{}>
  }
}