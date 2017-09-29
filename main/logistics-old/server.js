var express = require('express'),
    app = express();

var router = require('./route/router');

app.use(express.static(__dirname + '/build'));

app.use('/order',router);

app.listen(2999);

