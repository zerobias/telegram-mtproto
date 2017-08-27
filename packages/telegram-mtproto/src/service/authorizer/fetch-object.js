//@flow

import { Deserialization as Reader, Serialization as Writer } from '../../tl'
import { rsaEncrypt, sha1BytesSync } from '../../bin'

import {
  type ResPQ,
  type Server_DH_Params,
  type Server_DH_inner_data,
  type Set_client_DH_params_answer,
} from './index.h'
import { type PublicKeyExtended } from '../main/index.h'



export const fetchDHInner = (reader: Reader): Server_DH_inner_data =>
  //$off
  reader.fetchObject('Server_DH_inner_data', 'server_dh')

export const fetchDhParam = (reader: Reader): Set_client_DH_params_answer =>
  //$off
  reader.fetchObject('Set_client_DH_params_answer', 'client_dh')

export const fetchServerDh = (reader: Reader): Server_DH_Params =>
  //$off
  reader.fetchObject('Server_DH_Params', 'RESPONSE')

export const fetchResPQ = (reader: Reader): ResPQ =>
  //$off
  reader.fetchObject('ResPQ', 'ResPQ')


export function writeReqPQ(uid: string, nonce: number[]) {
  const request = new Writer({ mtproto: true }, uid)
  request.storeMethod('req_pq', { nonce })
  return request.writer.getBuffer()
}

export function writeReqDH(
  uid: string,
  auth: {
    nonce: number[],
    serverNonce: number[],
    publicKey: PublicKeyExtended,
    pq: number[],
    p: number[],
    q: number[],
    newNonce: number[],
  }
) {
  const {
    nonce,
    serverNonce,
    publicKey,
    pq,
    p,
    q,
    newNonce,
  } = auth
  const data = new Writer({ mtproto: true }, uid)
  data.storeObject({
    _           : 'p_q_inner_data',
    pq,
    p,
    q,
    nonce,
    server_nonce: serverNonce,
    new_nonce   : newNonce
  }, 'P_Q_inner_data', 'DECRYPTED_DATA')


  const hash = data.getBytesPlain()
  const dataWithHash = sha1BytesSync(data.writer.getBuffer()).concat(hash)


  const request = new Writer({ mtproto: true }, uid)
  request.storeMethod('req_DH_params', {
    nonce,
    server_nonce          : serverNonce,
    p,
    q,
    public_key_fingerprint: publicKey.fingerprint,
    encrypted_data        : rsaEncrypt(publicKey, dataWithHash)
  })
  return request.writer.getBuffer()
}

export function writeInnerDH(
  uid: string,
  auth: {
    nonce: number[],
    serverNonce: number[],
    retry: number,
  },
  gB: number[]
) {
  const {
    nonce,
    serverNonce,
  } = auth
  const data = new Writer({ mtproto: true }, uid)

  data.storeObject({
    _           : 'client_DH_inner_data',
    nonce,
    server_nonce: serverNonce,
    retry_id    : [0, auth.retry++],
    g_b         : gB
  }, 'Client_DH_Inner_Data', 'client_DH')

  const hash = data.getBytesPlain()
  return sha1BytesSync(data.writer.getBuffer()).concat(hash)
}