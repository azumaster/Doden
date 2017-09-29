var path = require('path'),
    src_dir = path.resolve(__dirname,'src'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    webpack = require('webpack');

var config = {
    entry: {
        newGoodsBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/new-goods/app.js'
        ],
        gainsBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/gains-goods/app.js'
        ],
        hotBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/hot-goods/app.js'
        ],
        groupBuyBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/groupBuy-goods/app.js'
        ],
        goodsInfoBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/goods-info/app.js'
        ],
        recommendBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/recommend-goods/app.js'
        ],
        seckillBundle: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/page/seckill-goods/app.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'/build'),
        publicPath: '/Public/buyer-cli/mall',
        filename: '[name].js'
    },
    //resolve: {
    //    alias: {
    //        //jquery: 'jquery',
    //        //iscroll: src_dir + '/vendors/iscroll-probe.js',
    //        'react': src_dir + '/vendors/react.min.js',
    //        'react-dom': src_dir + '/vendors/react-dom.min.js'
    //    }
    //},
    module:{
        preLoaders: [
            {
                // eslint loader;
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname,"src/")],
                exclude: [nodeModulesPath, path.resolve(__dirname,"src/vendors")]
            }
        ],
        //noParse: [ src_dir + '/react/react.min.js', src_dir + '/vendors/react-dom.min.js'],
        loaders:[
            {
                test:/\.less$/,
                include: [path.resolve(__dirname,"src/less")],
                loader:'style-loader!css-loader!less-loader'
                //loaders:['style-loader','css-loader?sourceMap','less-loader?sourceMap'],
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
                exclude: /node_modules/,
                loaders:['babel']
            }
        ]
    },
    plugins: [
        //new webpack.ProvidePlugin({
        //    $: 'jquery',
        //    jQuery: 'jquery',
        //    IScroll: 'iscroll'
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
