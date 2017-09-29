(function () {
    let req = {};
    let send = function (obj, method, url, data, callback, header) {
        if(!obj) return;
        let reqOption = {};
        reqOption.method = method;
        reqOption.url = url+'?r='+Math.random();
        if(method == 'post' || method == 'POST'){
            reqOption.body = data;
        }else {
            reqOption.params = data;
        }
        if(header){
            reqOption.header = header;
        }
        let request = obj.$http(reqOption).then((res)=>{
            callback.call(this, res.data?res.data:res.body);
        });

        return request;
    };


    //获取评价管理信息
    req.getPJGL = function (obj, data, callback) {
        return send (obj, 'get', '/mock/pjgl.json', data, callback, 'application/json')
    }
    //获取评价详情
    req.getOrder = function (obj, data, callback) {
        return send (obj, 'get', '/mock/order.json', data, callback, 'application/json')
    }
    //获取日志详情
    req.getLogs = function (obj, data, callback) {
        return send (obj, 'get', '/mock/logs.json', data, callback, 'application/json');
    }
    //获取交易订单
    req.getTradeOrders = function (obj, data, callback) {
        return send (obj, 'get', '/mock/pjgl.json', data, callback, 'application/json');
    }
    //获取财务退款订单
    req.getRefundOrders = function (obj, data, callback) {
        return send (obj, 'get', '/mock/pjgl.json', data, callback, 'application/json');
    }



    // 获取用户信息
    req.getUserInfo = function (obj, data, callback) {
        return send(obj, 'get', '/mock/city.json', data, callback);
    };
    //获取供应商评价数据
    req.getProviders = function (obj, data, callback) {
        return send (obj, 'get', '/mock/appraise/providers.json', data, callback);
    };
    // 根据商品获取数据
    req.getGoods = function (obj, data, callback) {
        return send (obj, 'get', '/mock/appraise/goods.json', data, callback);
    };


    // 获取地理位置
    req.getProvince = function (obj, data, callback) {
        return send (obj, 'get', '/mock/appraise/province.json', data, callback);
    };
    req.getCounty = function (obj, data, callback) {
        return send(obj, 'get', '/mock/appraise/county.json', data, callback);
    };
    window.req = req; 
})();
