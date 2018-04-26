//@flow

import Promise from 'bluebird'

import Logger from '../../util/log'
const debug = Logger([`request`])

import { MTError } from '../../error'
import { delayedCall } from '../../util/smart-timeout'
import type { NetworkerType, AsyncStorage, LeftOptions } from './index.h.js'

type Options = {|
  networker?: NetworkerType,
  dc: number,
  storage: AsyncStorage,
  getNetworker: (dcID: number, options: LeftOptions) => Promise<NetworkerType>,
  netOpts: mixed
|}

class Request {
  method: string
  params: { [arg: string]: mixed }
  config: Options
  constructor(config: Options, method: string, params?: Object = {}) {
    this.config = config
    this.method = method
    this.params = params

    this.performRequest = this.performRequest.bind(this)
    //$FlowIssue
    this.error303 = this.error303.bind(this)
    //$FlowIssue
    this.error420 = this.error420.bind(this)
    this.initNetworker = this.initNetworker.bind(this)
  }
  initNetworker = (): Promise<NetworkerType> => {
    if (!this.config.networker) {
      const { getNetworker, netOpts, dc } = this.config
      return getNetworker(dc, netOpts)
        .then(this.saveNetworker)
    }
    return Promise.resolve(this.config.networker)
  }
  saveNetworker = (networker: NetworkerType) => this.config.networker = networker
  performRequest = () => this.initNetworker().then(this.requestWith)
  requestWith = (networker: NetworkerType) => networker
    .wrapApiCall(this.method, this.params, this.config.netOpts)
    .catch({ code: 303 }, this.error303)
    .catch({ code: 420 }, this.error420)
  error303(err: MTError) {
    const matched = err.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)
    if (!matched || matched.length < 2) return Promise.reject(err)
    const [ , , newDcID] = matched
    if (+newDcID === this.config.dc) return Promise.reject(err)
    this.config.dc = +newDcID
    delete this.config.networker
    /*if (this.config.dc)
      this.config.dc = newDcID
    else
      await this.config.storage.set('dc', newDcID)*/
    //TODO There is disabled ability to change default DC
    //NOTE Shouldn't we must reassign current networker/cachedNetworker?
    return this.performRequest()
  }
  error420(err: MTError) {
    const matched = err.type.match(/^FLOOD_WAIT_(\d+)/)
    if (!matched || matched.length < 2) return Promise.reject(err)
    const [ , waitTime ] = matched
    console.error(`Flood error! The mtproto server has banned you for ${waitTime} seconds.`)
    return +waitTime > 60
      ? Promise.reject(err)
      : delayedCall(this.performRequest, +waitTime * 1e3)
  }
}

export default Request
