//@flow

import isNode from 'detect-node'

export { isNode }

const hasEnv = (
  typeof process === 'object'
  && process != null
  && typeof process.env === 'object'
  && process.env != null
)

export const isMock = hasEnv && !!process.env.MOCK

/*::
declare var __webpack_require__: mixed;
*/

export const isWebpack = typeof __webpack_require__ !== 'undefined'
