//@flow


import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from '../../plugins'
import NetworkerThread from '../networker'

export type Bytes = number[]

export type LeftOptions = {
  dcID?: number,
  createNetworker: ?boolean,
}

export type Cached<Model> = {
  [id: number]: Model
}

export type Cache = Cached<NetworkerThread>

export interface ApiManagerInstance {
  (method: string): Promise<any>,
  (method: string, params: Object): Promise<any>,
  (method: string, params: Object, options: LeftOptions): Promise<any>,
  storage: AsyncStorage,
  on: On,
  emit: Emit,
  bus: *,
}
