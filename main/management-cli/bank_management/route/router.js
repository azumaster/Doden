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

// 用户银行卡信息列表查询 -> /shop/bankCard/list    get
router.get('/shop/bankCard/list',function(req, res){
    console.log('银行卡列表');
    res.sendFile('/shop_bankCard_list.json', getOptions());
});

// 银行卡信息修改 -> /shop/bankCard/set-info    POST
router.post('/shop/bankCard/set-info',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/shop_bankCard_set_info.json', getOptions());
});

module.exports = router;
