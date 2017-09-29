var path = require('path'),
    express = require('express'),
    router = express.Router();

// 过滤掉路径中的‘\route’
var static_root = __dirname.replace(/\\route$/,'') + '/mock/logistics';

function getOptions(){
    return {
        root: static_root,
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }
};

router.use(function timeLog(req,res,next){
    console.log('Time: ',Date.now());
    next();
});

// 订单列表 -> /order/buy/list    get
router.get('/buy/list',function(req,res){
    console.log('订单列表');
    res.sendFile('/buy/list.json',getOptions());
});

// 订单中商品删除 -> /order/buy/goods/del    post
router.post('/buy/goods/del',function(req,res){
    console.log('订单中商品删除');
    res.sendFile('/buy/goods/del.json',getOptions());
});

// 订单收货 -> /order/buy/receive    post    
router.post('/buy/receive',function(req,res){
    console.log('订单收货');
    res.sendFile('/buy/receive.json',getOptions());
});

// 订单支付方式信息 -> /order/shop-page/mode/info    get
router.get('/shop-page/mode/info',function(req,res){
    console.log('订单支付方式信息');
    res.sendFile('/shop-page/mode/info.json',getOptions());
});

// 退货|退款 -> /order/buy/back    post
router.post('/buy/back',function(req,res){
    console.log('退货，退款');
    res.sendFile('/buy/back.json',getOptions());
});

// 各状态的订单量 -> /order/buy/quantity    get
router.get('/buy/quantity',function(req,res){
    console.log('各状态的订单量');
    res.sendFile('/buy/quantity.json',getOptions());
});

// 获取支付方式 -> /order/shop-page/mode    get
router.get('/shop-page/mode',function(req,res){
    console.log('获取支付方式');
    res.sendFile('/shop-page/mode.json',getOptions());
});

// 获取订单删除的原因 -> /order/goods/del-reason    get
router.get('/goods/del-reason',function(req,res){
    console.log('获取订单删除的原因');
    res.sendFile('/goods/del-reason.json',getOptions());
});

// 获取订单删除的原因 -> /order/goods/del-reason    get
router.get('/area/list',function(req,res){
    console.log('大区列表');
    res.sendFile('/area/list.json',getOptions());
});

// 微信支付待确认列表 -> /order/buy/wechat/shop-page/list    get
router.get('/buy/wechat/shop-page/list',function(req,res){
    console.log('微信支付待确认列表');
    res.sendFile('/buy/wechat/shop-page/list.json',getOptions());
});

// 微信支付运营确认操作 -> /order/buy/goods/back    get
router.get('/buy/goods/back',function(req,res){
    console.log('微信支付运营确认操作');
    res.sendFile('/buy/goods/back.json',getOptions());
});

// 买家删除订单商品原因列表 -> /order/del/goods/reason/list    get
router.get('/del/goods/reason/list',function(req,res){
    console.log('买家删除订单商品原因列表');
    res.sendFile('/del/goods/reason/list.json',getOptions());
});

// 微信支付charge对象 -> /order/shop-page/wechat    get
router.get('/shop-page/wechat',function(req,res){
    console.log('微信支付charge对象');
    res.sendFile('/shop-page/charge.json',getOptions());
});

module.exports = router;
