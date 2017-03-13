import type { TLSchema } from '../../tl/types'

export type Bytes = number[]

export type PublicKey = {
  modulus: string,
  exponent: string
}

export type ApiConfig = {
  invokeWithLayer?: number,
  layer          ?: number,
  initConnection ?: number,
  api_id         ?: number,
  device_model   ?: string,
  system_version ?: string,
  app_version    ?: string,
  lang_code      ?: string
}

export type ConfigType = {
  server?: {},
  api?: ApiConfig,
  app?: {
    storage?: AsyncStorage,
    publicKeys?: PublicKey[]
  },
  schema?: TLSchema,
  mtSchema?: TLSchema,
}

export type LeftOptions = {
  dcID?: number,
  createNetworker?: boolean,
  fileDownload?: boolean,
  fileUpload?: boolean
}

export type AsyncStorage = {
  get(...keys: string[]): Promise<any[]>,
  set(obj: Object): Promise<Object>,
  remove(...keys: string[]): Promise<any>,
  clear(): Promise<{}>,
  setPrefix(): void,
  noPrefix(): void
}

type Cached<Model> = {
  [id: number]: Model
}

export type NetworkerType = {
  wrapApiCall: (method: string, params?: Object, options?: LeftOptions) => Promise<any>
}

export type Cache = {
  uploader: Cached<NetworkerType>,
  downloader: Cached<NetworkerType>,
  auth: Cached<*>,
  servers: Cached<*>,
  keysParsed: Cached<PublicKey>,
}