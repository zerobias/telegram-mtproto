//@flow

import { uintToInt } from '../bin'
import { RpcApiError } from '../error'
import Logger from 'mtproto-logger'
const log = Logger`event, rpc`

export type RpcRawError = {
  error_message?: string,
  error_code?: number,
}

export const onRpcError = (rpcError: RpcRawError) => {
  const errorMessage = rpcError.error_message || ''
  const matches = (errorMessage).match(/^([A-Z_0-9]+\b)(: (.+))?/) || []
  const errorCode = uintToInt(rpcError.error_code || 0)
  const code = !errorCode || errorCode <= 0
      ? 500
      : errorCode
  const type = matches[1] || 'UNKNOWN'
  const description = matches[3] || `CODE#${code} ${errorMessage}`
  return new RpcApiError(code, description)
}

const migrateRegexp = /^(PHONE_MIGRATE_|NETWORK_MIGRATE_|USER_MIGRATE_)(\d+)/
const fileMigrateRegexp = /^(FILE_MIGRATE_)(\d+)/

export const isMigrateError = (err: RpcApiError) => migrateRegexp.test(err.message)
export const isFileMigrateError = (err: RpcApiError) => fileMigrateRegexp.test(err.message)

export const getMigrateDc = (err: RpcApiError, regExp: RegExp = migrateRegexp) => {
  const matched = err.message.match(regExp)
  if (!matched || matched.length < 2) {
    log('warning')('no matched error type', err.message)
    return null
  }
  const [ , , newDcID] = matched
  if (!isFinite(newDcID)) {
    log('warning', 'migrated error')('invalid dc', newDcID)
    return null
  }
  const newDc = parseInt(newDcID, 10)
  return newDc
}

export const getFileMigrateDc = (err: RpcApiError) => getMigrateDc(err, fileMigrateRegexp)
