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

// 删除原因列表 -> /order/del/goods/reason/list    get
router.get('/del/goods/reason/list',function(req,res){
    console.log('微信分组及对应菜单列表');
    res.sendFile('/del/goods/reason/list.json',getOptions());
});


module.exports = router;
