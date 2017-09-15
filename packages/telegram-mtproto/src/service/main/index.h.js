//@flow

import { type TLSchema } from '../../tl/index.h'
import { type AsyncStorage } from 'mtproto-shared'
import type { MTProto } from './index'

import { Fluture } from 'fluture'
import { type Emit, type On } from 'eventemitter2'
import { type Response } from 'Newtype'
import { MTError } from '../../error'

export type LeftOptions = {
  dcID?: number,
  createNetworker?: boolean,
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

export interface ApiManagerInstance {
  (method: string): Promise<any>,
  (method: string, params: Object): Promise<any>,
  (method: string, params: Object, options: LeftOptions): Promise<any>,
  future(method: string, params?: Object): Fluture<Response, MTError>,
  storage: AsyncStorage,
  on: On,
  emit: Emit,
  bus: *,
}
