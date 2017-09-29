var path = require('path'),
    src_dir = path.resolve(__dirname,'src'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    webpack = require('webpack');

var config = {
    entry: {
        driverEnd: [
            'webpack/hot/dev-server',
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.js',
            src_dir + '/react/app.js'
        ]
    },
    output:{
        path: path.resolve(__dirname,'/build'),
        publicPath: '/Public/logistics-end/driver',
        filename: '[name].js'
    },
    module:{
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname,"src/")],
                exclude: [nodeModulesPath, path.resolve(__dirname,"src/vendors")]
            }
        ],
        loaders:[
            {
                test:/\.less$/,
                include: [path.resolve(__dirname,"src/less")],
                loader:'style-loader!css-loader!less-loader'
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
