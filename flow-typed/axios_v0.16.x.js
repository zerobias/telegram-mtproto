// flow-typed signature: 8a60bc368e3d7a3a00c1ffe0712473e4
// flow-typed version: 59393f3a07/axios_v0.16.x/flow_>=v0.28.x

declare module 'axios' {
  declare interface ProxyConfig {
    host: string,
    port: number,
  }
  declare interface Cancel {
    constructor(message?: string): Cancel,
    message: string,
  }
  declare interface Canceler {
    (message?: string): void,
  }
  declare interface CancelTokenSource {
    token: CancelToken,
    cancel: Canceler,
  }
  declare export class CancelToken {
    constructor(executor: (cancel: Canceler) => void): CancelToken,
    static source(): CancelTokenSource,
    promise: Promise<Cancel>,
    reason?: Cancel,
    throwIfRequested(): void,
  }
  declare interface AxiosXHRConfigBase<T> {
    adapter?: <T>(config: AxiosXHRConfig<T>) => Promise<AxiosXHR<T>>,
    auth?: {
      username: string,
      password: string
    },
    baseURL?: string,
    cancelToken?: CancelToken,
    headers?: Object,
    httpAgent?: mixed, // Missing the type in the core flow node libdef
    httpsAgent?: mixed, // Missing the type in the core flow node libdef
    maxContentLength?: number,
    maxRedirects?: 5,
    params?: Object,
    paramsSerializer?: (params: Object) => string,
    progress?: (progressEvent: Event) => void | mixed,
    proxy?: ProxyConfig,
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
    timeout?: number,
    transformRequest?: Array<<U>(data: T) => U|Array<<U>(data: T) => U>>,
    transformResponse?: Array<<U>(data: T) => U>,
    validateStatus?: (status: number) => boolean,
    withCredentials?: boolean,
    xsrfCookieName?: string,
    xsrfHeaderName?: string,
  }
  declare type $AxiosXHRConfigBase<T> = AxiosXHRConfigBase<T>
  declare interface AxiosXHRConfig<T> extends AxiosXHRConfigBase<T> {
    data?: T,
    method?: string,
    url: string,
  }
  declare type $AxiosXHRConfig<T> = AxiosXHRConfig<T>
  declare export class AxiosXHR<T> {
    config: AxiosXHRConfig<T>,
    data: T,
    headers: Object,
    status: number,
    statusText: string,
    request: http$ClientRequest | XMLHttpRequest
  }
  declare export type $AxiosXHR<T> = AxiosXHR<T>
  declare class AxiosInterceptorIdent extends String {}
  declare class AxiosRequestInterceptor<T> {
    use(
      successHandler: ?(response: AxiosXHRConfig<T>) => Promise<AxiosXHRConfig<*>> | AxiosXHRConfig<*>,
      errorHandler: ?(error: mixed) => mixed,
    ): AxiosInterceptorIdent,
    eject(ident: AxiosInterceptorIdent): void,
  }
  declare class AxiosResponseInterceptor<T> {
    use(
      successHandler: ?(response: AxiosXHR<T>) => mixed,
      errorHandler: ?(error: mixed) => mixed,
    ): AxiosInterceptorIdent,
    eject(ident: AxiosInterceptorIdent): void,
  }
  declare export type AxiosPromise<T> = Promise<AxiosXHR<T>>
  declare class Axios {
    constructor<T>(config?: AxiosXHRConfigBase<T>): void,
    $call: <T>(config: AxiosXHRConfig<T> | string, config?: AxiosXHRConfig<T>) => Promise<AxiosXHR<T>>,
    request<T>(config: AxiosXHRConfig<T>): Promise<AxiosXHR<T>>,
    delete<T>(url: string, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    get<T>(url: string, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    head<T>(url: string, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    post<T>(url: string, data?: mixed, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    put<T>(url: string, data?: mixed, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    patch<T>(url: string, data?: mixed, config?: AxiosXHRConfigBase<T>): Promise<AxiosXHR<T>>,
    interceptors: {
      request: AxiosRequestInterceptor<mixed>,
      response: AxiosResponseInterceptor<mixed>,
    },
  }

  declare export class AxiosError<T> extends Error {
    config: AxiosXHRConfig<T>,
    response: AxiosXHR<T>,
    code?: string,
  }

  declare export type $AxiosError<T> = AxiosError<T>

  declare interface AxiosExport extends Axios {
    Axios: typeof Axios,
    Cancel: Class<Cancel>,
    CancelToken: Class<CancelToken>,
    isCancel(value: any): boolean,
    create(config?: AxiosXHRConfigBase<any>): Axios,
    all: typeof Promise.all,
    spread(callback: Function): (arr: Array<any>) => Function
  }
  declare export default AxiosExport
}
