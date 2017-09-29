var path = require('path'),
    express = require('express'),
    router = express.Router();

// 过滤掉路径中的‘\route’
var static_root = __dirname.replace(/\\route$/,'') + '/mock/order';

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
    res.sendFile('/buy/confirm.json',getOptions());
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

// 微信支付运营确认操作 -> /order/buy/goods/back    post
router.post('/buy/wechat/shop-page/confirm',function(req,res){
    console.log('微信支付运营确认操作');
    res.sendFile('/buy/wechat/shop-page/confirm.json',getOptions());
});

// 买家删除订单商品原因列表 -> /order/del/goods/reason/list    get
router.get('/del/goods/reason/list',function(req,res){
    console.log('买家删除订单商品原因列表');
    res.sendFile('/del/goods/reason/list.json',getOptions());
});

// 微信支付charge对象 -> /order/shop-page/wechat    get
router.get('/shop-page/wx/charge',function(req,res){
    console.log('微信支付charge对象');
    res.sendFile('/shop-page/wx/charge.json',getOptions());
});

// 买家订单评价列表 -> /order/appraise/list    
router.get('/appraise/list',function(req,res){
    console.log('买家订单评价列表');
    res.sendFile('/appraise/list.json',getOptions());
});

// 订单商品评价写入 -> /order/goods/appraise/add    
router.post('/goods/appraise/add',function(req,res){
    console.log('订单商品评价写入');
    res.sendFile('/goods/appraise/add.json',getOptions());
});

// 订单评价写入 -> /order/appraise/add    
router.post('/appraise/add',function(req,res){
    console.log('订单评价写入');
    res.sendFile('/appraise/add.json',getOptions());
});

// 订单商品评价删除 -> /order/goods/appraise/del    
router.post('/goods/appraise/del',function(req,res){
    console.log('订单商品评价删除');
    res.sendFile('/goods/appraise/del.json',getOptions());
});

// 常购买家店铺列表 -> /order/shop/list
router.get('/shop/list',function(req,res){
    console.log('常购买家店铺列表');
    res.sendFile('/shop/list.json',getOptions());
});

// 常购买家店铺中商品列表 -> /order/oftenBuy/goods/list
router.get('/oftenBuy/goods/list',function(req,res){
    console.log('常购买家店铺中商品列表');
    res.sendFile('/oftenBuy/goods/list.json',getOptions());
});

// 删除常购 -> /order/oftenBuy/goods/del
router.post('/oftenBuy/goods/del',function(req,res){
    console.log('删除常购');
    res.sendFile('/oftenBuy/goods/del.json',getOptions());
});

// 添加常购 -> /order/oftenBuy/goods/add
router.post('/oftenBuy/goods/add',function(req,res){
    console.log('添加常购');
    res.sendFile('/oftenBuy/goods/add.json',getOptions());
});

// 商品搜索 -> /order/goods/list
router.get('/goods/list',function(req,res){
    console.log('商品搜索');
    res.sendFile('/goods/list.json',getOptions());
});

// 购物车数据 -> /buyers/cardata
router.get('/cardata',function(req,res){
    console.log('购物车数据');
    res.sendFile('/cardata.json',getOptions());
});

// 购物车数据 -> /buyers/cardata
router.get('/groupon/time',function(req,res){
    console.log('购物车数据');
    res.sendFile('/groupon/time.json',getOptions());
});

// 获取用户已支付成功的身份信息
router.get('/shop-page/identity',function(req,res){
    console.log('获取用户已支付成功的身份信息');
    res.sendFile('/shop-page/identity.json',getOptions());
});

// 获取支付凭证
router.post('/shop-page/charge',function(req,res){
    console.log('获取支付凭证');
    res.sendFile('/shop-page/charge.json',getOptions());
});

// 白条额度查询
router.get('/buyer/ious/credit-limit',function(req,res){
    console.log('白条额度查询');
    res.sendFile('/buyer/ious/credit-limit.json',getOptions());
});

// 获取白条贷款利率
router.get('/buyer/ious/interest-rate',function(req,res){
    console.log('获取白条贷款利率');
    res.sendFile('/buyer/ious/interest-rate.json',getOptions());
});

// 确认支用申请
router.post('/buyer/ious/apply',function(req,res){
    console.log('确认支用申请');
    res.sendFile('/buyer/ious/apply.json',getOptions());
});

// 获取贷款人信息
router.get('/getApplyData',function(req,res){
    console.log('获取贷款人信息');
    res.sendFile('/getApplyData.json',getOptions());
});

module.exports = router;
