//@flow

import type { TLSchema } from '../../tl/index.h'

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

export type AsyncStorage = {
  get: (...keys: string[]) => Promise<any[]>,
  set: (obj: Object) => Promise<Object>,
  remove: (...keys: string[]) => Promise<any>,
  clear: () => Promise<{}>,
  setPrefix: () => void,
  noPrefix: () => void
}

export type PublicKey = {
  modulus: string,
  exponent: string
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
  proxy?: {
    host: string,
    port: number,
    auth?: {
      username: string,
      password: string
    }
  }
}

export type StrictConfig = {
  server: {},
  api: ApiConfig,
  app: {
    storage: AsyncStorage,
    publicKeys: PublicKey[]
  },
  schema: TLSchema,
  mtSchema: TLSchema,
}

export type Emit = (event: string | string[], ...values: any[]) => boolean

export type On = (event: string, listener: (...values: any[]) => void) => void