declare module 'telegram-mtproto' {
  type DC = {
    id: number
    host: string
    port: number
  }
  type ServerConfig = {
    dev?: boolean
    webogram?: boolean
    dcList?: Array<DC>
  }
  type PublicKey = {
    modulus: string
    exponent: string
  }
  type AppConfig = {
    debug?: boolean
    publicKeys?: Array<PublicKey>
    storage?: AsyncStorage
  }
  type ApiConfig = {
    invokeWithLayer?: number
    layer          ?: number
    initConnection ?: number
    api_id         ?: number
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

  interface ApiManagerInstance {
    readonly storage: AsyncStorage
    readonly updates: any
    <T>(method: string): Promise<T>
    <T>(method: string, params: Object): Promise<T>
    <T>(method: string, params: Object, options: Object): Promise<T>
    setUserAuth<T>(dc: number, userAuth: T): void
    on(event: string|string[], handler: Function)
  }
  interface IApiManager {
    new (): ApiManagerInstance
    new ({ server, api, app, schema, mtSchema }: Config): ApiManagerInstance
  }
  export const ApiManager: IApiManager
  class ApiManagerClass {
    readonly storage: AsyncStorage
    setUserAuth<T>(dc: number, userAuth: T): void
    on(event: string|string[], handler: Function)
  }
  export interface AsyncStorage {
    get(key: string): Promise<any>
    set(key: string, val: any): Promise<any>
    remove(...keys: string[]): Promise<any>
    clear(): Promise<{}>
  }

  function MTProto({ server, api, app, schema, mtSchema }: Config): ApiManagerInstance
  export default MTProto
}