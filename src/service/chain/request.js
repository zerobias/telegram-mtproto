//@flow

import axios from '../../http'
import type { AxiosXHRConfig, $AxiosXHR } from 'axios'
import Bluebird from 'bluebird'

const basicConfig = {
  responseType: 'arraybuffer'
}


const request = <Data>(config: AxiosXHRConfig<*>): Bluebird$Promise<$AxiosXHR<Data>> => {
  const fullConfig = { ...basicConfig, ...config }
  const result = Bluebird.try(axios.post, ['a', fullConfig])
  return result
}

export default request
