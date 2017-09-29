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

// 登录;
router.post('/mock/user/login',function(req, res){
    console.log('登录');
    res.sendFile('/user/login.json', getOptions());
});

// 退出;
router.post('/mock/user/logout',function(req, res){
    console.log('退出');
    res.sendFile('/user/logout.json', getOptions());
});

// 导航;
router.get('/mock/user/navigate',function(req, res){
    console.log('导航');
    res.sendFile('/user/navigate.json', getOptions());
});

// 获取用户信息;
router.get('/mock/user/info',function(req, res){
    console.log('获取用户信息');
    res.sendFile('/user/info.json', getOptions());
});

/*
* 账户管理
* */

//操作员账户列表;
router.get('/mock/user/list',function(req, res){
    console.log('获取用户列表');
    res.sendFile('/user/list.json', getOptions());
});
//操作员账户信息修改;
router.post('/mock/user/info/update',function(req, res){
    console.log('操作员账户信息修改');
    res.sendFile('/user/info/update.json', getOptions());
});
//操作员添加;
router.post('/mock/user/add',function(req, res){
    console.log('操作员添加');
    res.sendFile('/user/add.json', getOptions());
});
//操作员状态更改;
router.post('/mock/user/status/update',function(req, res){
    console.log('操作员状态更改');
    res.sendFile('/user/status/update.json', getOptions());
});
//指定ID的操作员所有权限获取;
router.get('/mock/user/privilege',function(req, res){
    console.log('指定ID的操作员所有权限获取');
    res.sendFile('/user/privilege.json', getOptions());
});
//用户权限修改;
router.post('/mock/user/privilege/update',function(req, res){
    console.log('用户权限修改');
    res.sendFile('/user/privilege/update.json', getOptions());
});

/*
 * 部门管理
 * */

//部门列表;
router.get('/mock/department/list',function(req, res){
    console.log('获取部门列表');
    res.sendFile('/department/list.json', getOptions());
});
//添加部门;
router.post('/mock/department/add',function(req, res){
    console.log('添加部门');
    res.sendFile('/department/add.json', getOptions());
});
//修改部门;
router.post('/mock/department/info/update',function(req, res){
    console.log('修改部门');
    res.sendFile('/department/info/update.json', getOptions());
});
//部门状态更改（删除）;
router.post('/mock/department/status/update',function(req, res){
    console.log('部门状态更改（删除）');
    res.sendFile('/department/status/update.json', getOptions());
});

/*
 * 权限管理管理
 * */

//所有权限获取;
router.get('/mock/privilege/list',function(req, res){
    console.log('所有权限获取');
    res.sendFile('/privilege/list.json', getOptions());
});
//添加权限;
router.post('/mock/privilege/add',function(req, res){
    console.log('添加权限');
    res.sendFile('/privilege/add.json', getOptions());
});
//修改权限;
router.post('/mock/privilege/update',function(req, res){
    console.log('更改权限获取');
    res.sendFile('/privilege/update.json', getOptions());
});
//获取指定ID权限的详细信息;
router.get('/mock/privilege/info',function(req, res){
    console.log('获取指定ID权限的详细信息');
    res.sendFile('/privilege/info.json', getOptions());
});
//修改指定权限的状态;
router.post('/mock/privilege/status/update',function(req, res){
    console.log('修改指定权限的状态');
    res.sendFile('/privilege/status/update.json', getOptions());
});


/*
* 订单管理
* */

//转接订单买家版列表;
router.get('/mock/order/buyers/list',function(req, res){
    console.log('转接订单买家版列表');
    res.sendFile('/order/buyers/list.json', getOptions());
});

//订单批量发货;
router.post('/mock/order/delivery',function(req, res){
    console.log('订单批量发货');
    res.sendFile('/order/delivery.json', getOptions());
});

//订单商品原卖家信息;
router.get('/mock/shop/seller/info',function(req, res){
    console.log('订单商品原卖家信息');
    res.sendFile('/order/seller/info.json', getOptions());
});

//订单备货状态修改;
router.post('/mock/order/goods-prepare',function(req, res){
    console.log('订单备货状态修改');
    res.sendFile('/order/goods-prepare.json', getOptions());
});

//订单改期;
router.post('/mock/order/delivery-date/update',function(req, res){
    console.log('订单改期');
    res.sendFile('/order/delivery-date/update.json', getOptions());
});

//订单商品取消(已收款的需做退款处理);
router.post('/mock/order/goods/del',function(req, res){
    console.log('订单商品取消(已收款的需做退款处理)');
    res.sendFile('/order/goods/del.json', getOptions());
});

//确认订单有效;
router.post('/mock/order/confirm',function(req, res){
    console.log('确认订单有效');
    res.sendFile('/order/confirm.json', getOptions());
});

//确认收货;
router.post('/mock/order/goods/take',function(req, res){
    console.log('确认收货');
    res.sendFile('/order/goods/take.json', getOptions());
});

//卖家版订单列表;
router.get('/mock/order/seller/list',function(req, res){
    console.log('卖家版订单列表');
    res.sendFile('/order/seller/list.json', getOptions());
});

//订单商品一键进货(加入商贸公司在找冻品网的购物车);
router.post('/mock/order/goods/purchase',function(req, res){
    console.log('订单商品一键进货(加入商贸公司在找冻品网的购物车)');
    res.sendFile('/order/goods/purchase.json', getOptions());
});

module.exports = router;
