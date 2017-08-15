//@flow


import { append, toPairs, chain, allPass, pipe, view, lensPath } from 'ramda'


const makeValidator = value => (currentPath: string[]) => pipe(view(lensPath(currentPath)), e => e === value)

const selectCase = value => typeof value === 'object'
  ? processSpec(value)
  : makeValidator(value)

//$off
const processPair = (fieldPath: string[]) => ([key, value]) => selectCase(value)(append( key, fieldPath ))

const processSpec = (spec: Object) => (fieldPath: string[]) => chain(processPair(fieldPath), toPairs(spec))

/**
 * Validate object by given pattern
 *
 * @param {Object} spec
 * @returns {(x: any) => boolean}
 */
export default function guard(spec: Object): (x: any) => boolean {
  const processing = processSpec(spec)
  const withEmptyPath = processing([])
  //$off
  return allPass(withEmptyPath)
}
