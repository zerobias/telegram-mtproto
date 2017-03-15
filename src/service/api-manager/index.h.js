//@flow

export type Bytes = number[]

export type PublicKey = { //TODO remove this
  modulus: string,
  exponent: string
}

export type LeftOptions = {
  dcID?: number,
  createNetworker?: boolean,
  fileDownload?: boolean,
  fileUpload?: boolean
}

export type AsyncStorage = { //TODO remove this
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

export type ApiManagerInstance = {
  (method: string): Promise<any>,
  (method: string, params: Object): Promise<any>,
  (method: string, params: Object, options: Object): Promise<any>,
  storage: AsyncStorage,
  setUserAuth(dc: number, userAuth: any): void,
  on: (event: string | string[], handler: Function) => void
}
