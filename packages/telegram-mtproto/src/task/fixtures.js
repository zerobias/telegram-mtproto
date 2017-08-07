//@flow

export const initFlags = ({
  api         = false,
  inner       = false,
  container   = false,
  incoming    = true,
  methodResult= false,
  body        = false,
}: {
  api?: boolean,
  inner?: boolean,
  container?: boolean,
  incoming?: boolean,
  methodResult?: boolean,
  body?: boolean,
}): {
  api: boolean,
  inner: boolean,
  container: boolean,
  incoming: boolean,
  methodResult: boolean,
  body: boolean,
} => ({
  api,
  inner,
  container,
  incoming,
  methodResult,
  body,
})

export function isApiObject(obj: mixed): boolean %checks {
  return (
    typeof obj === 'object'
    && obj != null
    && typeof obj._ === 'string'
  )
}
