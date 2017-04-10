'use strict'
const { resolve, join } = require('path')
const webpack = require('webpack')
const htmlWebpack = require('html-webpack-plugin')

const source = resolve(process.cwd(), 'src')
const build = resolve(process.cwd(), 'dist')

const vendorDll = require(join(build, 'vendor.json'))

const config = {
  devtool  : 'source-map',
  cache    : true,
  devServer: {
    hot               : true,
    historyApiFallback: true,
    contentBase       : build,
    publicPath        : '/',
    port              : 8899
  },
  entry: [
    'webpack-dev-server/client?http://localhost:8899',
    'webpack/hot/only-dev-server',
    './index.js'
  ],
  context: source,
  resolve: {
    extensions: ['.js']
    // modules   : [
    //   source,
    //   'node_modules'
    // ]
  },
  output: {
    // filename     : 'mtproto-browser.js',
    publicPath: '/',
    path      : build,
    // library      : 'mtproto',
    // libraryTarget: 'umd'
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
    new webpack.LoaderOptionsPlugin({
      options: {
        worker: {
          output: {
            // filename     : 'crypto-worker.js',
            chunkFilename: '[id].crypto-worker.js'
          }
        }
      }
    }),
    new htmlWebpack({
      title   : 'MTProto test page',
      template: '../config/web/index.ejs'
    })
  ],
  module: {
    rules: [{
      test   : /\.js$/,
      exclude: /node_modules/,
      loader : 'babel-loader'
    }]
  }
}

module.exports = config