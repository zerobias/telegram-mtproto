// flow-typed signature: 84be4e5d38912c7436ba8131e32fe121
// flow-typed version: <<STUB>>/randombytes_v^2.0.3/flow_v0.43.1

declare module 'randombytes' {
  declare function randomBytes(size: number): Buffer;
  declare function randomBytes(size: number, cb: (err: Error | null, bytes: Buffer) => *): void;
  declare export default typeof randomBytes;
}
