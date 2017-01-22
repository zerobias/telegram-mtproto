const mtproto = require('./mtproto')
module.exports = {
  mtproto,
  tl: mtproto.tl,
  Telegram: require('./front/telegram')
}