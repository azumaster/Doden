var express = require('express'),
    webpack = require('webpack'),
    router = require('./route/router'),
    app = express(),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    config = require('./webpack.config');

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

app.use(express.static(__dirname + '/public'));

app.use('/',router);

app.listen(2999);

