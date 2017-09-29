var path = require('path'),
    webpack = require('webpack'),
    src_dir = path.resolve(__dirname,'src'),
    node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
    entry: {
        bundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/app.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build/Public/buyer-cli/shopCart'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            jquery: 'jquery',
            iscroll: src_dir + '/vendors/iscroll-probe.js'
        }
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.jsx?$/,

                // There is not need to run the loader through
                // vendors
                exclude: [node_modules_dir],
                loader: 'babel'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=25000'
            },
            {
                test:/\.(woff|svg|eot|ttf)$/,
                loaders:['url?limit=15000']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            IScroll: 'iscroll'
        })
    ]
};

module.exports = config;
