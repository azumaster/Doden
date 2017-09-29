var path = require('path'),
    src_dir = path.resolve(__dirname,'assets'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        //css:src_dir + '/less/all-style.less',
        "html/goods/bundle": [
            'webpack-hot-middleware',
            src_dir + '/less/all-style.less',
            src_dir + '/vendors/zdp_base.js',
            src_dir + '/vendors/server.dev.js',
            src_dir + '/react/entry.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'public'),
        publicPath: '/',
        filename: '[name].js'
    },
    resolve: {
        root: path.resolve('assets')
    },
    module:{
        preLoaders: [
            {
                // eslint loader
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname,"assets/react/")],
                exclude: [nodeModulesPath]
            }
        ],
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
                //loader: 'babel-loader',
                exclude: /node_modules/,
                loaders:['react-hot','babel']/*,
                query: {
                    presets: ['react', 'es2015', 'stage-1']
                }*/
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('/css/base.css', {allChunks: true})
        //new webpack.DefinePlugin({
        //    'process.env.NODE_ENV': '"development"'
        //})
        //new webpack.optimize.OccurenceOrderPlugin(),
        //new webpack.HotModuleReplacementPlugin(),
        //new webpack.NoErrorsPlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    output: {
        //        comments: false
        //    }
        //})
        //new webpack.HotModuleReplacementPlugin()
        //new webpack.ProvidePlugin({
        //    $: 'jquery',
        //    jQuery: 'jquery'
        //})
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
