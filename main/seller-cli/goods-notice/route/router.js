var path = require('path'),
    express = require('express'),
    router = express.Router();

// 过滤掉路径中的‘\route’
var static_root = __dirname.replace(/\\route$/,'') + '/mock';

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

//店铺主打商品列表
router.get ('/buyers/goods/main-goods/list',function(req, res){
    res.sendFile('/buyers/goods/main-goods/list.json', getOptions());
});

//买家端展示卖家店铺信息
router.get ('/common/shop/info',function(req, res){
    res.sendFile('/common/shop/info.json', getOptions());
});

//店铺商品分类列表
router.get ('/buyers/goods/main-goods/categories',function(req, res){
    res.sendFile('/buyers/goods/main-goods/categories.json', getOptions());
});

module.exports = router;
