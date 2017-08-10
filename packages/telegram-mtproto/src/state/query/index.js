//@flow

import { of, makeError, type MakeError } from 'apropos'

import store from '../core'
import { type State } from '../index.h'
import resolveQuery from './resolve-request'

type Activator = <+O>(state: State) => <-I>(val: I) => O

const getState = (): State => store.getState()

const activate = fn => /*::<I>*/(data: any) => fn(getState())(data)


export const ok = activate((state: State) =>
  (ctx: number) => ({ ok: state.active, ctx }))

export const migration = activate((state: State) =>
  (dc: number) => {
    const currentDC = state.homeDc
    if (dc === currentDC) return
    if (!state.networker.has(dc) || !state.networker.has(currentDC)) {
      console.warn('No dc!', dc, currentDC)
      return
    }
    const currentThread = state.networker.get(currentDC)
    const targetThread = state.networker.get(dc)

  })


export const resolveRequest = activate(resolveQuery)

const noNetworker: MakeError<'no networker'> = makeError('no networker')

function requiestInfo(dc: number, outID: string, state: State) {

}

const selectDc = (state: State) => ({
  dc: state.homeDc,
  state,
})

const getNetworker = ({ dc, state }) => of(state)
  .map(st => st.networker)
  .logic({
    cond: net => net.has(dc),
    pass: net => net.get(dc),
    fail: () => noNetworker(dc)
  })
  .map(net => net.session)

export const getSuppressedSession = () =>
  of(getState())
    .map(selectDc)
    .chain(getNetworker)
