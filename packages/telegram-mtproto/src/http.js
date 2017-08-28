//@flow

import axios, { AxiosError, AxiosXHR } from 'axios'
import { encaseP2, type Encased2 } from 'fluture'

export const httpClient = axios.create()
//$FlowIssue
delete httpClient.defaults.headers.post['Content-Type']
//$FlowIssue
delete httpClient.defaults.headers.common['Accept']

const requestOptions = { responseType: 'arraybuffer' }

const request = (url: string, data: Int32Array) => httpClient.post(url, data, requestOptions)

export type Send = Encased2<string, Int32Array, AxiosXHR<ArrayBuffer>, AxiosError<ArrayBuffer>>
export const send: Send = encaseP2(request)

// export function unwrapPromise<L, R>(
//   either: Apropos<L, Promise<R>>
// ): Promise<Apropos<L, R>> {
//   return either.fold(e => Promise.resolve(Left(e)), x => x.then(Right))
// }

export default httpClient
