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

// 获取司机当前状态
router.get('/mock/driver/status', function (req, res) {
    res.sendFile('driverStatus.json', getOptions());
});

// 获取到司机未送的订单
router.get('/mock/driver/delivery', function (req, res) {
    res.sendFile('unfinishList.json', getOptions());
});

// 获取已完成的订单
router.get('/mock/driver/delivery/done', function (req, res) {
    res.sendFile('complete.json', getOptions());
});

// 标记开始配送
router.post('/mock/driver/start', function (req, res) {
    res.sendFile('status.json', getOptions());
});

// 标记运单的正确地址
router.post('/mock/driver/delivery/correct/:id', function (req, res) {
    res.sendFile('status.json', getOptions());
});

// 标记运单被拒绝
router.post('/mock/driver/delivery/reject/:id', function (req, res) {
    res.sendFile('status.json', getOptions());
});

// 标记运单已送达
router.post('/mock/driver/delivery/finish/:id', function (req, res) {
    res.sendFile('status.json', getOptions());
});

// 运单备注
router.post('/mock/driver/delivery/remark/:id', function (req, res) {
    res.sendFile('status.json', getOptions());
});


// 定位
router.post('/mock/map/geocode/regeo', function (req, res) {
    res.sendFile('address.json', getOptions());
});
// 获取地理位置信息
router.post('/mock/map/search/hint', function (req, res) {
    res.sendFile('location.json', getOptions());
});

module.exports = router;
