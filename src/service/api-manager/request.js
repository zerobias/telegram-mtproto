//@flow

import Bluebird from 'bluebird'

// import Logger from '../../util/log'
// const log = Logger`request`

import { MTError } from '../../error'
import { delayedCall } from '../../util/smart-timeout'
import type { NetworkerType, RequestOptions } from './index.h'



class Request {
  method: string
  params: { [arg: string]: * }
  config: RequestOptions
  constructor(config: RequestOptions,
              method: string,
              params?: Object = {}) {
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
  initNetworker = async (): Promise<NetworkerType> => {
    if (!this.config.networker) {
      const { getNetworker, netOpts, dc } = this.config
      const networker = await getNetworker(dc, netOpts)
      this.config.networker = networker
    }
    return this.config.networker
  }

  performRequest = () => this.initNetworker().then(this.requestWith)
  requestWith = (networker: NetworkerType) => networker
    .wrapApiCall(this.method, this.params, this.config.netOpts)
    .catch({ code: 303 }, this.error303)
    .catch({ code: 420 }, this.error420)
  error303(err: MTError) {
    const matched = err.type.match(/^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/)
    if (!matched || matched.length < 2) return Bluebird.reject(err)
    const [ , , newDcID] = matched
    if (+newDcID === this.config.dc) return Bluebird.reject(err)
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
    if (!matched || matched.length < 2) return Bluebird.reject(err)
    const [ , waitTime ] = matched
    console.error(`Flood error! It means that mtproto server bans you on ${waitTime} seconds`)
    return +waitTime > 60
      ? Bluebird.reject(err)
      : delayedCall(this.performRequest, +waitTime * 1e3)
  }
}

export default Request
