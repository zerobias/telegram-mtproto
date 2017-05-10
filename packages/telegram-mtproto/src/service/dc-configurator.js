//@flow

import { propEq, find, pipe } from 'ramda'

import type { ServerConfig, DC } from './main/index.h'

const sslSubdomains = ['pluto', 'venus', 'aurora', 'vesta', 'flora']

const devDC = [
  { id: 1, host: '149.154.175.10',  port: 80 },
  { id: 2, host: '149.154.167.40',  port: 80 },
  { id: 3, host: '149.154.175.117', port: 80 }
]

const prodDC = [
  { id: 1, host: '149.154.175.50',  port: 80 },
  { id: 2, host: '149.154.167.51',  port: 80 },
  { id: 3, host: '149.154.175.100', port: 80 },
  { id: 4, host: '149.154.167.91',  port: 80 },
  { id: 5, host: '149.154.171.5',   port: 80 }
]

const portString = ({ port = 80 }) => port === 80
  ? ''
  : `:${port}`

type FindById = (dc: number) => (list: DC[]) => ?DC
const findById: FindById = pipe( propEq('id'), find )

export const chooseServer = (chosenServers: { [id: number]: string | false }, serverConfig: ServerConfig = {}) =>
  (dcID: number, upload: boolean = false) => {

    const {
      dev = false,
      webogram = false,
      dcList = dev
        ? devDC
        : prodDC
    } = serverConfig

    if (typeof chosenServers[dcID] === 'string') return chosenServers[dcID]


    if (webogram) {
      const subdomain = sslSubdomains[dcID - 1] + (upload ? '-1' : '')
      const path = dev
        ? 'apiw_test1'
        : 'apiw1'
      const chosenServer = `https://${ subdomain }.web.telegram.org/${ path }`
      return chosenServer //TODO Possibly bug. Isn't it necessary? chosenServers[dcID] = chosenServer
    }
    const dcOption = findById(dcID)(dcList)
    if (dcOption) {
      const chosenServer = `http://${ dcOption.host }${portString(dcOption)}/apiw1`
      chosenServers[dcID] = chosenServer
    }
    return false
  }
