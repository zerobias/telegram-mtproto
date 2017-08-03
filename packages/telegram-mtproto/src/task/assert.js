//@flow


export function assertMsgId(val: mixed) {
  if (!isObject(val) || !isString(val.msg_id)) {
    throw new AssertError(val, `msg_id is not a string`)
  }
}

export function assertApiType(val: mixed, type: string) {
  if (!isObject(val) || !isString(val._) || val._ !== type) {
    throw new AssertError(val, `api type is not ${type}`)
  }
}

export function isObject(val: mixed): boolean %checks {
  return (
    val != null
    && typeof val === 'object'
  )
}

export function isString(val: mixed): boolean %checks {
  return typeof val === 'string'
}

class AssertError extends TypeError {
  constructor(val: mixed, message: string) {
    super(`Assert error! ${JSON.stringify(val)} ${message}`)
  }
}
