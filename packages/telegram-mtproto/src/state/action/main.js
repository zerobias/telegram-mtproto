//@flow

import { doubleCreator, type ActionPair } from '../helpers'
import type {
  InitType,
  OnStorageImported,
  OnRecovery,
  OnDcDetected,
  OnAuthResolve,
  OnAuthImport,
} from '../index.h'

type Main = {
  INIT: ActionPair<'main/init', InitType>,
  STORAGE_IMPORTED: ActionPair<'main/storage imported', OnStorageImported>,
  MODULE_LOADED: ActionPair<'main/module loaded', void>,
  DC_DETECTED: ActionPair<'main/dc detected', OnDcDetected>,
  DC_REJECTED: ActionPair<'main/dc rejected', OnDcDetected>,
  ACTIVATED: ActionPair<'main/instance activated', void>,
  AUTH_UNREG: ActionPair<'main/auth unreg', number>,
  RECOVERY_MODE: ActionPair<'main/recovery mode', OnRecovery>,
  AUTH: {
    RESOLVE: ActionPair<'main/auth resolve', OnAuthResolve>,
    IMPORT: ActionPair<'main/auth import', OnAuthImport>,
  }
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
  DC_DETECTED  : doubleCreator('main/dc detected'),
  DC_REJECTED  : doubleCreator('main/dc rejected'),
  ACTIVATED    : doubleCreator('main/instance activated'),
  AUTH_UNREG   : doubleCreator('main/auth unreg', onDc),
  RECOVERY_MODE: doubleCreator('main/recovery mode'),
  AUTH         : {
    RESOLVE: doubleCreator('main/auth resolve'),
    IMPORT : doubleCreator('main/auth import'),
  }
}
