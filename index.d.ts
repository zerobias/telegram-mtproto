declare module 'telegram-mtproto' {
  class ApiManager {
    mtpGetNetworker (dc: number): any
    mtpGetNetworker (dc: number, options: Object): any
  }
  const api: ApiManager
}