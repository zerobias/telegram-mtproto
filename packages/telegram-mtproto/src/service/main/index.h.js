//@flow

import { type TLSchema } from '../../tl/index.h'
import { type AsyncStorage } from '../../plugins'
import type { MTProto } from './index'

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

export type PublicKeyExtended = PublicKey & {
  fingerprint: string
}

export type DC = {
  id: number,
  host: string,
  port: number
}
export type ServerConfig = {
  dev?: boolean,
  webogram?: boolean,
  dcList?: Array<DC>
}

export interface Plugin {
  (ctx: MTProto): mixed,
  pluginName: string,
}

export type ConfigType = {
  server?: ServerConfig,
  api?: ApiConfig,
  app?: {
    storage?: AsyncStorage,
    publicKeys?: PublicKey[],
    plugins?: Plugin[],
  },
  schema?: TLSchema,
  mtSchema?: TLSchema
}

export type StrictConfig = {
  server: ServerConfig,
  api: ApiConfig,
  app: {
    storage: AsyncStorage,
    publicKeys: PublicKey[],
    plugins: Plugin[],
  },
  schema: TLSchema,
  mtSchema: TLSchema,
}

