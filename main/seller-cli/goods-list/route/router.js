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

//获取我的在售/待审核/已下架商品列表(带分页)
router.get ('/seller/goods/list',function(req, res){
    res.sendFile('/seller/goods/list.json', getOptions());
});

//获取我的在售/待审核/已下架商品的数量
router.get  ('/seller/goods/num' ,function(req, res){
    res.sendFile( '/seller/goods/num.json', getOptions());
});

//获取我的在售/待审核/已下架商品的类型列表;
router.get('/seller/goods/type/list', function(req, res){
    console.log('获取我的在售/待审核/已下架商品的类型列表');
    res.sendFile( '/seller/goods/type/list.json', getOptions());
});

//获取我的价格过期商品的数量
router.get  ('/seller/goods/soldout/num' ,function(req, res){
    res.sendFile( '/seller/goods/soldout/num.json', getOptions());
});

//更新我的价格过期商品的价格过期时间
router.post  ('/seller/goods/expiration-time/update' ,function(req, res){
    res.sendFile( '/seller/goods/expiration-time/update.json', getOptions());
});

//更新我的商品的价格
router.post  ('/seller/goods/price/change' ,function(req, res){
    res.sendFile( '/seller/goods/price/change.json', getOptions());
});

//删除我的商品
router.post ('/seller/goods/delete' ,function(req, res){
    res.sendFile( '/seller/goods/delete.json', getOptions());
});

//商品上下架
router.post ('/seller/goods/sale/status' ,function(req, res){
    res.sendFile( '/seller/goods/sale/status.json', getOptions());
});

//获取商品规格及型号约束
router.get  ('/seller/goods/type/basic-attr/get' ,function(req, res){
    res.sendFile( '/seller/goods/type/basic-attr/get.json', getOptions());
});

//获取商品通知列表
router.get('/seller/goods/notice/list' ,function(req, res){
    res.sendFile('/seller/goods/notice/list.json', getOptions());
});

//获取该商家所有的商品类型列表
router.get  ('/seller/goods/types/list' ,function(req, res){
    res.sendFile( '/seller/goods/types/list.json', getOptions());
});

//获取品牌列表
router.get  ('/seller/goods/brand/list' ,function(req, res){
    res.sendFile( '/seller/goods/brand/list.json', getOptions());
});

//获取商品详情
router.get  ('/seller/goods/info' ,function(req, res){
    res.sendFile( '/seller/goods/info.json', getOptions());
});

//获取未读商品通知数量;
router.get  ('/goods/unread-notice/num' ,function(req, res){
    res.sendFile( '/goods/unread-notice/num.json', getOptions());
});

//获取价格体系规则;
router.get  ('/seller/price-rules' ,function(req, res){
    res.sendFile( '/seller/price-rules.json', getOptions());
});

//获取商品的价格规则;
router.get  ('/seller/goods/price-rules' ,function(req, res){
    res.sendFile( '/seller/goods/price-rules.json', getOptions());
});

module.exports = router;
