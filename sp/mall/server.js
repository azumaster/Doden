var express = require('express'),
    app = express();

var router = require('../mall/route/router');

app.use(express.static(__dirname + '/build'));

app.use('/',router);

app.listen(2999);

