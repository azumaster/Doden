var path = require('path'),
    webpack = require('webpack'),
    // 因为配置在config目录下，获取root路径时，实际上是config的上层目录。
    __dirname = __dirname.replace(/\\config/,''),
    src_dir = path.resolve(__dirname,'src'),
    src_dir = src_dir.replace(/\\config/,''),
    node_modules_dir = path.resolve(__dirname, 'node_modules'),
    env = process.env.NODE_ENV;

    console.log('env:' + process.env.NODE_ENV);

var config = {
  entry: {
      oftenBuy: [
          'jquery',
            src_dir + '/vendors/base.js',
            src_dir + '/vendors/iscroll-probe.js',
            src_dir + '/vendors/request.production.js',
            src_dir + '/pages/often-buy/entry.jsx',
            src_dir + '/assets/less/often-buy-style.less'
      ]
  },
  output: {
    path: path.resolve(__dirname, 'build/often-buy'),
    filename: '[name].js'
  },
  resolve: {
        alias: {
            jquery: 'jquery',
            iscroll: path.resolve(__dirname,'src/vendors/iscroll-probe.js')
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
        },
    ]
  },
  devtool: 'cheap-module-source-map',
  plugins: env === 'production' ? [
      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          IScroll: 'iscroll'
      }),
      new webpack.optimize.UglifyJsPlugin({minimize: true}),
    ] : [
      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          IScroll: 'iscroll'
      })
    ]
  };

module.exports = config;
