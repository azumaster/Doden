var path = require('path'),
    webpack = require('webpack'),
    src_dir = path.resolve(__dirname,'src'),
    node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
    entry: {
        newGoodsBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/new-goods/app.js'
        ],
        gainsBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/gains-goods/app.js'
        ],
        hotBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/hot-goods/app.js'
        ],
        groupBuyBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/groupBuy-goods/app.js'
        ],
        goodsInfoBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/goods-info/app.js'
        ],
        recommendBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/recommend-goods/app.js'
        ],
        seckillBundle: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/page/seckill-goods/app.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build/Public/buyer-cli/mall'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            //jquery: 'jquery',
            //iscroll: src_dir + '/vendors/iscroll-probe.js',
            //'react': src_dir + '/vendors/react.min.js',
            //'react-dom': src_dir + '/vendors/react-dom.min.js'
        }
    },
    module: {
        //noParse: [src_dir + '/react/react.min.js', src_dir + '/vendors/react-dom.min.js'],
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
            //{ test: require.resolve("react"), loader: "expose?React" }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })/*,
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            IScroll: 'iscroll'
        })*/
    ]
};

module.exports = config;
