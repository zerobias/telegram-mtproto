//@flow

import { Future, type Fluture } from 'fluture'


import { Either, foldF } from '../../util/either'
import ApiRequest from '../main/request'
import NetworkerThread from '../networker'
import { type AsyncStorage } from '../../plugins'

const init:
  (initConn: () => Promise<void>) => Fluture<void, Error> =
  (initConn) => Future((rj, rs) => { initConn().then(rs, rj) })

const fHomeDC:
  (storage: AsyncStorage) => Fluture<number | string, Error> =
  (storage) => Future((rj, rs) => { storage.get('dc').then(rs, rj) })


const getNetworker: (
  getNetworker: (dc: number) => Promise<NetworkerThread>,
  dc: number
) => Fluture<NetworkerThread, Error> =
  (get, dc) => Future((rj, rs) => { get(dc).then(rs, rj) })

const wrapApiCall:
  (net: NetworkerThread, req: ApiRequest) => Fluture<mixed, mixed> =
  (net, req) => Future((rj, rs) => {
    net
      .wrapApiCall(
        req.data.method,
        req.data.params,
        req.options,
        req.requestID
      ).then(rs, rj)
  })

function invoke(
  req: ApiRequest,
  storage: AsyncStorage,
  initConn: () => Promise<void>,
  getNet: (dc: number) => Promise<NetworkerThread>,
): Fluture<Either<mixed, mixed>, void> {
  const future =
    init(initConn)
      .chain(() => fHomeDC(storage))
      .chain((homeDC: number | string) => Future((rj, rs) => {
        if (typeof homeDC === 'string') {
          if (isFinite(homeDC)) {
            rs(parseInt(homeDC, 10))
          } else {
            rj(new TypeError(`Wrong homeDC type ${homeDC} {typeof homeDC}`))
          }
        } else if (typeof homeDC === 'number') {
          rs(homeDC)
        } else {
          rj(new TypeError(`Wrong homeDC type ${homeDC} {typeof homeDC}`))
        }
      }))
      .map((homeDC: number) => ({ homeDC }))
      .map((data) => ({ ...data, dc: req.options.dc }))
      .chain(({ homeDC, dc }) => Future((rj, rs) => {
        if (dc) {
          if (typeof dc === 'number')
            rs(dc)
          else if (dc === '@@home')
            rs(homeDC)
          else
            rj(new Error(`invoke wrong request DC ${dc} home ${homeDC}`))
        } else
          rs(homeDC)
      }))
      .mapRej((err) => {
        req.defer.reject(err)
        return err
      })
      .chain((dc: number) => getNetworker(getNet, dc))
      .chain((net: NetworkerThread) => wrapApiCall(net, req))
      .chain(() => Future((rj, rs) => {
        req.defer.promise.then(rs, rj)
      }))
  const folded: Fluture<Either<mixed, mixed>, void> = foldF(future)
  return folded
}

export default invoke
