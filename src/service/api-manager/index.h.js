
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
  storage: AsyncStorage,
  (method: string): Promise<*>,
  (method: string, params: Object): Promise<*>,
  (method: string, params: Object, options: Object): Promise<*>,
  setUserAuth(dc: number, userAuth: *): void,
  on(event: string|string[], handler: Function): void
}
