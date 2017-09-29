var path = require('path'),
    webpack = require('webpack'),
    src_dir = path.resolve(__dirname,'src'),
    node_modules_dir = path.resolve(__dirname, 'node_modules');
var config = {
    entry: {
        home: [
            src_dir + '/less/style.less',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/react/app.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build/Public/seller-cli/home'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', 'less'],
        alias: {
            'iscroll': __dirname + '/src/vendors/iscroll.js'
        }
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
            },
            {
                test: /\.jsx?$/,
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
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new webpack.ProvidePlugin({
            IScroll: 'iscroll'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
};

module.exports = config;
