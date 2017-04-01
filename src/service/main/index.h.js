//@flow

import type { TLSchema } from '../../tl/index.h'
import type { AsyncStorage } from '../../plugins'

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