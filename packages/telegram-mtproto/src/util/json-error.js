//@flow

export default function jsonError(err: Error) {
  const result = {}
  if (err.type != null)
    result.type = err.type
  if (err.message != null)
    result.message = err.message
  if (err.code != null)
    result.code = err.code
  if (err.stack != null)
    result.stack = err.stack
  return result
}
