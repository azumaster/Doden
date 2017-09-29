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

// 获得微信分组及对应菜单 -> /wechat/menu/list    get
router.get('/wechat/menu/list',function(req,res){
    console.log('微信分组及对应菜单列表');
    res.sendFile('/wechat/menu/list.json',getOptions());
});

// 设置修改微信菜单 -> /wechat/menu/set    post
router.post('/wechat/menu/set',function(req,res){
    console.log('设置修改微信菜单');
    res.sendFile('/wechat/menu/set.json',getOptions());
});

module.exports = router;
