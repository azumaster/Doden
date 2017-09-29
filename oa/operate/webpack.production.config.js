var path = require('path'),
    src_dir = path.resolve(__dirname,'assets'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: {
        "html/operate/bundle": [
            src_dir + '/vendors/zdp_base.js',
            src_dir + '/vendors/server.production.js',
            src_dir + '/react/entry.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'public'),
        publicPath: '/',
        filename: '[name].js'
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
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
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
