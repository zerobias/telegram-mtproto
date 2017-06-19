declare module 'mtproto-storage-browser' {
  import { AsyncStorage } from 'mtproto-shared'
  import * as localforage from 'localforage'
  interface BrowserStorage extends AsyncStorage {
    new (storage: typeof localforage): BrowserStorage
  }
  const BrowserStorage: BrowserStorage
  export { BrowserStorage as Storage }
  export default BrowserStorage
}