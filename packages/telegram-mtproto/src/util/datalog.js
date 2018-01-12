//@flow

import { join } from 'path'
import { outputJsonSync } from 'fs-extra'

const testID = String((Date.now() - ((Date.now() / 1e8) | 0) * 1e8) / 1e3 | 0)

let event = 0
const eventId = () => String( ++event )
//
const LOG_PATH = [process.cwd(), 'logs', testID]

const getFilename = (tags: string[]) => join(
  ...LOG_PATH,
  eventId() + tags.join('_') + '.json'
)

const datalog = (tags: string[]) =>
  (data: any) =>
    outputJsonSync(getFilename(tags), data, { spaces: 2 })

export default datalog
