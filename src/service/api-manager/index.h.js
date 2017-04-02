//@flow

import type { Emit, On } from '../main/index.h'
import type { AsyncStorage } from '../../plugins'
import type { PublicKey } from '../main/index.h'

export type Bytes = number[]

export type LeftOptions = {
  dcID?: number,
  createNetworker?: boolean,
  fileDownload?: boolean,
  fileUpload?: boolean
}

export type Cached<Model> = {
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

export type ApiManagerInstance = {
  (method: string): Promise<any>,
  (method: string, params: Object): Promise<any>,
  (method: string, params: Object, options: Object): Promise<any>,
  storage: AsyncStorage,
  setUserAuth(dc: number, userAuth: any): void,
  on: On,
  emit: Emit
}
