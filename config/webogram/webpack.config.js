'use strict'
const { resolve, join } = require('path')
const webpack = require('webpack')

const source = resolve(process.cwd(), 'source')
const build = resolve(process.cwd(), 'dist')

const vendorDll = require(join(build, 'vendor.json'))

const config = {
  devtool: 'source-map',
  cache  : true,

  entry  : './index.js',
  context: source,
  resolve: {
    extensions: ['.js']
    // modules   : [
    //   source,
    //   'node_modules'
    // ]
  },
  output: {
    filename     : 'mtproto2-browser.js',
    // publicPath: '/',
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
    new webpack.LoaderOptionsPlugin({
			options: {
				worker: {
					output: {
						filename: 'hash.worker.js',
						chunkFilename: '[id].hash.worker.js'
          }
				}
      }
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