//@flow

type DcSettings = {
  dev: boolean,
  webogram: boolean,
}

const defaults: DcSettings = {
  dev: false,
  webogram: false,
}

type SingleDc = {|
  id: number,
  host: string
|}

type DcConfig = {|
  path: string,
  protocol: 'http' | 'https',
  port: number | false,
  dcList: SingleDc[]
|}

const mainDev: DcConfig = {
  path    : 'apiw1',
  protocol: 'http',
  port    : 80,
  dcList  : [
    { id: 1, host: '149.154.175.10' },
    { id: 2, host: '149.154.167.40' },
    { id: 3, host: '149.154.175.117' },
  ]
}

const mainProd: DcConfig = {
  path    : 'apiw1',
  protocol: 'http',
  port    : 80,
  dcList  : [
    { id: 1, host: '149.154.175.50' },
    { id: 2, host: '149.154.167.51' },
    { id: 3, host: '149.154.175.100' },
    { id: 4, host: '149.154.167.91' },
    { id: 5, host: '149.154.171.5' },
  ]
}

const webogramProd: DcConfig = {
  path    : 'apiw1',
  protocol: 'https',
  port    : false,
  dcList  : [
    { id: 1, host: 'pluto.web.telegram.org' },
    { id: 2, host: 'venus.web.telegram.org' },
    { id: 3, host: 'aurora.web.telegram.org' },
    { id: 4, host: 'vesta.web.telegram.org' },
    { id: 5, host: 'flora.web.telegram.org' },
  ]
}

const webogramDev: DcConfig = {
  path    : 'apiw_test1',
  protocol: 'https',
  port    : false,
  dcList  : [
    { id: 1, host: 'pluto.web.telegram.org' },
    { id: 2, host: 'venus.web.telegram.org' },
    { id: 3, host: 'aurora.web.telegram.org' },
    { id: 4, host: 'vesta.web.telegram.org' },
    { id: 5, host: 'flora.web.telegram.org' },
  ]
}

/*
const webogramProdUpload = {
  path    : 'apiw1',
  protocol: 'https',
  port    : false,
  dcList  : [
    { id: 1, host: 'pluto-1.web.telegram.org' },
    { id: 2, host: 'venus-1.web.telegram.org' },
    { id: 3, host: 'aurora-1.web.telegram.org' },
    { id: 4, host: 'vesta-1.web.telegram.org' },
    { id: 5, host: 'flora-1.web.telegram.org' },
  ]
}*/

const getDcConfig = ({ dev = false, webogram = false }: DcSettings) => {
  switch (true) {
    case dev && webogram: return webogramDev
    case dev && !webogram: return mainDev
    case !dev && webogram: return webogramProd
    case !dev && !webogram: return mainProd
    default: throw new Error(`Dc configuration error! dev: ${dev.toString()} webogram: ${webogram.toString()}`)
  }
}

const getFlatDcMap = ({ dcList, ...opts }: DcConfig) => {
  const dcMap: Map<number, string> = new Map()
  const protocol = `${opts.protocol}://`
  const port = opts.port
    ? `:${opts.port}`
    : ''
  const path = `/${opts.path}`
  for (const { id, host } of dcList) {
    const fullUrl = [protocol, host, port, path].join('')
    dcMap.set(id, fullUrl)
  }
  return dcMap
}

const parseServerConfig = (config: { dev?: boolean, webogram?: boolean } = {}) => {
  const withDefaults = { ...defaults, ...config }
  const cfg = getDcConfig(withDefaults)
  const dcMap = getFlatDcMap(cfg)
  return dcMap
}

export default parseServerConfig
