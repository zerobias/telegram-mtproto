//@flow

import isNode from 'detect-node'

export { isNode }

/*::
declare var __webpack_require__: mixed;
*/

export const isWebpack = typeof __webpack_require__ !== 'undefined'
