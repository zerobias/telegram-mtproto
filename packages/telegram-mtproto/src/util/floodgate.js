//@flow

import { combine } from 'kefir'
import type { Observable } from 'kefir'

const bufferOptions = { flushOnEnd: false }



const floodgate = <+F, +G>(
  flood: Observable<F, void>,
  gate: Observable<G, void>,
  gateMap: (val: G) => boolean
): Observable<F, void> => {

  const state = gate
    .map(gateMap)
    .toProperty(() => false)

  type StreamPair = { stream: F, gateState: boolean }

  const combinator = (f: F, s: boolean): StreamPair => ({
    stream   : f,
    gateState: s,
  })

  const bufferCondition = ({ gateState }: StreamPair) => !gateState

  const streamSelector = ({ stream }: StreamPair): F => stream

  const output = combine([flood, state], combinator)
    .bufferWhile(bufferCondition, bufferOptions)
    .flatten()
    .map(streamSelector)
    .skipDuplicates()
  return output
}

export default floodgate
