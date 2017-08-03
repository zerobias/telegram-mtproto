//@flow

import { type ActionPair } from '../helpers'
import { doubleCreator } from '../helpers'

export type InitType = {
  uid: string,
  invoke: (method: string, options: Object, opts: any) => Promise<any>,
  storageSet: (key: string, value: any) => Promise<any>,
}

type Main = {
  INIT: ActionPair<'main/init', InitType>,
  MODULE_LOADED: ActionPair<'main/module loaded', void>,
  DC_DETECTED: ActionPair<'main/dc detected', number>,
  ACTIVATED: ActionPair<'main/instance activated', void>,
  DC_CHANGED: ActionPair<'main/dc changed', number>,
}

const onDc = (dc: number) => ({
  _ : 'networker',
  id: dc,
})

export const MAIN: Main = {
  INIT         : doubleCreator('main/init'),
  MODULE_LOADED: doubleCreator('main/module loaded', () => ({
    _ : 'networker',
    id: 2,
  })),
  DC_DETECTED: doubleCreator('main/dc detected', onDc),
  ACTIVATED  : doubleCreator('main/instance activated'),
  DC_CHANGED : doubleCreator('main/dc changed', onDc),
}
