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

// 评价列表查询 -> /order/appraise/admin/list    get
router.get('/order/appraise/admin/list',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/order_appraise_admin_list.json', getOptions());
});

// 处理列表 -> /order/appraise/admin/dispose-list    get
router.get('/order/appraise/admin/dispose-list',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/order_appraise_admin_dispose_list.json', getOptions());
});

// 处理完成接口 -> /order/appraise/admin/finish-dispose    
router.post('/order/appraise/admin/finish-dispose',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/order_appraise_admin_finish_dispose.json', getOptions());
});

// 添加处理备注接口 -> /order/appraise/admin/add-dispose    
router.post('/order/appraise/admin/add-dispose',function(req, res){
    console.log('卖家订单评价列表');
    res.sendFile('/order_appraise_admin_add_dispose.json', getOptions());
});

// 获取大区
router.get('/order/area/list',function(req,res){
    console.log('大区列表');
    res.sendFile('/order_area_list.json',getOptions());
});
module.exports = router;
