'use strict'
const { resolve, join } = require('path')
const webpack = require('webpack')

const source = resolve(process.cwd(), 'src')
const build = resolve(process.cwd(), 'dist')

const config = {
  devtool: 'source-map',
  cache  : true,

  entry: {
    vendor: [
      '@goodmind/node-cryptojs-aes',
      'ajv',
      'ajv-keywords',
      'rusha',
      'pako/lib/inflate',
      'axios',
      'ramda',
      'bluebird',
      'debug',
      'detect-node',
      'eventemitter2',
      'randombytes'
    ]
  },
  context: source,
  output : {
    path    : build,
    filename: '[name].dll.js',
    library : '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: join(build, '[name].json')
    })
  ]
}

module.exports = config