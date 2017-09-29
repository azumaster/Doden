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

router.use(function timeLog(req,res,next){
    console.log('Time: ',Date.now());
    next();
});

// 购物车商品信息接口;
router.get('/mock/shopCart/goods/info',function(req,res){
    console.log('购物车商品信息接口');
    res.sendFile('/shopCart/goods/info.json',getOptions());
});

// 购物车选中商品总价计算接口;
router.get('/mock/shopCart/selected/goods/total-price',function(req,res){
    console.log('购物车选中商品总价计算接口');
    res.sendFile('/shopCart/selected/goods/total-price.json',getOptions());
});

// 购物车商品数量调整接口;
router.post('/mock/shopCart/goods/rejig/buy-number',function(req,res){
    console.log('购物车商品数量调整接口');
    res.sendFile('/shopCart/goods/rejig/buy-number.json',getOptions());
});

// 购物车商品数量调整接口;
router.post('/mock/shopCart/goods/rejig/buy-number',function(req,res){
    console.log('购物车商品数量调整接口');
    res.sendFile('/shopCart/goods/rejig/buy-number.json',getOptions());
});

//购物车商品删除接口;
router.post('/mock/shopCart/goods/del',function(req,res){
    console.log('购物车商品删除接口');
    res.sendFile('/shopCart/goods/del.json',getOptions());
});

//购物车结算信息接口;
router.get('/mock/shopCart/goods/settlement/info',function(req,res){
    console.log('购物车结算信息接口');
    res.sendFile('/shopCart/goods/settlement/info.json',getOptions());
});

//钻石可减免金额计算接口;
router.get('/mock/other/diamond/exchange',function(req,res){
    console.log('钻石可减免金额计算接口');
    res.sendFile('/other/diamond/exchange.json',getOptions());
});

//客服电话接口;
router.get('/mock/other/phone/custom-service',function(req,res){
    console.log('客服电话接口');
    res.sendFile('/other/phone/custom-service.json',getOptions());
});

//提交购物车信息生成订单接口;
router.post('/mock/order/create',function(req,res){
    console.log('提交购物车信息生成订单接口');
    res.sendFile('/order/create.json',getOptions());
});

//获取区域接口;
router.get('/mock/other/area/list',function(req,res){
    console.log('获取区域接口');
    res.sendFile('/other/area/list.json',getOptions());
});


module.exports = router;
