'use strict'
const { resolve } = require('path')

const mtpRoot = resolve(
  __dirname,
  '../..'
)

const buildFilename = 'mtproto-browser.js'
const vendorFilename = 'vendor.dll.js'

const source = resolve(mtpRoot, 'src')
const build = resolve(mtpRoot, 'dist')

const vendorModules = [
  '@goodmind/node-cryptojs-aes',
  'pako/lib/inflate',
  'debug',
  'ajv',
  'ajv-keywords',
  'array-flatten',
  'axios',
  'bluebird',
  'detect-node',
  'eventemitter2',
  'folktale',
  'memoizee',
  'most',
  'most-subject',
  'ramda',
  'randombytes',
  'rusha',
  'uuid'
]

const devServer = (process.env.DEV_SERVER === 'true') && true || false

module.exports = {
  source,
  build,
  vendorModules,
  buildFilename,
  devServer,
  vendorFilename,
}
