//@flow

import Ajv from 'ajv'
import AjvKeys from 'ajv-keywords/keywords/typeof'

const schema = {
  properties: {
    app     : require('../../../config-schema/app.json'),
    api     : require('../../../config-schema/api.json'),
    server  : require('../../../config-schema/server.json'),
    schema  : { type: 'object' },
    mtSchema: { type: 'object' }
  },
  additionalProperties: false
}

const ajv = new Ajv()
AjvKeys(ajv)
const validate = ajv.compile(schema)

const configValidator = (config: *) => {
  const valid = validate(config)
  if (!valid) {
    console.log('config errors')
    validate.errors.map(printObj)
    throw new Error('wrong config fields')
  }
}

const printObj = (arg) => console.log(arg)


export default configValidator
