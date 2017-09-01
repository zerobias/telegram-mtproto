//@flow

import uuid from 'uuid/v4'

import { type UID, toUID } from 'Newtype'

export default function newUuid(): UID {
  return /*:: toUID( */ uuid().slice(0, 8) /*:: ) */
}
