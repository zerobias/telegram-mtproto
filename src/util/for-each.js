import { is, addIndex, pipe, reject, isNil, ifElse, map, mapObjIndexed } from 'ramda'

const indexedMap = addIndex(map)
export const forEach = (data, func) => pipe(
  reject(isNil),
  ifElse(
    is(Array),
    indexedMap(func),
    mapObjIndexed(func)
  )
)(data)

export default forEach