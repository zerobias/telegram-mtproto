'use strict'
const { join, resolve } = require('path')
const webpack = require('webpack')

const { vendorModules, source, build } = require('./config')

const config = {
  devtool: 'source-map',
  cache  : true,
  entry  : {
    vendor: vendorModules
  },
  context: source,
  resolve: {
    // modules   : [
    //   resolve('node_modules'),
    //   resolve('mtproto-shared', 'node_modules'),
    //   resolve('mtproto-logger', 'node_modules'),
    //   // resolve(__dirname, '../../../mtproto-shared'),
    //   // join(__dirname, '../../..', 'mtproto-shared', 'node_modules'),
    //   // join(__dirname, '../../..', 'mtproto-logger', 'node_modules'),
    // ],
    alias: {
      memoizee: '../../mtproto-shared/node_modules/memoizee',
      'array-flatten': '../../mtproto-logger/node_modules/array-flatten',
    }
  },
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