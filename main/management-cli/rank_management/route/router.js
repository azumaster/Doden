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

// 获取违规处理类型接口 -> /admin/shop/seller/violation/types    get
router.get('/admin/shop/seller/violation/types',function(req,res){
    console.log('获取违规处理类型接口');
    res.sendFile('/admin/shop/seller/violation/types.json',getOptions());
});

// shop违规处理列表 -> /admin/shop/seller/violation/list    post
router.get('/admin/shop/seller/violation/list',function(req,res){
    console.log('shop违规处理列表');
    res.sendFile('/admin/shop/seller/violation/list.json',getOptions());
});

// 店铺违规处理流水 -> /admin/shop/seller/violation/logs    get
router.get('/admin/shop/seller/violation/logs',function(req,res){
    console.log('店铺违规处理流水');
    res.sendFile('/admin/shop/seller/violation/logs.json',getOptions());
});

// 提交违规 -> /admin/shop/seller/violation/add    post
router.post('/admin/shop/seller/violation/add',function(req,res){
    console.log('提交违规');
    res.sendFile('/admin/shop/seller/violation/add.json',getOptions());
});

// 撤回违规 -> /admin/shop/seller/violation/cancel   post
router.post('/admin/shop/seller/violation/cancel',function(req,res){
    console.log('撤回违规');
    res.sendFile('/admin/shop/seller/violation/cancel.json',getOptions());
});

// 获取大区
router.get('/order/area/list',function(req,res){
    console.log('大区列表');
    res.sendFile('/order/area/list.json',getOptions());
});

module.exports = router;
