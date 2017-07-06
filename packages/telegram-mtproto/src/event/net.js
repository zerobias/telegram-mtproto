//@flow

import { Future, encaseP3 } from 'fluture'
import { type Fluture } from 'fluture'
// import { Ok, Error } from 'folktale/result'

import { type Bus } from './bus'
import { MTProto } from '../service/main'
import { httpClient } from '../http'

function request(url: string, data: Int32Array, requestOpts: any) {
  return Future((rj, rs) => {
    httpClient.post(url, data, requestOpts).then(rs, rj)
  })
}
export const sendBinary = (ctx: MTProto) =>
  ctx.bus$.net.sendBinary
    // .observe(async({ url, data, requestOpts, message }) => {
    //   try {
    //     const result =
    //       request(url, data, requestOpts)
    //   } catch (error) {
    //     return 0
    //   }
    // })

type NetBinaryResponse = {
  status: number,
  statusText: string,
  data: Int32Array,
}

