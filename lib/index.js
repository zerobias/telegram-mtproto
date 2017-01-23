const mtproto = require('./mtproto')
const Telegram = require('./front/telegram')
module.exports = {
  mtproto,
  tl: mtproto.tl,
  Telegram
}