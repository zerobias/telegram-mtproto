import type { Stream } from 'most'

declare module '@most/hold' {
  declare export function hold<A>(stream: Stream<A>): Stream<A>
}
