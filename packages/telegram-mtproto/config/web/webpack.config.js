'use strict'
const { resolve, join } = require('path')
const webpack = require('webpack')
const htmlWebpack = require('html-webpack-plugin')

const {
  buildFilename,
  source,
  build,
  devServer,
  vendorFilename
} = require('./config')

const vendorDll = require(join(build, 'vendor.json'))

const devEntry = [
  'webpack-dev-server/client?http://localhost:8899',
  'webpack/hot/only-dev-server',
]
const entry = [
  './index.js'
]

devServer && entry.push(...devEntry)

const config = {
  devtool: 'source-map',
  // cache    : true,
  // devServer: {
  //   hot               : true,
  //   historyApiFallback: true,
  //   contentBase       : build,
  //   publicPath        : '/',
  //   port              : 8899
  // },
  entry,
  context: source,
  resolve: {
    extensions: ['.js'],
    modules   : [
      'node_modules',
      // resolve(__dirname, '../../../mtproto-shared'),
      // join(__dirname, '../../..', 'mtproto-shared', 'node_modules'),
      // join(__dirname, '../../..', 'mtproto-logger', 'node_modules'),
    ],
    // alias: {
    //   'mtproto-shared': resolve(__dirname, '../../../mtproto-shared'),
    //   'mtproto-logger': resolve(__dirname, '../../../mtproto-logger'),
    //   'array-flatten': resolve(
    //     __dirname,
    //     '../../..',
    //     'mtproto-logger',
    //     'node_modules',
    //     'array-flatten'),
    //   'memoizee': resolve(
    //     __dirname,
    //     '../../..',
    //     'mtproto-shared',
    //     'node_modules',
    //     'memoizee'),
    //   'eventemitter2': resolve(
    //     __dirname,
    //     '../../..',
    //     'mtproto-logger',
    //     'node_modules',
    //     'eventemitter2'),
    //   'kefir': resolve(
    //     __dirname,
    //     '../../..',
    //     'mtproto-logger',
    //     'node_modules',
    //     'kefir'),
    // }
  },
  output: {
    filename     : buildFilename,
    // publicPath   : '/',
    path         : build,
    library      : 'mtproto',
    libraryTarget: 'umd'
    // pathinfo  : true
  },
  externals: {
    // 'bluebird': {
    //   commonjs : 'lodash',
    //   commonjs2: 'lodash',
    //   amd      : 'lodash',
    //   root     : 'Promise'
    // }
    // ramda: {
    //   commonjs: 'ramda',
    //   umd     : 'ramda',
    //   root    : 'R'
    // },
    // jsbn: {
    //   commonjs: 'jsbn',
    //   umd     : 'jsbn',
    //   root    : 'jsbn'
    // },
    // axios: {
    //   commonjs: 'axios',
    //   umd     : 'axios',
    //   root    : 'axios'
    // }
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context : source,
      manifest: vendorDll
    }),
    // new webpack.LoaderOptionsPlugin({
    //   options: {
    //     worker: {
    //       output: {
    //         // filename     : 'crypto-worker.js',
    //         chunkFilename: '[id].crypto-worker.js'
    //       }
    //     }
    //   }
    // }),
    new htmlWebpack({
      title   : 'MTProto test page',
      template: '../config/web/index.ejs',
      vendor  : vendorFilename
    })
  ],
  module: {
    rules: [{
      test  : /\.js$/,
      // exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}

module.exports = config