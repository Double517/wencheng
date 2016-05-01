var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

var config = {
    context: path.join(__dirname, 'src'),
    entry: {
        js: './app.js',
        vendor: ['react', 'classnames', 'react-router', 'react-dom', 'react-addons-css-transition-group',
        'moment', 'react-weui', 'webpack-zepto']
    },
    output: {
        publicPath: 'http://7j1zl7.com1.z0.glb.clouddn.com/wxjs/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[chunkhash:8].js'
    },
    module: {
        loaders:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }, {
                test: /\.less$/,
                loader: 'style!css!postcss!less'
            }, {
                test: /\.css/,
                loader: ExtractTextPlugin.extract('style', 'css', 'postcss')
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=25000'
            }
        ]
    },
    postcss: [autoprefixer],
    plugins: [
        new webpack.DefinePlugin({
            __DEBUG__: process.env.NODE_ENV !== 'production'
        }),
        new ExtractTextPlugin('weui.min.css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.[chunkhash:8].js'),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html')
        }),
        //new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            mangle: false
        })
    );
}

module.exports = config;
