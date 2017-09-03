//@flow

import uuid from 'Util/uuid'
import { type UID } from 'Newtype'
import { type ConfigType } from './index.h'
import configNormalization from './config-normalization'
import parseServerConfig from '../../config-check/dc'
import { type TLSchema } from '../../tl/index.h'
import Layout from '../../layout'

export function init(config: ConfigType) {
  //$off
  const uid: UID = uuid()
  const fullConfig = configNormalization(config)
  const dcMap = parseServerConfig(config.server)
  const storage = fullConfig.app.storage
  const layer = generateLayers(fullConfig.schema, fullConfig.mtSchema)

  return {
    uid,
    fullConfig,
    dcMap,
    storage,
    layer,
  }
}

const generateLayers = (api: TLSchema, mt: TLSchema) => ({
  apiLayer: new Layout(api),
  mtLayer : new Layout(mt),
})
