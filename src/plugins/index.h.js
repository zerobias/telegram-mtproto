//@flow

export interface AsyncStorage {
  +get: (key: string) => Promise<*>,
  +set: (key: *, val: any) => Promise<*>,
  +remove: (...keys: string[]) => Promise<*>,
  +clear: () => Promise<*>,
}
