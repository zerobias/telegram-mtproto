import Ajv from 'ajv'
import AjvKeys from 'ajv-keywords/keywords/typeof'
import propIs from 'ramda/src/propIs'

const type = {
  func: { typeof: 'function' },
  num : { type: 'number' },
  str : { type: 'string' },
  bool: { type: 'boolean' },
  obj : { type: 'object' }
}

const app = {
  type      : 'object',
  properties: {
    publicKeys: {
      type       : 'array',
      uniqueItems: true,
    },
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
    schema  : type.obj,
    mtSchema: type.obj
  },
  additionalProperties: false
}

const ajv = new Ajv()
AjvKeys(ajv)
const validate = ajv.compile(schema)

const configValidator = config => {
  const valid = validate(config)
  if (!valid) {
    console.log('config errors')
    validate.errors.map(printObj)
    throw new Error('wrong config fields')
  }
}

const canDir = propIs(Function, 'dir', console)
const printObj = canDir
  ? (arg) => console.dir( arg, { colors: true })
  : (arg) => console.log(arg)


export default configValidator