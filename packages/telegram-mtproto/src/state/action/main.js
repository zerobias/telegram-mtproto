//@flow

import { doubleCreator, type ActionPair } from '../helpers'
import { type InitType, type OnStorageImported } from '../index.h'

type Main = {
  INIT: ActionPair<'main/init', InitType>,
  STORAGE_IMPORTED: ActionPair<'main/storage imported', OnStorageImported>,
  MODULE_LOADED: ActionPair<'main/module loaded', void>,
  DC_DETECTED: ActionPair<'main/dc detected', number>,
  ACTIVATED: ActionPair<'main/instance activated', void>,
  DC_CHANGED: ActionPair<'main/dc changed', number>,
  AUTH_UNREG: ActionPair<'main/auth unreg', number>,
}

const onDc = (dc: number) => ({
  _ : 'networker',
  id: dc,
})

export const MAIN: Main = {
  INIT            : doubleCreator('main/init'),
  STORAGE_IMPORTED: doubleCreator('main/storage imported'),
  MODULE_LOADED   : doubleCreator('main/module loaded', () => ({
    _ : 'networker',
    id: 2,
  })),
  DC_DETECTED: doubleCreator('main/dc detected', onDc),
  ACTIVATED  : doubleCreator('main/instance activated'),
  DC_CHANGED : doubleCreator('main/dc changed', onDc),
  AUTH_UNREG : doubleCreator('main/auth unreg', onDc),
}
