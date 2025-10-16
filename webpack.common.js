const path = require('path')
const webpack = require('webpack')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const WebpackCleanPlugin = require('webpack-clean-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'public/javascript/math_game/js/main.js'),
    ],
    vendor: ['pixi', 'p2', 'phaser'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor'/* chunkName= */, filename: '[hash].vendor.bundle.js'/* filename= */ }),
    new WebpackCleanPlugin({
      on: "emit",
      path: ['./dist']
    }),
    new ExtractTextPlugin("styles.css"),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'jquery',
          entry: 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
          global: 'jQuery',
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?compact=false', 'eslint-loader'],
        include: path.join(__dirname, 'public')
      },
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/images/[path][name]_[hash:7].[ext]',
            }
          }
        ]
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '/audio/[name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: 'json-loader',
          }
        ]
      },
      /*
      {
        test: /.*\.(gif|png|jpe?g|mp3)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000000
            }
          }
        ]
      },
      */
      /*
      {
        test: /.*\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          }
        ]
      },
      */
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  externals: {
    jquery: 'jQuery',
    Analytics: 'Analytics',
    globalUser: 'globalUser',
    getPassedStageIDList: 'getPassedStageIDList',
    path_prefix: 'path_prefix'
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2
    }
  }
}
