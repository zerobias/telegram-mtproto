'use strict'
const mtproto = require('./mtproto')
const Telegram = require('./front/telegram')
const network = require('./network')
module.exports = {
  mtproto,
  network,
  tl: mtproto.tl,
  Telegram
}