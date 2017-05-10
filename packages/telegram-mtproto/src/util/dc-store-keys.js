//@flow

const dcStoreKeys = (dc: number) => ({
  authKey: `dc${dc}_auth_key`,
  saltKey: `dc${dc}_server_salt`
})

export default dcStoreKeys
