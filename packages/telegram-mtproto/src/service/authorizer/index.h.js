//@flow

export type ResPQ = {
  _: 'resPQ',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  pq: Uint8Array,
  server_public_key_fingerprints: string[]
}

type ServerDHfail = {
  _: 'server_DH_params_fail',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  new_nonce_hash: Uint8Array,
}

type ServerDHok = {
  _: 'server_DH_params_ok',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  encrypted_answer: Uint8Array,
}

export type Server_DH_Params = ServerDHfail | ServerDHok

export type Server_DH_inner_data = {
  _: 'server_DH_inner_data',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  g: number,
  dh_prime: Uint8Array,
  g_a: Uint8Array,
  server_time: number,
}

export type Client_DH_Inner_Data = {
  _: 'client_DH_inner_data',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  retry_id: string,
  g_b: Uint8Array
}

export type Set_client_DH_params_answer = {
  _: 'dh_gen_ok',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  new_nonce_hash1: Uint8Array,
} | {
  _: 'dh_gen_retry',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  new_nonce_hash2: Uint8Array,
} | {
  _: 'dh_gen_fail',
  nonce: Uint8Array,
  server_nonce: Uint8Array,
  new_nonce_hash3: Uint8Array,
}
