'use strict'
const { resolve } = require('path')

const mtpRoot = resolve(
  __dirname,
  '../..'
)

const buildFilename = 'mtproto-browser.js'

const source = resolve(mtpRoot, 'src')
const build = resolve(mtpRoot, 'dist')

const devServer = (process.env.DEV_SERVER === 'true') && true || false

module.exports = {
  source,
  build,
  buildFilename,
  devServer,
}
