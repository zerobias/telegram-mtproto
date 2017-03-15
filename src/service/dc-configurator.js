import has from 'ramda/src/has'
import propEq from 'ramda/src/propEq'
import find from 'ramda/src/find'
import pipe from 'ramda/src/pipe'
import prop from 'ramda/src/prop'

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

const findById = pipe( propEq('id'), find )

export const chooseServer = (chosenServers, {
  dev = false,
  webogram = false,
  dcList = dev
    ? devDC
    : prodDC
  } = {}) =>
  (dcID, upload = false) => {
    const choosen = prop(dcID)
    if (has(dcID, chosenServers)) return choosen(chosenServers)
    let chosenServer = false


    if (webogram) {
      const subdomain = sslSubdomains[dcID - 1] + (upload ? '-1' : '')
      const path = dev
        ? 'apiw_test1'
        : 'apiw1'
      chosenServer = `https://${ subdomain }.web.telegram.org/${ path }`
      return chosenServer //TODO Possibly bug. Isn't it necessary? chosenServers[dcID] = chosenServer
    }
    const dcOption = findById(dcID)(dcList)
    if (dcOption)
      chosenServer = `http://${ dcOption.host }${portString(dcOption)}/apiw1`
    chosenServers[dcID] = chosenServer

    return choosen(chosenServers)
  }