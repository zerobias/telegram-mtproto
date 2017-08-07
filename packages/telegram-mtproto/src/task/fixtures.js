//@flow

export const initFlags = ({
  api         = false,
  inner       = false,
  container   = false,
  incoming    = true,
  methodResult= false,
  body        = false,
  error       = false,
}: {
  api?: boolean,
  inner?: boolean,
  container?: boolean,
  incoming?: boolean,
  methodResult?: boolean,
  body?: boolean,
  error?: boolean,
}): {
  api: boolean,
  inner: boolean,
  container: boolean,
  incoming: boolean,
  methodResult: boolean,
  body: boolean,
  error: boolean,
} => ({
  api,
  inner,
  container,
  incoming,
  methodResult,
  body,
  error,
})

export function isApiObject(obj: mixed): boolean %checks {
  return (
    typeof obj === 'object'
    && obj != null
    && typeof obj._ === 'string'
  )
}
