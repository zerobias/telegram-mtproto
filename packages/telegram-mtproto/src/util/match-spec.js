//@flow


import { append, toPairs, chain, allPass, pipe, view, lensPath } from 'ramda'

const viewPath = pipe(lensPath, view)

const makeValidator = (value, currentPath: string[]) => pipe(
  viewPath(currentPath),
  e => e === value
)

const selectCase = (value, fieldPath: string[]) => typeof value === 'object'
  ? processSpec(value, fieldPath)
  : makeValidator(value, fieldPath)

//$off
const processPair = (fieldPath: string[]) => ([key, value]) => selectCase(
  value,
  append( key, fieldPath )
)

const processSpec = (spec: Object, fieldPath: string[]) => chain(
  processPair(fieldPath),
  toPairs(spec)
)

/**
 * Validate object by given pattern
 *
 * @param {Object} spec
 * @returns {(x: any) => boolean}
 */
export default function guard(spec: Object): (x: any) => boolean {
  //$off
  return allPass(processSpec(spec, []))
}
