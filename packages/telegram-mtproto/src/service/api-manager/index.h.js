//@flow

import { Fluture } from 'fluture'
import { type Emit, type On } from 'eventemitter2'
import { type AsyncStorage } from 'mtproto-shared'
import { type Response } from 'Newtype'
import { MTError } from '../../error'

export type Bytes = number[]

export type LeftOptions = {
  dcID?: number,
  createNetworker: ?boolean,
}

export type Cached<Model> = {
  [id: number]: Model
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
