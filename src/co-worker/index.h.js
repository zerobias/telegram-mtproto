//@flow

interface CoWorker <Tasks: { [key: string]: <Args, Result>(...args: Array<Args>) => Result }> {
  tasks: $Shape<Tasks>,

}

export type TasksType =
  'factorize'
  | 'mod-pow'
  | 'sha1-hash'
  | 'aes-encrypt'
  | 'aes-decrypt'

export type WorkerMessage =
  WorkerMessageTask
  | WorkerMessageEmpty

export type WorkerMessageTask = {
  data: Task
}

type WorkerMessageEmpty = {
  data: string
}

export type Task = {
  task: TasksType,
  taskID: number,
  data: *,
}

export type TaskResult ={
  data: {
    taskID: number,
    result: *,
  }
}

export interface WorkerType {
  postMessage(data: string | Task): void,
  -onmessage: (e: TaskResult) => void,
  -onerror: (e: Error) => void
}


type Bytes = number[]
type BytesCrypto = Bytes | Uint8Array


type FactorizeArgs = {
  bytes: BytesCrypto,
}
type ModPowArgs = {
  x: BytesCrypto,
  y: BytesCrypto,
  m: BytesCrypto,
}
type Sha1HashArgs = {
  bytes: BytesCrypto | ArrayBuffer,
}
type AesEncryptArgs = {
  bytes: Bytes,
  keyBytes: Bytes,
  ivBytes: Bytes,
}
type AesDecryptArgs = {
  encryptedBytes: BytesCrypto,
  keyBytes: Bytes,
  ivBytes: Bytes,
}


type FactorizeResult = [Bytes, Bytes, number]
type ModPowResult = Bytes
type Sha1HashResult = ArrayBuffer
type AesEncryptResult = Bytes
type AesDecryptResult = Bytes

export type FactorizeFunc = (args: FactorizeArgs) => Promise<FactorizeResult>
export type ModPowFunc = (args: ModPowArgs) => Promise<ModPowResult>
export type Sha1HashFunc = (args: Sha1HashArgs) => Promise<Sha1HashResult>
export type AesEncryptFunc = (args: AesEncryptArgs) => Promise<AesEncryptResult>
export type AesDecryptFunc = (args: AesDecryptArgs) => Promise<AesDecryptResult>


export interface CryptoWorker {
  /* eslint-disable */
  factorize: FactorizeFunc,
  modPow: ModPowFunc,
  sha1Hash: Sha1HashFunc,
  aesEncrypt: AesEncryptFunc,
  aesDecrypt: AesDecryptFunc,
}
