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

    // 获取用户信息
    req.getUserInfo = function (obj, data, callback) {
        return send(obj, 'get', '/user/info', data, callback);
    };
    //获取供应商评价数据
    req.getProviders = function (obj, data, callback) {
        return send (obj, 'get', '/shop/handle/appraise/shops/info', data, callback);
    };
    // 根据商品获取数据
    req.getGoods = function (obj, data, callback) {
        return send (obj, 'get', '/shop/handle/appraise/goods/info', data, callback);
    };

    // 获取地理位置
    req.getProvince = function (obj, data, callback) {
        return send (obj, 'get', '/city', data, callback);
    };
    req.getCounty = function (obj, data, callback) {
        return send(obj, 'get', '/county', data, callback);
    };

    window.req = req;
})();