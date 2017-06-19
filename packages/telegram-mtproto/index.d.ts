declare module 'telegram-mtproto' {
  import { AsyncStorage } from 'mtproto-shared'
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
    schema?: object
    mtSchema?: object
  }
  type UpdatesManager = {}

  interface ApiManagerInstance {
    readonly storage: AsyncStorage
    readonly updates: UpdatesManager
    <T>(method: string, params?: object, options?: object): Promise<T>
    setUserAuth<T>(dc: number, userAuth: T): void
    on(event: string|Array<string>, handler: (msg: any) => void): void
  }
  interface ApiManager {
    new ({ server, api, app, schema, mtSchema }?: Config): ApiManagerInstance
  }
  export const ApiManager: ApiManager
  export { AsyncStorage }

  type Bytes = Array<number>

  export const plugins: {
    MemoryStorage: AsyncStorage,
    makePasswordHash(salt: Uint8Array | Bytes, password: string): Bytes
  }

  export function MTProto({ server, api, app, schema, mtSchema }: Config): ApiManagerInstance
  export default MTProto
}
