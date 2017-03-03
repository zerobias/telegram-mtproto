const test = require('tap').test

const Ajv = require('ajv')
const AjvKeys = require('ajv-keywords/keywords/typeof')

const type = {
  func: { typeof: 'function' },
  num : { type: 'number' },
  str : { type: 'string' },
  bool: { type: 'boolean' }
}

const app = {
  type      : 'object',
  properties: {
    storage: {
      type      : 'object',
      required  : ['get', 'set', 'remove', 'clear'],
      properties: {
        get   : type.func,
        set   : type.func,
        remove: type.func,
        clear : type.func
      },
      additionalProperties: true
    }
  },
  additionalProperties: false
}

const api = {
  type      : 'object',
  required  : ['layer', 'api_id'],
  properties: {
    invokeWithLayer: type.num,
    layer          : type.num,
    initConnection : type.num,
    api_id         : type.num,
    device_model   : type.str,
    system_version : type.str,
    app_version    : type.str,
    lang_code      : type.str
  },
  additionalProperties: false
}

const dc = {
  type      : 'object',
  required  : ['id', 'host'],
  properties: {
    id  : type.num,
    host: type.str,
    port: type.num
  },
  additionalProperties: false
}

const server = {
  type      : 'object',
  properties: {
    dev     : type.bool,
    webogram: type.bool,
    dcList  : {
      type       : 'array',
      uniqueItems: true,
      items      : dc
    }
  },
  additionalProperties: false
}

const schema = {
  properties: {
    app,
    api,
    server,
    schema  : { type: 'object' },
    mtSchema: { type: 'object' }
  },
  additionalProperties: false
}

test('full module config validation', t => {
  t.plan(1)
  const ajv = new Ajv()
  AjvKeys(ajv)

  const validate = ajv.compile(schema)

  const opts = {
    app: {
      storage: {
        get() {},
        set() {},
        remove() {},
        //eslint-disable-next-line
        clear: () => {}
      }
    },
    api: {
      invokeWithLayer: 0xda9b0d0d,
      layer          : 57,
      initConnection : 0x69796de9,
      api_id         : 49631,
      device_model   : 'Unknown UserAgent',
      system_version : 'Unknown Platform',
      app_version    : '1.0.1',
      lang_code      : 'en'
    },
    server: {
      dev     : true,
      webogram: true,
      dcList  : [
        { id: 1, host: '149.154.175.10',  port: 80 },
        { id: 2, host: '149.154.167.40',  port: 80 },
        { id: 3, host: '149.154.175.117', port: 80 }
      ]
    }
  }

  const valid = validate(opts)

  const print = res => res
    ? res
    : validate.errors

  console.log(print(valid))
  t.equal(valid, true, 'validation result is true')
})