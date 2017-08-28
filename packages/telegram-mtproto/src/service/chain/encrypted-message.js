//@flow
import { encaseP, encaseP2, Fluture } from 'fluture'

import CryptoWorker from '../../crypto'
import getMsgKeyIv from './msg-key'
import { writeInt, writeIntBytes, writeLong } from '../../tl/writer'

import { NetMessage } from '../networker/net-message'
import { TypeWriter } from '../../tl/type-buffer'
import { convertToUint8Array } from '../../bin'
// import Logger from 'mtproto-logger'

// const log = Logger`encrypted message`


type ApiMessageProps = {
  ctx: TypeWriter,
  serverSalt: number[],
  sessionID: number[],
  message: NetMessage
}

type MtMessageProps = {
  ctx: TypeWriter,
  authKeyID: number[],
  msgKey: Uint8Array,
  encryptedBytes: ArrayBuffer
}


export function apiMessage({ ctx, serverSalt, sessionID, message }: ApiMessageProps) {
  writeIntBytes(ctx, serverSalt, 64)
  writeIntBytes(ctx, sessionID, 64)
  writeLong(ctx, message.msg_id, 'message_id')
  writeInt(ctx, message.seq_no, 'seq_no')

  writeInt(ctx, message.body.length, 'message_data_length')
  writeIntBytes(ctx, message.body, false)

  const apiBytes = ctx.getBuffer()

  return apiBytes
}

opaque type SHA1Error: Error = Error
opaque type AESError: Error = Error
opaque type EncryptError: Error = Error
const sha1HashPlain = bytes => CryptoWorker.sha1Hash(bytes)
const msgKeyFromHash = hash => new Uint8Array(hash).subarray(4, 20)
const aesFromSha1 = (authKey, msgKey) => getMsgKeyIv(authKey, msgKey, true)
const encryptAES = (bytes, [aesKey, aesIv]) => CryptoWorker
  .aesEncrypt(bytes, aesKey, aesIv)

type MakeMsgKey = (bytes: ArrayBuffer) => Fluture<Uint8Array, SHA1Error>

type MakeAesKeys = (
  authKey: Uint8Array,
  msgKey: Uint8Array
) => Fluture<[Uint8Array, Uint8Array], AESError>

type MakeEncryptedBytes = (
  bytes: ArrayBuffer,
  aes: [Uint8Array, Uint8Array]
) => Fluture<ArrayBuffer, EncryptError>

const makeMsgKey: MakeMsgKey =
  bytes => encaseP(sha1HashPlain, bytes)
    .map(msgKeyFromHash)

const makeAesKeys: MakeAesKeys =
  (authKey, msgKey) =>
    encaseP2(aesFromSha1, authKey, msgKey)


const makeEncryptedBytes: MakeEncryptedBytes =
  (bytes, pair) => encaseP2(encryptAES, bytes, pair)

const aesEncrypt = (bytes, authKey, msgKey) =>
  makeAesKeys(authKey, msgKey)
    .chain(aes => makeEncryptedBytes(bytes, aes))
    .map(result => ({ bytes: result, msgKey }))

export const encryptApiBytes = (
  bytes: ArrayBuffer,
  authKey: number[]
) =>

  makeMsgKey(bytes)
    .chain(msgKey => aesEncrypt(bytes, convertToUint8Array(authKey), msgKey))


export function mtMessage({ ctx, authKeyID, msgKey, encryptedBytes }: MtMessageProps) {
  writeIntBytes(ctx, authKeyID, 64)
  writeIntBytes(ctx, msgKey, 128)
  writeIntBytes(ctx, encryptedBytes, false)

  const mtBytes = ctx.getArray()

  return mtBytes
}
