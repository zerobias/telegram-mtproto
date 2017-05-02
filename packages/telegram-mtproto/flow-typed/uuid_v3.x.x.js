
declare type uuid$V4 = (
  options?: {|
    random?: number[],
    rng?: () => number[] | Buffer,
  |},
  buffer?: number[] | Buffer,
  offset?: number
) => string

declare module 'uuid' {
  declare type V4 = uuid$V4;
  declare function v1(options?: {|
    node?: number[],
    clockseq?: number,
    msecs?: number | Date,
    nsecs?: number,
  |}, buffer?: number[] | Buffer, offset?: number): string;
  declare var v4: V4;
}

declare module 'uuid/v4' {
  declare type V4 = uuid$V4;
  declare module.exports: V4;
}
