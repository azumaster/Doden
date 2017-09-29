var path = require('path'),
    src_dir = path.resolve(__dirname,'src'),
    nodeModulesPath = path.resolve(__dirname, 'node_modules'),
    webpack = require('webpack');

var config = {
    devtool: 'source-map',
    entry: {
        bundle: [
            'webpack/hot/dev-server',
            src_dir + '/vendors/common.js',
            src_dir + '/vendors/request/request.js',
            src_dir + '/app.js',
            src_dir + '/less/style.less'
        ]
    },
    output:{
        path: path.resolve(__dirname,'/build'),
        publicPath: '/Public/service-provider/js/',
        filename: '[name].js',
        chunkFilename:'[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', 'less'],
        alias: {
            'components': __dirname + '/src/components/',
            'iscroll': __dirname + '/src/vendors/lib/iscroll.js',
            'reAction': __dirname + '/src/actions/'
        }
    },
    module:{
        preLoaders: [
            {
                // eslint loader;
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                include: [path.resolve(__dirname,"src/")],
                exclude: [path.resolve(__dirname,"src/vendors/lib")]
            }
        ],
        //noParse: [ src_dir + '/react/react.min.js', src_dir + '/vendors/react-dom.min.js'],
        loaders:[
            {
                test:/\.less$/,
                include: [path.resolve(__dirname,"src/less")],
                loader:'style-loader!css-loader!autoprefixer-loader!less-loader'
                //loaders:['style-loader','css-loader?sourceMap','less-loader?sourceMap'],
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!autoprefixer-loader'
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
                loaders:['react-hot','babel']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
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
