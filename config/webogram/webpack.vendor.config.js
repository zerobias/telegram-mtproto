'use strict'
const { resolve, join } = require('path')
const webpack = require('webpack')

const source = resolve(process.cwd(), 'source')
const build = resolve(process.cwd(), 'dist')

const config = {
  devtool: 'source-map',
  cache  : true,

  entry: {
    vendor: [
      // '@goodmind/node-cryptojs-aes',
      // 'big-integer',
      // 'rusha',
      'pako/lib/inflate',
      'jsbn',
      'axios',
      'ramda',
      'bluebird'
      // 'setimmediate'
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