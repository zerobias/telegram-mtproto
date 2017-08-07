//@flow

import store from '../core'
import { type State } from '../index.h'

function activate<Ctx, Thing>(q: (state: State) => (ctx: Ctx) => Thing) {
  return (ctx: Ctx) => q(store.getState())(ctx)
}

export const ok = activate((state: State) =>
  (ctx: number) => ({ ok: state.active, ctx }))
