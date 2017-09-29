var path = require('path'),
    express = require('express'),
    router = express.Router();

// 过滤掉路径中的‘\route’
var static_root = __dirname.replace(/\\route$/,'') + '/mock/';

function getOptions(){
    return {
        root: static_root,
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }
};

router.use(function timeLog(req, res, next){
    console.log('Time: ', Date.now());
    next();
});

// 卖家订单评价列表 -> /order/appraise/sell/list    get
router.get('/order/appraise/sell/list',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/order_appraise_sell_list.json', getOptions());
});

module.exports = router;
