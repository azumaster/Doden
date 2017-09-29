var path = require('path'),
    src_dir = path.resolve(__dirname,'src'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    webpack = require('webpack');

var config = {
    entry: {
        vendors:[
            'jquery',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/iscroll-probe.js'
        ],
        bundle: [
            'webpack/hot/dev-server',
            src_dir + '/vendors/request.js',
            src_dir + '/assets/less/entry.less',
            src_dir + '/pages/app.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'build'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            jquery: 'jquery',
            iscroll: src_dir + '/vendors/iscroll-probe.js'
        }
    },
    module:{
        preLoaders: [
            {
                // eslint loader
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname,"src/pages/")],
                exclude: [nodeModulesPath]
            }
        ],
        loaders:[
            {
                test:/\.less$/,
                loaders:['style-loader','css-loader?sourceMap','less-loader?sourceMap'],
            },
            {
                test:/\.(jpg|jpeg|png|gif|)$/i,
                loaders:['url?limit=18000']
            },
            {
                test:/\.(woff|svg|eot|ttf)$/,
                loaders:['url?limit=15000']
            },
            {
                test:/\.(js|jsx)$/,
                loaders:['babel']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            IScroll: 'iscroll'
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
