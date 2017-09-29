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

// 查询需退款订单信息 -> /order/goods/info    get
router.get('/order/goods/info',function(req, res){
    console.log('查询需退款订单信息');
    res.sendFile('/order_goods_info.json', getOptions());
});

// 退款申请 ->  /order/refund/apply   post
router.post('/order/refund/apply',function(req, res){
    console.log('退款申请');
    res.sendFile('/order_refund_apply.json', getOptions());
});

// 退款记录列表 -> /order/refund/list
router.get('/order/refund/list',function(req, res){
    console.log('退款记录列表');
    res.sendFile('/order_refund_list.json', getOptions());
});

// 撤回退款申请 -> /order/refund/cancel    
router.post('/order/refund/cancel',function(req, res){
    console.log('撤回退款申请');
    res.sendFile('/order_refund_cancel.json', getOptions());
});

//获取违规处理类型接口;
router.get('/admin/shop/seller/violation/types',function(req, res){
    console.log('获取违规处理类型接口');
    res.sendFile('/admin_shop_seller_violation_types.json', getOptions());
});

module.exports = router;
