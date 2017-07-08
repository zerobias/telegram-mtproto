//@flow

const extractPathRegex = /\s+at.*(?:\(|\s)(.*)\)?/
const pathRegex =
  /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/babel-polyfill\/.*)?\w+)\.js:\d+:\d+)|native|<anonymous>)/

const stackFilter = (x: string) => {
  const pathMatches = x.match(extractPathRegex)
  if (pathMatches == null || !pathMatches[1])
    return true
  return !pathRegex.test(pathMatches[1])
}

const stackCleaner =
  (stack: string) =>
    stack
      .replace(/\\/g, '/')
      .split('\n')
      .filter(stackFilter)
      .filter(x => x.trim() !== '')
      .join('\n')

export default stackCleaner
