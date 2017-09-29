var path = require('path'),
    webpack = require('webpack'),
    src_dir = path.resolve(__dirname,'src'),
    node_modules_dir = path.resolve(__dirname, 'node_modules'),
    env = process.env.NODE_ENV;

    console.log('env:' + process.env.NODE_ENV);

var config = {
  entry: {
      vendors:[
        'jquery',
        src_dir + '/vendors/base.js',
        src_dir + '/vendors/request.production.js',
        src_dir + '/assets/less/style.less',
      ],
      bundle:[path.resolve(__dirname, 'src/pages/app.js')]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
              jQuery: 'jquery'
          }),
      new webpack.optimize.UglifyJsPlugin({minimize: true}),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    ] : [
      new webpack.ProvidePlugin({
              $: 'jquery',
              jQuery: 'jquery'
          }),
      new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    ]
  };

module.exports = config;
