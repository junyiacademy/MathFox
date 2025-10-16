const path = require('path')
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = merge(common, {
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/javascript/game/dist',
        filename: '[hash].bundle.js'
    },
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            optipng: null,
            jpegtran: null,
            gifsicle: {
                optimizationLevel: 3
            },
            pngquant: {
                quality: '65-90',
                speed: 4
            },
            plugins: []
        })
    ]
});

