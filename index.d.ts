declare module 'telegram-mtproto' {
  type ServerConfig = {
    dev?: boolean
    webogram?: boolean
  }
  type AppConfig = {
    debug?: boolean
    storage?: AsyncStorage
  }
  type ApiConfig = {
    invokeWithLayer?: number
    layer          ?: number
    initConnection ?: number
    api_id         ?: string
    device_model   ?: string
    system_version ?: string
    app_version    ?: string
    lang_code      ?: string
  }
  type Config = {
    server?: ServerConfig
    api?: ApiConfig
    app?: AppConfig
    schema?: Object
    mtSchema?: Object
  }
  class ApiManager {
    constructor()
    constructor({ server, api, app, schema, mtSchema }: Config)
    // mtpGetNetworker(dc: number): any
    // mtpGetNetworker(dc: number, options: Object): any
    readonly storage: AsyncStorage
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