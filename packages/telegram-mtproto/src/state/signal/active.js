//@flow

import { statuses } from '../../status'
import { afterStatus } from '../helpers'

const isActive = afterStatus(statuses.activated)

export default isActive
