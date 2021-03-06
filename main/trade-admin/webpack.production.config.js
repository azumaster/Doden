var path = require('path'),
    src_dir = path.resolve(__dirname,'src'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: {
        css: [
            //src_dir + '/vendors/bootstrap.min.css',
            //src_dir + '/vendors/animate.min.css',
            src_dir + '/less/all-style.less'
        ],
        login: [
            src_dir + '/vendors/zdp_base.js',
            src_dir + '/vendors/server.production.js',
            src_dir + '/vendors/login.js'
        ],
        bundle: [
            src_dir + '/vendors/zdp_base.js',
            src_dir + '/vendors/server.production.js',
            src_dir + '/react/entry.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'public'),
        publicPath: '/',
        filename: 'js/[name].js'
    },
    module:{
        loaders:[
            {
                test:/\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css!less')
            },
            {
                test:/\.css$/,
                loader: ExtractTextPlugin.extract('css')
            },
            {
                test:/\.(jpg|jpeg|png|gif|)$/i,
                loaders:['url?limit=18000']
            },
            {
                test:/\.(woff|woff2|svg|eot|ttf)$/,
                loaders:['url?limit=15000']
            },
            {
                test:/\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('/css/base.css', {allChunks: true}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ],
    devServer: {
        proxy: {
            '*': {
                target: 'http://localhost:2999'
            }
        }
    }
};

module.exports = config;
