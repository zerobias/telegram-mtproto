
let savedConfig

function getConfig() {
  if (savedConfig == null) {
    throw new Error(`config-provider getConfig error, you should call registerInstance first`)
  }
  return savedConfig
}

function registerInstance(config) {
  savedConfig = {
    ...config,
    timerOffset  : 0,
    lastMessageID: [0, 0]
  }
}

module.exports = {
  getConfig,
  registerInstance,
}
