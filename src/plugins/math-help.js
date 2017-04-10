//@flow

import { bufferConcat, sha256HashSync, nextRandomInt } from '../bin'

/**
 * ### Make hash from user password string
 *
 * Used in methods `auth.checkPassword`, `account.getPasswordSettings`, `account.updatePasswordSettings` and some other
 *
 * **Usage**:
 *
 *     const makePasswordHash =
 *       require('telegram-mtproto').plugins.makePasswordHash
 *     const { current_salt } = await telegram('account.getPassword')
 *     const hash = makePasswordHash(current_salt, userPassword)
 *     const result = await telegram('auth.checkPassword', {
 *       password_hash: hash,
 *     })
 *
 * @param {(Uint8Array | number[])} salt
 * @param {string} password
 * @returns {number[]} bytes
 */
export function makePasswordHash(salt: Uint8Array | number[], password: string) {
  const passwordUTF8 = decodeURIComponent(escape(password))
  let buffer = new ArrayBuffer(passwordUTF8.length)
  const byteView = new Uint8Array(buffer)
  const len = passwordUTF8.length
  for (let i = 0; i < len; i++)
    byteView[i] = passwordUTF8.charCodeAt(i)

  buffer = bufferConcat(
    bufferConcat(
      salt,
      byteView,
    ),
    salt,
  )

  return sha256HashSync(buffer)
}


/**
 * ### Create new `random_id` value
 *
 * Useful for many methods, including `messages.sendMessage`, `messages.sendMedia`,
 * `messages.forwardMessage` etc.
 *
 * @export
 * @returns {number[]}
 */
export function getRandomId(): [number, number] {
  return [ nextRandomInt(0xFFFFFFFF), nextRandomInt(0xFFFFFFFF) ]
}
