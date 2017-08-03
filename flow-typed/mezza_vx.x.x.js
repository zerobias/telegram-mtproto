declare module 'mezza' {
  declare export default function choose<Input, Match: { [key: string]: (val: Input) => boolean }>(match: Match, matcher: $ObjMap<Match, (val: Input) => any>): any
}
